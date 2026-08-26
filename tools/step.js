/* 현재 화면에서 버튼을 순서대로 누르며 각 화면의 글을 모읍니다.
 *
 * 베이지안처럼 여러 단계를 거쳐야 나오는 화면을 손으로 이어갈 때 씁니다.
 * 버튼을 못 찾으면 **그 화면에 보이는 버튼 목록을 찍어 줍니다** — 다음 인자를
 * 무엇으로 줘야 하는지 바로 알 수 있습니다.
 *
 *   node step.js "베이지안 모델로 진행" "베이지안 모델 실행"
 *   node step.js --list                  버튼 목록만 보기
 *   node step.js --mclick "선택자"        진짜 마우스 클릭 (합성 click 무시하는 요소)
 */
const fs = require('fs');
const { connect } = require('./cdp.js');
const P = require('./pagelib.js');

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

function buttonList() {
  var out = [];
  var all = document.querySelectorAll('a,input[type=submit],input[type=button],button');
  for (var i = 0; i < all.length; i++) {
    if (all[i].offsetParent === null) continue;
    var t = (all[i].tagName === 'INPUT' ? all[i].value : all[i].textContent) || '';
    t = t.replace(/\s+/g, ' ').trim();
    if (t) out.push(t.slice(0, 50));
  }
  return out;
}

(async () => {
  const c = await connect();
  const log = (s) => process.stdout.write(s + '\n');
  const url = () => c.run(function () { return location.pathname; });
  const args = process.argv.slice(2);

  async function grab() {
    const u = await url();
    let n = 0;
    for (const s of (await c.run(P.textSnapshot)) || []) if (record(u, 'text', s)) n++;
    const o = await c.act(() => c.run(P.openHelp), 1200);
    if (o.result === 'OK') {
      await c.sleep(1400);
      for (const s of (await c.run(P.readHelp)) || []) if (record(u, 'help', s)) n++;
    }
    save();
    return n;
  }

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
    await c.act(null, 3000);
    return 'OK';
  }

  try {
    log('현재: ' + (await url()));
    if (!args.length || args[0] === '--list') {
      log('새 글 ' + (await grab()) + '개');
      log('보이는 버튼:\n  ' + (await c.run(buttonList)).join('\n  '));
      return;
    }
    for (let i = 0; i < args.length; i++) {
      if (args[i] === '--mclick') {
        const r = await mclick(args[++i]);
        log('mclick ' + args[i] + ' -> ' + r);
      } else {
        const r = await c.act(() => c.run(P.clickBtn, [args[i]]), 4000);
        log('[' + i + '] "' + args[i] + '" -> ' + r.result);
        if (r.result === 'NOTFOUND') {
          log('  보이는 버튼:\n    ' + (await c.run(buttonList)).join('\n    '));
          break;
        }
      }
      await c.sleep(1500);
      log('  -> ' + (await url()) + '  새 글 ' + (await grab()) + '개');
    }
  } finally {
    save();
    log('\n수집 ' + Object.keys(todo).length + '개 (새로 ' + newHits + ')');
    c.close();
  }
})();
