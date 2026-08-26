/* 활동 등급마다 '다음'을 눌러 그 등급의 하위 질문 화면까지 들어갑니다.
 * sweep_activities.js 는 등급/하위등급 '선택'만 바꿨을 뿐이라 하위 질문 화면
 * (교반 정도, 낙하 높이, 분무 방향, splash/submerged 등)에는 도달하지 못했습니다.
 * 그게 options/questions 미확인 구간의 정체입니다.
 *
 * 수집은 cdp_collect.js --watch 가 병행합니다. 선택만 바꾸고 저장은 하지 않습니다.
 *
 *   node walk_classes.js [등급화면경로]
 */
const { execFileSync } = require('child_process');
// 동기 블로킹 대기. drive.js 의 eval 은 기다리지 않아서 재시도 루프가 헛돌았습니다.
const sleep = (ms) => Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);

const CLASS_PAGE = process.argv[2] ||
  '/loggedin/mechquest/q017_055_103_activityclass.aspx';
// 여러 등급이 공유하는 화면 - 여기까지 오면 그 등급의 고유 질문은 끝난 것
const SHARED = ['q042_', 'q045_', 'q084_', 'q089_', 'q047_', 'q048_'];
const MAX_HOPS = 5;

const env = Object.assign({}, process.env,
  { ART_WAIT: process.env.ART_WAIT || '2600', MSYS_NO_PATHCONV: '1' });

function run(args) {
  return execFileSync('node', ['drive.js'].concat(args),
    { encoding: 'utf8', env, stdio: ['ignore', 'pipe', 'ignore'] });
}
function tail(out, ch) {
  const i = out.lastIndexOf(ch);
  if (i < 0) throw new Error('no ' + ch);
  return JSON.parse(out.slice(i === out.lastIndexOf('{') ? out.indexOf('{', i) : i));
}
function dump() {
  const o = run(['dump']);
  return JSON.parse(o.slice(o.indexOf('{')));
}
function radios() {
  const o = run(['radios']);
  return JSON.parse(o.slice(o.indexOf('[')));
}
const isShared = (u) => SHARED.some((s) => u.indexOf(s) !== -1);

run(['nav', CLASS_PAGE]);
const classes = radios().filter((r) => r.t);
console.log('활동 등급 ' + classes.length + '개\n');

const seen = new Set();
for (const c of classes) {
  const label = c.t.trim().slice(0, 30);
  console.log('== ' + c.v + '  ' + label);
  try {
    run(['nav', CLASS_PAGE]);
    run(['radio', label.toLowerCase()]);
  } catch (e) {
    console.log('   ! 등급 선택 실패');
    continue;
  }

  // 하위등급 드롭다운이 있으면 첫 실제 항목을 고름
  try {
    const d = dump();
    const sel = (d.selects || []).find((s) => /subclass/i.test(s.name || ''));
    if (sel) {
      // 드롭다운이 이미 한국어라 영어 기준 필터로는 자리표시자를 못 걸러냅니다.
      // '(하위 활동 등급 없음)' 을 골라버리면 포스트백이 선택을 무효화해서
      // 그 다음 '다음' 이 먹지 않습니다. 항목이 2개 이상일 때만 건드립니다.
      const opts = (sel.opts || []).filter((o) => o
        && o.indexOf('—') === -1 && o.indexOf('없음') === -1
        && o.indexOf('선택') === -1
        && !/choose|no activity/i.test(o));
      if ((sel.opts || []).length > 1 && opts.length) {
        run(['set', 'subclass', opts[0].slice(0, 35)]);
      }
    }
  } catch (e) { /* 하위등급 없음 */ }

  // 시작 URL 을 prev 로 잡아야 '클릭 실패로 등급화면에 그대로 있는' 경우를
  // 새 화면으로 오인하지 않습니다.
  let prev = '';
  try { prev = dump().url || ''; } catch (e) { prev = ''; }
  for (let hop = 0; hop < MAX_HOPS; hop++) {
    // 클릭 직후 dump 하면 아직 예전 URL 이 잡힙니다(포스트백 경합).
    // URL 이 바뀔 때까지 몇 번 더 읽습니다.
    let u = '';
    try {
      run(['click', '다음']);
      for (let t = 0; t < 6; t++) {
        try { u = dump().url || ''; } catch (e) { u = ''; }
        if (u && u !== prev) break;
        sleep(2500);
      }
    } catch (e) { break; }
    if (!u || u === prev) break;
    prev = u;
    const name = u.split('/').pop();
    if (seen.has(u)) { console.log('   . ' + name + ' (이미 봄)'); }
    else { seen.add(u); console.log('   + ' + name); }
    if (isShared(u)) break;
  }
}

console.log('\n순회 완료. 새로 본 화면 ' + seen.size + '개');
