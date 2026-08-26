const { connect } = require('./cdp.js');
const P = require('./pagelib.js');
(async () => {
  const c = await connect();
  const log = (s) => process.stdout.write(s + '\n');
  const url = () => c.run(function () { return location.pathname; });
  // 제품 유형 화면까지 '이전' 으로 되돌립니다
  for (let i = 0; i < 20; i++) {
    if ((await url()).indexOf('q003_090_producttype') !== -1) break;
    const p = await c.act(() => c.run(P.clickBtn, ['이전', 'previous']), 3000);
    if (p.result === 'NOTFOUND') break;
  }
  log('화면: ' + (await url()));
  const r = await c.run(function () {
    var out = [];
    var rs = document.querySelectorAll('input[type=radio]');
    for (var i = 0; i < rs.length; i++) {
      var e = rs[i];
      out.push(e.value + '  checked=' + e.checked + '  disabled=' + e.disabled
        + '  vis=' + (e.offsetParent !== null)
        + '  onclick=' + (e.getAttribute('onclick') || '-').slice(0, 70));
    }
    return out;
  });
  r.forEach(function (x) { log('  ' + x); });
  c.close();
})();
