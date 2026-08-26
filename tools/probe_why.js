const { connect } = require('./cdp.js');
const P = require('./pagelib.js');
(async () => {
  const c = await connect();
  const log = (s) => process.stdout.write(s + '\n');
  await c.nav('/loggedin/mechquest/q002_7_activities.aspx');
  await c.act(() => c.run(P.clickBtn, ['활동 구성', 'configure activity']), 3000);
  for (let i = 0; i < 20; i++) {
    const u = await c.run(function () { return location.pathname; });
    if (u.indexOf('q003_090_producttype') !== -1) break;
    const p = await c.act(() => c.run(P.clickBtn, ['이전', 'previous']), 3000);
    if (p.result === 'NOTFOUND') break;
  }
  const r = await c.run(function () {
    var norm = function (s) { return String(s || '').replace(/\s+/g, ' ').trim(); };
    var out = [];
    var rs = document.querySelectorAll('input[type=radio]');
    for (var i = 0; i < rs.length; i++) {
      var e = rs[i];
      var lab = e.id ? document.querySelector('label[for="' + e.id + '"]') : null;
      var row = e.closest('tr,li,div');
      out.push({
        v: e.value, dis: e.disabled, chk: e.checked,
        title: e.getAttribute('title') || (lab && lab.getAttribute('title')) || '',
        cls: (lab && lab.className) || '',
        labstyle: (lab && lab.getAttribute('style')) || '',
        row: row ? norm(row.textContent).slice(0, 70) : ''
      });
    }
    // 화면 안내문 전체
    var info = document.querySelectorAll('.infopanel,#ctl00_cphInfo_infoPanel_panelInfo');
    var texts = [];
    for (var j = 0; j < info.length; j++) texts.push(norm(info[j].textContent).slice(0, 500));
    return { url: location.pathname, rows: out, info: texts };
  });
  log(r.url);
  r.rows.forEach(function (x) {
    log('  ' + (x.dis ? '[잠김] ' : '       ') + x.v
      + '  title=' + (x.title || '-') + '  cls=' + (x.cls || '-')
      + '  style=' + (x.labstyle || '-'));
  });
  log('\n안내문:');
  r.info.forEach(function (t) { log('  ' + t); });
  c.close();
})();
