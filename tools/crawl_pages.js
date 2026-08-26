/* 마법사 밖의 화면들(내 시나리오, 결과, 베이지안, 측정자료, 지원 문서 등)을
 * 링크를 따라가며 훑습니다.
 *
 * crawl.js 는 /loggedin/mechquest/* 만 덮습니다. 그쪽은 순서가 강제돼 링크로
 * 못 들어가지만, 나머지 화면은 그냥 이동하면 열립니다.
 *
 * 안전장치: 지우기·로그아웃 같은 되돌릴 수 없는 링크는 절대 누르지 않습니다.
 * 링크를 '클릭' 하지 않고 href 로 **이동만** 합니다 (__doPostBack 링크는 건너뜀).
 *
 *   node crawl_pages.js [최대화면수]
 */
const fs = require('fs');
const { connect } = require('./cdp.js');
const P = require('./pagelib.js');

const SEEDS = [
  '/loggedin/myscenarios.aspx',
  '/loggedin/mechanisticresults.aspx',
  '/loggedin/prebayesian.aspx',
  '/loggedin/browseedb.aspx',
  '/loggedin/progress.aspx',
  '/', '/science.aspx', '/support.aspx', '/training.aspx', '/consortium.aspx',
];
const MAX = Number(process.argv[2] || 80);
const OUT_SCREENS = 'crawl_screens.json';
const OUT_TODO = 'crawl_todo.json';

// 되돌릴 수 없는 동작. 시나리오를 지우거나 로그아웃하면 순회가 끝납니다.
const DANGER = /logout|logoff|signout|delete|remove|discard|reset|purge|삭제|로그아웃/i;

const IGNORE = ['English', 'Deutsche', 'Francais', 'Nederlands',
  'claude-translanguage', 'XLUNIFAC', 'xylene', 'toluene'];

// ASP.NET 예외 페이지 문구. 시나리오가 미완성이면 서버 오류가 나는데,
// 그 진단 화면 boilerplate 는 ART UI 가 아니라 번역 대상이 아닙니다.
const ASPNET_ERR = /Server Error in|unhandled exception|stack trace|Debug\s*=\s*"true"|<%@|<configuration|<system\.web|compilation debug|Microsoft\.NET|ASP\.NET Version|Runtime Version|Exception Details|Source Error|debug mode|memory\/performance overhead|System\.(InvalidOperationException|Exception|Web)|@import|Stack Trace/i;

const HANGUL = /[가-힣]/;

function ignorable(s) {
  const t = s.trim();
  if (ASPNET_ERR.test(t)) return true;
  if (IGNORE.indexOf(t) !== -1) return true;
  // 이미 한국어인 문장이 다시 수집되지 않도록. 'ART — 고급 REACH 도구' 처럼
  // 영미어 낙말이 섞여 있으면 기존 알파벳 검사만으로는 걸러지지 않습니다.
  if (HANGUL.test(t)) return true;
  if (t.length < 4) return true;
  if (!/[A-Za-z]{4}/.test(t)) return true;
  if (/^[\d.,\s%<>=+/()-]*[A-Za-z/²³°µ]{1,6}$/.test(t)) return true;
  return false;
}

const OUT_OTHER = 'crawl_otherattrs.json';
const load = (f, d) => (fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')) : d);
const screens = load(OUT_SCREENS, {});
const todo = load(OUT_TODO, {});
let newHits = 0;

function record(url, kind, s) {
  const t = String(s || '').replace(/\s+/g, ' ').trim();
  if (!t || ignorable(t)) return;
  if (!(t in todo)) { todo[t] = ''; newHits++; }
  const sc = screens[url] || (screens[url] = {});
  if (!sc[kind]) sc[kind] = [];
  if (sc[kind].indexOf(t) === -1) sc[kind].push(t);
}
// 유저스크립트가 아직 안 건드리는 표시용 속성(aria-label, summary, data-*).
// 번역 단위가 아니라 '여기에 글이 있으니 ATTRS 에 추가할지 판단하라' 는 진단입니다.
const otherAttrs = load(OUT_OTHER, {});
function noteOther(url, s) {
  const t = String(s || '').replace(/\s+/g, ' ').trim();
  if (!t) return;
  (otherAttrs[t] || (otherAttrs[t] = [])).indexOf(url) === -1
    && otherAttrs[t].push(url);
}
function save() {
  fs.writeFileSync(OUT_OTHER, JSON.stringify(otherAttrs, null, 1), 'utf8');
  fs.writeFileSync(OUT_SCREENS, JSON.stringify(screens, null, 1), 'utf8');
  fs.writeFileSync(OUT_TODO, JSON.stringify(todo, null, 1), 'utf8');
}

// 같은 사이트의 실제 링크만. 자바스크립트 포스트백 링크는 이동으로 재현할 수
// 없으므로 건너뜁니다(클릭하면 어떤 동작을 할지 알 수 없습니다).
function collectLinks() {
  var out = [];
  var as = document.querySelectorAll('a[href]');
  for (var i = 0; i < as.length; i++) {
    var a = as[i];
    var h = a.getAttribute('href') || '';
    if (!h || h.charAt(0) === '#') continue;
    if (h.toLowerCase().indexOf('javascript:') === 0) continue;
    var u;
    try { u = new URL(a.href, location.href); } catch (e) { continue; }
    if (u.host !== location.host) continue;
    if (!/\.aspx$/i.test(u.pathname) && u.pathname !== '/') continue;
    out.push({ path: u.pathname + (u.search || ''),
               text: (a.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 60) });
  }
  return out;
}

(async () => {
  const c = await connect();
  const log = (s) => process.stdout.write(s + '\n');
  const queue = SEEDS.slice();
  const seen = new Set();
  let visited = 0;

  try {
    while (queue.length && visited < MAX) {
      const path = queue.shift();
      const bare = path.split('?')[0];
      if (seen.has(bare)) continue;
      seen.add(bare);
      if (DANGER.test(path)) { log('  ! 위험 링크 건너뜀 ' + path); continue; }
      if (bare.indexOf('/mechquest/') !== -1) continue;   // crawl.js 담당

      await c.nav(path);
      const here = await c.run(function () { return location.pathname; });
      visited++;
      log('\n[' + visited + '] ' + path + (here !== bare ? '  -> ' + here : ''));

      let h;
      try { h = await c.run(P.harvest); } catch (e) { log('  훑기 실패'); continue; }
      if (h.title) record(here, 'title', h.title);
      h.residue.forEach((s) => record(here, 'text', s));
      h.attrs.forEach((s) => record(here, 'attr', s));
      h.opts.forEach((s) => record(here, 'option', s));
      h.legends.forEach((s) => record(here, 'legend', s));
    (h.dialogs || []).forEach((s) => record(here, 'dialog', s));
    (h.otherAttrs || []).forEach((x) => noteOther(here, x));
      if (h.desc) for (const v of Object.values(h.desc)) record(here, 'desc', v);
      h.tas.filter((t) => t.ro || t.dis).forEach((t) => record(here, 'desc', t.full));

      const o = await c.act(() => c.run(P.openHelp), 1200);
      if (o.result === 'OK') {
        await c.sleep(1400);
        (await c.run(P.readHelp)).forEach((s) => record(here, 'help', s));
      }

      let links = [];
      try { links = await c.run(collectLinks); } catch (e) { links = []; }
      let added = 0;
      for (const l of links) {
        const b = l.path.split('?')[0];
        if (seen.has(b) || DANGER.test(l.path) || DANGER.test(l.text)) continue;
        if (b.indexOf('/mechquest/') !== -1) continue;
        if (queue.indexOf(l.path) !== -1) continue;
        queue.push(l.path);
        added++;
      }
      log('  수집 ' + Object.keys(todo).length + '개 (새로 ' + newHits + '), 링크 +' + added);
      save();
    }
  } finally {
    save();
    log('\n=== 끝. 방문 ' + visited + '개 화면, 수집 ' + Object.keys(todo).length + '개 ===');
    c.close();
  }
})();
