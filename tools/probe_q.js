/* 지금 열린 화면에서 '질문 문구'가 DOM 어디에 있는지 찾습니다.
 * 드롭다운만 있는 화면은 legend 가 없어서 다른 자리를 봐야 합니다.
 *   node probe_q.js
 */
const { connect } = require('./cdp.js');

function dump() {
  var norm = function (s) { return String(s || '').replace(/\s+/g, ' ').trim(); };
  var out = [];
  var w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null);
  var n;
  while ((n = w.nextNode())) {
    var p = n.parentElement;
    if (!p || p.offsetParent === null) continue;
    if (p.tagName === 'SCRIPT' || p.tagName === 'STYLE') continue;
    var t = norm(n.nodeValue);
    if (t.length < 8) continue;
    var chain = [];
    for (var e = p; e && e !== document.body; e = e.parentElement) {
      chain.push(e.tagName + (e.id ? '#' + e.id : '')
        + (e.className && typeof e.className === 'string'
           ? '.' + e.className.split(/\s+/).join('.') : ''));
      if (chain.length >= 4) break;
    }
    out.push(chain.join(' < ') + '   ||  ' + t.slice(0, 120));
    if (out.length > 40) break;
  }
  return { url: location.pathname, lines: out };
}

(async () => {
  const c = await connect();
  const r = await c.run(dump);
  process.stdout.write(r.url + '\n');
  r.lines.forEach((l) => process.stdout.write('  ' + l + '\n'));
  c.close();
})();
