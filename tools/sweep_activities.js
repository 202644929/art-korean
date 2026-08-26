/* 활동 등급 화면의 트리(등급 -> 하위등급)를 전부 훑어 문자열을 노출시킵니다.
 * 수집 자체는 cdp_collect.js --watch 가 병행해서 담당합니다.
 * 선택만 바꿀 뿐 저장하지 않지만, 세션 상태는 바뀝니다 — 버릴 시나리오에서만.
 *
 *   node sweep_activities.js
 */
const { execFileSync } = require('child_process');

const env = Object.assign({}, process.env, { ART_WAIT: process.env.ART_WAIT || '2000' });
function run(args) {
  return execFileSync('node', ['drive.js'].concat(args), { encoding: 'utf8', env });
}
function json(out) { return JSON.parse(out.slice(out.indexOf(out.indexOf('[') >= 0 && (out.indexOf('[') < out.indexOf('{') || out.indexOf('{') < 0) ? '[' : '{'))); }
function dump() { const o = run(['dump']); return JSON.parse(o.slice(o.indexOf('{'))); }
function radios() { const o = run(['radios']); return JSON.parse(o.slice(o.indexOf('['))); }

const classes = radios();
console.log('활동 등급 ' + classes.length + '개');

for (const c of classes) {
  if (!c.t) continue;
  try { run(['radio', c.t.slice(0, 45)]); } catch (e) { console.log('  ! 등급 선택 실패: ' + c.t); continue; }
  let d;
  try { d = dump(); } catch (e) { console.log('  ! 덤프 실패'); continue; }
  const sel = d.selects.find((s) => /subclass/i.test(s.name || ''));
  const opts = sel ? sel.opts.filter((o) => o && !/choose|no activity subclass/i.test(o)) : [];
  console.log('[' + c.v + '] ' + c.t.slice(0, 55) + '  하위 ' + opts.length + '개');
  for (const o of opts) {
    try {
      run(['set', 'subclass', o.slice(0, 40)]);
      console.log('    - ' + o.slice(0, 70));
    } catch (e) {
      console.log('    ! 하위등급 실패: ' + o.slice(0, 50));
    }
  }
}
console.log('순회 완료');
