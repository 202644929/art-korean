/* 페이지에서 실행할 함수 모음.
 *
 * 전부 **실제 함수**로 정의하고 cdp.js 의 run() 이 fn.toString() 으로 보냅니다.
 * 문자열/템플릿 리터럴로 감싸 보내면 백슬래시가 한 번 더 먹혀 정규식이 깨집니다
 * (인수인계서 '함정 2': /\s+/g 가 /s+/g 로 변해 s 를 전부 지워버림).
 */

// 화면에서 아직 영어인 것만 골라냅니다. 번역 스크립트가 이미 적용된 상태로
// 보므로 '남아 있는 영어'가 곧 구멍입니다.
function harvest() {
  var HAN = /[가-힣]/;
  var BSL = String.fromCharCode(92);   // 역슬래시
  var LAT = /[A-Za-z]{3}/;
  var norm = function (s) { return String(s || '').replace(/\s+/g, ' ').trim(); };
  var out = {
    url: location.pathname, title: norm(document.title),
    residue: [], attrs: [], opts: [], desc: null, descBox: null, legends: [], tas: []
  };
  var seen = {};
  var push = function (arr, s) {
    s = norm(s);
    if (s.length < 3 || HAN.test(s) || !LAT.test(s)) return;
    if (seen[s]) return;
    seen[s] = 1;
    arr.push(s);
  };

  var SKIP = { SCRIPT: 1, STYLE: 1, NOSCRIPT: 1 };
  var w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null);
  var n;
  while ((n = w.nextNode())) {
    var p = n.parentElement;
    if (!p || SKIP[p.tagName]) continue;
    if (p.tagName !== 'OPTION' && p.offsetParent === null) continue;
    push(out.residue, n.nodeValue);
  }

  // 버튼 캡션, placeholder, title, alt
  var els = document.querySelectorAll('input,textarea,select,a,img,[title]');
  for (var i = 0; i < els.length; i++) {
    var e = els[i];
    if (e.tagName === 'INPUT'
        && (e.type === 'submit' || e.type === 'button' || e.type === 'reset')) {
      push(out.attrs, e.value);
    }
    if (e.placeholder) push(out.attrs, e.placeholder);
    if (e.title) push(out.attrs, e.title);
    if (e.alt) push(out.attrs, e.alt);
  }

  // 유저스크립트가 아직 손대지 않는 속성들이 화면에 글을 띄우는지 확인용.
  // 여기서 뭔가 잡히면 템플릿의 ATTRS 에 그 속성을 추가해야 합니다.
  // (전송되는 값이 아니라 표시용 속성이라 번역해도 서버 데이터는 안 바뀝니다.)
  out.otherAttrs = [];
  var all2 = document.querySelectorAll('*');
  for (var v2 = 0; v2 < all2.length; v2++) {
    var at = all2[v2].attributes;
    if (!at) continue;
    for (var w2 = 0; w2 < at.length; w2++) {
      var an = at[w2].name;
      if (an !== 'aria-label' && an !== 'summary' && an.indexOf('data-') !== 0) continue;
      var av = norm(at[w2].value);
      if (av.length < 6 || HAN.test(av) || !/[A-Za-z]{4}\s+[A-Za-z]{2}/.test(av)) continue;
      out.otherAttrs.push(an + '=' + av);
    }
  }

  // select 옵션 전체
  var ss = document.querySelectorAll('select');
  for (var j = 0; j < ss.length; j++) {
    for (var k = 0; k < ss[j].options.length; k++) push(out.opts, ss[j].options[k].text);
  }

  // legend / fieldset 제목
  var lg = document.querySelectorAll('legend,fieldset > span:first-child,.groupHeader');
  for (var m = 0; m < lg.length; m++) push(out.legends, lg[m].textContent);

  // 설명 상자: 어떤 요소인지 + 내용
  var db = document.querySelector('#divDescription,[id*=escription],[id*=escr]');
  if (db) {
    out.descBox = {
      tag: db.tagName, id: db.id, name: db.name || '', cls: String(db.className || ''),
      ro: !!db.readOnly, dis: !!db.disabled,
      val: norm(db.tagName === 'TEXTAREA' ? db.value : db.textContent).slice(0, 500)
    };
    push(out.residue, out.descBox.val);
  }

  // 모든 textarea 상태 (사용자 입력칸과 읽기전용 설명칸 구분용)
  var tas = document.querySelectorAll('textarea');
  for (var q = 0; q < tas.length; q++) {
    var t = tas[q];
    // head 는 사람이 보기 위한 요약, full 이 사전 키로 쓸 전체 값입니다.
    // 예전에는 head(80자)를 그대로 기록해서 잘린 문장이 사전에 들어갔습니다.
    out.tas.push({ id: t.id, name: t.name || '', ro: !!t.readOnly, dis: !!t.disabled,
                   len: (t.value || '').length, head: norm(t.value).slice(0, 80),
                   full: norm(t.value) });
    if (t.readOnly || t.disabled) push(out.residue, t.value);
  }

  // onclick 속성 안에 박혀 있는 confirm()/alert() 문구.
  // 이건 클릭해 봐야 뜨는 대화상자라 DOM 순회로는 절대 안 잡힙니다.
  // (삭제 확인 같은 것들 — 실제로 누르면 데이터가 지워지므로 문자열만 캅니다.)
  out.dialogs = [];
  var withOn = document.querySelectorAll('[onclick],[onsubmit],[onchange]');
  for (var z = 0; z < withOn.length; z++) {
    var code = (withOn[z].getAttribute('onclick') || '')
      + ' ' + (withOn[z].getAttribute('onsubmit') || '')
      + ' ' + (withOn[z].getAttribute('onchange') || '');
    // 정규식으로 문자열 리터럴을 파싱하면 이스케이프 때문에 금방 깨집니다.
    // 여는 따옴표를 찾고 짝이 맞는 닫는 따옴표까지 직접 훑습니다.
    var low = code.toLowerCase();
    var from = 0;
    for (;;) {
      var ci = low.indexOf('confirm(', from);
      var ai = low.indexOf('alert(', from);
      var at = (ci < 0) ? ai : (ai < 0 ? ci : Math.min(ci, ai));
      if (at < 0) break;
      var open = code.indexOf('(', at) + 1;
      while (open < code.length && code.charAt(open) === ' ') open++;
      var q = code.charAt(open);
      if (q !== '"' && q !== "'") { from = at + 6; continue; }
      var buf = '';
      var i2 = open + 1;
      for (; i2 < code.length; i2++) {
        var ch2 = code.charAt(i2);
        if (ch2 === BSL) { buf += code.charAt(i2 + 1); i2++; continue; }
        if (ch2 === q) break;
        buf += ch2;
      }
      from = i2 + 1;
      var txt = norm(buf);
      if (txt.length > 3 && !HAN.test(txt) && LAT.test(txt)) out.dialogs.push(txt);
    }
  }

  out.desc = (typeof Descriptions !== 'undefined' && Descriptions) ? Descriptions : null;
  return out;
}

// 이 화면의 라디오 그룹 (숨은 것 제외)
function radioGroups() {
  var norm = function (s) { return String(s || '').replace(/\s+/g, ' ').trim(); };
  var rs = document.querySelectorAll('input[type=radio]');
  var g = {};
  for (var i = 0; i < rs.length; i++) {
    var r = rs[i];
    if (r.offsetParent === null) continue;
    var key = r.name || 'anon';
    if (!g[key]) g[key] = [];
    var lab = r.id ? document.querySelector('label[for="' + r.id + '"]') : null;
    var t = lab ? lab.textContent : (r.parentElement ? r.parentElement.textContent : '');
    g[key].push({ i: i, v: r.value, c: r.checked, t: norm(t).slice(0, 90) });
  }
  return g;
}

function pickRadio(name, value) {
  var rs = document.querySelectorAll('input[type=radio]');
  for (var i = 0; i < rs.length; i++) {
    if ((rs[i].name || 'anon') === name && rs[i].value === value) {
      if (rs[i].checked) return 'ALREADY';
      // 잠긴 라디오는 click() 이 아무 일도 하지 않습니다. 그런데 그걸 모른 채
      // 다음으로 넘기면 **원래 골라져 있던 값의 동작을 기록**하게 됩니다 —
      // 실제로 가스/섬유상/고온금속 갈래 141개가 그렇게 오염됐습니다.
      // (ART 는 흄·섬유·가스·고온금속을 아직 평가하지 못해 잠가 둡니다.)
      if (rs[i].disabled) return 'DISABLED';
      rs[i].click();
      return 'OK';
    }
  }
  return 'MISS';
}

function selectInfo() {
  var norm = function (s) { return String(s || '').replace(/\s+/g, ' ').trim(); };
  var ss = document.querySelectorAll('select');
  var out = [];
  for (var i = 0; i < ss.length; i++) {
    var s = ss[i];
    if (s.offsetParent === null) continue;
    var o = [];
    for (var j = 0; j < s.options.length; j++) {
      o.push({ v: s.options[j].value, t: norm(s.options[j].text) });
    }
    out.push({ name: s.name || s.id, id: s.id, idx: s.selectedIndex, opts: o });
  }
  return out;
}

function pickSelect(name, value) {
  var ss = document.querySelectorAll('select');
  for (var i = 0; i < ss.length; i++) {
    if ((ss[i].name || ss[i].id) === name) {
      if (ss[i].value === value) return 'ALREADY';
      if (ss[i].disabled) return 'DISABLED';
      for (var j = 0; j < ss[i].options.length; j++) {
        if (ss[i].options[j].value === value && ss[i].options[j].disabled) {
          return 'DISABLED';
        }
      }
      ss[i].value = value;
      ss[i].dispatchEvent(new Event('change', { bubbles: true }));
      return 'OK';
    }
  }
  return 'MISS';
}

// 캡션으로 버튼 클릭. 한국어/영어 후보를 순서대로 시도합니다.
function clickBtn(needles) {
  var norm = function (s) { return String(s || '').replace(/\s+/g, ' ').trim().toLowerCase(); };
  var all = document.querySelectorAll('a,button,input[type=submit],input[type=button]');
  for (var k = 0; k < needles.length; k++) {
    var nd = String(needles[k]).toLowerCase();
    for (var i = 0; i < all.length; i++) {
      var e = all[i];
      if (e.offsetParent === null) continue;
      var t = norm(e.tagName === 'INPUT' ? e.value : e.textContent);
      if (t && t.indexOf(nd) !== -1) { e.click(); return 'CLICKED:' + t; }
    }
  }
  return 'NOTFOUND';
}

// 검증 오류 메시지 ('다음'이 막혔는지 판단용)
function errors() {
  var norm = function (s) { return String(s || '').replace(/\s+/g, ' ').trim(); };
  var out = [];
  var es = document.querySelectorAll(
    '.error,span[style*="color:Red"],span[style*="color: red"],[id*=alidat]');
  for (var i = 0; i < es.length; i++) {
    if (es[i].offsetParent === null) continue;
    var t = norm(es[i].textContent);
    if (t) out.push(t);
  }
  return out;
}

// 비어 있는 필수 입력칸 채우기. 범위 초과로 막히지 않게 보수적인 값을 씁니다.
function fillBlanks() {
  var done = [];
  var ins = document.querySelectorAll('input[type=text],input[type=number]');
  for (var i = 0; i < ins.length; i++) {
    var e = ins[i];
    if (e.offsetParent === null || e.value) continue;
    var k = String(e.name || e.id || '').toLowerCase();
    if (k.indexOf('usernote') >= 0 || k.indexOf('search') >= 0) continue;
    var v = '1';
    if (k.indexOf('temp') >= 0) v = '20';
    else if (k.indexOf('fraction') >= 0 || k.indexOf('weight') >= 0) v = '0.5';
    else if (k.indexOf('dustiness') >= 0) v = '100';
    else if (k.indexOf('pressure') >= 0) v = '100';
    else if (k.indexOf('viscos') >= 0) v = '10';
    e.value = v;
    e.dispatchEvent(new Event('change', { bubbles: true }));
    done.push((e.name || e.id) + '=' + v);
  }
  return done;
}

// '?' 도움말 팝업 열기
function openHelp() {
  var e = document.querySelector(
    'a.aPageHelpIcon,.aPageHelpIcon,img.infoicon,img[src*=elp],img[src*=nfo]');
  if (!e) return 'NOICON';
  e.scrollIntoView({ block: 'center' });
  e.click();
  return 'OK';
}

// 도움말 팝업 내용 (조각 단위). ART 자체 버그로 새어나오는 서버 태그는 제외.
function readHelp() {
  var HAN = /[가-힣]/;
  var norm = function (s) { return String(s || '').replace(/\s+/g, ' ').trim(); };
  var out = [];
  var cs = document.querySelectorAll('.qtip-content,.ui-tooltip-content,.qtip');
  for (var c = 0; c < cs.length; c++) {
    var w = document.createTreeWalker(cs[c], NodeFilter.SHOW_TEXT, null);
    var n;
    while ((n = w.nextNode())) {
      var t = norm(n.nodeValue);
      if (t.length < 3 || HAN.test(t) || !/[A-Za-z]{3}/.test(t)) continue;
      if (t.indexOf('<%') === 0 || t.indexOf('@import') === 0) continue;
      out.push(t);
    }
  }
  return out;
}


// 선택지를 고를 때만 채워지는 두 상자를 읽습니다.
//
//   '예시:'  <ul><li>Milling operations</li><li>Lathe</li>…  ← 항목마다 텍스트 노드
//   '설명'   <div id=divDescription> 또는 <textarea readonly>
//
// **아무것도 선택하지 않은 상태에서는 둘 다 비어 있습니다.** 4차 세션 순회가
// 활동 예시(Milling operations, Lathe, Circular saw …)를 통째로 놓친 이유가
// 이것입니다. 화면을 훑을 때는 반드시 라디오를 하나씩 눌러가며 이 함수를
// 불러야 합니다. 설명 상자만 그렇게 처리하고 예시 상자는 빠뜨렸습니다.
function optionBoxes() {
  var norm = function (s) { return String(s || '').replace(/\s+/g, ' ').trim(); };
  var out = { examples: [], description: '' };

  // 실제 DOM: <div id="divExamplesList"><ul><li>Milling operations</li>…</ul></div>
  // '예시:' 머리글은 이 div **밖에** 있습니다. 그래서 '머리글이 예시인 목록'으로
  // 찾으면 실패합니다 — id 로 직접 잡습니다.
  var box = document.querySelector('#divExamplesList,[id*=xamplesList],[id*=xamples]');
  var lists = box ? [box] : [];
  if (!lists.length) {
    // 예비 경로: 보이는 목록 중 li 가 있는 것 (화면에 목록이 하나뿐입니다)
    var uls = document.querySelectorAll('ul,ol');
    for (var k = 0; k < uls.length; k++) {
      if (uls[k].offsetParent !== null && uls[k].querySelectorAll('li').length) {
        lists.push(uls[k]);
        break;
      }
    }
  }
  for (var i = 0; i < lists.length; i++) {
    var items = lists[i].querySelectorAll('li');
    for (var m = 0; m < items.length; m++) {
      var x = norm(items[m].textContent);
      if (x) out.examples.push(x);
    }
  }

  var db = document.querySelector('#divDescription,[id*=escription]');
  if (db) out.description = norm(db.tagName === 'TEXTAREA' ? db.value : db.textContent);
  return out;
}

// 시나리오 목록(myscenarios.aspx)에서 이름으로 시나리오를 불러옵니다.
//
// 마법사 화면(q002_7 이하)은 **시나리오가 불러와져 있어야** 열립니다. 안 그러면
// 목록으로 튕깁니다. 순회를 새 브라우저 프로필에서 시작하면 여기서 막힙니다.
//
// '삭제' 는 절대 누르지 않습니다 — 같은 행에 나란히 있습니다.
function loadScenario(name) {
  var norm = function (s) { return String(s || '').replace(/\s+/g, ' ').trim(); };
  var rows = document.querySelectorAll('tr');
  for (var i = 0; i < rows.length; i++) {
    var t = norm(rows[i].textContent);
    if (t.indexOf(name) === -1) continue;
    var as = rows[i].querySelectorAll('a');
    for (var j = 0; j < as.length; j++) {
      var lab = norm(as[j].textContent);
      if (lab.indexOf('삭제') !== -1 || /delete/i.test(lab)) continue;   // 안전장치
      if (lab.indexOf('불러오기') !== -1 || /^load/i.test(lab)) {
        as[j].click();
        return 'LOADED';
      }
    }
  }
  return 'NOROW';
}

// ── 상호작용으로만 나타나는 글을 잡기 위한 도구들 ───────────────────────────
//
// 지금까지의 방식은 '글이 있을 만한 곳'(텍스트 노드, option, title, 설명 상자…)을
// 열거해서 읽는 것이었습니다. 그래서 **내가 모르는 곳**은 영원히 못 봅니다.
// 실제로 `예시:` 상자를 그렇게 놓쳤습니다.
//
// 그래서 뒤집습니다: **조작 전후로 보이는 글 전체를 비교해 새로 나타난 것을 잡습니다.**
// 그 글이 어디서 오는지 몰라도 됩니다. 검증 메시지, 툴팁, 대화상자, 진행 화면이
// 모두 이 방식에 걸립니다.

// 화면에 보이는 모든 글의 목록. 이걸 조작 전후로 비교합니다.
function textSnapshot() {
  var norm = function (s) { return String(s || '').replace(/\s+/g, ' ').trim(); };
  var out = [];
  var seen = {};
  var push = function (s) {
    s = norm(s);
    if (!s || s.length < 2 || seen[s]) return;
    seen[s] = 1;
    out.push(s);
  };
  var SKIP = { SCRIPT: 1, STYLE: 1, NOSCRIPT: 1 };
  var w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null);
  var n;
  while ((n = w.nextNode())) {
    var p = n.parentElement;
    if (!p || SKIP[p.tagName]) continue;
    if (p.tagName !== 'OPTION' && p.offsetParent === null) continue;
    push(n.nodeValue);
  }
  // 보이는 값·속성도 화면에 나타나는 글입니다
  var els = document.querySelectorAll('input,textarea,[title],[alt],[placeholder]');
  for (var i = 0; i < els.length; i++) {
    var e = els[i];
    // 렌더링되지 않는 요소의 속성은 화면에 나타나지 않습니다.
    // <style title="ART Standard"> 가 헛 구멍으로 잡혔던 사례.
    if (e.offsetParent === null && e.tagName !== 'OPTION') continue;
    if (e.tagName === 'INPUT'
        && (e.type === 'submit' || e.type === 'button' || e.type === 'reset')) push(e.value);
    if (e.tagName === 'TEXTAREA' && (e.readOnly || e.disabled)) push(e.value);
    if (e.getAttribute) {
      push(e.getAttribute('title'));
      push(e.getAttribute('alt'));
      push(e.getAttribute('placeholder'));
    }
  }
  return out;
}

// alert/confirm/prompt 문구를 가로채 모읍니다.
//
// **confirm 은 항상 false 를 돌려줍니다.** 삭제 확인 같은 동작이 절대 진행되지
// 않게 하기 위함입니다. prompt 도 null(취소)을 돌려줍니다.
// 유저스크립트가 이미 감싸 놓은 뒤에 덮어쓰므로, 여기서 보이는 문구가 영어라면
// 그건 곧 번역이 안 된 것입니다 — 구멍 판정에 그대로 쓸 수 있습니다.
function installDialogSpy() {
  if (window.__artDialogSpy) return 'ALREADY';
  window.__artDialogSpy = [];
  window.alert = function (m) { window.__artDialogSpy.push('alert: ' + m); };
  window.confirm = function (m) { window.__artDialogSpy.push('confirm: ' + m); return false; };
  window.prompt = function (m) { window.__artDialogSpy.push('prompt: ' + m); return null; };
  return 'OK';
}

function readDialogSpy() {
  var v = window.__artDialogSpy || [];
  window.__artDialogSpy = [];
  return v;
}

// 마우스 올림 이벤트를 뿌려 CSS/JS 툴팁을 띄웁니다.
// `title` 속성은 이미 덮었지만, 직접 만든 툴팁은 이렇게만 나타납니다.
function hoverAll() {
  var els = document.querySelectorAll('a,img,label,span,th,td,input,select,div');
  var n = 0;
  for (var i = 0; i < els.length && n < 500; i++) {
    var e = els[i];
    if (e.offsetParent === null) continue;
    try {
      e.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
      e.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
      if (e.focus) e.focus();
    } catch (ex) { /* 무시 */ }
    n++;
  }
  try { document.body.focus(); } catch (ex) { /* 무시 */ }
  return n;
}

/* 검증 메시지를 일부러 유발합니다.
 *
 *   'empty'    보이는 입력칸을 모두 비우고 선택도 해제
 *   'text'     숫자칸에 글자를 넣음
 *   'huge'     터무니없이 큰 값
 *   'negative' 음수
 *   'both'     숫자칸과 범주 드롭다운을 **둘 다** 채움
 *              (ART 는 하나만 받습니다 — 실제로 순회를 막았던 조건)
 *
 * 사용자 메모칸(taUserNotes)은 건드리지 않습니다.
 */
function stuffBadValues(mode) {
  var done = [];
  var ins = document.querySelectorAll('input[type=text],input[type=number]');
  for (var i = 0; i < ins.length; i++) {
    var e = ins[i];
    if (e.offsetParent === null) continue;
    var k = String(e.name || e.id || '').toLowerCase();
    if (k.indexOf('usernote') >= 0 || k.indexOf('search') >= 0) continue;
    var v = '';
    if (mode === 'text') v = 'abc';
    else if (mode === 'huge') v = '999999999';
    else if (mode === 'negative') v = '-5';
    else if (mode === 'both') v = '1';
    e.value = v;
    try { e.dispatchEvent(new Event('change', { bubbles: true })); } catch (ex) {}
    done.push((e.name || e.id) + '=' + JSON.stringify(v));
  }
  if (mode === 'both') {
    // 숫자도 넣고 범주도 고릅니다
    var ss = document.querySelectorAll('select');
    for (var j = 0; j < ss.length; j++) {
      var s = ss[j];
      if (s.offsetParent === null || s.options.length < 2) continue;
      s.selectedIndex = 1;
      try { s.dispatchEvent(new Event('change', { bubbles: true })); } catch (ex) {}
      done.push((s.name || s.id) + '=idx1');
    }
  }
  if (mode === 'empty') {
    // 드롭다운은 자리표시자(빈 값)로 되돌립니다
    var ss2 = document.querySelectorAll('select');
    for (var m = 0; m < ss2.length; m++) {
      var s2 = ss2[m];
      if (s2.offsetParent === null) continue;
      for (var q = 0; q < s2.options.length; q++) {
        if (s2.options[q].value === '') { s2.selectedIndex = q; break; }
      }
      try { s2.dispatchEvent(new Event('change', { bubbles: true })); } catch (ex) {}
    }
  }
  return done;
}

module.exports = { harvest, optionBoxes, radioGroups, pickRadio, selectInfo,
                   pickSelect, clickBtn, errors, fillBlanks, openHelp, readHelp,
                   loadScenario, textSnapshot, installDialogSpy, readDialogSpy,
                   hoverAll, stuffBadValues };
