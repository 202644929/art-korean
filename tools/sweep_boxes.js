/* 마법사 모든 화면에서 **선택지별 '예시' / '설명' 상자**를 긁습니다.
 *
 * 왜 따로 필요한가
 *   두 상자는 **선택지를 고를 때만 채워집니다.** 4차 세션 순회기(crawl.js)는
 *   설명 상자가 `<textarea readonly>` 인 화면에서만 라디오를 하나씩 눌렀고,
 *   `Descriptions` 전역이 있는 화면은 안 눌렀습니다. 그런데 **예시 상자는
 *   전역이 없어서** 그런 화면에서는 통째로 안 잡혔습니다.
 *   → 화면에 `Milling operations`, `Lathe`, `Circular saw` 가 영어로 남았습니다.
 *
 * 예시 상자의 실제 DOM
 *   <div id="divExamplesList"><ul><li>Milling operations</li>…</ul></div>
 *   '예시:' 머리글은 이 div **밖에** 있습니다. 머리글로 찾으면 실패합니다.
 *
 *   node sweep_boxes.js [최대화면수]
 *
 * 결과는 crawl_screens.json / crawl_todo.json 에 합칩니다(매 화면 저장).
 */
const fs = require('fs');
const { connect } = require('./cdp.js');
const P = require('./pagelib.js');

const START = '/loggedin/mechquest/q002_7_activities.aspx';
const SCENARIO = process.env.ART_SCENARIO || 'claude-translanguage';
const PAIR_SEP = '~~';
const MAX = Number(process.argv[2] || 200);
const OUT_SCREENS = 'crawl_screens.json';
const OUT_TODO = 'crawl_todo.json';

const load = (f, d) => (fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')) : d);
const screens = load(OUT_SCREENS, {});
const todo = load(OUT_TODO, {});
const store = load('crawl_edges.json', { edges: {} });
const edges = store.edges;
let newHits = 0;

function ignorable(s) {
  const t = s.trim();
  if (t.length < 3) return true;
  if (!/[A-Za-z]{3}/.test(t)) return true;
  if (/[가-힣]/.test(t)) return true;      // 이미 번역된 것
  return false;
}
function record(url, kind, s) {
  const t = String(s || '').replace(/\s+/g, ' ').trim();
  if (!t || ignorable(t)) return;
  if (!(t in todo)) { todo[t] = ''; newHits++; }
  const sc = screens[url] || (screens[url] = {});
  if (!sc[kind]) sc[kind] = [];
  if (sc[kind].indexOf(t) === -1) sc[kind].push(t);
}
function save() {
  fs.writeFileSync(OUT_SCREENS, JSON.stringify(screens, null, 1), 'utf8');
  fs.writeFileSync(OUT_TODO, JSON.stringify(todo, null, 1), 'utf8');
}

// 목적지별 최단 경로
const pathTo = {};
for (const k of Object.keys(edges)) {
  const e = edges[k];
  if (!e.dest || !e.path || e.dest.indexOf('/loggedin/mechquest/') !== 0) continue;
  if (!pathTo[e.dest] || e.path.length < pathTo[e.dest].length) pathTo[e.dest] = e.path;
}
const targets = Object.keys(pathTo).sort((a, b) => pathTo[a].length - pathTo[b].length);

(async () => {
  const c = await connect();
  const log = (s) => process.stdout.write(s + '\n');
  const url = () => c.run(function () { return location.pathname; });
  let curPath = [];

  async function applyChoice(ch) {
    if (ch.kind === 'pair') {
      const rn = ch.name.split(PAIR_SEP)[0];
      const sn = ch.name.split(PAIR_SEP)[1];
      const rv = ch.v.split(PAIR_SEP)[0];
      const sv = ch.v.split(PAIR_SEP)[1];
      await c.act(() => c.run(P.pickRadio, rn, rv), 1500);
      return (await c.act(() => c.run(P.pickSelect, sn, sv), 1500)).result;
    }
    const fn = ch.kind === 'radio'
      ? () => c.run(P.pickRadio, ch.name, ch.v)
      : () => c.run(P.pickSelect, ch.name, ch.v);
    return (await c.act(fn, 1500)).result;
  }
  const clickNext = () => c.act(() => c.run(P.clickBtn, ['다음', 'next']), 3000);
  const clickPrev = () => c.act(() => c.run(P.clickBtn, ['이전', 'previous', 'back']), 3000);

  async function next(u) {
    await clickNext();
    let now = await url();
    if (now !== u) return now;
    const gg = await c.run(P.radioGroups);
    let touched = false;
    for (const nm of Object.keys(gg)) {
      if (gg[nm].some((o) => o.c)) continue;
      await c.act(() => c.run(P.pickRadio, nm, gg[nm][0].v), 1500);
      touched = true;
    }
    if (touched) { await clickNext(); now = await url(); if (now !== u) return now; }
    const f = await c.act(() => c.run(P.fillBlanks), 1200);
    if ((f.result || []).length) { await clickNext(); now = await url(); if (now !== u) return now; }
    for (const s of await c.run(P.selectInfo)) {
      if (s.opts.length > 1 && s.idx <= 0) {
        await c.act(() => c.run(P.pickSelect, s.name, s.opts[1].v), 1200);
      }
    }
    await clickNext();
    now = await url();
    return now !== u ? now : false;
  }

  async function reset() {
    await c.nav(START);
    if ((await url()).indexOf('myscenarios') !== -1) {
      const L = await c.act(() => c.run(P.loadScenario, SCENARIO), 3000);
      if (L.result === 'NOROW') throw new Error('시나리오를 못 찾음: ' + SCENARIO);
      await c.nav(START);
    }
    const r = await c.act(() => c.run(P.clickBtn, ['활동 구성', 'configure activity']), 2500);
    if (r.result === 'NOTFOUND') throw new Error('활동 구성 버튼 없음');
    curPath = [];
  }

  const sig = (ch) => ch.at + '|' + ch.kind + '|' + ch.name + '|' + ch.v;

  async function rewindTo(wantUrl) {
    for (let i = 0; i < 40; i++) {
      const u = await url();
      if (u === wantUrl) return true;
      const r = await clickPrev();
      if (r.result === 'NOTFOUND') return false;
      if ((await url()) === u) return false;
    }
    return true;
  }

  // 이어 걷기 → 되감기 → 처음부터. crawl.js 와 같은 전략입니다.
  async function goTo(path) {
    const want = path.length ? path[path.length - 1].at : null;
    let common = 0;
    while (common < curPath.length && common < path.length
           && sig(curPath[common]) === sig(path[common])) common++;
    const prefix = path.slice(0, -1);
    const dest = path[path.length - 1];

    if (common === curPath.length && curPath.length === prefix.length
        && (await url()) === dest.at) {
      // 이미 그 자리
    } else if (common >= prefix.length && await rewindTo(dest.at)) {
      curPath = prefix.slice();
    } else {
      await reset();
      common = 0;
    }
    for (let k = curPath.length; k < prefix.length; k++) {
      const ch = prefix[k];
      const u = await url();
      if (ch.at && ch.at !== u) throw new Error('경로 이탈 ' + u.split('/').pop());
      await applyChoice(ch);
      if (!(await next(u))) throw new Error('막힘 @' + u.split('/').pop());
      curPath = prefix.slice(0, k + 1);
    }
    // 마지막 한 걸음
    const u = await url();
    await applyChoice(dest);
    const nu = await next(u);
    if (!nu) throw new Error('막힘 @' + u.split('/').pop());
    curPath = path.slice();
    return nu;
  }

  let done = 0;
  let skipped = 0;
  try {
    for (const t of targets) {
      if (done >= MAX) break;
      const name = t.split('/').pop();
      // 이미 예시를 모아둔 화면은 건너뜁니다
      if ((screens[t] || {}).example) { skipped++; continue; }
      done++;
      log('\n### ' + done + '/' + targets.length + '  ' + name);
      try {
        const at = await goTo(pathTo[t]);
        if (at !== t) { log('  도착 불일치 ' + at.split('/').pop()); continue; }
        const g = await c.run(P.radioGroups);
        let n = 0;
        for (const nm of Object.keys(g)) {
          for (const o of g[nm]) {
            await c.act(() => c.run(P.pickRadio, nm, o.v), 1500);
            if ((await url()) !== t) break;   // 라디오가 화면을 넘겼으면 중단
            const b = await c.run(P.optionBoxes);
            (b.examples || []).forEach((x) => { record(t, 'example', x); n++; });
            if (b.description) record(t, 'desc', b.description);
          }
        }
        // 선택지가 select 로만 된 화면
        for (const s of await c.run(P.selectInfo)) {
          if (s.opts.length < 2 || s.opts.length > 30) continue;
          for (const o of s.opts) {
            if (o.v === '') continue;
            await c.act(() => c.run(P.pickSelect, s.name, o.v), 1200);
            if ((await url()) !== t) break;
            const b = await c.run(P.optionBoxes);
            (b.examples || []).forEach((x) => { record(t, 'example', x); n++; });
            if (b.description) record(t, 'desc', b.description);
          }
        }
        if (!((screens[t] || {}).example)) {
          // 예시 상자가 없는 화면임을 표시해 다음 실행에서 건너뛰게 합니다
          (screens[t] || (screens[t] = {})).example = [];
        }
        log('  예시/설명 ' + n + '개, 누적 수집 ' + Object.keys(todo).length
          + ' (새로 ' + newHits + ')');
      } catch (e) {
        log('  실패: ' + e.message);
        curPath = [];
      }
      save();
    }
  } finally {
    save();
    log('\n=== 끝. 화면 ' + done + '개 처리, 건너뜀 ' + skipped
      + ', 수집 ' + Object.keys(todo).length + '개 (새로 ' + newHits + ') ===');
    c.close();
  }
})();
