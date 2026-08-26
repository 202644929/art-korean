/* 각 화면의 '설명' 상자 내용을 전부 긁습니다.
 *
 * 설명은 DIV#divDescription 에 보이지만, 실제로는 페이지 스크립트의 전역
 * `Descriptions` 객체에 전부 들어 있고 선택할 때 꺼내 넣습니다. 그래서
 * **선택지를 하나하나 클릭할 필요가 없습니다** — 전역만 읽으면 다 나옵니다.
 * (수집기가 이걸 놓친 이유: 아무것도 선택하지 않은 상태에서는 divDescription 이
 *  비어 있어서 텍스트 노드로 잡히지 않습니다.)
 *
 *   node grab_descriptions.js              collected.by-page.tsv 의 화면 전부
 *   node grab_descriptions.js /a.aspx /b.aspx
 */
const { execFileSync } = require('child_process');
const fs = require('fs');

const sleep = (ms) => Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
const env = Object.assign({}, process.env, { MSYS_NO_PATHCONV: '1', ART_WAIT: '2000' });
const OUT = 'descriptions.json';

function drive(args) {
  return execFileSync('node', ['drive.js'].concat(args),
    { encoding: 'utf8', env, stdio: ['ignore', 'pipe', 'ignore'] });
}

let pages = process.argv.slice(2);
if (!pages.length) {
  pages = Array.from(new Set(fs.readFileSync('collected.by-page.tsv', 'utf8')
    .split('\n').map((l) => l.split('\t')[0])
    .filter((p) => p && p.indexOf('/loggedin/') === 0)));
}

const all = fs.existsSync(OUT) ? JSON.parse(fs.readFileSync(OUT, 'utf8')) : {};
let added = 0;

for (const p of pages) {
  try { drive(['nav', p]); } catch (e) { console.log('! nav 실패 ' + p); continue; }
  sleep(1200);
  let raw;
  try {
    raw = drive(['eval', "typeof Descriptions!=='undefined'?JSON.stringify(Descriptions):'NONE'"])
      .trim().split('\n').pop().trim();
  } catch (e) { continue; }
  if (raw.indexOf('NONE') !== -1) { console.log('   . ' + p.split('/').pop()); continue; }
  let obj;
  try {
    obj = JSON.parse(raw.charAt(0) === '"' ? JSON.parse(raw) : raw);
  } catch (e) { console.log('   ! 파싱 실패 ' + p.split('/').pop()); continue; }
  let n = 0;
  for (const v of Object.values(obj)) {
    const s = String(v).replace(/\s+/g, ' ').trim();
    if (s.length > 2 && !all[s]) { all[s] = ''; n++; added++; }
  }
  console.log('   + ' + p.split('/').pop() + '  ' + Object.keys(obj).length + '개 (새 ' + n + ')');
}

fs.writeFileSync(OUT, JSON.stringify(all, null, 1), 'utf8');
console.log('\n고유 설명 ' + Object.keys(all).length + '개 (이번에 새로 ' + added + '개) -> ' + OUT);
