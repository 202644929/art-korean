/* 지금 열려 있는 화면에 **빌드된 유저스크립트를 주입**하고 남은 영어를 셉니다.
 *
 * 브라우저의 Tampermonkey 에 깔린 것이 옛 빌드일 수 있으므로, 검증은 항상
 * 파일에서 읽은 최신 빌드를 주입해서 합니다. (@grant none 과 같은 조건 —
 * 페이지 컨텍스트에서 실행하므로 프로토타입 패치가 페이지에 닿습니다.)
 *
 * 폼 전송 데이터가 그대로인지도 함께 확인합니다. 이게 이 프로젝트의 합격 기준입니다.
 *
 *   node verify.js                       현재 화면
 *   node verify.js /loggedin/x.aspx ...   지정 화면들 (마법사 화면은 튕길 수 있음)
 */
const fs = require('fs');
const path = require('path');
const { connect } = require('./cdp.js');
const P = require('./pagelib.js');

const BUILD = path.join(__dirname, '..', 'art-korean.user.js');

// 번역 대상이 아닌 것
const OK_EN = ['English', 'Deutsche', 'Francais', 'Nederlands', 'XLUNIFAC',
  'xylene', 'toluene', 'claude-translanguage'];

function serializeFn() {
  var f = document.getElementById('aspnetForm')
    || document.querySelector('form');
  if (!f) return 'NOFORM';
  var out = [];
  var fd = new FormData(f);
  fd.forEach(function (v, k) { out.push(k + '=' + v); });
  return out.join('&');
}

// 전송 직전 복원 경로를 실제로 밟아 봅니다(제출은 하지 않습니다).
function restoreOnlyFn() {
  var f = document.getElementById('aspnetForm') || document.querySelector('form');
  if (!f) return 'NOFORM';
  var ev = new Event('submit', { bubbles: true, cancelable: true });
  // 기본 동작(실제 전송)은 막습니다. 핸들러만 돌게 합니다.
  f.addEventListener('submit', function (e) { e.preventDefault(); }, { once: true });
  f.dispatchEvent(ev);
  return 'OK';
}

(async () => {
  const c = await connect();
  const src = fs.readFileSync(BUILD, 'utf8');
  const pages = process.argv.slice(2);
  const log = (s) => process.stdout.write(s + '\n');
  let bad = 0;

  // 문서가 만들어지기 **전에** 파일 빌드를 심습니다.
  // 이러면 파일 빌드가 먼저 돌아 중복 방지 가드를 세우고, Tampermonkey 에 깔린
  // (옛) 빌드는 가드를 보고 스스로 물러납니다. 관찰자가 하나만 남으므로
  // 페이지가 멈추는 사고도 없습니다.
  // 이 장치가 없으면 '이미 적용됨' 으로 판단해 주입을 건너뛰고, 결국 옛 빌드를
  // 검증하게 됩니다 — 실제로 그렇게 헛 검증을 했습니다.
  const boot = '(function(){var s=' + JSON.stringify(src) + ';'
    + 'function go(){try{(0,eval)(s);}catch(e){console.error(e);}}'
    + 'if(document.readyState==="loading")'
    + 'document.addEventListener("DOMContentLoaded",go);else go();})()';
  await c.call('Page.enable', {});
  await c.call('Page.addScriptToEvaluateOnNewDocument', { source: boot });

  try {
    const list = pages.length ? pages : [null];
    for (const p of list) {
      try {
      // 주입 전에 항상 새 문서로 만듭니다. 같은 문서에 두 번 주입하면 중복
      // 방지 장치에 걸려 두 번째가 아무 일도 하지 않으므로, 이미 브라우저에
      // 깔린 (옛) 빌드를 검증하는 셈이 됩니다.
      await c.nav(p || (await c.run(function () { return location.pathname; })));
      const before = await c.run(serializeFn);

      // 이미 Tampermonkey 가 번역해 놓았을 수 있으니, 주입 전 상태와
      // 주입 후 상태의 전송 데이터를 비교합니다.
      // 문서 시작 전에 심어 뒀으므로 이미 적용돼 있어야 합니다.
      let already = await c.run(function () { return !!window.__ART_KO_ACTIVE__; });
      if (!already) {
        // 만약 안 걸렸으면(캐시된 문서 등) 지금이라도 넣습니다.
        await c.run(function (code) {
          // eslint-disable-next-line no-eval
          (0, eval)(code);
        }, src);
        already = false;
      }
      await c.sleep(500);

      const here = await c.run(function () { return location.pathname; });
      const h = await c.run(P.harvest);
      log('   적용 경로: 파일 빌드(문서 시작 전 주입)');
      const left = h.residue.filter((s) => OK_EN.indexOf(s.trim()) === -1);

      await c.run(restoreOnlyFn);
      const after = await c.run(serializeFn);

      log('\n== ' + here + '   ' + (h.title || ''));
      log('   전송 데이터 동일: ' + (before === after ? '예' : '아니오'));
      if (before !== after) {
        bad++;
        log('   before: ' + String(before).slice(0, 300));
        log('   after : ' + String(after).slice(0, 300));
      }
      if (h.descBox) {
        log('   설명상자 <' + h.descBox.tag + '>: '
          + (h.descBox.val ? h.descBox.val.slice(0, 90) : '(빔)'));
      }
      if (left.length) {
        bad++;
        log('   남은 영어 ' + left.length + '개:');
        left.slice(0, 12).forEach((s) => log('     - ' + s.slice(0, 110)));
      } else {
        log('   남은 영어 없음');
      }
      } catch (e) {
        // 한 화면이 실패해도 나머지는 계속 봅니다.
        bad++;
        log('== ' + p + '   실패: ' + e.message);
      }
    }
  } finally {
    log('\n=== ' + (bad ? '문제 ' + bad + '건' : '전부 통과') + ' ===');
    c.close();
  }
})();
