/* 실제 로그인된 ART 페이지에 유저스크립트를 주입해 안전성을 검증합니다.
 *
 * Tampermonkey 설치가 필요 없습니다 — CDP Runtime.evaluate 는 페이지 컨텍스트
 * (main world)에서 실행되므로 @grant none 과 같은 조건입니다. 즉
 * HTMLFormElement.prototype 패치(3.2절 경로 3)도 그대로 동작합니다.
 *
 *   node live_check.js            주입 전후 폼 직렬화를 비교
 *   node live_check.js --no-inject  현재 상태만 직렬화해서 출력
 *
 * 합격 기준: 주입 전후 직렬화가 완전히 동일해야 합니다. 한 바이트라도 다르면
 * 서버로 가는 데이터가 바뀐 것이므로 즉시 중단하고 원인을 찾아야 합니다.
 */
const fs = require('fs');
const path = require('path');

const SCRIPT = fs.readFileSync(path.join(__dirname, '..', 'art-korean.user.js'), 'utf8');

// 폼 전체 직렬화. test.js 와 같은 방식(FormData)이라 결과를 비교할 수 있습니다.
const SERIALIZE = `(function () {
  var f = document.getElementById('aspnetForm');
  if (!f) return 'NOFORM';
  var fd = new FormData(f);
  var out = [];
  fd.forEach(function (v, k) { out.push(k + '=' + v); });
  return out.join('&');
})()`;

// 제출 버튼별 직렬화 — 버튼 value 는 표시와 전송이 같은 속성이라 3.2절의
// 복원 경로가 실제로 작동하는지 여기서 드러납니다.
const SERIALIZE_WITH_SUBMITTERS = `(function () {
  var f = document.getElementById('aspnetForm');
  if (!f) return 'NOFORM';
  var out = {};
  var btns = [].slice.call(f.querySelectorAll('input[type=submit]'));
  btns.forEach(function (b, i) {
    try {
      var fd = new FormData(f, b);
      var parts = [];
      fd.forEach(function (v, k) { parts.push(k + '=' + v); });
      out[(b.name || '#' + i)] = parts.join('&');
    } catch (e) { out[(b.name || '#' + i)] = 'ERR:' + e.message; }
  });
  return JSON.stringify(out);
})()`;

// select 의 value 가 영어 원문 그대로인지 (3.1절 value 고정)
const SELECT_VALUES = `(function () {
  var out = [];
  [].slice.call(document.querySelectorAll('select')).forEach(function (s) {
    var sel = s.options[s.selectedIndex];
    out.push({
      name: s.name || s.id,
      value: s.value,
      text: sel ? (sel.textContent || '').trim().slice(0, 40) : null
    });
  });
  return JSON.stringify(out);
})()`;

const SAMPLE_TEXT = `(function () {
  var t = (document.body.innerText || '').replace(/[ \\t]+/g, ' ');
  return t.split('\\n').filter(function (s) { return s.trim().length > 3; }).slice(0, 14).join(' | ');
})()`;

async function conn() {
  const list = await fetch('http://127.0.0.1:9222/json/list').then((r) => r.json());
  const t = list.find((x) => x.type === 'page' && x.url.includes('advancedreachtool'));
  if (!t) throw new Error('ART 탭이 없습니다');
  const ws = new WebSocket(t.webSocketDebuggerUrl);
  await new Promise((res, rej) => {
    ws.addEventListener('open', res);
    ws.addEventListener('error', () => rej(new Error('WS 연결 실패')));
  });
  let id = 0;
  const evalJs = (expression) => new Promise((res, rej) => {
    const myId = ++id;
    const onMsg = (ev) => {
      const m = JSON.parse(ev.data);
      if (m.id !== myId) return;
      ws.removeEventListener('message', onMsg);
      if (m.result && m.result.exceptionDetails) {
        const ex = m.result.exceptionDetails.exception || {};
        return rej(new Error(ex.description || ex.value || 'JS 예외'));
      }
      res(m.result.result.value);
    };
    ws.addEventListener('message', onMsg);
    ws.send(JSON.stringify({
      id: myId, method: 'Runtime.evaluate',
      params: { expression, returnByValue: true, awaitPromise: false }
    }));
  });
  return { evalJs, close: () => { try { ws.close(); } catch (e) {} } };
}

function diff(a, b) {
  if (a === b) return null;
  const A = a.split('&'), B = b.split('&');
  const out = [];
  const max = Math.max(A.length, B.length);
  for (let i = 0; i < max; i++) {
    if (A[i] !== B[i]) out.push('  전: ' + (A[i] || '(없음)') + '\n  후: ' + (B[i] || '(없음)'));
    if (out.length >= 8) { out.push('  ...'); break; }
  }
  return out.join('\n');
}

(async () => {
  const c = await conn();
  try {
    const url = await c.evalJs('location.pathname');
    console.log('화면: ' + url);

    const before = await c.evalJs(SERIALIZE);
    if (before === 'NOFORM') { console.log('aspnetForm 이 없는 화면입니다.'); c.close(); return; }
    const beforeSubs = await c.evalJs(SERIALIZE_WITH_SUBMITTERS);
    const beforeSel = await c.evalJs(SELECT_VALUES);
    console.log('주입 전 직렬화 ' + before.length + '바이트, select ' + JSON.parse(beforeSel).length + '개');

    if (process.argv.includes('--no-inject')) {
      console.log(before.slice(0, 400));
      c.close();
      return;
    }

    const already = await c.evalJs('typeof window.__ART_KO_LOADED');
    if (already !== 'undefined') console.log('※ 이미 주입되어 있습니다 (재주입).');

    await c.evalJs(SCRIPT + '\n; window.__ART_KO_LOADED = true;');
    console.log('유저스크립트 주입 완료');

    const after = await c.evalJs(SERIALIZE);
    const afterSubs = await c.evalJs(SERIALIZE_WITH_SUBMITTERS);
    const afterSel = await c.evalJs(SELECT_VALUES);

    console.log('');
    const d1 = diff(before, after);
    console.log(d1 === null
      ? 'PASS  폼 직렬화 동일 (' + after.length + '바이트)'
      : 'FAIL  폼 직렬화가 달라졌습니다:\n' + d1);

    const d2 = beforeSubs === afterSubs;
    console.log(d2 ? 'PASS  제출 버튼별 직렬화 동일'
                   : 'FAIL  제출 버튼별 직렬화가 달라졌습니다');
    if (!d2) {
      const B = JSON.parse(beforeSubs), A = JSON.parse(afterSubs);
      Object.keys(B).forEach(function (k) {
        if (B[k] !== A[k]) console.log('  [' + k + ']\n    전: ' + String(B[k]).slice(0, 200)
                                       + '\n    후: ' + String(A[k]).slice(0, 200));
      });
    }

    const bs = JSON.parse(beforeSel), as = JSON.parse(afterSel);
    let selOk = true;
    bs.forEach(function (s, i) {
      if (!as[i] || as[i].value !== s.value) {
        selOk = false;
        console.log('  select ' + s.name + ': value ' + JSON.stringify(s.value)
                    + ' -> ' + JSON.stringify(as[i] && as[i].value));
      }
    });
    console.log(selOk ? 'PASS  select value 전부 유지 (표시만 한국어)'
                      : 'FAIL  select value 가 바뀌었습니다');
    if (selOk && as.length) {
      console.log('  예: ' + as.slice(0, 3).map(function (s) {
        return s.name + ' value=' + JSON.stringify(s.value) + ' 표시=' + JSON.stringify(s.text);
      }).join('\n      '));
    }

    console.log('\n화면 표시 (주입 후):');
    console.log('  ' + String(await c.evalJs(SAMPLE_TEXT)).slice(0, 500));
  } catch (e) {
    console.error('오류: ' + e.message);
  }
  c.close();
  process.exit(0);
})();
