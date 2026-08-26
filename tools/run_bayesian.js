/* 베이지안 업데이트를 **실제로 실행**해서 그 화면들의 글을 모읍니다.
 *
 * 왜 어려운가
 *   1. 베이지안은 노출 데이터 라이브러리에 **유사 데이터가 있는 시나리오**여야
 *      진행됩니다. 없으면 "No suitable scenarios were found" 로 막힙니다.
 *      2차 세션 기록: **분말 이송 → 분말 낙하** 로 구성하면 11개가 나옵니다.
 *      액체 분무는 데이터가 없습니다.
 *   2. 시나리오 이름 선택은 ASP.NET 인라인 요소라 합성 .click() 에 반응하지
 *      않는 경우가 있습니다. 진짜 마우스 이벤트를 보내야 합니다.
 *
 * 경로
 *   결과 → 베이지안 모델로 진행 → aboutanalogousdata
 *        → ART 노출 데이터 라이브러리에서 선택 → browseedb
 *        → 시나리오 선택 → 베이지안 업데이트로 진행 → prebayesian
 *        → 베이지안 모델 실행 → bayesianresults
 *
 *   node run_bayesian.js
 */
const fs = require('fs');
const { connect } = require('./cdp.js');
const P = require('./pagelib.js');

const START = '/loggedin/mechquest/q002_7_activities.aspx';
const SCENARIO = process.env.ART_SCENARIO || 'claude-translanguage';
const OUT_SCREENS = 'crawl_screens.json';
const OUT_TODO = 'crawl_todo.json';

const load = (f, d) => (fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')) : d);
const screens = load(OUT_SCREENS, {});
const todo = load(OUT_TODO, {});
let newHits = 0;

const HANGUL = /[가-힣]/;
const ASPNET_ERR = /Server Error in|unhandled exception|Stack Trace|<%@|<configuration|System\.|ASP\.NET|Runtime Version|Version Information/i;
const IGNORE = ['English', 'Deutsche', 'Francais', 'Nederlands',
  'claude-translanguage', 'XLUNIFAC', 'xylene', 'toluene', 'PDF', 'Excel'];

function ignorable(s) {
  const t = s.trim();
  if (ASPNET_ERR.test(t)) return true;
  if (IGNORE.indexOf(t) !== -1) return true;
  if (t.length < 4) return true;
  if (HANGUL.test(t)) return true;
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

  async function grab(tag) {
    const u = await url();
    let n = 0;
    for (const s of (await c.run(P.textSnapshot)) || []) if (record(u, tag, s)) n++;
    const o = await c.act(() => c.run(P.openHelp), 1200);
    if (o.result === 'OK') {
      await c.sleep(1400);
      for (const s of (await c.run(P.readHelp)) || []) if (record(u, 'help', s)) n++;
    }
    save();
    return n;
  }

  // 진짜 마우스 클릭. ASP.NET 인라인 요소는 합성 .click() 을 무시합니다.
  async function mclick(sel) {
    const box = await c.run(function (s) {
      var e = document.querySelector(s);
      if (!e || e.offsetParent === null) return 'NOEL';
      e.scrollIntoView({ block: 'center' });
      var r = e.getBoundingClientRect();
      return JSON.stringify({ x: Math.round(r.left + r.width / 2),
                              y: Math.round(r.top + r.height / 2) });
    }, sel);
    if (box === 'NOEL') return 'NOEL';
    const pt = JSON.parse(box);
    await c.call('Input.dispatchMouseEvent', { type: 'mouseMoved', x: pt.x, y: pt.y });
    await c.call('Input.dispatchMouseEvent', { type: 'mousePressed', x: pt.x, y: pt.y, button: 'left', clickCount: 1 });
    await c.call('Input.dispatchMouseEvent', { type: 'mouseReleased', x: pt.x, y: pt.y, button: 'left', clickCount: 1 });
    await c.act(null, 2500);
    return 'OK';
  }

  const clickNext = () => c.act(() => c.run(P.clickBtn, ['다음', 'next']), 3000);

  // 화면을 정상으로 채워 넘깁니다. want 가 주어지면 그 문구가 든 라디오를 고릅니다.
  async function advance(u, want) {
    if (want) {
      const r = await c.act(() => c.run(function (needle) {
        var norm = function (s) { return String(s || '').replace(/\s+/g, ' ').trim(); };
        var rs = document.querySelectorAll('input[type=radio]');
        for (var i = 0; i < rs.length; i++) {
          var e = rs[i];
          if (e.offsetParent === null) continue;
          var lab = e.id ? document.querySelector('label[for="' + e.id + '"]') : null;
          var t = norm(lab ? lab.textContent : (e.parentElement ? e.parentElement.textContent : ''));
          if (t.indexOf(needle) !== -1) { e.click(); return 'PICKED:' + t.slice(0, 50); }
        }
        return 'NORADIO';
      }, want), 2000);
      log('    선택 시도 "' + want + '" -> ' + r.result);
    }
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
    await c.act(() => c.run(P.stuffBadValues, 'clear'), 1200);
    await clickNext();
    now = await url();
    return now !== u ? now : false;
  }

  // 화면 이름 -> 그 화면에서 고를 문구. 유사 데이터가 있는 조합으로 몰아갑니다.
  const WANT = {
    q003_090_producttype: '분말',            // Powders, granules or pelletised material
    q017_055_103_activityclass: '이송',      // Transfer of powders
  };
  function wantFor(u) {
    for (const k of Object.keys(WANT)) if (u.indexOf(k) !== -1) return WANT[k];
    return null;
  }

  try {
    await c.nav(START);
    if ((await url()).indexOf('myscenarios') !== -1) {
      const L = await c.act(() => c.run(P.loadScenario, SCENARIO), 3000);
      if (L.result === 'NOROW') throw new Error('시나리오를 못 찾음: ' + SCENARIO);
      await c.nav(START);
    }
    const r = await c.act(() => c.run(P.clickBtn, ['활동 구성', 'configure activity']), 2500);
    if (r.result === 'NOTFOUND') throw new Error('활동 구성 버튼 없음');

    // 분말 이송으로 활동을 다시 구성
    for (let i = 0; i < 30; i++) {
      const u = await url();
      if (u.indexOf('q002_7') !== -1) { log('활동 완료 (' + i + '걸음)'); break; }
      log('[' + i + '] ' + u.split('/').pop());
      await grab('text');
      const nu = await advance(u, wantFor(u));
      if (!nu) { log('  막힘: ' + JSON.stringify(await c.run(P.errors))); break; }
    }

    // 모델 실행
    const run = await c.act(() => c.run(P.clickBtn, ['완료 및 실행', '완료', 'finish']), 4000);
    log('실행: ' + run.result);
    for (let i = 0; i < 20; i++) {
      const now = await url();
      await grab('text');
      if (now.indexOf('mechanisticresults') !== -1) break;
      if (now.indexOf('progress') !== -1) { await c.sleep(2000); continue; }
      await c.sleep(1500);
    }
    log('결과 화면: ' + (await url()));

    // 베이지안 연쇄
    const CHAIN = [
      ['베이지안', 'Bayesian'],
      ['노출 데이터 라이브러리', 'exposure data library', 'Select from'],
      null,                                  // 시나리오 선택 (mclick)
      ['베이지안 업데이트로 진행', 'Proceed to Bayesian update'],
      ['베이지안 모델 실행', 'Run Bayesian'],
    ];
    for (let s = 0; s < CHAIN.length; s++) {
      const before = await url();
      if (CHAIN[s] === null) {
        // 라이브러리에서 첫 시나리오를 고릅니다
        let m = await mclick('div.exp-col-section-left label');
        if (m === 'NOEL') m = await mclick('#ctl00_cphMain_gvScenarios a, table a');
        log('  시나리오 선택: ' + m);
      } else {
        const k = await c.act(() => c.run(P.clickBtn, CHAIN[s]), 4000);
        log('  [' + s + '] ' + JSON.stringify(CHAIN[s][0]) + ' -> ' + k.result);
        if (k.result === 'NOTFOUND') {
          log('    버튼 없음. 지금 화면: ' + before);
          log('    보이는 버튼: ' + JSON.stringify(
            (await c.run(function () {
              var out = [];
              var all = document.querySelectorAll('a,input[type=submit],input[type=button],button');
              for (var i = 0; i < all.length; i++) {
                if (all[i].offsetParent === null) continue;
                var t = (all[i].tagName === 'INPUT' ? all[i].value : all[i].textContent) || '';
                t = t.replace(/\s+/g, ' ').trim();
                if (t) out.push(t.slice(0, 40));
              }
              return out.slice(0, 25);
            }))));
          break;
        }
      }
      await c.sleep(1500);
      const n = await grab('text');
      log('    -> ' + (await url()) + '  새 글 ' + n + '개');
    }
  } catch (e) {
    log('실패: ' + e.message);
  } finally {
    save();
    log('\n=== 끝. 수집 ' + Object.keys(todo).length + '개 (새로 ' + newHits + ') ===');
    c.close();
  }
})();
