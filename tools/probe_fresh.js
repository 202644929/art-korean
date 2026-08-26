/* 활동을 '아무것도 안 고른' 상태로 되돌리는 방법을 찾습니다.
 *
 * 관찰된 문제: 이미 구성된 활동은 제품 유형을 바꿀 수 없습니다.
 * pickRadio 가 클릭은 하지만 포스트백 뒤 원래 값으로 되돌아갑니다.
 * 그래서 rbGranularMaterial 이외의 갈래를 되밟을 수 없습니다.
 *
 * 시도: 취소 -> 시나리오 다시 불러오기 -> 활동 구성
 *
 *   node probe_fresh.js
 */
const { connect } = require('./cdp.js');
const P = require('./pagelib.js');

const SCEN = process.env.ART_SCENARIO || 'claude-translanguage';
const ACTS = '/loggedin/mechquest/q002_7_activities.aspx';
const MYSC = '/loggedin/myscenarios.aspx';

(async () => {
  const c = await connect();
  const log = (s) => process.stdout.write(s + '\n');
  const url = () => c.run(function () { return location.pathname; });
  const short = (u) => String(u).split('/').pop();

  async function checked() {
    const gg = await c.run(P.radioGroups);
    const out = [];
    for (const nm of Object.keys(gg)) {
      for (const o of gg[nm]) if (o.c) out.push(o.v);
    }
    return out.length ? out.join(',') : '(아무것도 안 고름)';
  }

  try {
    await c.nav(ACTS);
    log('1) 활동 목록: ' + short(await url()));
    const cancel = await c.act(() => c.run(P.clickBtn, ['취소', 'cancel']), 3000);
    log('2) 취소: ' + cancel.result + ' -> ' + short(await url()));

    if ((await url()).indexOf('myscenarios') === -1) await c.nav(MYSC);
    log('3) 내 시나리오: ' + short(await url()));

    const L = await c.act(() => c.run(P.loadScenario, SCEN), 4000);
    log('4) 시나리오 불러오기: ' + L.result + ' -> ' + short(await url()));

    await c.nav(ACTS);
    log('5) 활동 목록: ' + short(await url()));

    const cfg = await c.act(() => c.run(P.clickBtn, ['활동 구성', 'configure activity']), 3000);
    log('6) 활동 구성: ' + cfg.result + ' -> ' + short(await url()));
    log('   체크 상태: ' + (await checked()));

    // 실제로 바꿀 수 있는지 확인
    const pr = await c.act(() => c.run(P.pickRadio, 'ctl00$cphMain$ProductType', 'rbGas'), 2500);
    log('7) rbGas 고르기: ' + pr.result + '  체크 상태: ' + (await checked()));
    const nx = await c.act(() => c.run(P.clickBtn, ['다음', 'next']), 3000);
    log('8) 다음: ' + nx.result + ' -> ' + short(await url()));
  } catch (e) {
    log('실패: ' + e.message);
  } finally {
    c.close();
  }
})();
