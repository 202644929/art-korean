/* 로그인된 크롬에 CDP 로 붙어 ART 화면 문자열을 자동 수집합니다.
 *
 * 크롬을 --remote-debugging-port=9222 로 띄워야 합니다(기존 프로필 그대로 쓰면
 * 로그인 세션이 유지됩니다). 읽기만 하며 페이지를 조작하지 않습니다.
 *
 *   node cdp_collect.js              한 번 수집
 *   node cdp_collect.js --watch      2초마다 폴링, 새 문자열만 누적
 *   node cdp_collect.js --out x.txt  출력 파일 지정 (기본 collected.txt)
 *
 * 출력은 두 개입니다 — collected.txt(평면 목록, dom_diff.py 입력)와
 * collected.by-page.tsv(화면 경로 + 문자열, 어느 화면 것인지 되짚을 때).
 *
 * 사용자가 화면을 클릭해 옮겨 다니면 --watch 가 알아서 새 화면을 주워담습니다.
 * 스크립트가 대신 조작하지 않으므로 계정에 아무것도 쓰지 않습니다.
 */
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const has = (f) => args.includes(f);
const val = (f, d) => { const i = args.indexOf(f); return i >= 0 ? args[i + 1] : d; };

const PORT = val('--port', '9222');
const OUT = path.resolve(__dirname, val('--out', 'collected.txt'));
// 어느 화면에서 나온 문자열인지 남깁니다. collected.txt 는 평면 목록이라
// 나중에 "이건 어느 페이지 거지?" 를 되짚을 수 없어서 사이드카로 기록합니다.
const OUT_SRC = OUT.replace(/\.txt$/, '') + '.by-page.tsv';
const MATCH = val('--match', 'advancedreachtool');
const WATCH = has('--watch');
const EXPR = fs.readFileSync(path.join(__dirname, 'collect.js'), 'utf8')
  + '\n; window.__ART_COLLECTED';

// 이미 모아 둔 문자열은 다시 쓰지 않습니다.
const seen = new Set(
  fs.existsSync(OUT) ? fs.readFileSync(OUT, 'utf8').split('\n').map((s) => s.trim()) : []
);
seen.delete('');

async function targets() {
  const r = await fetch(`http://127.0.0.1:${PORT}/json/list`);
  const all = await r.json();
  return all.filter((t) => t.type === 'page' && t.url && t.url.includes(MATCH));
}

function evaluate(wsUrl, expression) {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(wsUrl);
    const timer = setTimeout(() => { try { ws.close(); } catch (e) {} reject(new Error('timeout')); }, 15000);
    ws.addEventListener('open', () => {
      ws.send(JSON.stringify({
        id: 1,
        method: 'Runtime.evaluate',
        params: { expression, returnByValue: true, awaitPromise: false }
      }));
    });
    ws.addEventListener('message', (ev) => {
      let msg;
      try { msg = JSON.parse(ev.data); } catch (e) { return; }
      if (msg.id !== 1) return;
      clearTimeout(timer);
      try { ws.close(); } catch (e) {}
      const r = msg.result;
      if (!r || r.exceptionDetails) {
        return reject(new Error(r && r.exceptionDetails
          ? (r.exceptionDetails.exception || {}).description || 'evaluate 실패'
          : 'evaluate 실패'));
      }
      resolve((r.result && r.result.value) || []);
    });
    ws.addEventListener('error', () => { clearTimeout(timer); reject(new Error('WebSocket 오류')); });
  });
}

async function sweep() {
  let pages;
  try {
    pages = await targets();
  } catch (e) {
    console.error('크롬 디버깅 포트에 붙지 못했습니다 (' + PORT + '). '
      + '크롬을 --remote-debugging-port=' + PORT + ' 로 다시 띄웠는지 확인하십시오.');
    return null;
  }
  if (!pages.length) {
    console.error(`'${MATCH}' 를 포함한 탭이 없습니다. ART 화면을 열어 두십시오.`);
    return 0;
  }
  let added = 0;
  for (const t of pages) {
    let list;
    try {
      list = await evaluate(t.webSocketDebuggerUrl, EXPR);
    } catch (e) {
      console.error('  ! ' + t.url + ' : ' + e.message);
      continue;
    }
    const fresh = list.filter((s) => s && !seen.has(s));
    fresh.forEach((s) => seen.add(s));
    if (fresh.length) {
      fs.appendFileSync(OUT, fresh.join('\n') + '\n', 'utf8');
      const src = t.url.replace(/^https?:\/\/[^/]+/, '') || '/';
      fs.appendFileSync(OUT_SRC,
        fresh.map((x) => src + '\t' + x).join('\n') + '\n', 'utf8');
      added += fresh.length;
      const u = t.url.replace(/^https?:\/\/[^/]+/, '');
      console.log(`+${fresh.length}  ${u}   (누적 ${seen.size})`);
    }
  }
  return added;
}

(async () => {
  if (!WATCH) {
    const n = await sweep();
    if (n !== null) console.log(`수집 완료 — 새 문자열 ${n}개, 누적 ${seen.size}개 -> ${OUT}`);
    return;
  }
  console.log(`감시 시작 (2초 간격). 크롬에서 화면을 옮겨 다니십시오. 누적 ${seen.size}개`);
  console.log('중지: Ctrl+C');
  for (;;) {
    await sweep();
    await new Promise((r) => setTimeout(r, 2000));
  }
})();
