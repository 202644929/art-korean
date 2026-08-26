const { connect } = require('./cdp.js');
const P = require('./pagelib.js');
(async () => {
  const c = await connect();
  const log = (s) => process.stdout.write(s + '\n');
  const o = await c.act(() => c.run(P.openHelp), 1500);
  log('도움말 열기: ' + o.result);
  await c.sleep(1600);
  const h = await c.run(P.readHelp);
  (h || []).forEach(function (t) { log('  ' + String(t).slice(0, 400)); });
  c.close();
})();
