/* 현재 화면부터 활동 등급 화면(q017)까지 물성 질문들을 자동으로 통과합니다.
 *
 * autowalk.js 는 선택지를 '텍스트'로 고르는데, 화면이 이미 한국어라 자리표시자
 * '— 선택 —' 을 실제 항목으로 착각해 멈춥니다. 여기서는 텍스트를 보지 않고
 * **인덱스 1**(자리표시자 다음 첫 실제 항목)을 고릅니다.
 *
 *   node step_to_class.js [최대걸음]
 */
const { execFileSync } = require('child_process');
const sleep = (ms) => Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
const env = Object.assign({}, process.env, { MSYS_NO_PATHCONV: '1', ART_WAIT: '2500' });
const MAX = Number(process.argv[2] || 14);

function drive(args) {
  return execFileSync('node', ['drive.js'].concat(args),
    { encoding: 'utf8', env, stdio: ['ignore', 'pipe', 'ignore'] });
}
const evalJs = (js) => drive(['eval', js]).trim().split('\n').pop().trim();
function url() {
  const o = drive(['dump']);
  return JSON.parse(o.slice(o.indexOf('{'))).url || '';
}

// 자리표시자를 건너뛰고 각 select 의 첫 실제 항목을 고른다. 포스트백을 유발하므로
// 한 번에 하나씩 처리하고, 바뀔 때마다 잠깐 기다린다.
const PICK_ONE = "(function(){"
  + "var ss=[].slice.call(document.querySelectorAll('select'));"
  + "for(var i=0;i<ss.length;i++){var s=ss[i];"
  + "if(s.options.length<2) continue;"
  + "if(s.selectedIndex>0) continue;"
  + "s.selectedIndex=1;"
  + "s.dispatchEvent(new Event('change',{bubbles:true}));"
  + "return 'SET:'+(s.name||s.id)+'='+s.options[1].text.slice(0,30);}"
  + "return 'NONE';})()";

// 값이 빈 숫자/텍스트 칸을 채운다. 온도류는 큰 값이 필요할 수 있어 이름으로 구분.
const FILL = "(function(){var n=0;"
  + "[].slice.call(document.querySelectorAll('input[type=text],input[type=number]'))"
  + ".forEach(function(i){"
  + "if(i.offsetParent===null||i.value) return;"
  + "var k=(i.name||i.id||'').toLowerCase();"
  + "var v='1';"
  + "if(k.indexOf('temp')>=0) v='1500';"
  + "else if(k.indexOf('melt')>=0||k.indexOf('boil')>=0) v='1000';"
  + "else if(k.indexOf('fraction')>=0) v='0.5';"
  + "else if(k.indexOf('dustiness')>=0) v='1000';"
  + "i.value=v;i.dispatchEvent(new Event('change',{bubbles:true}));n++;});"
  + "return 'FILLED:'+n;})()";

let prev = '';
for (let step = 0; step < MAX; step++) {
  const u = url();
  console.log('[' + step + '] ' + u.split('/').pop());
  if (u.indexOf('activityclass') !== -1) { console.log('활동 등급 화면 도달'); break; }
  if (u === prev) { console.log('진행 없음, 중단'); break; }
  prev = u;

  // 숫자칸이 먼저다. ART 는 '값을 직접 입력' 과 '범주를 선택' 중 하나만 받는데,
  // 둘을 같이 채우면 화면이 넘어가지 않는다 (용융 금속 1500도 vs 범주 최대 150도).
  const f = evalJs(FILL);
  const filled = f.indexOf('FILLED:0') === -1;
  if (filled) { console.log('    ' + f.replace(/^"|"$/g, '')); sleep(1500); }

  if (!filled) {
    for (let i = 0; i < 6; i++) {
      const r = evalJs(PICK_ONE);
      if (r.indexOf('SET:') === -1) break;
      console.log('    ' + r.replace(/^"|"$/g, ''));
      sleep(2200);
    }
  }

  try { drive(['click', '다음']); } catch (e) { console.log('    다음 클릭 실패'); break; }
  sleep(2500);
}
console.log('종료: ' + url());
