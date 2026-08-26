/* 각 화면의 '?' 도움말 팝업 내용을 긁습니다.
 *
 * 팝업은 qTip(jQuery) 이고 클릭할 때 서버에서 조각을 받아 .qtip-content 에
 * 넣습니다. DOM 에 삽입되므로 유저스크립트가 번역할 수 있지만, 클릭하지 않으면
 * 존재하지 않아서 일반 수집으로는 절대 잡히지 않습니다.
 *
 * 텍스트가 γ, χi 같은 기호 요소에서 잘려 **여러 텍스트 노드**로 나뉩니다.
 * 그래서 통째로가 아니라 조각별로 키를 만들어야 합니다.
 *
 * 주의: 페이지에서 실행할 코드에 정규식을 쓰지 마십시오. drive.js 가 템플릿
 * 리터럴로 감싸 보내므로 백슬래시가 한 번 더 먹혀 문자가 사라집니다
 * (인수인계서 '함정 2'). 정규화는 이 파일의 Node 쪽에서 합니다.
 */
const { execFileSync } = require('child_process');
const fs = require('fs');
const sleep = (ms) => Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
const env = Object.assign({}, process.env, { MSYS_NO_PATHCONV: '1', ART_WAIT: '1800' });
const drive = (a) => execFileSync('node', ['drive.js'].concat(a),
  { encoding: 'utf8', env, stdio: ['ignore', 'pipe', 'ignore'] });

const GRAB = "JSON.stringify((function(){var c=document.querySelector('.qtip-content');"
  + "if(!c)return[];var o=[],w=document.createTreeWalker(c,NodeFilter.SHOW_TEXT,null),n;"
  + "while(n=w.nextNode()){var t=n.nodeValue;if(t&&t.trim().length>1)o.push(t.trim());}"
  + "return o;})())";

let pages = process.argv.slice(2);
if (!pages.length) {
  pages = Array.from(new Set(fs.readFileSync('collected.by-page.tsv', 'utf8')
    .split('\n').map((l) => l.split('\t')[0])
    .filter((p) => p && p.indexOf('/loggedin/') === 0)));
}

const OUT = 'help_fragments.json';
const all = fs.existsSync(OUT) ? JSON.parse(fs.readFileSync(OUT, 'utf8')) : {};
let added = 0;

for (const p of pages) {
  try { drive(['nav', p]); } catch (e) { continue; }
  sleep(1000);
  try { drive(['mclick', 'a.aPageHelpIcon, .aPageHelpIcon, img.infoicon']); } catch (e) { continue; }
  sleep(2200);
  let raw;
  try { raw = drive(['eval', GRAB]).trim().split('\n').pop().trim(); } catch (e) { continue; }
  let arr;
  try { arr = JSON.parse(raw.charAt(0) === '"' ? JSON.parse(raw) : raw); } catch (e) { continue; }
  let n = 0;
  for (const s of arr) {
    const t = String(s).replace(/\s+/g, ' ').trim();
    // ART 자체 버그로 서버 태그와 CSS 가 팝업에 새어 나옵니다. 번역 대상이 아닙니다.
    if (t.indexOf('<%') === 0 || t.indexOf('@import') === 0) continue;
    if (t.length > 3 && /[A-Za-z]{4}/.test(t) && !all[t]) { all[t] = ''; n++; added++; }
  }
  if (n) console.log('   + ' + p.split('/').pop() + '  조각 ' + n + '개');
}

fs.writeFileSync(OUT, JSON.stringify(all, null, 1), 'utf8');
console.log('\n고유 도움말 조각 ' + Object.keys(all).length + '개 (새로 ' + added + '개) -> ' + OUT);
