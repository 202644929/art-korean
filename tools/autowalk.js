/* 마법사 질문 화면을 자동으로 통과합니다. 선택지는 **첫 번째 것**을 무조건 고르므로
 * 결과값은 의미가 없습니다. 화면 문자열 수집만이 목적입니다.
 * 계정에 데이터를 씁니다 — 버릴 시나리오에서만 쓰십시오.
 *
 *   node autowalk.js [최대단계수]
 */
const { execFileSync } = require('child_process');
const env = Object.assign({}, process.env, { ART_WAIT: process.env.ART_WAIT || '2200' });
function run(args) {
  return execFileSync('node', ['drive.js'].concat(args), { encoding: 'utf8', env });
}
function dump() { const o = run(['dump']); return JSON.parse(o.slice(o.indexOf('{'))); }
function radios() { const o = run(['radios']); return JSON.parse(o.slice(o.indexOf('['))); }

const MAX = Number(process.argv[2] || 25);
let prev = '', stuck = 0;

for (let i = 0; i < MAX; i++) {
  let d;
  try { d = dump(); } catch (e) { console.log('덤프 실패: ' + e.message); break; }
  console.log(`[${i}] ${d.url}`);

  const errs = (d.validators || []).filter((v) => v && v.indexOf('Please wait') === -1);
  if (errs.length) console.log('    검증: ' + errs.join(' | ').slice(0, 100));

  if (d.url === prev) {
    if (++stuck >= 2) { console.log('    두 번 연속 정체, 중단'); break; }
  } else { stuck = 0; }
  prev = d.url;

  // 결과 화면에 닿으면 멈춥니다
  if (/result|report|output|bayes/i.test(d.url)) { console.log('    결과 화면 도달'); break; }

  let acted = false;
  let setSelectThisRound = false;

  // 1) 라디오 미선택이면 첫 번째 선택
  try {
    const rs = radios().filter((r) => r.k === 'radio');
    if (rs.length && !rs.some((r) => r.c)) {
      // 2차 원거리장 발생원에 'Yes' 를 고르면 두 번째 발생원 설정 루프로 들어가
      // 마법사가 길어집니다. 문자열 수집이 목적이므로 'No' 로 짧게 끝냅니다.
      const prefer = /secondaryfarfield/i.test(d.url)
        ? rs.find((r) => /^no$/i.test((r.t || '').trim())) : null;
      const pick = prefer || rs[0];
      if (pick && pick.t) {
        run(['radio', pick.t.slice(0, 40)]);
        acted = true;
        console.log('    라디오: ' + pick.t.slice(0, 55));
      }
    }
  } catch (e) { /* 무시 */ }

  // 2) 미선택 드롭다운은 첫 실제 항목 선택
  for (const s of d.selects) {
    // 자리표시자는 한국어로도 나옵니다 ('— 선택 —', '(하위 활동 등급 없음)').
    const PLACEHOLDER = /choose|no activity subclass|선택|하위 활동 등급 없음/i;
    const real = s.opts.filter((o) => o && !PLACEHOLDER.test(o));
    if (real.length && (s.value === '0' || s.value === '' || s.value === '__None')) {
      try { run(['set', (s.name || '').slice(-12), real[0].slice(0, 35)]);
        acted = true; setSelectThisRound = true;
        console.log('    선택: ' + real[0].slice(0, 50)); } catch (e) { /* 무시 */ }
    }
  }

  // 3) 빈 숫자 입력칸은 1 로 채웁니다.
  //    단, 같은 화면에 이미 선택된 드롭다운이 있으면 건너뜁니다 — ART 는
  //    '측정값을 직접 입력' 과 '범주 선택' 을 배타적으로 다루는 화면이 많아
  //    둘 다 채우면 Next 가 먹지 않습니다.
  const selSet = setSelectThisRound
    || d.selects.some((s) => s.value && s.value !== '0' && s.value !== '__None');
  for (const inp of (selSet ? [] : d.inputs)) {
    if (inp.name && inp.name !== 'taUserNotes' && !String(inp.value).trim()) {
      try { run(['fill', inp.name.slice(-12), '1']); acted = true;
        console.log('    입력: ' + inp.name.slice(-20) + ' = 1'); } catch (e) { /* 무시 */ }
    }
  }

  // 유저스크립트가 켜져 있으면 버튼이 한국어로 보입니다. 둘 다 인식합니다.
  const NEXTS  = ['Next', '다음'];
  const FINISH = ['Finish & Run', '완료 및 실행', 'Finish', '완료'];
  const nextBtn = d.buttons.find((b) => NEXTS.includes(b))
               || d.buttons.find((b) => FINISH.includes(b))
               || null;
  if (!nextBtn) { console.log('    진행 버튼 없음, 중단'); break; }
  try { run(['click', nextBtn]); } catch (e) { console.log('    클릭 실패'); break; }
}
console.log('자동 순회 종료');
