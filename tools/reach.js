/* 저장된 순회 경로를 재생해 **특정 마법사 화면까지 걸어갑니다.**
 *
 * 마법사 화면은 직접 `nav` 로 못 들어갑니다 — 순서를 강제해 시나리오 개요로
 * 튕겨냅니다. 그래서 `crawl_edges.json` 에 기록된 경로를 다시 밟습니다.
 *
 *   node reach.js fracturingabrasionsolids          거기까지 가서 멈춤
 *   node reach.js q043_131_segregation --examples   가서 라디오별 예시/설명 덤프
 *
 * `--examples` 는 라디오를 하나씩 눌러가며 '예시:'/'설명' 상자를 읽습니다.
 * 이게 필요한 이유: 두 상자는 **선택할 때만 채워집니다.** 아무것도 선택하지
 * 않은 상태로 화면을 훑으면 빈 상자를 보게 되고, 그래서 4차 세션 순회가
 * 활동 예시(Milling operations, Lathe, Circular saw ...)를 통째로 놓쳤습니다.
 */
const fs = require('fs');
const { connect } = require('./cdp.js');
const P = require('./pagelib.js');

const START = '/loggedin/mechquest/q002_7_activities.aspx';
const SCENARIO = process.env.ART_SCENARIO || 'claude-translanguage';
const PAIR_SEP = '~~';
const target = process.argv[2];
const wantEx = process.argv.indexOf('--examples') !== -1;
if (!target) {
  console.log('사용법: node reach.js <화면이름조각> [--examples]');
  process.exit(1);
}

const store = JSON.parse(fs.readFileSync('crawl_edges.json', 'utf8'));
const edges = store.edges;

// 목적지가 target 인 간선 중 경로가 가장 짧은 것
let best = null;
for (const k of Object.keys(edges)) {
  const e = edges[k];
  if (!e.dest || e.dest.indexOf(target) === -1) continue;
  if (!e.path) continue;
  if (!best || e.path.length < best.path.length) best = e;
}
if (!best) {
  console.log('그 화면으로 가는 경로가 crawl_edges.json 에 없습니다: ' + target);
  process.exit(1);
}
console.log('경로 깊이 ' + best.path.length + ' -> ' + best.dest);

(async () => {
  const c = await connect();
  const url = () => c.run(function () { return location.pathname; });

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

  try {
    // 시나리오가 안 불러와져 있으면 마법사가 목록으로 튕겨냅니다.
    await c.nav(START);
    if ((await url()).indexOf('myscenarios') !== -1) {
      const L = await c.act(() => c.run(P.loadScenario, SCENARIO), 3000);
      if (L.result === 'NOROW') throw new Error('시나리오를 못 찾음: ' + SCENARIO);
      console.log('시나리오 불러옴: ' + SCENARIO);
      await c.nav(START);
    }
    const r = await c.act(() => c.run(P.clickBtn, ['활동 구성', 'configure activity']), 2500);
    if (r.result === 'NOTFOUND') throw new Error('활동 구성 버튼 없음 @' + (await url()));

    for (const ch of best.path) {
      const u = await url();
      if (ch.at && ch.at !== u) throw new Error('경로 이탈: ' + u.split('/').pop());
      await applyChoice(ch);
      if (!(await next(u))) throw new Error('막힘 @' + u.split('/').pop());
    }
    console.log('도착: ' + (await url()));

    if (wantEx) {
      const g = await c.run(P.radioGroups);
      for (const name of Object.keys(g)) {
        for (const opt of g[name]) {
          await c.act(() => c.run(P.pickRadio, name, opt.v), 1500);
          const box = await c.run(P.optionBoxes);
          console.log('\n-- ' + (opt.t || opt.v).slice(0, 60));
          console.log('   예시: ' + JSON.stringify(box.examples));
          console.log('   설명: ' + (box.description || '').slice(0, 100));
        }
      }
    }
  } catch (e) {
    console.log('실패: ' + e.message);
  } finally {
    c.close();
  }
})();
