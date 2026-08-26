/* 화면 제목을 전부 긁습니다. 제목은 '원거리장 1차 배출 발생원 — 2차 국소 제어'
 * 처럼 두 조각이 각각 다른 텍스트 노드로 렌더링돼서, 일반 수집으로는 뒷조각이
 * 자주 빠집니다. */
const { execFileSync } = require('child_process');
const fs = require('fs');
const sleep = (ms) => Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
const env = Object.assign({}, process.env, { MSYS_NO_PATHCONV: '1', ART_WAIT: '1800' });
const drive = (a) => execFileSync('node', ['drive.js'].concat(a),
  { encoding: 'utf8', env, stdio: ['ignore', 'pipe', 'ignore'] });
const pages = Array.from(new Set(fs.readFileSync('collected.by-page.tsv', 'utf8')
  .split('\n').map((l) => l.split('\t')[0])
  .filter((p) => p && p.indexOf('/loggedin/') === 0)));
const EXPR = "JSON.stringify([].slice.call(document.querySelectorAll('h1,h2,h3,.pageTitle,[class*=itle]'))"
  + ".map(function(e){return e.innerText||'';}))";
const out = {};
for (const p of pages) {
  try { drive(['nav', p]); } catch (e) { continue; }
  sleep(900);
  let r;
  try { r = drive(['eval', EXPR]).trim().split('\n').pop().trim(); } catch (e) { continue; }
  try {
    const arr = JSON.parse(r.charAt(0) === '"' ? JSON.parse(r) : r);
    arr.forEach(function (s) {
      String(s).replace(/\s+/g, ' ').trim().split('—').forEach(function (part) {
        const t = part.trim();
        if (t.length > 2 && /[A-Za-z]{4}/.test(t)) out[t] = '';
      });
    });
  } catch (e) { /* skip */ }
}
fs.writeFileSync('titles.json', JSON.stringify(out, null, 1), 'utf8');
console.log('영문 제목 조각 ' + Object.keys(out).length + '개');
Object.keys(out).forEach(function (k) { console.log(' - ' + k); });
