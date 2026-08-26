/* 지속 연결 CDP 헬퍼. drive.js 는 명령마다 프로세스와 WS 를 새로 열어 느립니다.
 * 순회는 수백 번 조작하므로 연결을 재사용해야 합니다.
 *
 * 페이지에서 돌릴 코드는 **반드시 실제 함수로 정의해 fn.toString() 으로 보냅니다.**
 * 문자열/템플릿 리터럴로 감싸면 백슬래시가 한 번 더 먹혀 정규식이 깨집니다
 * (인수인계서 '함정 2': /\s+/g 가 /s+/g 가 되어 s 를 다 지워버림).
 *
 * 포스트백 대기가 이 파일의 핵심입니다. ASP.NET 은 세 가지로 반응합니다.
 *   (a) 전체 포스트백  → 문서가 통째로 교체됨
 *   (b) 부분 포스트백  → PageRequestManager 가 잠깐 busy
 *   (c) 아무 일 없음   → 즉시 반환해야 함 (안 그러면 매 조작마다 수십 초 낭비)
 * 그래서 '변화가 시작됐는지' 를 짧게 보고, 시작됐으면 끝날 때까지 기다립니다.
 * 고정 sleep 이나 URL 단순 비교로는 (a) 의 시작 직전 순간을 '안정' 으로
 * 오인해 이전 화면을 읽습니다 — crawl.js 첫 시도가 그렇게 깨졌습니다.
 */
const HOST = 'https://www.advancedreachtool.com';

// 문서 교체 감지용 표식. 새 문서에는 없으므로 사라졌다면 (a) 가 일어난 것.
const MARK = '__artCrawlMark';

// 병렬 순회용. 계정마다 크롬을 따로 띄우고 디버깅 포트를 달리합니다.
// 같은 계정으로 창만 늘리면 ASP.NET 세션이 하나라서 서로의 마법사 상태를 뭉갭니다.
const PORT = Number(process.env.ART_PORT || 9222);

async function connect() {
  const list = await fetch('http://127.0.0.1:' + PORT + '/json/list').then((r) => r.json());
  const t = list.find((x) => x.type === 'page' && x.url.includes('advancedreachtool'));
  if (!t) throw new Error('ART 탭이 없습니다 (포트 ' + PORT + ')');
  const ws = new WebSocket(t.webSocketDebuggerUrl);
  await new Promise((res, rej) => {
    ws.addEventListener('open', res);
    ws.addEventListener('error', () => rej(new Error('WS 연결 실패')));
  });
  let id = 0;
  const pending = new Map();
  ws.addEventListener('message', (ev) => {
    const m = JSON.parse(ev.data);
    if (m.id && pending.has(m.id)) {
      const { res, rej } = pending.get(m.id);
      pending.delete(m.id);
      if (m.error) rej(new Error(m.error.message));
      else res(m.result);
    }
  });
  const call = (method, params) => new Promise((res, rej) => {
    const myId = ++id;
    pending.set(myId, { res, rej });
    ws.send(JSON.stringify({ id: myId, method, params }));
    setTimeout(() => {
      if (pending.has(myId)) { pending.delete(myId); rej(new Error('타임아웃 ' + method)); }
    }, Number(process.env.ART_CALL_TIMEOUT || 90000));
  });

  // fn 을 페이지에서 실행하고 반환값을 받습니다.
  async function run(fn, ...args) {
    const expr = '(' + fn.toString() + ').apply(null,' + JSON.stringify(args) + ')';
    const r = await call('Runtime.evaluate',
      { expression: expr, returnByValue: true, awaitPromise: true });
    if (r.exceptionDetails) {
      throw new Error('페이지 예외: '
        + ((r.exceptionDetails.exception || {}).description || r.exceptionDetails.text));
    }
    return r.result && r.result.value;
  }

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  async function state(mark) {
    try {
      return await run(function (m) {
        var newDoc = (typeof window[m] === 'undefined');
        var busy = false;
        try {
          busy = Sys.WebForms.PageRequestManager.getInstance().get_isInAsyncPostBack();
        } catch (e) { busy = false; }
        return (newDoc ? 'NEW' : 'SAME')
          + (document.readyState === 'complete' ? '/R' : '/L')
          + (busy ? '/B' : '/I')
          + '|' + location.pathname;
      }, mark);
    } catch (e) {
      return 'GONE/L/I|';   // 문서 교체 중이면 evaluate 가 실패합니다
    }
  }

  async function setMark() {
    try { await run(function (m) { window[m] = 1; }, MARK); } catch (e) { /* 무시 */ }
  }

  /* 조작 하나를 실행하고 그 결과가 가라앉을 때까지 기다립니다.
   * startWindow 안에 아무 변화도 시작되지 않으면 바로 돌아옵니다.
   * 반환: 'NEW'(문서 교체) | 'ASYNC'(부분 포스트백) | 'NONE'(변화 없음) */
  async function act(fn, startWindow = 1400, timeout = 20000) {
    await setMark();
    const before = await state(MARK);
    const beforePath = before.split('|')[1] || '';
    let r;
    if (fn) r = await fn();

    const t0 = Date.now();
    let started = null;
    while (Date.now() - t0 < startWindow) {
      const s = await state(MARK);
      if (s.indexOf('NEW') === 0 || s.indexOf('GONE') === 0) { started = 'NEW'; break; }
      if (s.indexOf('/B') !== -1 || s.indexOf('/L') !== -1) { started = 'ASYNC'; break; }
      if ((s.split('|')[1] || '') !== beforePath) { started = 'NEW'; break; }
      await sleep(120);
    }
    if (!started) return { kind: 'NONE', result: r };

    // 시작됐으면 완료까지. 연속 2회 '완료/유휴' 를 봐야 끝난 것으로 봅니다.
    let stable = 0;
    let last = '';
    while (Date.now() - t0 < timeout) {
      const s = await state(MARK);
      const done = s.indexOf('/R') !== -1 && s.indexOf('/I') !== -1 && s.indexOf('GONE') !== 0;
      if (done && s === last) { if (++stable >= 2) break; } else { stable = 0; }
      last = s;
      await sleep(150);
    }
    return { kind: started, result: r };
  }

  async function nav(path) {
    const url = /^https?:/i.test(path) ? path : HOST + path;
    await act(() => call('Page.navigate', { url }), 3000);
    // 로그인 리다이렉트 등 연쇄 이동이 있으면 한 번 더 가라앉힙니다.
    await act(null, 700);
  }

  // 이전 버전과의 호환용
  const settle = () => act(null, 900);

  return { ws, call, run, act, nav, settle, sleep, MARK,
           close: () => { try { ws.close(); } catch (e) {} } };
}

module.exports = { connect, HOST, MARK, PORT };
