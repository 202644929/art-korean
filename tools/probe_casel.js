const { connect } = require('./cdp.js');
(async () => {
  const c = await connect();
  await c.nav('/loggedin/mechquest/q002_casno.aspx');
  const r = await c.run(function () {
    var norm = function (s) { return String(s || '').replace(/\s+/g, ' ').trim(); };
    var out = [];
    var all = document.querySelectorAll('#ctl00_cphMain_upMain *');
    for (var i = 0; i < all.length; i++) {
      var e = all[i];
      if (e.offsetParent === null) continue;
      if (e.children.length) continue;
      out.push(e.tagName.toLowerCase()
        + (e.type ? '[' + e.type + ']' : '')
        + (e.id ? ' #' + e.id : '')
        + '  ' + norm(e.textContent || e.value).slice(0, 50));
    }
    return out;
  });
  r.forEach(function (x) { process.stdout.write('  ' + x + '\n'); });
  c.close();
})();
