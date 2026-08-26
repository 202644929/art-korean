/* '활동 구성' 으로 처음으로 되돌린 뒤, 제품 유형을 골랐을 때 실제로 어디로
 * 가는지 한 걸음씩 관찰합니다. 경로 되밟기가 왜 어긋나는지 보려는 것입니다.
 *
 *   node probe_reset.js rbGas
 */
const { connect } = require('./cdp.js');
const P = require('./pagelib.js');

const START = '/loggedin/mechquest/q002_7_activities.aspx';
const FIRST = 'q003_090_producttype';
const WANT = process.argv[2] || 'rbGas';

(async () => {
  const c = await connect();
  const log = (s) => process.stdout.write(s + '\n');
  const url = () => c.run(function () { return location.pathname; });
  const short = (u) => String(u).split('/').pop();

  try {
    await c.nav(START);
    log('활동 목록: ' + short(await url()));

    const r = await c.act(() => c.run(P.clickBtn, ['활동 구성', 'configure activity']), 2500);
    log('활동 구성 클릭: ' + r.result + '  -> ' + short(await url()));

    // 첫 화면까지 되돌리기
    for (let i = 0; i < 40; i++) {
      const u = await url();
      if (u.indexOf(FIRST) !== -1) break;
      const p = await c.act(() => c.run(P.clickBtn, ['이전', 'previous', 'back']), 3000);
      log('  이전 ' + (i + 1) + ': ' + p.result + ' -> ' + short(await url()));
      if (p.result === 'NOTFOUND' || (await url()) === u) break;
    }
    log('되돌린 뒤: ' + short(await url()));

    // 지금 무엇이 체크되어 있는가
    let gg = await c.run(P.radioGroups);
    for (const nm of Object.keys(gg)) {
      log('  그룹 ' + nm);
      gg[nm].forEach((o) => log('    ' + (o.c ? '[v]' : '[ ]') + ' ' + o.v + '  ' + o.t.slice(0, 40)));
    }

    // 원하는 값을 고른다
    const pr = await c.act(() => c.run(P.pickRadio, Object.keys(gg)[0], WANT), 2000);
    log('pickRadio ' + WANT + ': ' + pr.result + '  화면: ' + short(await url()));

    gg = await c.run(P.radioGroups);
    for (const nm of Object.keys(gg)) {
      gg[nm].forEach((o) => {
        if (o.c) log('  고른 뒤 체크됨: ' + o.v + '  ' + o.t.slice(0, 40));
      });
    }

    const before = await url();
    const nx = await c.act(() => c.run(P.clickBtn, ['다음', 'next']), 3000);
    log('다음 클릭: ' + nx.result + '  -> ' + short(await url())
      + (before === (await url()) ? '  (안 넘어감)' : ''));
    log('오류: ' + JSON.stringify(await c.run(P.errors)));
  } catch (e) {
    log('실패: ' + e.message);
  } finally {
    c.close();
  }
})();
