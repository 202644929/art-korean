/* 흐름도용 **문구**를 모읍니다.
 *
 * crawl_edges.json 에는 답의 값(rbGranularMaterial)만 있고 화면에 보이는 문구가
 * 없습니다. 흐름도를 그리려면 문구가 있어야 읽힙니다.
 *
 * 하는 일: (화면, 맥락) 조합마다 저장된 경로 중 **가장 짧은 것**을 되밟아 가서
 *   - 그 화면의 질문 문구 (제목 / 머리글 / legend)
 *   - 라디오·드롭다운의 값마다 붙은 문구
 * 를 crawl_labels.json 에 적습니다.
 *
 * 이미 적힌 조합은 건너뜁니다 — 끊겼다 이어 돌려도 됩니다.
 * 브라우저에 유저스크립트가 켜져 있으면 문구가 한국어로 잡힙니다(그게 더 좋습니다).
 *
 *   node labels.js [최대개수]
 */
const fs = require('fs');
const { connect } = require('./cdp.js');
const P = require('./pagelib.js');

const START = '/loggedin/mechquest/q002_7_activities.aspx';
const IN_EDGES = 'crawl_edges.json';
const MAX = Number(process.argv[2] || 200);
const PAIR_SEP = '~~';

/* 병렬 순회 (ART_SHARD=1/3 처럼 지정).
 *
 * 계정마다 크롬을 따로 띄우고(포트 9222/9223/9224) 일감을 겹치지 않게 나눕니다.
 * **같은 계정으로 창만 늘리면 안 됩니다** — ART 는 마법사가 몇 번째 화면인지를
 * 서버가 세션에 들고 있어서, 한쪽이 처음으로 되돌리면 다른 쪽은 자기가 아직
 * 7단계에 있는 줄 알고 다음을 눌러 **엉뚱한 화면의 결과를 자기 기록으로 적습니다.**
 *
 * 나누는 규칙은 '깊이순으로 정렬한 뒤 번갈아' 입니다. 깊은 조합이 한 일꾼에게
 * 몰리면 그쪽만 늦게 끝나므로 순번으로 흩뿌립니다.
 *
 * 결과는 일꾼마다 다른 파일에 쓰고 merge_labels.py 로 합칩니다. 한 파일에
 * 같이 쓰면 나중에 저장한 쪽이 앞사람 것을 통째로 덮어씁니다(읽기-수정-쓰기 경합).
 */
const SHARD = (() => {
  const t = String(process.env.ART_SHARD || '1/1').split('/');
  const i = Number(t[0]) - 1, n = Number(t[1]) || 1;
  if (!(n >= 1) || !(i >= 0) || i >= n) throw new Error('ART_SHARD 형식은 1/3');
  return { i, n };
})();
const OUT = process.env.ART_OUT
  || (SHARD.n > 1 ? 'crawl_labels.s' + (SHARD.i + 1) + '.json' : 'crawl_labels.json');

const load = (f, d) => (fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')) : d);
const edges = load(IN_EDGES, { edges: {} }).edges;
const out = load(OUT, {});
const save = () => fs.writeFileSync(OUT, JSON.stringify(out, null, 1), 'utf8');

const edgeKey = (ch) => ch.at + '@' + (ch.ctx || '')
  + '|' + ch.kind + '|' + ch.name + '|' + ch.v;

// 화면의 질문 문구.
//   라디오 화면 -> <legend> 에 질문이 있습니다.
//   드롭다운 화면 -> legend 가 없고, #ctl00_cphMain_upMain 안의 <span> 에 있습니다.
// 그래서 둘 다 긁습니다. 'sect' 는 '1차 배출 발생원' 같은 구역 이름입니다.
function questionText() {
  var norm = function (s) { return String(s || '').replace(/\s+/g, ' ').trim(); };
  var r = { title: norm(document.title), legends: [], main: [], sect: [] };

  var ls = document.querySelectorAll('legend');
  for (var j = 0; j < ls.length && r.legends.length < 6; j++) {
    if (ls[j].offsetParent === null) continue;
    var u = norm(ls[j].textContent);
    if (u && u.length < 400 && r.legends.indexOf(u) === -1) r.legends.push(u);
  }

  var main = document.getElementById('ctl00_cphMain_upMain');
  var seen = {};
  var walk = function (root, into, limit) {
    if (!root) return;
    var w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
    var n;
    while ((n = w.nextNode()) && into.length < limit) {
      var p = n.parentElement;
      if (!p || p.offsetParent === null) continue;
      if (p.tagName === 'SCRIPT' || p.tagName === 'STYLE') continue;
      var t = norm(n.nodeValue);
      if (t.length < 6 || seen[t]) continue;
      seen[t] = 1;
      into.push(t.slice(0, 400));
    }
  };
  walk(main, r.main, 10);

  // 구역 이름은 upMain 밖에 있습니다.
  var all = document.querySelectorAll('#page div');
  for (var i = 0; i < all.length && r.sect.length < 4; i++) {
    var e = all[i];
    if (e.offsetParent === null) continue;
    if (main && main.contains(e)) continue;
    if (e.children.length) continue;
    var s = norm(e.textContent);
    if (s.length >= 4 && s.length < 60 && /발생원|ource|Field|근거리|원거리/.test(s)
        && r.sect.indexOf(s) === -1) r.sect.push(s);
  }
  return r;
}

(async () => {
  const c = await connect();
  const log = (s) => process.stdout.write(s + '\n');
  const url = () => c.run(function () { return location.pathname; });

  // (화면, 맥락) 조합마다 가장 짧은 도달 경로를 고릅니다.
  const pairs = {};
  for (const e of Object.values(edges)) {
    if (!e.path || !e.path.length) continue;
    const key = e.at + '@' + (e.ctx || '');
    const prefix = e.path.slice(0, -1);   // 마지막 선택은 이 화면에서 하는 것
    if (!pairs[key] || prefix.length < pairs[key].length) pairs[key] = prefix;
  }
  const todo = Object.keys(pairs)
    .filter((k) => !out[k])
    .sort((a, b) => pairs[a].length - pairs[b].length)
    .filter((k, idx) => idx % SHARD.n === SHARD.i);
  log('조합 ' + Object.keys(pairs).length + '개, 남은 것 ' + todo.length + '개'
    + (SHARD.n > 1 ? '  (일꾼 ' + (SHARD.i + 1) + '/' + SHARD.n
       + ', 포트 ' + (process.env.ART_PORT || 9222) + ' -> ' + OUT + ')' : ''));

  let curPath = [];

  const clickPrev = () => c.act(() => c.run(P.clickBtn, ['이전', 'previous', 'back']), 3000);

  // 마법사의 첫 화면(제품 유형)으로 되돌립니다.
  // '활동 구성' 은 **이전 활동을 이어받아** 중간 화면에서 시작하는 경우가 있습니다.
  // 그러면 경로 되밟기가 첫걸음부터 어긋납니다 — 실패 9/20 의 원인이었습니다.
  async function reset() {
    await c.nav(START);
    let u = await url();
    if (u.indexOf('q002_7') === -1) { await c.nav(START); u = await url(); }
    const r = await c.act(() => c.run(P.clickBtn, ['활동 구성', 'configure activity']), 2500);
    if (r.result === 'NOTFOUND') throw new Error('활동 구성 버튼 없음');
    u = await url();
    for (let i = 0; i < 40 && u.indexOf('q003_090_producttype') === -1; i++) {
      const p = await clickPrev();
      if (p.result === 'NOTFOUND') break;
      const nu = await url();
      if (nu === u) break;
      u = nu;
    }
    if (u.indexOf('q003_090_producttype') === -1) {
      throw new Error('첫 화면으로 못 감 (' + u.split('/').pop() + ')');
    }
    curPath = [];
    return u;
  }

  async function applyChoice(ch) {
    if (ch.kind === 'linear') return 'LINEAR';   // 선택지 없는 화면 — 그냥 통과
    if (ch.kind === 'pair') {
      const rn = ch.name.split(PAIR_SEP)[0], sn = ch.name.split(PAIR_SEP)[1];
      const rv = ch.v.split(PAIR_SEP)[0], sv = ch.v.split(PAIR_SEP)[1];
      await c.act(() => c.run(P.pickRadio, rn, rv), 1500);
      return (await c.act(() => c.run(P.pickSelect, sn, sv), 1500)).result;
    }
    const fn = ch.kind === 'radio'
      ? () => c.run(P.pickRadio, ch.name, ch.v)
      : () => c.run(P.pickSelect, ch.name, ch.v);
    return (await c.act(fn, 1500)).result;
  }

  const clickNext = () => c.act(() => c.run(P.clickBtn, ['다음', 'next']), 3000);

  // 화면을 넘깁니다. crawl.js 의 next() 와 같은 순서 — 다음 먼저, 그다음 채우기.
  async function next(u) {
    const r = await clickNext();
    if (r.result === 'NOTFOUND') return false;
    let now = await url();
    if (now !== u) return now;

    let touched = false;
    const gg = await c.run(P.radioGroups);
    for (const nm of Object.keys(gg)) {
      if (gg[nm].some((o) => o.c)) continue;
      await c.act(() => c.run(P.pickRadio, nm, gg[nm][0].v), 1500);
      touched = true;
    }
    if (touched) { await clickNext(); now = await url(); if (now !== u) return now; }

    const f = await c.act(() => c.run(P.fillBlanks), 1200);
    let picked = false;
    if (!(f.result || []).length) {
      for (const s of await c.run(P.selectInfo)) {
        if (s.opts.length > 1 && s.idx <= 0) {
          await c.act(() => c.run(P.pickSelect, s.name, s.opts[1].v), 1200);
          picked = true;
        }
      }
    }
    if ((f.result || []).length || picked) {
      await clickNext(); now = await url(); if (now !== u) return now;
    }

    const cleared = await c.act(() => c.run(function () {
      var n = 0;
      var ins = document.querySelectorAll('input[type=text],input[type=number]');
      for (var i = 0; i < ins.length; i++) {
        var e = ins[i];
        if (e.offsetParent === null || !e.value) continue;
        if (String(e.name || e.id || '').toLowerCase().indexOf('usernote') >= 0) continue;
        e.value = '';
        e.dispatchEvent(new Event('change', { bubbles: true }));
        n++;
      }
      return n;
    }), 1200);
    if (cleared.result) { await clickNext(); now = await url(); if (now !== u) return now; }

    return false;
  }

  // prefix 를 밟아 wantUrl 까지. 이어 걸을 수 있으면 이어 걷습니다.
  async function goTo(prefix, wantUrl) {
    let common = 0;
    while (common < curPath.length && common < prefix.length
           && edgeKey(curPath[common]) === edgeKey(prefix[common])) common++;
    // 되감기(이전 버튼)는 쓰지 않습니다. 지금까지 밟은 것이 prefix 의 앞부분과
    // 완전히 같을 때만 이어 걷고, 아니면 처음부터 다시 갑니다.
    if (common < curPath.length) await reset();
    if (curPath.length === prefix.length && (await url()) === wantUrl) return;

    for (let k = curPath.length; k < prefix.length; k++) {
      const ch = prefix[k];
      const u = await url();
      if (ch.at && ch.at !== u) throw new Error('경로 이탈 ' + u.split('/').pop());
      const ap = await applyChoice(ch);
      if (ap === 'DISABLED') {
        throw new Error('선택 불가 @' + u.split('/').pop() + ' ' + ch.v);
      }
      const nu = await next(u);
      if (!nu) throw new Error('막힘 @' + u.split('/').pop());
      curPath = prefix.slice(0, k + 1);
    }
    const at = await url();
    if (at !== wantUrl) throw new Error('도착 불일치 ' + at.split('/').pop());
  }

  let done = 0, fail = 0;
  const total = Math.min(MAX, todo.length);
  try {
    await reset();
    for (const key of todo.slice(0, MAX)) {
      const at = key.split('@')[0];
      const ctx = key.split('@')[1] || '';
      log('\n[' + (done + fail + 1) + '/' + total + '] 깊이 ' + pairs[key].length
        + '  ' + at.split('/').pop() + (ctx ? '  @' + ctx : ''));
      try {
        await goTo(pairs[key], at);
        const q = await c.run(questionText);
        const gg = await c.run(P.radioGroups);
        const ss = await c.run(P.selectInfo);
        out[key] = { at, ctx, q, radios: gg, selects: ss };
        done++;
        const n = Object.values(gg).reduce((a, g) => a + g.length, 0);
        log('  라디오 문구 ' + n + '개, 드롭다운 ' + ss.length + '개');
        save();
      } catch (err) {
        fail++;
        log('  실패: ' + err.message);
        try { await reset(); } catch (e2) { log('  되돌리기 실패: ' + e2.message); break; }
      }
    }
  } finally {
    save();
    log('\n=== 끝. 성공 ' + done + ', 실패 ' + fail
      + ', 누적 ' + Object.keys(out).length + '/' + Object.keys(pairs).length + ' ===');
    c.close();
  }
})();
