/* 활동 하나를 **끝까지 정상으로** 채우고 모델을 실행합니다.
 *
 * 왜 필요한가
 *   결과·베이지안 화면은 시나리오가 완전해야 렌더링됩니다. 4차 세션 순회기는
 *   활동을 중간에 두고 나왔기 때문에 그 화면들이
 *   `System.InvalidOperationException: Found invalid enabled activity`
 *   서버 오류를 냈고, 그래서 결과 화면 텍스트가 한 번도 확인되지 않았습니다.
 *
 * 하는 일
 *   1. 시나리오를 불러온다
 *   2. 활동 구성을 처음부터 끝까지 걸어간다 (마지막 화면까지)
 *   3. 활동 지속시간을 480분으로 넣는다 (인라인 편집기 — 진짜 키 입력 필요)
 *   4. '완료'/'실행' 을 눌러 모델을 돌린다
 *   5. 진행 화면과 결과 화면의 글을 모은다
 *
 * 인라인 편집기 주의 (2차 세션 기록)
 *   ASP.NET 인라인 편집기는 `.value` 설정 + `change` 이벤트를 무시합니다.
 *   CDP Input 도메인으로 **진짜 마우스·키 입력**을 보내야 반응합니다.
 *   이름은 `textarea.field`, 지속시간은 `input.field` 로 요소가 다릅니다.
 *   숨은 것이 잡히니 반드시 보이는 `.inplace-edit` 안에서 찾으십시오.
 *
 *   node run_model.js            활동을 끝내고 모델 실행까지
 *   node run_model.js --collect  실행 후 결과/베이지안 화면 수집까지
 */
const fs = require('fs');
const { connect } = require('./cdp.js');
const P = require('./pagelib.js');

const START = '/loggedin/mechquest/q002_7_activities.aspx';
const SCENARIO = process.env.ART_SCENARIO || 'claude-translanguage';
const DURATION = process.env.ART_DURATION || '480';
const MAX_STEPS = 30;
const OUT_SCREENS = 'crawl_screens.json';
const OUT_TODO = 'crawl_todo.json';

const load = (f, d) => (fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')) : d);
const screens = load(OUT_SCREENS, {});
const todo = load(OUT_TODO, {});
let newHits = 0;

const ASPNET_ERR = /Server Error in|unhandled exception|Stack Trace|<%@|<configuration|System\.|ASP\.NET|Runtime Version|Version Information/i;
const IGNORE = ['English', 'Deutsche', 'Francais', 'Nederlands',
  'claude-translanguage', 'XLUNIFAC', 'xylene', 'toluene'];

function ignorable(s) {
  const t = s.trim();
  if (ASPNET_ERR.test(t)) return true;
  if (IGNORE.indexOf(t) !== -1) return true;
  if (t.length < 4) return true;
  if (/[가-힣]/.test(t)) return true;
  if (!/[A-Za-z]{4}/.test(t)) return true;
  return false;
}
function record(url, kind, s) {
  const t = String(s || '').replace(/\s+/g, ' ').trim();
  if (!t || ignorable(t)) return false;
  if (!(t in todo)) { todo[t] = ''; newHits++; }
  const sc = screens[url] || (screens[url] = {});
  if (!sc[kind]) sc[kind] = [];
  if (sc[kind].indexOf(t) === -1) sc[kind].push(t);
  return true;
}
function save() {
  fs.writeFileSync(OUT_SCREENS, JSON.stringify(screens, null, 1), 'utf8');
  fs.writeFileSync(OUT_TODO, JSON.stringify(todo, null, 1), 'utf8');
}

(async () => {
  const c = await connect();
  const log = (s) => process.stdout.write(s + '\n');
  const url = () => c.run(function () { return location.pathname; });
  const collect = process.argv.indexOf('--collect') !== -1;

  async function grab(tag) {
    const u = await url();
    let n = 0;
    for (const s of (await c.run(P.textSnapshot)) || []) {
      if (record(u, tag, s)) n++;
    }
    const o = await c.act(() => c.run(P.openHelp), 1200);
    if (o.result === 'OK') {
      await c.sleep(1400);
      for (const s of (await c.run(P.readHelp)) || []) if (record(u, 'help', s)) n++;
    }
    save();
    return n;
  }

  const clickNext = () => c.act(() => c.run(P.clickBtn, ['다음', 'next']), 3000);

  // 화면을 넘깁니다. 값을 '정상으로' 채우는 것이 목적입니다.
  async function advance(u) {
    const gg = await c.run(P.radioGroups);
    for (const nm of Object.keys(gg)) {
      if (gg[nm].some((o) => o.c)) continue;
      await c.act(() => c.run(P.pickRadio, nm, gg[nm][0].v), 1500);
    }
    await clickNext();
    let now = await url();
    if (now !== u) return now;
    const f = await c.act(() => c.run(P.fillBlanks), 1200);
    if ((f.result || []).length) { await clickNext(); now = await url(); if (now !== u) return now; }
    for (const s of await c.run(P.selectInfo)) {
      if (s.opts.length > 1 && s.idx <= 0) {
        await c.act(() => c.run(P.pickSelect, s.name, s.opts[1].v), 1200);
      }
    }
    await clickNext();
    now = await url();
    if (now !== u) return now;
    // 마지막 수단: 숫자칸을 비워 범주 선택만 남김
    await c.act(() => c.run(function () {
      var ins = document.querySelectorAll('input[type=text],input[type=number]');
      for (var i = 0; i < ins.length; i++) {
        var e = ins[i];
        if (e.offsetParent === null || !e.value) continue;
        if (String(e.name || e.id || '').toLowerCase().indexOf('usernote') >= 0) continue;
        e.value = '';
        e.dispatchEvent(new Event('change', { bubbles: true }));
      }
      return 1;
    }), 1200);
    await clickNext();
    now = await url();
    return now !== u ? now : false;
  }

  // 인라인 편집기로 지속시간을 넣습니다. 진짜 마우스·키 입력이 필요합니다.
  async function setDuration() {
    const box = await c.run(function () {
      // 지속시간 편집 링크. 이름 편집(textarea)과 구분해야 합니다.
      var as = document.querySelectorAll('a');
      for (var i = 0; i < as.length; i++) {
        var t = (as[i].getAttribute('title') || '') + ' ' + (as[i].textContent || '');
        if (/duration|지속/i.test(t) && as[i].offsetParent !== null) {
          as[i].scrollIntoView({ block: 'center' });
          var r = as[i].getBoundingClientRect();
          return JSON.stringify({ x: Math.round(r.left + r.width / 2),
                                  y: Math.round(r.top + r.height / 2) });
        }
      }
      return 'NOLINK';
    });
    if (box === 'NOLINK') return 'NOLINK';
    const pt = JSON.parse(box);
    await c.call('Input.dispatchMouseEvent', { type: 'mousePressed', x: pt.x, y: pt.y, button: 'left', clickCount: 1 });
    await c.call('Input.dispatchMouseEvent', { type: 'mouseReleased', x: pt.x, y: pt.y, button: 'left', clickCount: 1 });
    await c.sleep(1200);

    const fld = await c.run(function () {
      var e = document.querySelector('.inplace-edit input.field, .inplace-edit input[type=text]');
      if (!e || e.offsetParent === null) return 'NOFIELD';
      e.focus();
      if (e.select) e.select();
      var r = e.getBoundingClientRect();
      return JSON.stringify({ x: Math.round(r.left + r.width / 2),
                              y: Math.round(r.top + r.height / 2) });
    });
    if (fld === 'NOFIELD') return 'NOFIELD';
    const fp = JSON.parse(fld);
    await c.call('Input.dispatchMouseEvent', { type: 'mousePressed', x: fp.x, y: fp.y, button: 'left', clickCount: 3 });
    await c.call('Input.dispatchMouseEvent', { type: 'mouseReleased', x: fp.x, y: fp.y, button: 'left', clickCount: 3 });
    await c.call('Input.insertText', { text: String(DURATION) });
    await c.act(() => c.run(function () {
      var b = document.querySelector('.inplace-edit .save-button, .inplace-edit a[title*=ave], .inplace-edit input[type=submit]');
      if (b) { b.click(); return 'SAVED'; }
      return 'NOSAVE';
    }), 2500);
    return 'OK';
  }

  try {
    await c.nav(START);
    if ((await url()).indexOf('myscenarios') !== -1) {
      const L = await c.act(() => c.run(P.loadScenario, SCENARIO), 3000);
      if (L.result === 'NOROW') throw new Error('시나리오를 못 찾음: ' + SCENARIO);
      await c.nav(START);
    }
    log('개요 도착: ' + (await url()));
    if (collect) log('  개요에서 새 글 ' + (await grab('text')) + '개');

    const r = await c.act(() => c.run(P.clickBtn, ['활동 구성', 'configure activity']), 2500);
    if (r.result === 'NOTFOUND') throw new Error('활동 구성 버튼 없음');

    // 활동을 끝까지 걸어갑니다
    for (let i = 0; i < MAX_STEPS; i++) {
      const u = await url();
      if (u.indexOf('q002_7') !== -1) { log('활동 완료 → 개요 복귀 (' + i + '걸음)'); break; }
      log('[' + i + '] ' + u.split('/').pop());
      if (collect) await grab('text');
      const nu = await advance(u);
      if (!nu) { log('  막힘 — 오류: ' + JSON.stringify(await c.run(P.errors))); break; }
    }

    // 지속시간
    const d = await setDuration();
    log('지속시간 설정: ' + d);

    // 모델 실행
    const before = await url();
    const run = await c.act(() => c.run(P.clickBtn, ['완료', 'finish', '실행', 'run']), 4000);
    log('실행 버튼: ' + run.result);
    for (let i = 0; i < 20; i++) {
      const now = await url();
      if (collect) await grab('text');
      if (now !== before && now.indexOf('progress') === -1) break;
      await c.sleep(2000);
    }
    log('도착: ' + (await url()));
    if (collect) log('결과 화면에서 새 글 ' + (await grab('text')) + '개');
  } catch (e) {
    log('실패: ' + e.message);
  } finally {
    save();
    log('\n=== 끝. 수집 ' + Object.keys(todo).length + '개 (새로 ' + newHits + ') ===');
    c.close();
  }
})();
