/* drive.js 를 반복 호출해 단순 화면을 자동 통과합니다.
 * 판단이 필요한 지점(드롭다운, 빈 입력칸, 검증 오류)에서 멈춥니다.
 * 계정에 데이터를 씁니다 — 버릴 시나리오에서만 쓰십시오.
 *
 *   node walk.js [최대단계수]
 */
const { execFileSync } = require('child_process');

function run(args) {
  return execFileSync('node', ['drive.js'].concat(args), { encoding: 'utf8' });
}
function dump() {
  const out = run(['dump']);
  return JSON.parse(out.slice(out.indexOf('{')));
}

const MAX = Number(process.argv[2] || 12);
let prev = '';
for (let i = 0; i < MAX; i++) {
  let d;
  try { d = dump(); } catch (e) { console.log('덤프 실패:', e.message); break; }

  const empties = d.inputs.filter((x) => x.name !== 'taUserNotes' && !String(x.value).trim());
  const errs = (d.validators || []).filter((v) => v && v.indexOf('Please wait') === -1);

  console.log(`[${i}] ${d.url}  선택지 ${d.selects.length} / 빈칸 ${empties.length}`);
  if (d.headings.length) console.log('     ' + d.headings.join(' | ').slice(0, 120));

  if (d.url === prev) { console.log('  -> URL 변화 없음, 중단'); break; }
  prev = d.url;

  if (errs.length) { console.log('  -> 검증 메시지: ' + errs.join(' | ')); break; }
  if (d.selects.length) {
    console.log('  -> 드롭다운 발견, 판단 필요:');
    d.selects.forEach((s) => console.log('     ' + s.name + ' (' + s.n + '개) ' + s.opts.join(' / ').slice(0, 150)));
    break;
  }
  if (empties.length) {
    console.log('  -> 빈 입력칸: ' + empties.map((x) => x.name).join(', '));
    break;
  }
  // 라디오 그룹이 있는데 아무것도 선택 안 됐으면 Next 가 먹히지 않습니다.
  if (d.radios.length && !d.radios.some((r) => r.checked)) {
    console.log('  -> 라디오 미선택 (' + d.radios.length + '개), 판단 필요');
    break;
  }
  if (!d.buttons.some((b) => b === 'Next')) { console.log('  -> Next 없음, 중단'); break; }
  run(['click', 'Next']);
}
console.log('순회 종료');
