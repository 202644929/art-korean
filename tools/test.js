// ART Korean userscript - safety tests.
// The acceptance criterion: the bytes the server receives must be identical
// with and without translation. Everything else is secondary.
'use strict';
const fs = require('fs');
const { JSDOM } = require('jsdom');

const SCRIPT = fs.readFileSync('../art-korean.user.js', 'utf8');

let pass = 0, fail = 0;
const ok = (name, cond, extra) => {
  if (cond) { pass++; console.log('  ok   ' + name); }
  else { fail++; console.log('  FAIL ' + name + (extra ? '\n         ' + extra : '')); }
};
const eq = (name, a, b) =>
  ok(name, a === b, 'expected: ' + JSON.stringify(b) + '\n         actual:   ' + JSON.stringify(a));

// An ASP.NET WebForms page shaped like ART's activity configuration screen.
// Note ddlProduct's options deliberately have NO value attribute - that is the
// case where the browser submits the option's *text*.
const PAGE = `<!DOCTYPE html><html><body>
<form id="aspnetForm" method="post" action="default.aspx">
  <input type="hidden" name="__VIEWSTATE" value="/wEPDwUKMTU5MjA1NjE0OWRk">
  <input type="hidden" name="__VIEWSTATEGENERATOR" value="CA0B0334">
  <input type="hidden" name="__EVENTTARGET" value="">
  <input type="hidden" name="__EVENTARGUMENT" value="">

  <ul id="nav"><li><a href="#">My Scenarios</a></li><li><a href="#">Science</a></li>
      <li><a href="#">Support</a></li><li><a href="#">Training</a></li></ul>

  <label for="ddlProduct">What is the product type of the substance/preparation?</label>
  <select name="ctl00$ddlProduct" id="ddlProduct">
    <option>Powders, granules or pelletized material</option>
    <option>Solid objects</option>
    <option selected>Liquids</option>
    <option>Hot or molten metal</option>
  </select>

  <label for="ddlAgitation">What is the level of agitation?</label>
  <select name="ctl00$ddlAgitation" id="ddlAgitation">
    <option value="AC-1">Application of compressed air</option>
    <option value="AC-2" selected>Other handling with high level of agitation</option>
    <option value="AC-3">Handling with low level of agitation</option>
  </select>

  <select name="ctl00$ddlLev" id="ddlLev">
    <option>No localized controls</option>
    <option selected>Local exhaust ventilation (LEV)</option>
    <option>Glove boxes and glove bags</option>
    <option>Some String Not In The Dictionary At All</option>
  </select>

  <input type="text" name="ctl00$txtEmail" id="txtEmail" value="user@example.org">
  <input type="text" name="ctl00$txtCas" id="txtCas" value="7440-22-4">

  <input type="submit" name="ctl00$btnFinish" id="btnFinish" value="Finish">
  <input type="submit" name="ctl00$btnLogin" id="btnLogin" value="Log in">
  <input type="button" name="ctl00$btnQuick" id="btnQuick" value="Quick revision">
  <button type="submit" id="btnEl">Close</button>
</form>
</body></html>`;

function serialize(dom, submitter) {
  const form = dom.window.document.getElementById('aspnetForm');
  const fd = submitter
    ? new dom.window.FormData(form, submitter)
    : new dom.window.FormData(form);
  return [...fd.entries()].map(([k, v]) => k + '=' + v).join('&');
}

function makeDom() {
  return new JSDOM(PAGE, { runScripts: 'outside-only', url: 'https://www.advancedreachtool.com/' });
}

// ── baseline: serialization of the untouched page ─────────────────────────────
const base = makeDom();
const BASE_ALL = serialize(base);
const BASE_FINISH = serialize(base, base.window.document.getElementById('btnFinish'));
const BASE_SELECT_VALUES = ['ddlProduct', 'ddlAgitation', 'ddlLev']
  .map((id) => base.window.document.getElementById(id).value);

// ── run the userscript ───────────────────────────────────────────────────────
const dom = makeDom();
const { window } = dom;
const doc = window.document;
// 스크립트가 감쌀 대상(native alert)을 미리 스파이로 바꿔, 실제로 native 에
// 도달하는 문구가 한국어인지 관찰합니다.
const alertSeen = [];
window.alert = function (m) { alertSeen.push(String(m)); };
window.eval(SCRIPT);

console.log('\n[1] 화면 문구가 한국어로 바뀌는지');
eq('nav: My Scenarios', doc.querySelector('#nav a').textContent, '내 시나리오');
eq('question label', doc.querySelector('label[for="ddlProduct"]').textContent,
   '물질/조제품의 제품 유형은 무엇입니까?');
eq('option text (no value attr)', doc.querySelector('#ddlProduct option').textContent,
   '분말, 과립 또는 펠릿형 재료');
eq('option text (with value attr)', doc.querySelector('#ddlAgitation option').textContent,
   '압축공기 사용');
eq('submit button caption', doc.getElementById('btnFinish').value, '완료');
eq('<button> element text', doc.getElementById('btnEl').textContent, '닫기');
ok('unknown string left in English',
   doc.querySelector('#ddlLev option:nth-child(4)').textContent
     === 'Some String Not In The Dictionary At All');

console.log('\n[2] value 고정 - select.value 는 계속 영어 원문');
eq('ddlProduct.value', doc.getElementById('ddlProduct').value, 'Liquids');
eq('ddlAgitation.value', doc.getElementById('ddlAgitation').value, 'AC-2');
eq('ddlLev.value', doc.getElementById('ddlLev').value, 'Local exhaust ventilation (LEV)');
ok('value attribute was pinned on options that lacked one',
   [...doc.querySelectorAll('#ddlProduct option')].every((o) => o.hasAttribute('value')));
eq('pinned value matches the original text',
   doc.querySelector('#ddlProduct option').getAttribute('value'),
   'Powders, granules or pelletized material');

console.log('\n[3] 사용자 입력값은 절대 건드리지 않음');
eq('text input value', doc.getElementById('txtEmail').value, 'user@example.org');
eq('CAS input value', doc.getElementById('txtCas').value, '7440-22-4');
eq('__VIEWSTATE', doc.getElementsByName('__VIEWSTATE')[0].value, '/wEPDwUKMTU5MjA1NjE0OWRk');

console.log('\n[4] 합격 기준: 폼 직렬화 결과가 번역 전후 완전 동일');
eq('FormData (all fields)', serialize(dom), BASE_ALL);
eq('select.value trio', JSON.stringify(['ddlProduct', 'ddlAgitation', 'ddlLev']
    .map((id) => doc.getElementById(id).value)), JSON.stringify(BASE_SELECT_VALUES));

console.log('\n[5] 버튼 복원 - 네 경로');
// 경로 1a: pointerdown
const btnFinish = doc.getElementById('btnFinish');
btnFinish.dispatchEvent(new window.Event('pointerdown', { bubbles: true }));
eq('path 1a pointerdown restores clicked button', btnFinish.value, 'Finish');
eq('path 1a serialization with submitter', serialize(dom, btnFinish), BASE_FINISH);

// 경로 1b: keydown (Enter) on a text field submits the whole form
window.eval('document.getElementById("btnFinish").value = "완료";' +
            'document.getElementById("btnLogin").value = "로그인";');
doc.getElementById('txtEmail').dispatchEvent(
  new window.KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
eq('path 1b Enter restores all buttons (btnFinish)', btnFinish.value, 'Finish');
eq('path 1b Enter restores all buttons (btnLogin)',
   doc.getElementById('btnLogin').value, 'Log in');

// 경로 2: submit 이벤트
window.eval('document.getElementById("btnFinish").value = "완료";');
doc.getElementById('aspnetForm').dispatchEvent(
  new window.Event('submit', { bubbles: true, cancelable: true }));
eq('path 2 submit event restores', btnFinish.value, 'Finish');

// 경로 3: form.submit() - __doPostBack() 이 쓰는 길. submit 이벤트가 안 뜬다.
window.eval('document.getElementById("btnFinish").value = "완료";');
eq('precondition: button is Korean again', btnFinish.value, '완료');
try { doc.getElementById('aspnetForm').submit(); } catch (e) { /* jsdom: not implemented */ }
eq('path 3 form.submit() patch restores', btnFinish.value, 'Finish');
ok('path 3 patch is installed on the prototype',
   window.HTMLFormElement.prototype.submit.toString().indexOf('restoreAllButtons') !== -1);

// 경로 4: PageRequestManager 훅이 존재하는지 (실제 Sys 객체가 없는 환경이므로 코드 존재만 확인)
ok('path 4 PageRequestManager hook present in source',
   SCRIPT.indexOf('add_initializeRequest') !== -1 && SCRIPT.indexOf('add_endRequest') !== -1);

console.log('\n[6] 부분 포스트백 후 재번역 (MutationObserver)');
const doneObs = (async () => {
  const host = doc.createElement('div');
  host.innerHTML = '<label>What is the drop height?</label>' +
    '<select id="ddlNew"><option>Drop height &lt; 0.5 m</option>' +
    '<option selected>Drop height &gt; 0.5 m</option></select>' +
    '<input type="submit" name="n" id="btnNew" value="Finish">';
  doc.body.appendChild(host);
  await new Promise((r) => setTimeout(r, 60));
  eq('new label translated', host.querySelector('label').textContent, '낙하 높이는 얼마입니까?');
  eq('new option translated', host.querySelector('option').textContent, '낙하 높이 < 0.5 m');
  eq('new select.value still English', doc.getElementById('ddlNew').value, 'Drop height > 0.5 m');
  eq('new button translated', doc.getElementById('btnNew').value, '완료');

  console.log('\n[7] Alt+K 한/영 토글');
  doc.dispatchEvent(new window.KeyboardEvent('keydown',
    { key: 'k', altKey: true, bubbles: true }));
  eq('revert: nav', doc.querySelector('#nav a').textContent, 'My Scenarios');
  eq('revert: label', doc.querySelector('label[for="ddlProduct"]').textContent,
     'What is the product type of the substance/preparation?');
  eq('revert: option text', doc.querySelector('#ddlProduct option').textContent,
     'Powders, granules or pelletized material');
  eq('revert: button', doc.getElementById('btnFinish').value, 'Finish');
  eq('revert: serialization unchanged', serialize(dom), BASE_ALL);

  doc.dispatchEvent(new window.KeyboardEvent('keydown',
    { key: 'k', altKey: true, bubbles: true }));
  await new Promise((r) => setTimeout(r, 60));
  eq('re-translate: nav', doc.querySelector('#nav a').textContent, '내 시나리오');
  eq('re-translate: serialization unchanged', serialize(dom), BASE_ALL);

  console.log('\n[8] alert() 문구만 교체, 호출 자체는 그대로');
  alertSeen.length = 0;
  window.alert('Wrong password.');
  eq('알려진 alert 문구가 한국어로', alertSeen[0], '비밀번호가 올바르지 않습니다.');
  window.alert('Some unmapped server message');
  eq('사전에 없는 문구는 원문 유지', alertSeen[1], 'Some unmapped server message');
  ok('alert 호출이 삼켜지지 않고 그대로 전달됨', alertSeen.length === 2);
  // 영어 모드에서는 원문이 그대로 전달되어야 합니다
  doc.dispatchEvent(new window.KeyboardEvent('keydown',
    { key: 'k', altKey: true, bubbles: true }));
  window.alert('Wrong password.');
  eq('영어 모드에서는 alert 도 원문', alertSeen[2], 'Wrong password.');
  doc.dispatchEvent(new window.KeyboardEvent('keydown',
    { key: 'k', altKey: true, bubbles: true }));
  await new Promise((r) => setTimeout(r, 60));

  console.log('\n[9] 오탐 방지 - 짧은 단어는 부분 치환 대상이 아님');
  const p = doc.createElement('p');
  p.textContent = 'The Gas station sells Metal and Wood products.';
  doc.body.appendChild(p);
  await new Promise((r) => setTimeout(r, 60));
  eq('short words not substituted mid-sentence', p.textContent,
     'The Gas station sells Metal and Wood products.');

  console.log('\n[10] Guidance text + 공백 정규화');
  const g = doc.createElement('div');
  // 실제 HTML 처럼 줄바꿈과 연속 공백으로 감싼 도움말
  g.appendChild(doc.createTextNode(
    '\n      Select the type of the product   at the beginning\n      of the activity.\n   '));
  doc.body.appendChild(g);
  await new Promise((r) => setTimeout(r, 60));
  ok('줄바꿈/연속 공백이 섞인 도움말도 번역됨 (' +
     JSON.stringify(g.textContent.trim()) + ')',
     g.textContent.indexOf('활동 시작 시점의 제품 유형을 선택하십시오.') !== -1);

  const g2 = doc.createElement('p');
  g2.textContent = 'Secondary far field sources can be co-workers, machines or ' +
    'evaporating baths, objects or surfaces.';
  doc.body.appendChild(g2);
  await new Promise((r) => setTimeout(r, 60));
  eq('원거리장 도움말 번역', g2.textContent,
     '2차 원거리장 발생원으로는 동료 작업자, 기계, 증발이 일어나는 조(槽), 물체 또는 표면 등이 있을 수 있습니다.');

  // 도움말이 길어도 폼 직렬화는 그대로여야 합니다
  eq('도움말 추가 후에도 직렬화 동일', serialize(dom), BASE_ALL);

  console.log('\n[11] UpdatePanel 이 노드를 통째로 갈아끼울 때 (root 자신이 대상)');
  // 실제 사이트에서 하위등급 드롭다운이 영어로 남던 결함의 회귀 테스트입니다.
  // MutationObserver 는 추가된 노드 **자신**을 넘겨주는데 querySelectorAll 은
  // 자손만 찾으므로, 그 노드가 통째로 번역에서 빠졌습니다. [6] 은 컨테이너 div 를
  // 추가해 자손 탐색으로 잡혔기 때문에 이 경우를 못 걸렀습니다.
  const selDyn = doc.getElementById('ddlNew');
  const optDyn = doc.createElement('option');
  optDyn.textContent = 'Surface spraying of liquids';
  selDyn.appendChild(optDyn);                    // <option> 자체가 addedNode

  const btnDyn = doc.createElement('input');
  btnDyn.type = 'submit';
  btnDyn.name = 'nDyn';
  btnDyn.value = 'Next';
  doc.body.appendChild(btnDyn);                  // <input> 자체가 addedNode

  const tipDyn = doc.createElement('a');
  tipDyn.setAttribute('title', 'Click for help');
  tipDyn.textContent = 'x';
  doc.body.appendChild(tipDyn);                  // title 을 가진 요소 자체가 addedNode

  await new Promise((r) => setTimeout(r, 60));
  eq('직접 추가된 option 번역', optDyn.textContent, '액체의 표면 분무');
  eq('직접 추가된 option 의 value 는 영어 원문으로 고정',
     optDyn.getAttribute('value'), 'Surface spraying of liquids');
  eq('직접 추가된 submit 버튼 번역', btnDyn.value, '다음');
  eq('직접 추가된 요소의 title 번역', tipDyn.getAttribute('title'), '도움말을 보려면 클릭');
  eq('노드 직접 추가 후에도 직렬화 동일', serialize(dom), BASE_ALL);

  console.log('\n[12] 읽기전용 textarea(설명 상자)');
  // 실제 사이트는 설명 상자를 화면마다 두 가지로 렌더링합니다.
  //   <div id="divDescription">                    -> 일반 텍스트 워커가 처리
  //   <textarea readonly name="...txtDescription"> -> SKIP_TAGS 때문에 빠졌던 쪽
  // 그런데 이 textarea 는 name 이 있어 **폼 전송에 포함**됩니다. 그냥 번역하면
  // 서버가 받는 데이터가 한국어로 바뀝니다. 번역 + 전송 직전 복원이 둘 다 필요합니다.
  const DESC_EN = 'Glove changes should be able to be carried out without breaking containment';
  const DESC_KO = '밀폐를 해제하지 않고 장갑을 교체할 수 있어야 합니다';

  function addDesc(d) {
    const t = d.window.document.createElement('textarea');
    t.setAttribute('readonly', 'readonly');
    t.setAttribute('name', 'ctl00$txtDescription');
    t.value = DESC_EN;
    d.window.document.getElementById('aspnetForm').appendChild(t);
    return t;
  }
  // 기준값: 같은 상자를 영어 원문 그대로 둔 폼의 직렬화
  addDesc(base);

  function addNotes(d) {
    const t = d.window.document.createElement('textarea');
    t.setAttribute('name', 'ctl00$taUserNotes');
    t.value = 'Local exhaust ventilation (LEV)';   // 사전에 있지만 사용자 입력
    d.window.document.getElementById('aspnetForm').appendChild(t);
    return t;
  }
  addNotes(base);
  const BASE_WITH_DESC = serialize(base);

  const ta = addDesc(dom);
  const notes = addNotes(dom);   // 사용자가 직접 쓰는 칸은 절대 건드리면 안 됩니다

  await new Promise((r) => setTimeout(r, 80));

  eq('읽기전용 설명 상자 번역됨', ta.value, DESC_KO);
  eq('사용자 입력 textarea 는 그대로', notes.value, 'Local exhaust ventilation (LEV)');
  ok('번역 상태로는 전송 데이터가 달라진다(그래서 복원이 필요)',
     serialize(dom) !== BASE_WITH_DESC);

  // 경로 2: submit 이벤트
  doc.getElementById('aspnetForm').dispatchEvent(
    new window.Event('submit', { bubbles: true, cancelable: true }));
  eq('submit 시 설명 상자 원문 복원', ta.value, DESC_EN);
  eq('설명 상자 포함 폼 직렬화 동일', serialize(dom), BASE_WITH_DESC);

  // 알려진 한계: textarea 의 .value 를 스크립트로 바꾸면 MutationObserver 가
  // 울리지 않습니다(자식 텍스트 노드가 그대로라서). 그래서 복원 뒤에는 다음
  // 포스트백까지 영어로 남습니다. 실제 사이트는 설명을 채울 때마다 포스트백이
  // 요소를 새로 심으므로 문제가 되지 않고, 그 경로를 여기서 검증합니다.
  // 타이머로 다시 번역하는 방법은 쓰지 않습니다 — 복원과 전송 사이에 끼어들면
  // 서버가 한국어를 받을 수 있습니다.
  // 원래 위치(메모칸 앞)에 다시 심습니다. 폼 직렬화 순서는 DOM 순서라서
  // 끝에 붙이면 필드 순서만 달라져 비교가 깨집니다.
  ta.remove();
  const ta2 = doc.createElement('textarea');
  ta2.setAttribute('readonly', 'readonly');
  ta2.setAttribute('name', 'ctl00$txtDescription');
  ta2.value = DESC_EN;
  doc.getElementById('aspnetForm').insertBefore(ta2, notes);
  await new Promise((r) => setTimeout(r, 80));
  eq('포스트백으로 새로 심긴 설명 상자는 번역됨', ta2.value, DESC_KO);

  // 경로 3: form.submit() (__doPostBack 이 쓰는 길)
  doc.getElementById('aspnetForm').submit();
  eq('form.submit() 시에도 원문 복원', ta2.value, DESC_EN);
  eq('form.submit() 후 직렬화 동일', serialize(dom), BASE_WITH_DESC);

  console.log('\n[13] confirm / prompt');
  // 삭제 확인처럼 확인 대화상자로만 뜨는 문구가 있습니다. DOM 에 없으니
  // 텍스트 워커로는 절대 안 잡힙니다. alert 과 같은 방식으로 문구만 바꿉니다.
  // **반환값을 절대 바꾸면 안 됩니다** — confirm 의 true/false 가 삭제 여부를
  // 정하므로, 삼키거나 뒤집으면 사용자 데이터가 날아갑니다.
  const seenC = [];
  let answer = false;
  window.confirm = function (m) { seenC.push(m); return answer; };
  window.prompt = function (m, d) { seenC.push(m); return d; };
  // 스크립트를 다시 돌려 새 native 를 감싸게 합니다.
  // 중복 실행 방지 장치를 일부러 풉니다. 같은 문서에서 두 번 돌면 관찰자가
  // 두 개가 되어 서로의 변경을 물고 페이지가 멈추므로 실사용에서는 막아야
  // 하지만, 여기서는 confirm/prompt 스파이를 감싸게 하려고 한 번 더 돌립니다.
  window.__ART_KO_ACTIVE__ = false;
  window.eval(SCRIPT);

  answer = true;
  eq('confirm 반환값 그대로 (true)', window.confirm('Delete'), true);
  answer = false;
  eq('confirm 반환값 그대로 (false)', window.confirm('Delete'), false);

  seenC.length = 0;
  window.confirm('Please select an activity class/subclass.');
  eq('confirm 문구 번역', seenC[0], '활동 등급/하위등급을 선택하십시오.');

  seenC.length = 0;
  const back = window.prompt('Please select an activity class/subclass.', 'user typed');
  eq('prompt 문구 번역', seenC[0], '활동 등급/하위등급을 선택하십시오.');
  eq('prompt 기본값은 건드리지 않음', back, 'user typed');

  seenC.length = 0;
  window.confirm('Some string that is not in the dictionary');
  eq('사전에 없으면 원문 유지', seenC[0], 'Some string that is not in the dictionary');

  console.log('\n[14] 중복 실행 방지');
  // 같은 문서에서 두 번 돌면 MutationObserver 가 두 개가 되고, 서로가 만든
  // 변경을 상대가 다시 처리하면서 페이지가 멈춥니다(실제 사이트에서 겪음).
  // Tampermonkey 에 두 번 설치했거나 콘솔로 한 번 더 붙여넣은 경우입니다.
  ok('가드가 켜져 있다', window.__ART_KO_ACTIVE__ === true);

  const before14 = doc.querySelectorAll('option[data-art-en]').length;
  window.eval(SCRIPT);                       // 두 번째 실행 - 아무 일도 없어야 함
  await new Promise((r) => setTimeout(r, 60));
  eq('두 번째 실행은 아무것도 바꾸지 않음',
     doc.querySelectorAll('option[data-art-en]').length, before14);
  // 지금은 번역이 적용된 상태(설명 상자가 한국어)이므로, 합격 기준인 '전송 시점'
  // 으로 맞춰 놓고 비교합니다. 복원 경로가 여전히 살아 있는지도 같이 확인됩니다.
  doc.getElementById('aspnetForm').dispatchEvent(
    new window.Event('submit', { bubbles: true, cancelable: true }));
  eq('두 번째 실행 후에도 전송 데이터 동일', serialize(dom), BASE_WITH_DESC);

  console.log('\n' + (fail === 0 ? 'ALL PASS' : 'FAILURES: ' + fail) +
              '  (' + pass + ' passed, ' + fail + ' failed)');
  process.exit(fail === 0 ? 0 : 1);
})();
