// ==UserScript==
// @name         ART 한국어 번역기 (Advanced REACH Tool)
// @namespace    art-ko-translator
// @version      1.0.0
// @description  advancedreachtool.com 의 화면 문구를 한국어로 표시합니다. 화면에 보이는 텍스트만 바꾸며, 서버 요청/폼 값/사이트 로직에는 전혀 영향을 주지 않습니다.
// @match        https://www.advancedreachtool.com/*
// @run-at       document-idle
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  // 사전에 없는 문구는 번역하지 않고 원문(영어) 그대로 둡니다 (안전한 폴백).
  // 로그인 후 화면 문구는 공개된 ART User Guide(TNO)를 근거로 추정한 것이라
  // 실제 화면과 정확히 일치하지 않을 수 있습니다. 실제 화면 캡처를 공유해주시면
  // 이 사전을 보강할 수 있습니다.
  const DICT = {
    // --- 사이트 내비게이션 / 공용 ---
    'My Scenarios': '내 시나리오',
    'Science': '과학적 배경',
    'Support': '지원',
    'Training': '교육',
    'Consortium': '컨소시엄',
    'Welcome to the Advanced Reach Tool 1.5': 'Advanced Reach Tool 1.5에 오신 것을 환영합니다',
    'Contributors to ART': 'ART 참여 기관',
    'News': '뉴스',
    '(feed unavailable)': '(피드를 불러올 수 없습니다)',

    // --- 로그인 패널 ---
    'Existing users log in:': '기존 사용자 로그인:',
    'Email': '이메일',
    'Password': '비밀번호',
    'Log in': '로그인',
    'New user?': '신규 사용자이신가요?',
    'Register here.': '여기에서 가입하세요.',
    'Forgotten your password? Type in your email address above then': '비밀번호를 잊으셨나요? 위에 이메일 주소를 입력한 후',
    'click here.': '여기를 클릭하세요.',

    // --- 로그인/가입 관련 알림창(alert) ---
    'Invalid email.': '유효하지 않은 이메일입니다.',
    'Not a registered ART user.': '등록되지 않은 ART 사용자입니다.',
    'Wrong password.': '비밀번호가 올바르지 않습니다.',
    'Not an approved user. Please click the link in your confirmation email and complete the registration process.':
      '승인되지 않은 사용자입니다. 확인 이메일의 링크를 클릭하여 가입 절차를 완료해 주세요.',
    'System error.': '시스템 오류가 발생했습니다.',
    'Password reminder sent. Check your email.': '비밀번호 재설정 안내를 이메일로 보냈습니다. 이메일을 확인해 주세요.',

    // --- 쿠키 배너 ---
    'This website operates using non-intrusive cookies to support essential operations. You can visit our':
      '이 웹사이트는 필수 운영을 지원하기 위해 비침해적인 쿠키를 사용합니다. 자세한 내용은',
    'cookie privacy page': '쿠키 개인정보 보호 페이지',
    'for more information.': '에서 확인하실 수 있습니다.',
    'Close': '닫기',

    // --- 회원가입 페이지 ---
    'ART — Register New User': 'ART — 신규 사용자 등록',
    'Your details': '회원 정보',
    'Disclaimer': '면책 조항',
    'COPYRIGHT STATEMENT': '저작권 안내',
    'Confirm password': '비밀번호 확인',
    'First name': '이름',
    'Last name': '성',
    'Organisation': '소속 기관',
    'Position': '직위',
    'I am willing to be contacted by the ART consortium about REACH-related services':
      'ART 컨소시엄이 REACH 관련 서비스에 대해 연락하는 것에 동의합니다',
    'I agree to the disclaimer': '면책 조항에 동의합니다',
    'Your details will not be used for marketing purposes.': '입력하신 정보는 마케팅 목적으로 사용되지 않습니다.',
    'After you click register you will be sent an email that asks you to confirm your registration.':
      '등록 버튼을 클릭하면 가입 확인을 요청하는 이메일이 발송됩니다.',
    'Please complete all fields, read and agree to the disclaimer, then press the Register button.':
      '모든 항목을 입력하고 면책 조항을 읽고 동의한 후 등록 버튼을 눌러주세요.',

    // --- 로그인 후 도구 화면 (ART User Guide 기반 추정 — 실제 화면과 다를 수 있음) ---
    'Scenario overview': '시나리오 개요',
    'Configuration of activities': '활동 구성',
    'Chemical name': '화학물질명',
    'CAS No.': 'CAS 번호',
    'Non-exposed period': '비노출 기간',
    'Product type': '제품 유형',
    'Powders, granules, or pelletized material': '분말, 과립 또는 펠릿형 물질',
    'Solid objects': '고체 물체',
    'Liquids': '액체',
    'Powder dissolved in a liquid or incorporated in a liquid matrix': '액체에 용해되거나 액상 매트릭스에 포함된 분말',
    'Paste, slurry or clearly (soaked) wet powder': '페이스트, 슬러리 또는 완전히 젖은 습윤 분말',
    'Hot or molten metal': '고온 또는 용융 금속',
    'Near Field (NF)': '근거리 영역(Near Field, NF)',
    'Far Field (FF)': '원거리 영역(Far Field, FF)',
    'Breathing zone': '호흡 영역',
    'Localised controls': '국소적 제어수단(Localised Controls)',
    'Segregation': '격리(Segregation)',
    'Separation': '분리(Separation)',
    'Surface contamination': '표면 오염',
    'Dispersion': '확산(Dispersion)',
    'Running the mechanistic model': '기계론적 모델 실행',
    'Finish': '완료',
    'Quick revision': '빠른 수정',
    'Use of Bayesian module': '베이지안(Bayesian) 모듈 사용',
    'Fully analogous': '완전히 유사함',
    'Highly analogous': '매우 유사함',
    'Moderately analogous': '중간 정도 유사함',
    'Weakly analogous': '약하게 유사함',
    'Comma Separated Values (CSV)': '쉼표로 구분된 값(CSV)',
    'Output of ART': 'ART 결과 출력',
    'Full-Shift': '전체 근무시간(Full-Shift)',
    'Long-Term Average': '장기 평균(Long-Term Average)',
    'Percentiles and uncertainties': '백분위수 및 불확실성',
    'Variability': '변동성(Variability)',
    'Uncertainty': '불확실성(Uncertainty)',
    'Dust': '분진(Dust)',
    'Mist': '미스트(Mist)',
    'Vapour': '증기(Vapour)',
    'Fume': '흄(Fume)',
    'Gas': '가스(Gas)',
    'Fibres': '섬유(Fibres)',
  };

  // 이 태그 내부의 텍스트는 절대 건드리지 않습니다.
  // INPUT은 사용자가 입력하는 값(이메일/비밀번호 등)이 텍스트 노드로 존재하지 않으므로
  // 애초에 TreeWalker 대상이 아니지만, 명시적으로도 제외합니다.
  const SKIP_TAGS = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEXTAREA', 'INPUT']);

  function translateText(raw) {
    const trimmed = raw.trim();
    if (!trimmed) return null;
    return DICT[trimmed] || null;
  }

  // 순수 텍스트 노드 치환: 사전에 있는 원문을 사전 값으로 바꿀 뿐,
  // DOM 구조/속성/이벤트 핸들러/폼 필드는 전혀 수정하지 않습니다.
  function translateTextNode(node) {
    const ko = translateText(node.nodeValue);
    if (!ko) return;
    const leading = node.nodeValue.match(/^\s*/)[0];
    const trailing = node.nodeValue.match(/\s*$/)[0];
    node.nodeValue = leading + ko + trailing;
  }

  function walk(root) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        const parent = node.parentElement;
        if (!parent || SKIP_TAGS.has(parent.tagName)) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      },
    });
    let node;
    while ((node = walker.nextNode())) {
      translateTextNode(node);
    }
    translateAttributes(root);
  }

  // 버튼/제출 캡션, placeholder, title 속성 중 사전에 등록된 것과
  // "정확히 일치"하는 경우에만 치환합니다. 사용자가 직접 입력하는 값(email/password 등)은
  // 여기서 건드리지 않습니다 (해당 값은 사전에 등록되어 있지 않음).
  function translateAttributes(root) {
    if (!root.querySelectorAll) return;
    const els = root.querySelectorAll('input[type="submit"], input[type="button"], button, [placeholder], [title]');
    els.forEach((el) => {
      if (el.value) {
        const ko = translateText(el.value);
        if (ko) el.value = ko;
      }
      if (el.placeholder) {
        const ko = translateText(el.placeholder);
        if (ko) el.placeholder = ko;
      }
      if (el.title) {
        const ko = translateText(el.title);
        if (ko) el.title = ko;
      }
    });
  }

  // alert() 문구만 한국어로 바꿔서 보여줍니다. 실제 alert 호출/페이지 로직은 그대로 유지됩니다.
  const nativeAlert = window.alert;
  window.alert = function (message) {
    const ko = translateText(String(message));
    return nativeAlert.call(window, ko || message);
  };

  walk(document.body);

  // ASP.NET UpdatePanel 등 부분 갱신(AJAX)으로 새로 삽입되는 DOM도 계속 감시해서 번역합니다.
  // 이미 한국어로 바뀐 텍스트는 사전의 영어 키와 일치하지 않으므로 재처리해도 변화가 없어
  // 무한 루프 없이 안전하게 동작합니다.
  const observer = new MutationObserver((mutations) => {
    for (const m of mutations) {
      if (m.type === 'childList') {
        m.addedNodes.forEach((n) => {
          if (n.nodeType === Node.ELEMENT_NODE) {
            walk(n);
          } else if (n.nodeType === Node.TEXT_NODE) {
            translateTextNode(n);
          }
        });
      } else if (m.type === 'characterData') {
        translateTextNode(m.target);
      }
    }
  });

  observer.observe(document.body, { childList: true, subtree: true, characterData: true });
})();
