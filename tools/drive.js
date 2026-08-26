/* ART 화면을 CDP 로 조종합니다. 수집(cdp_collect.js)과 달리 **페이지를 조작하므로
 * 계정에 데이터가 쓰입니다.** 버릴 시나리오에서만 쓰십시오.
 *
 *   node drive.js dump                 현재 화면 구조 요약
 *   node drive.js click "Load"         텍스트/value 가 일치하는 첫 요소 클릭
 *   node drive.js nav /loggedin/x.aspx 이동
 *   node drive.js set "<select 이름조각>" "<옵션 텍스트조각>"   드롭다운 선택(+postback)
 *   node drive.js fill "<input 이름조각>" "<값>"                텍스트 입력
 */
const WAIT = Number(process.env.ART_WAIT || 3500);
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

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
  const call = (method, params) => new Promise((res, rej) => {
    const myId = ++id;
    const onMsg = (ev) => {
      const m = JSON.parse(ev.data);
      if (m.id !== myId) return;
      ws.removeEventListener('message', onMsg);
      if (m.result && m.result.exceptionDetails) {
        return rej(new Error((m.result.exceptionDetails.exception || {}).description || 'JS 예외'));
      }
      res(m.result);
    };
    ws.addEventListener('message', onMsg);
    ws.send(JSON.stringify({ id: myId, method, params }));
  });
  const evalJs = async (expr) => {
    const r = await call('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: false });
    return r.result && r.result.value;
  };
  return { ws, evalJs, call, close: () => { try { ws.close(); } catch (e) {} } };
}

const DUMP = `(function () {
  function txt(e) { return (e.textContent || '').replace(/\\s+/g, ' ').trim(); }
  var o = { url: location.pathname, title: document.title };
  o.headings = [].slice.call(document.querySelectorAll('h1,h2,h3,legend'))
    .map(txt).filter(Boolean).slice(0, 12);
  o.selects = [].slice.call(document.querySelectorAll('select')).map(function (s) {
    return { name: s.name || s.id, value: s.value,
             opts: [].slice.call(s.options).map(function (x) { return txt(x); }).slice(0, 6),
             n: s.options.length };
  });
  o.inputs = [].slice.call(document.querySelectorAll('input[type=text],input[type=number],textarea'))
    .map(function (i) { return { name: i.name || i.id, value: i.value }; });
  o.radios = [].slice.call(document.querySelectorAll('input[type=radio],input[type=checkbox]'))
    .map(function (i) { return { name: i.name || i.id, checked: i.checked }; }).slice(0, 20);
  o.buttons = [].slice.call(document.querySelectorAll('input[type=submit],input[type=button],button,a'))
    .map(function (b) { return b.tagName === 'INPUT' ? b.value : txt(b); })
    .filter(function (s) { return s && s.length > 1; }).slice(0, 40);
  o.validators = [].slice.call(document.querySelectorAll('.error,[style*="color:Red"],[style*="color: red"]'))
    .map(txt).filter(Boolean).slice(0, 10);
  return JSON.stringify(o, null, 1);
})()`;

const RADIOS = `(function () {
  var out = [];
  var rs = document.querySelectorAll('input[type=radio],input[type=checkbox]');
  for (var i = 0; i < rs.length; i++) {
    var r = rs[i];
    var lab = r.id ? document.querySelector('label[for="' + r.id + '"]') : null;
    var t = lab ? lab.textContent : (r.parentElement ? r.parentElement.textContent : '');
    out.push({ i: i, v: r.value, c: r.checked, k: r.type,
               t: (t || '').replace(/\\s+/g, ' ').trim().slice(0, 100) });
  }
  return JSON.stringify(out, null, 1);
})()`;

function clickExpr(needle) {
  const n = JSON.stringify(needle);
  return `(function () {
    function txt(e) { return (e.tagName === 'INPUT' ? (e.value||'') : (e.textContent||'')).replace(/\\s+/g,' ').trim(); }
    var all = [].slice.call(document.querySelectorAll('a,button,input[type=submit],input[type=button]'));
    var hit = all.filter(function (e) { return txt(e).toLowerCase().indexOf(${n}.toLowerCase()) !== -1; });
    if (!hit.length) return 'NOTFOUND:' + all.map(txt).filter(Boolean).slice(0,30).join(' | ');
    hit[0].click();
    return 'CLICKED:' + txt(hit[0]);
  })()`;
}

(async () => {
  const [cmd, a, b] = process.argv.slice(2);
  const c = await conn();
  try {
    if (cmd === 'dump') {
      console.log(await c.evalJs(DUMP));
    } else if (cmd === 'nav') {
      // location.href 할당은 네트워크 오류 페이지에서 먹지 않습니다.
      // 브라우저 수준 Page.navigate 를 써야 오류 페이지에서도 빠져나옵니다.
      // Git Bash(MSYS)는 '/loggedin/x.aspx' 같은 인자를
      // 'C:/Program Files/Git/loggedin/x.aspx' 로 바꿔버립니다. 그대로 이어 붙이면
      // 호스트가 'advancedreachtool.comC:' 가 되어 DNS 오류 페이지로 갑니다.
      // 호출부에서 MSYS_NO_PATHCONV=1 을 쓰는 것이 정석이지만 여기서도 되돌립니다.
      let path = a || '/';
      if (path.length > 2 && path[1] === ':') {
        const m = path.match(/[/]((?:loggedin|default|science|support|training|credits|cookie)[^]*)$/i);
        path = m ? '/' + m[1] : '/';
      }
      if (!/^https?:/i.test(path) && path[0] !== '/') path = '/' + path;
      const url = /^https?:/i.test(path) ? path : 'https://www.advancedreachtool.com' + path;
      await c.call('Page.navigate', { url });
      await wait(WAIT);
      console.log(await c.evalJs(DUMP));
    } else if (cmd === 'click') {
      console.log(await c.evalJs(clickExpr(a)));
      await wait(WAIT);
      console.log(await c.evalJs(DUMP));
    } else if (cmd === 'set') {
      const expr = `(function () {
        var ss = [].slice.call(document.querySelectorAll('select'));
        var s = ss.filter(function (x) { return (x.name||x.id||'').toLowerCase().indexOf(${JSON.stringify(a.toLowerCase())}) !== -1; })[0];
        if (!s) return 'NOSELECT:' + ss.map(function(x){return x.name||x.id;}).join(' | ');
        var o = [].slice.call(s.options).filter(function (x) {
          return (x.textContent||'').toLowerCase().indexOf(${JSON.stringify(String(b).toLowerCase())}) !== -1; })[0];
        if (!o) return 'NOOPT:' + [].slice.call(s.options).map(function(x){return (x.textContent||'').trim();}).join(' | ');
        s.value = o.value;
        s.dispatchEvent(new Event('change', { bubbles: true }));
        return 'SET:' + (s.name||s.id) + ' = ' + (o.textContent||'').trim();
      })()`;
      console.log(await c.evalJs(expr));
      await wait(WAIT);
      console.log(await c.evalJs(DUMP));
    } else if (cmd === 'mclick') {
      // 진짜 마우스 이벤트로 클릭합니다. ASP.NET 인라인 편집 링크처럼
      // 합성 .click() 에 반응하지 않는 요소용. a = CSS 선택자
      const box = await c.evalJs(`(function () {
        var e = document.querySelector(${JSON.stringify(a)});
        if (!e) return 'NOEL';
        e.scrollIntoView({ block: 'center' });
        var r = e.getBoundingClientRect();
        if (!r.width && !r.height) return 'HIDDEN';
        return JSON.stringify({ x: Math.round(r.left + r.width / 2),
                                y: Math.round(r.top + r.height / 2) });
      })()`);
      if (box === 'NOEL' || box === 'HIDDEN') { console.log(box + ': ' + a); }
      else {
        const pt = JSON.parse(box);
        await c.call('Input.dispatchMouseEvent', { type: 'mouseMoved', x: pt.x, y: pt.y });
        await c.call('Input.dispatchMouseEvent', { type: 'mousePressed', x: pt.x, y: pt.y, button: 'left', clickCount: 1 });
        await c.call('Input.dispatchMouseEvent', { type: 'mouseReleased', x: pt.x, y: pt.y, button: 'left', clickCount: 1 });
        await wait(WAIT);
        console.log('MCLICKED (' + pt.x + ',' + pt.y + ')');
      }
    } else if (cmd === 'type') {
      // ASP.NET 인라인 편집기는 합성 이벤트(.value 설정 + change)를 무시합니다.
      // CDP Input 도메인으로 진짜 키 입력을 보내야 반응합니다.
      // a = CSS 선택자, b = 입력할 문자열
      const box = await c.evalJs(`(function () {
        var e = document.querySelector(${JSON.stringify(a)});
        if (!e) return 'NOEL';
        e.focus();
        if (e.select) e.select();
        var r = e.getBoundingClientRect();
        return JSON.stringify({ x: Math.round(r.left + r.width / 2),
                                y: Math.round(r.top + r.height / 2) });
      })()`);
      if (box === 'NOEL') { console.log('요소 없음: ' + a); }
      else {
        const pt = JSON.parse(box);
        await c.call('Input.dispatchMouseEvent', { type: 'mousePressed', x: pt.x, y: pt.y, button: 'left', clickCount: 3 });
        await c.call('Input.dispatchMouseEvent', { type: 'mouseReleased', x: pt.x, y: pt.y, button: 'left', clickCount: 3 });
        await c.call('Input.insertText', { text: String(b) });
        console.log('TYPED: ' + await c.evalJs(
          `JSON.stringify((document.querySelector(${JSON.stringify(a)}) || {}).value)`));
      }
    } else if (cmd === 'inject') {
      // 빌드된 유저스크립트를 페이지 컨텍스트에 주입합니다(@grant none 과 동일 조건).
      const src = require('fs').readFileSync(
        require('path').join(__dirname, '..', 'art-korean.user.js'), 'utf8');
      await c.evalJs(src);
      console.log('주입 완료: ' + (await c.evalJs(
        "(/다음|이전|시나리오/.test(document.body.innerText) ? '한국어 적용됨' : '적용 안 됨')")));
    } else if (cmd === 'eval') {
      // 임의 JS 실행. 이름 없는 입력칸처럼 다른 명령으로 못 잡는 요소를 다룰 때.
      console.log(await c.evalJs(a));
    } else if (cmd === 'radios') {
      console.log(await c.evalJs(RADIOS));
    } else if (cmd === 'radio') {
      const expr = `(function () {
        var rs = [].slice.call(document.querySelectorAll('input[type=radio],input[type=checkbox]'));
        var hit = rs.filter(function (r) {
          var lab = r.id ? document.querySelector('label[for="' + r.id + '"]') : null;
          var t = lab ? lab.textContent : (r.parentElement ? r.parentElement.textContent : '');
          return (t || '').toLowerCase().indexOf(${JSON.stringify(String(a).toLowerCase())}) !== -1;
        })[0];
        if (!hit) return 'NORADIO';
        hit.click();
        return 'PICKED:' + hit.value;
      })()`;
      console.log(await c.evalJs(expr));
      await wait(WAIT);
      console.log(await c.evalJs(DUMP));
    } else if (cmd === 'fill') {
      const expr = `(function () {
        var is = [].slice.call(document.querySelectorAll('input[type=text],input[type=number],textarea'));
        var i = is.filter(function (x) { return (x.name||x.id||'').toLowerCase().indexOf(${JSON.stringify(a.toLowerCase())}) !== -1; })[0];
        if (!i) return 'NOINPUT:' + is.map(function(x){return x.name||x.id;}).join(' | ');
        i.value = ${JSON.stringify(String(b))};
        i.dispatchEvent(new Event('change', { bubbles: true }));
        return 'FILL:' + (i.name||i.id) + ' = ' + i.value;
      })()`;
      console.log(await c.evalJs(expr));
    } else {
      console.log('알 수 없는 명령: ' + cmd);
    }
  } catch (e) {
    console.error('오류:', e.message);
  }
  c.close();
  process.exit(0);
})();
