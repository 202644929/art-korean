/* ART 화면 문자열 수집 — 스크립트를 설치하지 않고도 씁니다.
 *
 * 사용법: 대상 화면에서 크롬 F12 -> Console 에 이 파일 내용을 붙여넣고 Enter.
 *         결과가 클립보드에 복사됩니다. collected.txt 로 저장한 뒤:
 *             python dom_diff.py collected.txt
 *
 * 화면을 전혀 건드리지 않습니다(읽기만 함). 페이지마다 한 번씩 실행하고
 * 결과를 한 파일에 이어 붙이면 됩니다 — dom_diff.py 가 중복을 제거합니다.
 *
 * 유저스크립트가 실제로 번역하는 대상과 같은 범위를 수집합니다:
 * 텍스트 노드(SKIP_TAGS 제외), option 텍스트, submit/button 의 value,
 * 그리고 title/placeholder/alt 속성.
 */
(function () {
  var SKIP = { SCRIPT: 1, STYLE: 1, NOSCRIPT: 1, TEXTAREA: 1 };
  var out = [];
  function push(s) {
    if (!s) return;
    s = String(s).replace(/[\uE000-\uF8FF]/g, '').replace(/\s+/g, ' ').trim();
    // __LogIn 같은 ASP.NET 컨트롤 흔적은 화면 문구가 아니므로 제외합니다.
    if (s.indexOf('__') === 0) return;
    // 영문 3자 이상만 담으면 '75th', '1st' 같은 서수 라벨을 놓칩니다.
    // 실제로 결과 화면의 백분위수 선택지가 이 필터에 걸려 안 잡혔습니다.
    if (s.length > 1 && (/[A-Za-z]{3}/.test(s) || /^\d+(st|nd|rd|th)/i.test(s))) out.push(s);
  }

  // 페이지가 아직 로딩 중이면 document.body 가 없습니다. 그대로 두면
  // createTreeWalker 가 TypeError 를 내고 그 화면을 통째로 놓칩니다.
  if (!document.body) { console.log('[ART] body 없음 (로딩 중)'); return 0; }

  // 텍스트 노드 — option 은 SKIP_TAGS 에 들어 있지만 수집 대상이므로 아래에서 따로 처리
  var w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode: function (n) {
      var p = n.parentElement;
      if (!p || SKIP[p.tagName]) return NodeFilter.FILTER_REJECT;
      return n.nodeValue && n.nodeValue.trim()
        ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
    }
  });
  for (var n; (n = w.nextNode()); ) push(n.nodeValue);

  document.querySelectorAll('option').forEach(function (o) { push(o.textContent); });
  document.querySelectorAll('input[type=submit],input[type=button],button')
    .forEach(function (b) { push(b.value); push(b.textContent); });
  ['title', 'placeholder', 'alt'].forEach(function (a) {
    document.querySelectorAll('[' + a + ']').forEach(function (e) {
      push(e.getAttribute(a));
    });
  });

  var uniq = out.filter(function (s, i, a) { return a.indexOf(s) === i; });
  // cdp_collect.js 가 CDP 로 읽어 갑니다(콘솔 사용에는 영향 없음).
  window.__ART_COLLECTED = uniq;
  var text = uniq.join('\n');
  console.log('[ART] ' + uniq.length + '개 수집 (' + location.pathname + ')');
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text)
      .then(function () { console.log('[ART] 클립보드 복사 완료'); })
      .catch(function () { console.log(text); });
  } else {
    console.log(text);
  }
  return uniq.length;
})();
