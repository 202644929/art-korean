/* 활동 목록에서 '이전' 을 눌러 시나리오 단계 화면들을 거슬러 올라갑니다.
 * 제품 유형 중 가스/섬유상/고온금속을 잠그는 설정이 어디 있는지 찾습니다.
 */
const { connect } = require('./cdp.js');
const P = require('./pagelib.js');
const ACTS = '/loggedin/mechquest/q002_7_activities.aspx';
(async () => {
  const c = await connect();
  const log = (s) => process.stdout.write(s + '\n');
  const url = () => c.run(function () { return location.pathname; });
  await c.nav(ACTS);
  for (let i = 0; i < 12; i++) {
    const u = await url();
    const q = await c.run(function () {
      var norm = function (s) { return String(s || '').replace(/\s+/g, ' ').trim(); };
      var m = document.getElementById('ctl00_cphMain_upMain') || document.body;
      var out = [];
      var w = document.createTreeWalker(m, NodeFilter.SHOW_TEXT, null);
      var n;
      while ((n = w.nextNode()) && out.length < 6) {
        var p = n.parentElement;
        if (!p || p.offsetParent === null) continue;
        if (p.tagName === 'SCRIPT' || p.tagName === 'STYLE') continue;
        var t = norm(n.nodeValue);
        if (t.length < 6) continue;
        out.push(t.slice(0, 100));
      }
      var ctl = [];
      var rs = document.querySelectorAll('input[type=radio],select,input[type=text]');
      for (var i = 0; i < rs.length; i++) {
        var e = rs[i];
        if (e.offsetParent === null) continue;
        ctl.push(e.tagName.toLowerCase() + ' ' + (e.name || e.id)
          + (e.type === 'radio' ? ' =' + e.value + (e.checked ? '(v)' : '')
             + (e.disabled ? ' [잠김]' : '') : ''));
      }
      return { texts: out, ctl: ctl.slice(0, 14) };
    });
    log('\n### ' + u.split('/').pop());
    q.texts.forEach((t) => log('   ' + t));
    q.ctl.forEach((t) => log('   · ' + t));
    const p = await c.act(() => c.run(P.clickBtn, ['이전', 'previous']), 3000);
    if (p.result === 'NOTFOUND') { log('\n(이전 없음 — 끝)'); break; }
    if ((await url()) === u) { log('\n(안 넘어감 — 끝)'); break; }
  }
  c.close();
})();
