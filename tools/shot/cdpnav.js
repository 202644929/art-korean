/* 디버그 크롬(포트 9222)의 탭 하나를 CDP 로만 조작합니다.
 * 키보드 입력이나 창 포커스는 전혀 건드리지 않습니다.
 *
 *   node cdpnav.js nav <url>          해당 탭을 이동
 *   node cdpnav.js shot <파일경로>      CDP 로 페이지 캡처 (chrome:// 은 불가)
 *   node cdpnav.js eval <표현식>
 *   node cdpnav.js tabs
 */
const fs = require('fs');
const PORT = process.env.ART_PORT || 9222;
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

async function pick() {
  const list = await fetch(`http://127.0.0.1:${PORT}/json/list`).then((r) => r.json());
  const pages = list.filter((x) => x.type === 'page');
  // ART_TAB 로 인덱스를 직접 지정할 수 있고, 없으면 ART 탭 우선
  if (process.env.ART_TAB !== undefined) return pages[parseInt(process.env.ART_TAB, 10)];
  return pages.find((x) => /advancedreachtool/.test(x.url))
      || pages.find((x) => /localhost|^chrome:/.test(x.url))
      || pages[0];
}

(async () => {
  const [cmd, arg] = process.argv.slice(2);

  if (cmd === 'tabs') {
    const list = await fetch(`http://127.0.0.1:${PORT}/json/list`).then((r) => r.json());
    list.filter((x) => x.type === 'page')
        .forEach((x, i) => console.log(`${i}  ${x.url}\n   ${x.title}`));
    return;
  }

  const t = await pick();
  if (!t) { console.error('탭 없음'); process.exit(1); }
  // 해당 탭을 실제로 앞으로 (창 포커스는 안 건드림 — 탭만 전환)
  await fetch(`http://127.0.0.1:${PORT}/json/activate/${t.id}`).catch(() => {});
  await wait(400);

  const ws = new WebSocket(t.webSocketDebuggerUrl);
  await new Promise((res, rej) => {
    ws.addEventListener('open', res);
    ws.addEventListener('error', () => rej(new Error('WS 실패')));
  });
  let id = 0;
  const call = (method, params) => new Promise((res, rej) => {
    const my = ++id;
    const on = (ev) => {
      const m = JSON.parse(ev.data);
      if (m.id !== my) return;
      ws.removeEventListener('message', on);
      if (m.error) return rej(new Error(m.error.message));
      res(m.result);
    };
    ws.addEventListener('message', on);
    ws.send(JSON.stringify({ id: my, method, params }));
  });

  try {
    if (cmd === 'nav') {
      await call('Page.enable', {});
      const r = await call('Page.navigate', { url: arg });
      if (r.errorText) console.log('오류: ' + r.errorText);
      await wait(2800);
      const u = await call('Runtime.evaluate', { expression: 'location.href', returnByValue: true });
      console.log('현재: ' + (u.result && u.result.value));
    } else if (cmd === 'shot') {
      const r = await call('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
      fs.writeFileSync(arg, Buffer.from(r.data, 'base64'));
      console.log('SAVED:' + arg);
    } else if (cmd === 'altk') {
      // Alt+K — 스크립트의 한/영 토글. CDP 로 해당 탭에만 보냅니다(OS 키보드 아님).
      for (const type of ['keyDown', 'keyUp']) {
        await call('Input.dispatchKeyEvent', {
          type, modifiers: 1, key: 'k', code: 'KeyK',
          windowsVirtualKeyCode: 75, nativeVirtualKeyCode: 75
        });
        await wait(80);
      }
      await wait(1200);
      console.log('Alt+K 전송');
    } else if (cmd === 'size') {
      const [w, h] = (arg || '1600x900').split('x').map(Number);
      await call('Emulation.setDeviceMetricsOverride', {
        width: w, height: h, deviceScaleFactor: 2, mobile: false
      });
      await wait(1200);
      console.log('size ' + w + 'x' + h);
    } else if (cmd === 'scroll') {
      const dy = parseInt(arg || '400', 10);
      const steps = Math.max(1, Math.ceil(Math.abs(dy) / 120));
      for (let i = 0; i < steps; i++) {
        await call('Input.dispatchMouseEvent', {
          type: 'mouseWheel', x: 900, y: 500, button: 'none',
          deltaX: 0, deltaY: dy > 0 ? 120 : -120
        });
        await wait(60);
      }
      await wait(500);
      console.log('scrolled ' + dy);
    } else if (cmd === 'eval') {
      const r = await call('Runtime.evaluate', { expression: arg, returnByValue: true });
      console.log(JSON.stringify(r.result && r.result.value));
    }
  } catch (e) {
    console.error('실패: ' + e.message);
  }
  ws.close();
  process.exit(0);
})();
