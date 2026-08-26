const { connect } = require('./cdp.js');
(async () => {
  const c = await connect();
  const r = await c.run(function () {
    var out = [];
    var rs = document.querySelectorAll('input[type=radio]');
    for (var i = 0; i < rs.length; i++) {
      var e = rs[i];
      out.push(e.value + '  checked=' + e.checked + '  disabled=' + e.disabled
        + '  readonly=' + e.hasAttribute('readonly')
        + '  vis=' + (e.offsetParent !== null)
        + '  onclick=' + (e.getAttribute('onclick') || '-').slice(0, 60));
    }
    return { url: location.pathname, rows: out };
  });
  process.stdout.write(r.url + '\n');
  r.rows.forEach(function (x) { process.stdout.write('  ' + x + '\n'); });
  c.close();
})();
