/* 마법사 모든 화면에서 **상호작용으로만 나타나는 글**을 잡아냅니다.
 *
 * ── 왜 이 방식인가 ────────────────────────────────────────────────────────
 * 지금까지의 수집기는 '글이 있을 만한 곳'(텍스트 노드, option, title, 설명 상자…)
 * 을 열거해서 읽었습니다. 그래서 **내가 모르는 곳**은 영원히 못 봅니다. 실제로
 * `예시:` 상자를 그렇게 놓쳤고, 사용자가 캡처를 보내고서야 알았습니다.
 *
 * 그래서 뒤집습니다.
 *
 *     조작 전 화면의 모든 글을 적어둔다
 *     조작한다
 *     조작 후 화면의 모든 글을 적는다
 *     차이 = 그 조작으로만 나타나는 글
 *
 * 그 글이 어디서 오는지 몰라도 잡힙니다.
 *
 * ── 시도하는 조작 ────────────────────────────────────────────────────────
 *   hover     모든 요소에 마우스 올림 이벤트 → CSS/JS 툴팁
 *   empty     입력칸을 다 비우고 '다음' → 필수값 검증 메시지
 *   text      숫자칸에 글자 넣고 '다음' → 형식 검증 메시지
 *   huge      터무니없이 큰 값 → 범위 검증 메시지
 *   negative  음수 → 범위 검증 메시지
 *   both      숫자와 범주를 둘 다 채움 → ART 특유의 '하나만 고르라' 조건
 *   dialog    alert/confirm/prompt 문구 (confirm 은 항상 false 로 돌려 안전)
 *
 * ── 안전 ─────────────────────────────────────────────────────────────────
 *   '다음' 만 누릅니다. 삭제·로그아웃·저장·완료는 누르지 않습니다.
 *   confirm 은 항상 false 를 돌려주므로 파괴적 동작이 진행되지 않습니다.
 *
 *   node probe_all.js [최대화면수]
 */
const fs = require('fs');
const { connect } = require('./cdp.js');
const P = require('./pagelib.js');

const START = '/loggedin/mechquest/q002_7_activities.aspx';
const SCENARIO = process.env.ART_SCENARIO || 'claude-translanguage';
const PAIR_SEP = '~~';
const MAX = Number(process.argv[2] || 200);
const MODES = ['empty', 'text', 'huge', 'negative', 'both'];
const OUT_SCREENS = 'crawl_screens.json';
const OUT_TODO = 'crawl_todo.json';
const OUT_DONE = 'probe_done.json';

const load = (f, d) => (fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')) : d);
const screens = load(OUT_SCREENS, {});
const todo = load(OUT_TODO, {});
const done = load(OUT_DONE, {});
const store = load('crawl_edges.json', { edges: {} });
const edges = store.edges;
let newHits = 0;

// 번역 대상이 아닌 것
const ASPNET_ERR = /Server Error in|unhandled exception|Stack Trace|<%@|<configuration|System\.|ASP\.NET|Runtime Version|Version Information/i;
const IGNORE = ['English', 'Deutsche', 'Francais', 'Nederlands',
  'claude-translanguage', 'XLUNIFAC', 'xylene', 'toluene'];

function ignorable(s) {
  const t = s.trim();
  if (ASPNET_ERR.test(t)) return true;
  if (IGNORE.indexOf(t) !== -1) return true;
  if (t.length < 4) return true;
  if (/[가-힣]/.test(t)) return true;                // 이미 번역된 것
  if (!/[A-Za-z]{4}/.test(t)) return true;           // 알파벳 낱말이 없음
  return false;
}
function record(url, kind, s) {
  const t = String(s || '').replace(/\s+/g, ' ').trim();
  if (!t || ignorable(t)) return false;
  if (!(t in todo)) { todo[t] = ''; newHits++; }
  const sc = screens[url] || (screens[url] = {});
  if (!sc[kind]) sc[kind] = [];
  if (sc[kind].indexOf(t) === -1) sc[kind].push(t);
  return true;
}
function save() {
  fs.writeFileSync(OUT_SCREENS, JSON.stringify(screens, null, 1), 'utf8');
  fs.writeFileSync(OUT_TODO, JSON.stringify(todo, null, 1), 'utf8');
  fs.writeFileSync(OUT_DONE, JSON.stringify(done, null, 1), 'utf8');
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

  async function advance(u) {
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

  // 목표 화면까지: 이어 걷기 → 되감기 → 처음부터
  async function goTo(path) {
    const prefix = path.slice(0, -1);
    const dest = path[path.length - 1];
    let common = 0;
    while (common < curPath.length && common < path.length
           && sig(curPath[common]) === sig(path[common])) common++;

    if (common === curPath.length && curPath.length === prefix.length
        && (await url()) === dest.at) {
      // 이미 그 자리
    } else if (common >= prefix.length && await rewindTo(dest.at)) {
      curPath = prefix.slice();
    } else {
      await reset();
    }
    for (let k = curPath.length; k < prefix.length; k++) {
      const ch = prefix[k];
      const u = await url();
      if (ch.at && ch.at !== u) throw new Error('경로 이탈 ' + u.split('/').pop());
      await applyChoice(ch);
      if (!(await advance(u))) throw new Error('막힘 @' + u.split('/').pop());
      curPath = prefix.slice(0, k + 1);
    }
    const u = await url();
    await applyChoice(dest);
    const nu = await advance(u);
    if (!nu) throw new Error('막힘 @' + u.split('/').pop());
    curPath = path.slice();
    return nu;
  }

  // 조작 전후의 글 차이를 기록합니다
  async function diffAfter(target, kind, action, waitMs) {
    const before = new Set(await c.run(P.textSnapshot));
    await action();
    if (waitMs) await c.sleep(waitMs);
    let after;
    try { after = await c.run(P.textSnapshot); } catch (e) { return 0; }
    let n = 0;
    for (const s of after) if (!before.has(s) && record(target, kind, s)) n++;
    for (const d of (await c.run(P.readDialogSpy)) || []) {
      if (record(target, 'dialog', d.replace(/^(alert|confirm|prompt):\s*/, ''))) n++;
    }
    return n;
  }

  let processed = 0;
  let found = 0;
  try {
    for (const t of targets) {
      if (processed >= MAX) break;
      if (done[t]) continue;
      processed++;
      const name = t.split('/').pop();
      log('\n### ' + processed + '  ' + name);
      try {
        const at = await goTo(pathTo[t]);
        if (at !== t) { log('  도착 불일치 ' + at.split('/').pop()); continue; }
        await c.run(P.installDialogSpy);

        // 1) 마우스 올림 → 툴팁
        let n = await diffAfter(t, 'tooltip', () => c.run(P.hoverAll), 600);
        if (n) log('  툴팁으로 새 글 ' + n + '개');
        found += n;

        // 2) 잘못된 입력 → 검증 메시지
        for (const mode of MODES) {
          if ((await url()) !== t) {
            // 앞 단계에서 화면이 넘어갔으면 되돌아옵니다
            if (!(await rewindTo(t))) { await goTo(pathTo[t]); }
            await c.run(P.installDialogSpy);
          }
          const k = await diffAfter(t, 'validation', async () => {
            await c.act(() => c.run(P.stuffBadValues, mode), 1500);
            await clickNext();
          }, 400);
          if (k) log('  [' + mode + '] 새 글 ' + k + '개');
          found += k;
        }
        done[t] = true;
        log('  누적 수집 ' + Object.keys(todo).length + '개 (새로 ' + newHits + ')');
      } catch (e) {
        log('  실패: ' + e.message);
        curPath = [];
      }
      save();
    }
  } finally {
    save();
    log('\n=== 끝. 화면 ' + processed + '개, 새 글 ' + found
      + '건, 수집 ' + Object.keys(todo).length + '개 (새로 ' + newHits + ') ===');
    c.close();
  }
})();
