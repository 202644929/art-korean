/* ART 가 CAS 번호로 물성을 스스로 채워 주는지 확인합니다.
 *
 * 채워 준다면 MSDS 자동 채우기의 상당 부분이 이미 있는 셈입니다.
 * 겸사겸사, 잠긴 제품 유형(가스·섬유상·고온금속)이 물질에 따라 풀리는지도 봅니다.
 *
 *   node probe_cas.js 108-88-3        (톨루엔)
 */
const { connect } = require('./cdp.js');
const P = require('./pagelib.js');

const CAS = process.argv[2] || '108-88-3';
const CASNO = '/loggedin/mechquest/q002_casno.aspx';
const ACTS = '/loggedin/mechquest/q002_7_activities.aspx';

function fields() {
  var norm = function (s) { return String(s || '').replace(/\s+/g, ' ').trim(); };
  var out = { url: location.pathname, inputs: [], texts: [] };
  var ins = document.querySelectorAll('input[type=text],input[type=number],select');
  for (var i = 0; i < ins.length; i++) {
    var e = ins[i];
    if (e.offsetParent === null) continue;
    out.inputs.push((e.name || e.id) + ' = ' + norm(e.value));
  }
  var m = document.getElementById('ctl00_cphMain_upMain') || document.body;
  var w = document.createTreeWalker(m, NodeFilter.SHOW_TEXT, null);
  var n;
  while ((n = w.nextNode()) && out.texts.length < 14) {
    var p = n.parentElement;
    if (!p || p.offsetParent === null) continue;
    if (p.tagName === 'SCRIPT' || p.tagName === 'STYLE') continue;
    var t = norm(n.nodeValue);
    if (t.length > 5) out.texts.push(t.slice(0, 120));
  }
  return out;
}

function radios() {
  var norm = function (s) { return String(s || '').replace(/\s+/g, ' ').trim(); };
  var out = [];
  var rs = document.querySelectorAll('input[type=radio]');
  for (var i = 0; i < rs.length; i++) {
    var e = rs[i];
    var lab = e.id ? document.querySelector('label[for="' + e.id + '"]') : null;
    out.push((e.disabled ? '[잠김] ' : '       ') + e.value + '  '
      + norm(lab ? lab.textContent : '').slice(0, 34));
  }
  return out;
}

(async () => {
  const c = await connect();
  const log = (s) => process.stdout.write(s + '\n');
  const url = () => c.run(function () { return location.pathname; });

  try {
    await c.nav(CASNO);
    log('1) ' + (await url()));
    let f = await c.run(fields);
    log('   입력칸: ' + JSON.stringify(f.inputs));

    // CAS 번호를 넣고 확인을 누릅니다
    const set = await c.act(() => c.run(function (v) {
      var e = document.querySelector('input[name*=txtCasNo],input[id*=txtCasNo]');
      if (!e) return 'NOFIELD';
      e.value = v;
      e.dispatchEvent(new Event('change', { bubbles: true }));
      return 'SET';
    }, CAS), 1500);
    log('2) CAS ' + CAS + ' 입력: ' + set.result);

    const chk = await c.act(() => c.run(P.clickBtn, ['CAS 번호 확인', 'check cas']), 4000);
    log('3) 확인 클릭: ' + chk.result + ' -> ' + (await url()));
    await c.sleep(1500);

    f = await c.run(fields);
    log('   화면 글:');
    f.texts.forEach((t) => log('     ' + t));
    log('   입력칸: ' + JSON.stringify(f.inputs));

    // 다음으로 넘어가 물성 화면에 값이 들어갔는지 봅니다
    for (let i = 0; i < 6; i++) {
      const before = await url();
      await c.act(() => c.run(P.clickBtn, ['다음', 'next']), 3000);
      const now = await url();
      if (now === before) break;
      const g = await c.run(fields);
      log('   -> ' + now.split('/').pop() + '  ' + JSON.stringify(g.inputs));
      if (now.indexOf('q002_7') !== -1) break;
    }

    // 제품 유형 잠김 상태가 달라졌는가
    await c.nav(ACTS);
    await c.act(() => c.run(P.clickBtn, ['활동 구성', 'configure activity']), 3000);
    for (let i = 0; i < 20; i++) {
      if ((await url()).indexOf('q003_090_producttype') !== -1) break;
      const p = await c.act(() => c.run(P.clickBtn, ['이전', 'previous']), 3000);
      if (p.result === 'NOTFOUND') break;
    }
    log('\n4) ' + (await url()) + '  제품 유형 잠김 상태:');
    (await c.run(radios)).forEach((r) => log('     ' + r));
  } catch (e) {
    log('실패: ' + e.message);
  } finally {
    c.close();
  }
})();
