/* 활동 목록 화면(q002_7_activities)의 버튼과 활동 개수를 봅니다.
 * '새 활동' 을 만들 수 있으면 되돌리기가 훨씬 깔끔해집니다.
 *   node probe_acts.js
 */
const { connect } = require('./cdp.js');

const START = '/loggedin/mechquest/q002_7_activities.aspx';

function look() {
  var norm = function (s) { return String(s || '').replace(/\s+/g, ' ').trim(); };
  var btns = [];
  var all = document.querySelectorAll('a,input[type=submit],input[type=button],button');
  for (var i = 0; i < all.length; i++) {
    var e = all[i];
    if (e.offsetParent === null) continue;
    var t = norm(e.tagName === 'INPUT' ? e.value : e.textContent);
    if (!t) continue;
    btns.push(t.slice(0, 40) + '   {' + e.tagName.toLowerCase()
      + (e.id ? ' #' + e.id : '') + '}');
  }
  var rows = [];
  var trs = document.querySelectorAll('table tr');
  for (var j = 0; j < trs.length; j++) {
    if (trs[j].offsetParent === null) continue;
    var t2 = norm(trs[j].textContent);
    if (t2) rows.push(t2.slice(0, 130));
  }
  return { url: location.pathname, btns: btns, rows: rows };
}

(async () => {
  const c = await connect();
  const log = (s) => process.stdout.write(s + '\n');
  await c.nav(START);
  const r = await c.run(look);
  log(r.url);
  log('\n버튼/링크:');
  r.btns.forEach((b) => log('  ' + b));
  log('\n표 행:');
  r.rows.forEach((b) => log('  ' + b));
  c.close();
})();
