// ==UserScript==
// @name         ART 한국어 (Advanced REACH Tool)
// @namespace    art-ko
// @version      1.6.3
// @description  advancedreachtool.com 화면을 한국어로 표시합니다. 표시 계층만 바꾸며 서버로 전송되는 폼 데이터는 한 바이트도 달라지지 않습니다. Alt+K 한/영 토글, Alt+C 수집 모드, Alt+E 미번역 내보내기.
// @author       -
// @match        *://*.advancedreachtool.com/*
// @match        *://advancedreachtool.com/*
// @run-at       document-idle
// @grant        none
// ==/UserScript==

// @grant none 은 필수입니다. GM_* 권한을 쓰면 스크립트가 샌드박스로 분리되어
// HTMLFormElement.prototype.submit 패치(경로 3)가 페이지에 닿지 못합니다.

(function () {
  'use strict';

  // ── 중복 실행 방지 ────────────────────────────────────────────────────────
  // 이 스크립트가 한 문서에서 두 번 돌면 MutationObserver 도 두 개가 되고,
  // 서로가 만든 변경을 상대가 다시 처리하면서 페이지가 멈춥니다(실제로 겪음).
  // Tampermonkey 에 같은 스크립트를 두 번 설치했거나, 개발 중에 콘솔로 한 번 더
  // 붙여넣은 경우에 일어납니다. 두 번째부터는 조용히 빠집니다.
  if (window.__ART_KO_ACTIVE__) {
    console.warn('[ART-KO] 이미 적용되어 있어 중복 실행을 건너뜁니다.');
    return;
  }
  window.__ART_KO_ACTIVE__ = true;

  // ── 번역 사전 ─────────────────────────────────────────────────────────────
  // art-ko-dict.json 에서 생성됨. 직접 고치지 말고 JSON을 고친 뒤 다시 빌드하세요.
  const DICT = /*__DICT__*/;

  // 부분(부문자열) 치환에 쓸 키. 짧은 단어까지 부분 치환하면 단어 중간에
  // 오탐이 생기므로 14자 이상만 사용하고, 긴 것부터 적용해 겹침을 피합니다.
  const PHRASE_MIN = 14;
  const PHRASE_KEYS = Object.keys(DICT)
    .filter((k) => k.length >= PHRASE_MIN)
    .sort((a, b) => b.length - a.length);

  // OPTION 은 반드시 제외합니다. 일반 텍스트 워커가 option 텍스트를 먼저 바꾸면
  // 뒤이은 value 고정이 '한국어' 값을 고정해 전송 데이터가 바뀝니다.
  const SKIP_TAGS = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEXTAREA', 'INPUT',
                             'SELECT', 'OPTION', 'OPTGROUP']);
  const ATTRS = ['title', 'placeholder', 'alt'];

  // 되돌리기(Alt+K)용 원문 보관. 노드를 Set에 모아두지 않고 WeakMap만 쓰므로
  // DOM에서 떨어진 노드는 그대로 GC됩니다.
  const origText = new WeakMap();

  let active = true;      // 한국어 표시 중인지
  let collecting = false; // 수집 모드
  const collected = new Set();

  // ── 조회 ─────────────────────────────────────────────────────────────────
  // HTML 은 긴 문장을 줄바꿈과 연속 공백으로 감싸 놓기 때문에, 원문 그대로의
  // 조회가 실패해도 공백을 하나로 접은 형태로 한 번 더 찾습니다. 이게 없으면
  // 긴 질문문과 도움말 문구는 실제 DOM 에서 거의 매칭되지 않습니다.
  const NORM = Object.create(null);
  for (const k of Object.keys(DICT)) {
    const n = k.replace(/\s+/g, ' ').trim();
    if (!(n in NORM)) NORM[n] = DICT[k];
  }

  function lookup(s) {
    const key = s.trim();
    if (!key) return null;
    if (Object.prototype.hasOwnProperty.call(DICT, key)) return DICT[key];
    const n = key.replace(/\s+/g, ' ');
    return n in NORM ? NORM[n] : null;
  }

  function phraseSub(raw) {
    if (raw.length < PHRASE_MIN || raw.length > 4000) return null;
    let out = raw;
    for (const k of PHRASE_KEYS) {
      if (out.indexOf(k) !== -1) out = out.split(k).join(DICT[k]);
    }
    return out === raw ? null : out;
  }

  function translate(raw) {
    const exact = lookup(raw);
    if (exact !== null) {
      // 앞뒤 공백은 레이아웃에 영향을 주므로 보존합니다.
      return raw.match(/^\s*/)[0] + exact + raw.match(/\s*$/)[0];
    }
    return phraseSub(raw);
  }

  function note(raw) {
    if (!collecting) return;
    const k = raw.trim();
    if (k && k.length > 1 && !lookup(k) && /[A-Za-z]{3}/.test(k)) collected.add(k);
  }

  // ── 텍스트 노드 ───────────────────────────────────────────────────────────
  function doTextNode(node) {
    const raw = node.nodeValue;
    if (!raw || !raw.trim()) return;
    note(raw);
    const ko = translate(raw);
    if (ko === null) return;
    if (!origText.has(node)) origText.set(node, raw);
    node.nodeValue = ko;
  }

  function walkText(root, fn) {
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(n) {
        const p = n.parentElement;
        if (!p || SKIP_TAGS.has(p.tagName)) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      },
    });
    let n;
    while ((n = w.nextNode())) fn(n);
  }

  // ── <option>: value 고정 후 표시 텍스트만 교체 ────────────────────────────
  // WebForms 의 <select> 는 선택된 option 의 value 속성을 전송하는데, value 속성이
  // 없으면 브라우저가 표시 텍스트를 대신 전송합니다. 그래서 번역 '전에' 암묵적
  // 값을 명시적 속성으로 고정(value pinning)합니다. HTML 명세상 value 속성이
  // 있으면 전송되는 것은 속성값이고 텍스트는 표시 전용이므로, 이후 select.value
  // 는 계속 영어 원문을 반환합니다. 되돌리거나 submit 을 가로챌 필요가 없습니다.
  // RequiredFieldValidator 의 InitialValue 비교도 value 기준이라 그대로 통과합니다.
  // MutationObserver 는 추가된 노드 **자신**을 넘겨줍니다. querySelectorAll 은
  // 자손만 찾으므로, ASP.NET UpdatePanel 이 <option> 이나 <input> 을 통째로
  // 갈아끼우면 그 노드가 번역에서 통째로 빠집니다. 실제 사이트에서 하위등급
  // 드롭다운이 영어로 남는 것으로 확인된 결함입니다. root 자신도 포함시킵니다.
  function pick(root, sel) {
    const out = [];
    try {
      if (root.matches && root.matches(sel)) out.push(root);
    } catch (e) { /* 잘못된 선택자 무시 */ }
    if (root.querySelectorAll) {
      for (const el of root.querySelectorAll(sel)) out.push(el);
    }
    return out;
  }

  function doOptions(root) {
    const opts = pick(root, 'option');
    for (const opt of opts) {
      try {
        if (!opt.hasAttribute('value')) opt.setAttribute('value', opt.value);
      } catch (e) {
        continue; // 값 고정에 실패하면 이 option 은 손대지 않습니다.
      }
      const raw = opt.textContent;
      note(raw);
      const ko = translate(raw);
      if (ko === null) continue;
      if (!opt.hasAttribute('data-art-en')) opt.setAttribute('data-art-en', raw);
      opt.textContent = ko;
    }
  }

  // ── 읽기전용 textarea('설명' 상자) ───────────────────────
  // ART 은 화면마다 설명 상자를 달리 렌더링합니다.
  //   <div id="divDescription">        ← 일반 텍스트 워커가 처리
  //   <textarea readonly name="...txtDescription">  ← 여기서 처리
  // textarea 는 SKIP_TAGS 에 있어 워커가 지나가는데, 사용자가 직접 입력하는
  // 칸(별도 메모 등)을 건드리면 안 되기 때문입니다. readonly/disabled 인 칸은
  // 사용자가 쓸 수 없는 '보여주기용' 이므로 여기서만 번역합니다.
  //
  // 중요: name 이 있어 폼 전송에 포함됩니다. 그래서 버튼과 동일하게
  // 전송 직전에 원문을 되돌립니다(restoreAllButtons).
  function doDescTextareas(root) {
    for (const el of pick(root, 'textarea')) {
      if (!(el.readOnly || el.disabled
            || el.hasAttribute('readonly') || el.hasAttribute('disabled'))) continue;
      const raw = el.value;
      if (!raw || !raw.trim()) continue;
      note(raw);
      const ko = translate(raw);
      if (ko === null) continue;
      if (!el.hasAttribute('data-art-en')) el.setAttribute('data-art-en', raw);
      el.value = ko;
    }
  }

  // ── 버튼: 표시와 전송이 같은 value 속성이라 분리 불가 → 전송 직전 원문 복원 ──
  function doButtons(root) {
    const sel = 'input[type="submit"], input[type="button"], input[type="reset"], button';
    const els = pick(root, sel);
    for (const el of els) {
      if (el.tagName === 'BUTTON') {
        // <button> 의 표시 텍스트는 자식 텍스트 노드이므로 walkText 가 처리합니다.
        continue;
      }
      const raw = el.value;
      if (!raw) continue;
      note(raw);
      const ko = translate(raw);
      if (ko === null) continue;
      if (!el.hasAttribute('data-art-en')) el.setAttribute('data-art-en', raw);
      el.value = ko;
    }
  }

  function restoreOne(el) {
    if (el && el.nodeType === 1 && el.hasAttribute && el.hasAttribute('data-art-en')
        && 'value' in el) {
      el.value = el.getAttribute('data-art-en');
    }
  }

  // 버튼과 읽기전용 textarea 를 모두 복원합니다. 둘 다 value 가 그대로 전송되므로
  // 하나만 복원하면 서버가 받는 데이터가 달라집니다.
  function restoreAllButtons() {
    document.querySelectorAll('input[data-art-en], textarea[data-art-en]')
      .forEach(restoreOne);
  }

  // ── 기타 속성 ────────────────────────────────────────────────────────────
  function doAttrs(root) {
    for (const a of ATTRS) {
      for (const el of pick(root, '[' + a + ']')) {
        const raw = el.getAttribute(a);
        if (!raw) continue;
        const ko = lookup(raw);
        if (ko === null) continue;
        const bak = 'data-art-en-' + a;
        if (!el.hasAttribute(bak)) el.setAttribute(bak, raw);
        el.setAttribute(a, ko);
      }
    }
  }

  // ── 전체 적용 / 되돌리기 ──────────────────────────────────────────────────
  // 보이는 부분은 아니지만 보입니다 — 보드러우지 탭 제목.
  // 서버로 가지 않는 순수 표시용 문자열이라 되돌릴 필요가 없습니다.
  let titleOrig = null;
  function doTitle() {
    const raw = document.title;
    if (!raw) return;
    if (titleOrig === null) titleOrig = raw;
    note(raw);
    const ko = translate(raw);
    if (ko !== null && ko !== raw) document.title = ko;
  }

  function apply(root) {
    if (!active || !root) return;
    if (root.nodeType === Node.TEXT_NODE) { doTextNode(root); return; }
    if (root.nodeType !== Node.ELEMENT_NODE && root.nodeType !== Node.DOCUMENT_NODE) return;
    doOptions(root);   // value 고정이 먼저여야 합니다
    walkText(root, doTextNode);
    doButtons(root);
    doDescTextareas(root);
    doAttrs(root);
    doTitle();
  }

  function revert() {
    walkText(document.body, (n) => {
      if (origText.has(n)) n.nodeValue = origText.get(n);
    });
    document.querySelectorAll('option[data-art-en]').forEach((o) => {
      o.textContent = o.getAttribute('data-art-en');
    });
    restoreAllButtons();
    if (titleOrig !== null) document.title = titleOrig;
    for (const a of ATTRS) {
      document.querySelectorAll('[data-art-en-' + a + ']').forEach((el) => {
        el.setAttribute(a, el.getAttribute('data-art-en-' + a));
      });
    }
  }

  // ── alert/confirm/prompt 문구만 한국어로 ─────────────────────────
  // 반환값을 그대로 넘깁니다. confirm 은 true/false 가 삭제 여부를 정하므로
  // 삼키거나 바꿔서는 절대 안 됩니다. 보이는 문구만 건드립니다.
  const nativeAlert = window.alert;
  window.alert = function (msg) {
    if (!active) return nativeAlert.call(window, msg);
    const ko = lookup(String(msg));
    return nativeAlert.call(window, ko === null ? msg : ko);
  };

  const nativeConfirm = window.confirm;
  window.confirm = function (msg) {
    if (!active) return nativeConfirm.call(window, msg);
    const ko = lookup(String(msg));
    return nativeConfirm.call(window, ko === null ? msg : ko);
  };

  const nativePrompt = window.prompt;
  window.prompt = function (msg, def) {
    if (!active) return nativePrompt.call(window, msg, def);
    const ko = lookup(String(msg));
    // 기본값(def)은 그대로 남깁니다 — 사용자 입력값이라 서버로 갑니다.
    return nativePrompt.call(window, ko === null ? msg : ko, def);
  };

  // ── 전송 직전 버튼 복원: 네 경로를 모두 막습니다 ──────────────────────────
  // 1) 포인터/키보드로 버튼을 활성화하는 경로
  document.addEventListener('pointerdown', (e) => {
    const el = e.target && e.target.closest
      ? e.target.closest('input[data-art-en]') : null;
    restoreOne(el);
  }, true);
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const el = e.target && e.target.closest
      ? e.target.closest('input[data-art-en]') : null;
    if (el) restoreOne(el);
    else restoreAllButtons(); // Enter 로 폼 전체가 제출되는 경우
  }, true);

  // 2) 일반 submit 이벤트
  document.addEventListener('submit', restoreAllButtons, true);

  // 3) form.submit() 프로그램 호출.
  //    ASP.NET 의 __doPostBack() 이 이 경로를 쓰는데, 이때 브라우저는 submit
  //    이벤트를 발생시키지 않습니다. 제품 유형을 고르면 Activity Class 목록이
  //    갱신되는 그 동작이 바로 이 경로이므로, 2)만 걸면 가장 자주 쓰는 길에서
  //    안전장치가 빠집니다.
  try {
    const nativeSubmit = HTMLFormElement.prototype.submit;
    HTMLFormElement.prototype.submit = function () {
      restoreAllButtons();
      return nativeSubmit.apply(this, arguments);
    };
  } catch (e) {
    console.warn('[ART-KO] form.submit() 패치 실패 - @grant none 인지 확인하세요.', e);
  }

  // 4) ASP.NET AJAX 부분 포스트백
  function hookPRM() {
    try {
      const S = window.Sys;
      if (!S || !S.WebForms || !S.WebForms.PageRequestManager) return false;
      const prm = S.WebForms.PageRequestManager.getInstance();
      prm.add_initializeRequest(restoreAllButtons);
      prm.add_endRequest(() => apply(document.body));
      return true;
    } catch (e) {
      return false;
    }
  }
  if (!hookPRM()) {
    // 스크립트가 ASP.NET AJAX 보다 먼저 돌 수 있으므로 잠깐 재시도합니다.
    let tries = 0;
    const t = setInterval(() => { if (hookPRM() || ++tries > 20) clearInterval(t); }, 250);
  }

  // ── 최초 적용 + 이후 DOM 변화 감시 ────────────────────────────────────────
  apply(document.body);

  const observer = new MutationObserver((muts) => {
    if (!active) return;
    observer.disconnect(); // 자기 변경을 다시 잡지 않도록
    try {
      for (const m of muts) {
        if (m.type === 'childList') m.addedNodes.forEach(apply);
        else if (m.type === 'characterData') doTextNode(m.target);
      }
    } finally {
      observer.observe(document.body, OBS);
    }
  });
  const OBS = { childList: true, subtree: true, characterData: true };
  observer.observe(document.body, OBS);

  // ── 단축키 ───────────────────────────────────────────────────────────────
  function toast(msg) {
    const d = document.createElement('div');
    d.textContent = msg;
    d.style.cssText = 'position:fixed;z-index:2147483647;right:12px;bottom:12px;' +
      'background:#222;color:#fff;padding:8px 12px;border-radius:6px;' +
      'font:13px/1.4 sans-serif;box-shadow:0 2px 8px rgba(0,0,0,.3)';
    document.body.appendChild(d);
    setTimeout(() => d.remove(), 2200);
  }

  document.addEventListener('keydown', (e) => {
    if (!e.altKey || e.ctrlKey || e.metaKey) return;
    const k = e.key.toLowerCase();

    if (k === 'k') {                       // 한/영 토글
      active = !active;
      if (active) apply(document.body); else revert();
      toast(active ? '한국어 표시' : '영어 원문 표시');
    } else if (k === 'c') {                // 수집 모드
      collecting = !collecting;
      if (collecting) { collected.clear(); apply(document.body); }
      toast(collecting ? '수집 모드 ON' : '수집 모드 OFF (' + collected.size + '개)');
    } else if (k === 'e') {                // 미번역 내보내기
      const out = {};
      Array.from(collected).sort().forEach((s) => { out[s] = ''; });
      const json = JSON.stringify(out, null, 2);
      console.log('[ART-KO] 미번역 ' + collected.size + '개\n' + json);
      if (navigator.clipboard) {
        navigator.clipboard.writeText(json)
          .then(() => toast('미번역 ' + collected.size + '개 클립보드 복사'))
          .catch(() => toast('콘솔에 출력했습니다 (' + collected.size + '개)'));
      } else {
        toast('콘솔에 출력했습니다 (' + collected.size + '개)');
      }
    }
  });

  console.log('[ART-KO] 사전 ' + Object.keys(DICT).length +
    '개 항목 적용. Alt+K 한/영, Alt+C 수집, Alt+E 내보내기');
})();
