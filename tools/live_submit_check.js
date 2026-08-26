/* 유저스크립트를 주입한 상태에서 실제로 버튼을 눌러, **네트워크로 나가는 POST
 * 본문**을 그대로 잡아 검사합니다. 프로젝트의 합격 기준(전송 데이터 불변)을
 * 직접 확인하는 유일한 방법입니다.
 *
 * element.click() 이 아니라 CDP Input.dispatchMouseEvent 로 진짜 마우스 이벤트를
 * 보냅니다. element.click() 은 pointerdown 을 발생시키지 않아서 3.2절 경로 1a 를
 * 건너뛰기 때문입니다.
 *
 *   node live_submit_check.js "Next"
 *
 * 확인 항목:
 *   - 제출 버튼의 value 가 영어 원문으로 전송되는가 (3.2절)
 *   - select 가 원래 value 를 전송하는가 (3.1절)
 *   - 한국어 문자열이 본문에 섞여 나가지 않는가
 */
const fs = require('fs');
const path = require('path');

const SCRIPT = fs.readFileSync(path.join(__dirname, '..', 'art-korean.user.js'), 'utf8');
const LABEL = process.argv[2] || 'Next';
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  const list = await fetch('http://127.0.0.1:9222/json/list').then((r) => r.json());
  const t = list.find((x) => x.type === 'page' && x.url.includes('advancedreachtool'));
  if (!t) { console.error('ART 탭이 없습니다'); process.exit(1); }

  const ws = new WebSocket(t.webSocketDebuggerUrl);
  await new Promise((res) => ws.addEventListener('open', res));

  let id = 0;
  const pending = new Map();
  const posts = [];

  ws.addEventListener('message', (ev) => {
    const m = JSON.parse(ev.data);
    if (m.id && pending.has(m.id)) {
      const { res, rej } = pending.get(m.id);
      pending.delete(m.id);
      if (m.result && m.result.exceptionDetails) {
        const ex = m.result.exceptionDetails.exception || {};
        rej(new Error(ex.description || ex.value || 'JS 예외'));
      } else res(m.result);
      return;
    }
    if (m.method === 'Network.requestWillBeSent') {
      const r = m.params.request;
      if (r.method === 'POST' && r.postData) posts.push({ url: r.url, body: r.postData });
    }
  });

  const call = (method, params) => new Promise((res, rej) => {
    const myId = ++id;
    pending.set(myId, { res, rej });
    ws.send(JSON.stringify({ id: myId, method, params }));
  });
  const evalJs = async (expression) => {
    const r = await call('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: false });
    return r.result && r.result.value;
  };

  try {
    await call('Network.enable', {});
    console.log('화면: ' + await evalJs('location.pathname'));

    await evalJs(SCRIPT);
    console.log('유저스크립트 주입 완료');

    // 사용자가 드롭다운을 고르는 상황을 재현합니다(있는 경우).
    const selInfo = await evalJs(`(function () {
      var s = document.querySelector('select');
      if (!s) return 'NOSELECT';
      var i = Math.min(2, s.options.length - 1);
      s.selectedIndex = i;
      s.dispatchEvent(new Event('change', { bubbles: true }));
      var o = s.options[i];
      return JSON.stringify({ name: s.name, value: s.value,
                              shown: (o.textContent || '').trim() });
    })()`);
    console.log('드롭다운 선택: ' + selInfo);

    const btn = await evalJs(`(function () {
      var bs = [].slice.call(document.querySelectorAll('input[type=submit]'));
      var b = bs.filter(function (x) { return (x.value || '').trim() === ${JSON.stringify(LABEL)}
        || (x.name || '').indexOf(${JSON.stringify(LABEL)}) !== -1; })[0];
      if (!b) return JSON.stringify({ err: bs.map(function (x) { return x.value; }) });
      var r = b.getBoundingClientRect();
      return JSON.stringify({ name: b.name, shown: b.value,
                              x: Math.round(r.left + r.width / 2),
                              y: Math.round(r.top + r.height / 2) });
    })()`);
    const B = JSON.parse(btn);
    if (B.err) { console.error('버튼을 못 찾음. 있는 버튼: ' + B.err.join(' | ')); ws.close(); process.exit(1); }
    console.log('버튼: name=' + B.name + '  화면표시=' + JSON.stringify(B.shown));

    posts.length = 0;
    // 진짜 마우스 이벤트 (pointerdown -> mousedown -> mouseup -> click)
    await call('Input.dispatchMouseEvent', { type: 'mousePressed', x: B.x, y: B.y, button: 'left', clickCount: 1 });
    await call('Input.dispatchMouseEvent', { type: 'mouseReleased', x: B.x, y: B.y, button: 'left', clickCount: 1 });
    await wait(4000);

    if (!posts.length) { console.log('\n POST 요청이 잡히지 않았습니다 (버튼 위치가 화면 밖일 수 있습니다).'); }
    posts.forEach((p, i) => {
      console.log('\n── POST ' + (i + 1) + ' ' + p.url.replace(/^https?:\/\/[^/]+/, ''));
      const pairs = p.body.split('&').map((kv) => {
        const j = kv.indexOf('=');
        return [decodeURIComponent(kv.slice(0, j).replace(/\+/g, ' ')),
                decodeURIComponent(kv.slice(j + 1).replace(/\+/g, ' '))];
      });
      // 뷰스테이트류는 길어서 접습니다
      pairs.forEach(([k, v]) => {
        if (/^__(VIEWSTATE|EVENTVALIDATION|VIEWSTATEGENERATOR)/.test(k)) {
          console.log('   ' + k + ' = (' + v.length + '바이트, 생략)');
        } else {
          console.log('   ' + k + ' = ' + JSON.stringify(v));
        }
      });
      const hangul = pairs.filter(([k, v]) =>
        !/^__(VIEWSTATE|EVENTVALIDATION|VIEWSTATEGENERATOR)/.test(k) && /[가-힣]/.test(v));
      console.log('');
      console.log(hangul.length === 0
        ? '   PASS  본문에 한국어가 섞이지 않았습니다'
        : '   FAIL  한국어가 전송되었습니다: '
          + hangul.map(([k, v]) => k + '=' + JSON.stringify(v)).join(', '));
    });
  } catch (e) {
    console.error('오류: ' + e.message);
  }
  try { ws.close(); } catch (e) {}
  process.exit(0);
})();
