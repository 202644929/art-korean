# -*- coding: utf-8 -*-
"""모은 것을 한 페이지로 묶습니다.

입력  flow/one.json, flow/one.mmd, flow/flow_*.mmd, flow/flow.csv
출력  flow/art-flow.html   (Artifact 로 올릴 파일)

  python flow_page.py
"""
import io
import os
import re
import csv
import json
import glob

HERE = os.path.dirname(os.path.abspath(__file__))
OUTDIR = os.path.join(HERE, 'flow')
OUT = os.path.join(OUTDIR, 'art-flow.html')

# 제품 유형 상세 그림을 보여 줄 순서. ART 가 잠가 둔 셋은 파일이 없습니다.
DETAIL_ORDER = ['분말·과립', '액체내분말', '고체물체', '페이스트·슬러리', '액체', '공통']

ART_QUOTE = ('ART는 현재 흡입성 분진·증기·미스트만 평가하도록 보정되어 있습니다. '
             '다만 적절한 보정 데이터가 없어, 흄·섬유·가스 및 고온 금속 공정의 '
             '배출로 생기는 분진은 당분간 평가할 수 없습니다.')

CSS = """
:root {
  --paper: #FBFAF6;
  --panel: #F4F1E9;
  --ink: #191D21;
  --muted: #6D675C;
  --rule: #DEDAD0;
  --accent: #2C5C4C;
  --accent-soft: #E5EDE8;
  --flag: #8C5624;
  --flag-soft: #F3E7DA;
  --n-entry: #4A5A63;
  --n-spine: #2C5C4C;
  --n-branch: #3A5A78;
  --n-far: #6A4A7A;
  --n-end: #3A3F45;
  --n-stub: #8C5624;
  --n-wire: #9AA6A0;
  --n-grid: #EAE6DC;
  --shadow: 0 1px 2px rgba(25, 29, 33, .06);
  --serif: "Hahmlet", "Nanum Myeongjo", Georgia, serif;
  --sans: "IBM Plex Sans KR", "Malgun Gothic", system-ui, sans-serif;
  --mono: "IBM Plex Mono", "Nanum Gothic Coding", ui-monospace, monospace;
}
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --paper: #13161A;
    --panel: #1A1E23;
    --ink: #E9E6DF;
    --muted: #98928A;
    --rule: #2A2F36;
    --accent: #79B49B;
    --accent-soft: #1B2A25;
    --flag: #C8955F;
    --flag-soft: #2A2118;
  --n-entry: #7A8C95;
  --n-spine: #79B49B;
  --n-branch: #7FA6C9;
  --n-far: #B394C9;
  --n-end: #9AA0A8;
  --n-stub: #C8955F;
  --n-wire: #4A5259;
  --n-grid: #1E232A;
    --shadow: 0 1px 2px rgba(0, 0, 0, .4);
  }
}
:root[data-theme="dark"] {
  --paper: #13161A;
  --panel: #1A1E23;
  --ink: #E9E6DF;
  --muted: #98928A;
  --rule: #2A2F36;
  --accent: #79B49B;
  --accent-soft: #1B2A25;
  --flag: #C8955F;
  --flag-soft: #2A2118;
  --n-entry: #7A8C95;
  --n-spine: #79B49B;
  --n-branch: #7FA6C9;
  --n-far: #B394C9;
  --n-end: #9AA0A8;
  --n-stub: #C8955F;
  --n-wire: #4A5259;
  --n-grid: #1E232A;
  --shadow: 0 1px 2px rgba(0, 0, 0, .4);
}

* { box-sizing: border-box; }
body {
  margin: 0;
  background: var(--paper);
  color: var(--ink);
  font-family: var(--sans);
  font-weight: 300;
  font-size: 16px;
  line-height: 1.7;
  -webkit-font-smoothing: antialiased;
}
a { color: var(--accent); text-decoration-thickness: 1px; text-underline-offset: 3px; }
a:focus-visible, button:focus-visible, input:focus-visible, select:focus-visible,
summary:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }

.shell {
  display: grid;
  grid-template-columns: 13rem minmax(0, 1fr);
  gap: 3rem;
  max-width: 78rem;
  margin: 0 auto;
  padding: 3.5rem 2rem 6rem;
}

/* 왼쪽 눈금 — 흐름의 척추를 닮게 */
.rail { position: sticky; top: 3.5rem; align-self: start;
        font-size: .78rem; letter-spacing: .04em; }
.rail-title { font-size: .7rem; font-weight: 500; letter-spacing: .1em;
              color: var(--muted); margin-bottom: .9rem; }
.rail ol { list-style: none; margin: 0; padding: 0;
           border-left: 1px solid var(--rule); }
.rail li { position: relative; }
.rail a { display: block; padding: .42rem 0 .42rem 1rem; color: var(--muted);
          text-decoration: none; border-left: 2px solid transparent;
          margin-left: -1px; transition: color .15s, border-color .15s; }
.rail a::before { content: ""; position: absolute; left: -1px; top: 50%;
                  width: .5rem; height: 1px; background: var(--rule); }
.rail a:hover { color: var(--ink); }
.rail a.on { color: var(--accent); border-left-color: var(--accent); font-weight: 500; }

main { min-width: 0; }

/* 머리 */
.masthead { border-bottom: 1px solid var(--rule); padding-bottom: 2rem;
            margin-bottom: 3rem; }
.eyebrow { font-size: .76rem; font-weight: 500; letter-spacing: .08em;
           color: var(--accent); margin: 0 0 1rem; }
h1 { font-family: var(--serif); font-weight: 700; font-size: clamp(2.1rem, 5vw, 3.2rem);
     line-height: 1.14; letter-spacing: -.015em; margin: 0 0 1rem;
     text-wrap: balance; }
.standfirst { font-size: 1.06rem; color: var(--muted); max-width: 40ch;
              margin: 0 0 2rem; }

.stats { display: flex; flex-wrap: wrap; gap: 0; border: 1px solid var(--rule);
         border-radius: 2px; overflow: hidden; background: var(--panel); }
.stat { flex: 1 1 7rem; padding: .85rem 1rem; border-right: 1px solid var(--rule); }
.stat:last-child { border-right: 0; }
.stat b { display: block; font-family: var(--mono); font-size: 1.35rem;
          font-weight: 500; font-variant-numeric: tabular-nums; line-height: 1.2; }
.stat span { font-size: .72rem; letter-spacing: .04em; color: var(--muted); }

section { margin: 0 0 4rem; scroll-margin-top: 2rem; }
h2 { font-family: var(--serif); font-weight: 600; font-size: 1.7rem;
     letter-spacing: -.01em; margin: 0 0 .5rem; text-wrap: balance; }
h2 .num { font-family: var(--mono); font-size: .8rem; font-weight: 400;
          color: var(--accent); letter-spacing: .1em; display: block;
          margin-bottom: .35rem; }
h3 { font-family: var(--sans); font-weight: 600; font-size: 1rem; margin: 0 0 .4rem; }
.lede { color: var(--muted); max-width: 62ch; margin: 0 0 1.6rem; }
p { max-width: 64ch; }

/* 그림 틀 */
.viewer { display: flex; flex-direction: column; gap: .5rem; }
/* 틀은 내용 높이에 맞춰 늘어납니다. max-height 를 주면 페이지 안에 스크롤이
   하나 더 생기고, 그림보다 틀이 커서 빈 공간이 남습니다. 세로 스크롤은 페이지
   하나만 씁니다. 가로는 확대했을 때만 (.wide) 생깁니다. */
.frame { border: 1px solid var(--rule); border-radius: 2px; background: var(--panel);
         overflow: hidden; padding: 1.4rem; box-shadow: var(--shadow); }
.frame.wide { overflow-x: auto; overflow-y: hidden; }
.frame pre.mermaid { margin: 0; background: none; display: inline-block;
                     transform-origin: top left; }
/* mermaid 가 SVG 에 max-width:100% 를 붙이면 넓은 그림이 줄어들어 글씨를 못
   읽습니다. 원본의 useMaxWidth:false 와 짝으로 여기서도 풀어 둡니다. */
.frame pre.mermaid svg { max-width: none !important; }
.frame.wide pre.mermaid { cursor: grab; }

.zoombar { display: flex; align-items: center; gap: .3rem; flex-wrap: wrap; }
.zoombar button { font-family: var(--sans); font-size: .82rem; line-height: 1;
                  padding: .38rem .6rem; min-width: 2.1rem; cursor: pointer;
                  border: 1px solid var(--rule); border-radius: 2px;
                  background: var(--paper); color: var(--ink); }
.zoombar button:hover { border-color: var(--accent); color: var(--accent); }
.zoombar button.txt { font-size: .76rem; }
.zoombar .zval { font-size: .78rem; color: var(--muted); min-width: 3.2rem;
                 text-align: center; font-variant-numeric: tabular-nums; }

.viewer.full { position: fixed; inset: 0; z-index: 60; background: var(--paper);
               padding: 1rem; gap: .6rem; }
.viewer.full .frame { flex: 1; overflow: auto; min-height: 0; }
body.locked-scroll { overflow: hidden; }
.caption { font-size: .8rem; color: var(--muted); margin: .7rem 0 0; }

/* 척추 목록 — 실제 순서가 있으므로 번호가 정보입니다 */
.spine { list-style: none; margin: 0; padding: 0; counter-reset: sp; }
.spine li { counter-increment: sp; display: grid;
            grid-template-columns: 2.4rem minmax(0, 1fr); gap: 1rem;
            padding: .7rem 0; border-top: 1px solid var(--rule); align-items: baseline; }
.spine li:last-child { border-bottom: 1px solid var(--rule); }
.spine li::before { content: counter(sp, decimal-leading-zero);
                    font-family: var(--mono); font-size: .8rem; color: var(--accent);
                    font-variant-numeric: tabular-nums; }
.spine .q { font-size: .96rem; }
.spine .id { font-family: var(--mono); font-size: .7rem; color: var(--muted);
             display: block; word-break: break-all; }

/* 묶음 카드 */
.cards { display: grid; gap: 1rem;
         grid-template-columns: repeat(auto-fill, minmax(16rem, 1fr)); }
.card { border: 1px solid var(--rule); border-radius: 2px; background: var(--panel);
        padding: 1.05rem 1.15rem; box-shadow: var(--shadow); }
.card h3 { font-size: .95rem; line-height: 1.4; }
.card .count { font-size: .74rem; color: var(--accent); font-weight: 500;
               font-variant-numeric: tabular-nums; }
.card ul { margin: .6rem 0 0; padding-left: 1.05rem; font-size: .86rem;
           color: var(--muted); line-height: 1.55; }
.card ul li { margin-bottom: .25rem; }
.chips { display: flex; flex-wrap: wrap; gap: .3rem; margin-top: .7rem; }
.chip { font-size: .68rem; letter-spacing: .03em; padding: .12rem .45rem;
        border: 1px solid var(--rule); border-radius: 999px; color: var(--muted); }

/* 잠긴 것 */
.locked { border: 1px solid var(--flag); border-radius: 2px;
          background: var(--flag-soft); padding: 1.3rem 1.5rem; }
.locked h3 { color: var(--flag); }
blockquote { margin: .8rem 0 0; padding-left: 1rem;
             border-left: 2px solid var(--flag); font-family: var(--serif);
             font-size: 1rem; line-height: 1.6; max-width: 60ch; }
.locked-list { display: flex; flex-wrap: wrap; gap: .5rem; margin: 1rem 0 0;
               padding: 0; list-style: none; }
.locked-list li { font-size: .8rem; color: var(--flag); font-weight: 500;
                  border: 1px solid var(--flag); border-radius: 2px;
                  padding: .18rem .5rem; }

details { border-top: 1px solid var(--rule); }
details:last-of-type { border-bottom: 1px solid var(--rule); }
summary { cursor: pointer; padding: .85rem .2rem; font-weight: 500;
          display: flex; align-items: baseline; gap: .7rem; list-style: none; }
summary::-webkit-details-marker { display: none; }
summary::before { content: "+"; font-family: var(--mono); color: var(--accent);
                  width: 1rem; }
details[open] > summary::before { content: "\\2212"; }
summary .meta { font-size: .76rem; color: var(--muted);
                margin-left: auto; font-variant-numeric: tabular-nums; }
details .body { padding: 0 0 1.4rem; }

/* 표 */
.controls { display: flex; flex-wrap: wrap; gap: .6rem; align-items: center;
            margin-bottom: 1rem; }
.controls input, .controls select {
  font-family: var(--sans); font-size: .86rem; padding: .45rem .6rem;
  border: 1px solid var(--rule); border-radius: 2px;
  background: var(--paper); color: var(--ink);
}
.controls input { flex: 1 1 14rem; min-width: 9rem; }
.hits { font-size: .78rem; color: var(--muted);
        font-variant-numeric: tabular-nums; }
.tablewrap { border: 1px solid var(--rule); border-radius: 2px; overflow-x: auto;
             max-height: 32rem; overflow-y: auto; }
table { border-collapse: collapse; width: 100%; font-size: .82rem; }
thead th { position: sticky; top: 0; background: var(--panel); text-align: left;
           font-weight: 500; font-size: .72rem; letter-spacing: .05em;
           text-transform: uppercase; color: var(--muted);
           padding: .6rem .7rem; border-bottom: 1px solid var(--rule);
           white-space: nowrap; }
tbody td { padding: .5rem .7rem; border-bottom: 1px solid var(--rule);
           vertical-align: top; }
tbody tr:hover { background: var(--accent-soft); }
td.scr, td.next { font-family: var(--mono); font-size: .72rem; color: var(--muted);
                  word-break: break-all; max-width: 12rem; }
td.note { color: var(--flag); font-size: .74rem; white-space: nowrap; }
.pt { white-space: nowrap; font-size: .76rem; }

.note-block { border-left: 2px solid var(--rule); padding-left: 1.1rem;
              color: var(--muted); font-size: .9rem; }
.note-block h3 { color: var(--ink); }
.note-block ul { padding-left: 1.1rem; }
footer { border-top: 1px solid var(--rule); margin-top: 4rem; padding-top: 1.5rem;
         font-size: .8rem; color: var(--muted);
         font-variant-numeric: tabular-nums; }


/* ── 노드 그래프 ────────────────────────────────────────────────────────
   비주얼 스크립팅 편집기 모양. 칸 = 질문 화면, 줄 = 답 하나, 줄 오른쪽 점이
   그 답의 출력 핀입니다. 핀에서 다음 칸의 입력 핀으로 선이 이어집니다.
   좌표는 flow_nodes.py 가 미리 계산합니다 (브라우저 줄바꿈에 안 맡깁니다). */
.ntabs { display: flex; flex-wrap: wrap; gap: .35rem; margin-bottom: .6rem; }
.ntabs button { font-family: var(--sans); font-size: .8rem; padding: .4rem .7rem;
                cursor: pointer; border: 1px solid var(--rule); border-radius: 2px;
                background: var(--paper); color: var(--muted); }
.ntabs button:hover { color: var(--ink); }
.ntabs button[aria-selected="true"] { background: var(--accent-soft);
                border-color: var(--accent); color: var(--accent); font-weight: 500; }

.nview { border: 1px solid var(--rule); border-radius: 2px; overflow: hidden;
         background: var(--panel);
         background-image: radial-gradient(var(--n-grid) 1px, transparent 1px);
         background-size: 22px 22px; box-shadow: var(--shadow); }
.nview.pan { overflow: auto; max-height: 78vh; cursor: grab; }
.nview.pan.grabbing { cursor: grabbing; }
.nsize { position: relative; }
.ncanvas { position: absolute; top: 0; left: 0; transform-origin: 0 0; }
.nwires { position: absolute; top: 0; left: 0; overflow: visible; pointer-events: none; }
.nwires path { fill: none; stroke: var(--n-wire); stroke-width: 1.6; opacity: .85; }

/* overflow:hidden 을 주면 안 됩니다 — 칸 밖으로 4px 나오는 핀이 잘립니다.
   머리의 둥근 모서리는 .nhead 에 직접 줍니다. */
.nnode { position: absolute; border-radius: 5px;
         background: var(--paper); border: 1px solid var(--rule);
         box-shadow: 0 2px 5px rgba(0,0,0,.13); }
.nhead { color: #fff; font-weight: 500; word-break: keep-all;
         border-radius: 4px 4px 0 0; }
.nnode[data-kind="entry"] .nhead { background: var(--n-entry); }
.nnode[data-kind="spine"] .nhead { background: var(--n-spine); }
.nnode[data-kind="branch"] .nhead { background: var(--n-branch); }
.nnode[data-kind="far"] .nhead { background: var(--n-far); }
.nnode[data-kind="end"] .nhead { background: var(--n-end); }
.nnode[data-kind="stub"] .nhead { background: var(--n-stub); }
.nbadge { float: right; margin-left: 6px; font-size: 9.5px; line-height: 13px;
          padding: 0 5px; border-radius: 7px; background: rgba(255,255,255,.26); }
.nrows { padding: 4px 0 6px; }
/* 줄 높이가 화면 폭에 따라 달라지므로 핀 점 위치를 --rh 로 계산합니다.
   고정값(8.5px)으로 두면 작은 칸에서 점이 줄 밖으로 밀립니다. */
.nrow { position: relative; color: var(--muted); padding: 0 15px 0 9px;
        white-space: nowrap; overflow: visible; text-overflow: ellipsis; }
.nrow > span { display: block; overflow: hidden; text-overflow: ellipsis; }
.nrow::after { content: ""; position: absolute; right: -4px;
               top: calc((var(--rh, 23px) - 7px) / 2);
               width: 7px; height: 7px; border-radius: 50%;
               background: var(--paper); border: 1.6px solid var(--n-wire); }
.nin { position: absolute; left: -4px; width: 7px; height: 7px; border-radius: 50%;
       background: var(--paper); border: 1.6px solid var(--n-wire); }
.nscreen { font-size: 9.5px; color: var(--muted); padding: 0 10px 6px;
           font-family: var(--mono); word-break: break-all; opacity: .75; }

/* 눌렀을 때 이어진 곳만 남기고 나머지를 흐리게 합니다. */
.nnode { cursor: pointer; }
.nnode:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
.nview.sel .nwires path { opacity: .09; }
.nview.sel .nwires path.hot { opacity: 1; stroke: var(--accent); stroke-width: 2.4; }
.nview.sel .nnode { opacity: .28; }
.nview.sel .nnode.hot { opacity: 1;
  box-shadow: 0 0 0 2px var(--accent), 0 3px 10px rgba(0,0,0,.22); }
.nrow.hot { color: var(--accent); font-weight: 500; }
.nrow.hot::after { background: var(--accent); border-color: var(--accent); }

.nsel { font-size: .82rem; color: var(--muted); margin: .1rem 0 .55rem;
        min-height: 1.5em; display: flex; flex-wrap: wrap; gap: .3rem .6rem;
        align-items: baseline; }
.nsel b { color: var(--ink); font-weight: 500; }
.nsel .to { color: var(--accent); }
.nsel button { font-family: var(--sans); font-size: .74rem; padding: .18rem .5rem;
               cursor: pointer; border: 1px solid var(--rule); border-radius: 2px;
               background: var(--paper); color: var(--muted); }

.nlegend { display: flex; flex-wrap: wrap; gap: .5rem .9rem; margin: .7rem 0 0;
           font-size: .76rem; color: var(--muted); }
.nlegend span { display: inline-flex; align-items: center; gap: .35rem; }
.nlegend i { width: 11px; height: 11px; border-radius: 2px; display: inline-block; }

@media (prefers-reduced-motion: reduce) {
  * { transition: none !important; animation: none !important; }
}

/* ── 반응형은 반드시 맨 끝에 ────────────────────────────────────────────
   앞에 두면 뒤에 오는 같은 특이도의 규칙에 덮입니다. 실제로 그렇게 해서
   좁은 화면에서 목차가 sticky 로 남아 본문 위에 겹쳐 떴습니다. */
@media (max-width: 60rem) {
  .shell { grid-template-columns: minmax(0, 1fr); gap: 1.6rem;
           padding: 2rem 1.1rem 4rem; }
  /* 목차는 가로로 눕힙니다. 세로로 두면 본문이 한참 밀립니다. */
  .rail { position: static; top: auto; border: 1px solid var(--rule);
          border-radius: 2px; background: var(--panel); padding: .8rem 1rem; }
  .rail ol { display: flex; flex-wrap: wrap; gap: .15rem .4rem; border-left: 0; }
  .rail a { padding: .2rem .55rem; border-left: 0; border: 1px solid var(--rule);
            border-radius: 999px; font-size: .74rem; }
  .rail a::before { display: none; }
  .rail a.on { border-color: var(--accent); background: var(--accent-soft); }
  .frame { padding: .9rem; }
  .zoombar button.txt { font-size: .72rem; padding: .34rem .5rem; }
  .nview.pan { max-height: 70vh; }
  .ntabs button { font-size: .74rem; padding: .34rem .55rem; }
  h1 { font-size: clamp(1.8rem, 8vw, 2.4rem); }
  .stat { flex-basis: 5.5rem; padding: .7rem .8rem; }
  .stat b { font-size: 1.15rem; }
}
@media (max-width: 34rem) {
  .cards { grid-template-columns: minmax(0, 1fr); }
  .spine li { grid-template-columns: 1.9rem minmax(0, 1fr); gap: .7rem; }
  td.scr, td.next { max-width: 7rem; }
}
"""

JS = r"""
(function () {
  // 왼쪽 눈금이 지금 읽는 자리를 표시합니다.
  var links = Array.prototype.slice.call(document.querySelectorAll('.rail a'));
  var secs = links.map(function (a) {
    return document.querySelector(a.getAttribute('href'));
  });
  function mark() {
    var best = 0, y = window.scrollY + 140;
    for (var i = 0; i < secs.length; i++) {
      if (secs[i] && secs[i].offsetTop <= y) best = i;
    }
    links.forEach(function (a, i) { a.classList.toggle('on', i === best); });
  }
  window.addEventListener('scroll', mark, { passive: true });
  mark();

  // 표 걸러 보기
  var q = document.getElementById('q');
  var pt = document.getElementById('pt');
  var hits = document.getElementById('hits');
  var rows = Array.prototype.slice.call(
    document.querySelectorAll('#flowtable tbody tr'));
  function run() {
    var needle = (q.value || '').trim().toLowerCase();
    var want = pt.value;
    var n = 0;
    rows.forEach(function (tr) {
      var okPt = !want || tr.dataset.pt === want;
      var okQ = !needle || tr.dataset.hay.indexOf(needle) !== -1;
      var show = okPt && okQ;
      tr.hidden = !show;
      if (show) n++;
    });
    hits.textContent = n + ' / ' + rows.length + ' 행';
  }
  q.addEventListener('input', run);
  pt.addEventListener('change', run);
  run();

  // ── 그림 확대 ───────────────────────────────────────────────────────────
  // 부모에 zoom 을 걸면 안 됩니다. mermaid 가 SVG 에 width:100% 를 붙여 두기
  // 때문에, 부모를 확대하면 SVG 도 같은 비율로 줄어 결과가 상쇄됩니다
  // (배율 표시만 바뀌고 그림은 그대로였습니다).
  // SVG 자체의 width/height 를 픽셀로 직접 지정합니다. 인라인 !important 는
  // 호스트 스타일시트의 !important 보다 우선합니다.
  var STEPS = [25, 33, 50, 67, 80, 100, 125, 150, 200, 300, 400, 600];

  // SVG 는 pre 안에 들어갈 수도, 옆에 붙을 수도 있습니다. viewer 전체에서 찾습니다.
  function svgOf(v) { return v.querySelector('svg'); }

  function intrinsic(svg) {
    var vb = (svg.getAttribute('viewBox') || '').trim().split(/[\s,]+/);
    if (vb.length === 4 && +vb[2] > 0 && +vb[3] > 0) {
      return { w: +vb[2], h: +vb[3] };
    }
    var r = svg.getBoundingClientRect();
    return { w: r.width || 800, h: r.height || 600 };
  }

  function apply(v, pct) {
    var svg = svgOf(v);
    if (!svg) return;
    var n = intrinsic(svg);
    svg.style.setProperty('max-width', 'none', 'important');
    svg.style.setProperty('width', Math.round(n.w * pct / 100) + 'px', 'important');
    svg.style.setProperty('height', Math.round(n.h * pct / 100) + 'px', 'important');
    svg.style.setProperty('display', 'block', 'important');
    // 틀보다 넓을 때만 가로 스크롤을 켭니다.
    var frame = v.querySelector('.frame');
    if (frame && !v.classList.contains('full')) {
      frame.classList.toggle('wide',
        Math.round(n.w * pct / 100) > frame.clientWidth - 40);
    }
    v.dataset.pct = pct;
    var out = v.querySelector('.zval');
    if (out) out.textContent = Math.round(pct) + '%';
  }

  function pctOf(v) { return Number(v.dataset.pct || 100); }

  function step(pct, dir) {
    var i;
    if (dir > 0) {
      for (i = 0; i < STEPS.length; i++) if (STEPS[i] > pct + 0.5) return STEPS[i];
      return STEPS[STEPS.length - 1];
    }
    for (i = STEPS.length - 1; i >= 0; i--) if (STEPS[i] < pct - 0.5) return STEPS[i];
    return STEPS[0];
  }

  // 틀 안에 그림 전체가 들어오는 배율
  function fit(v) {
    var svg = svgOf(v);
    var frame = v.querySelector('.frame');
    if (!svg || !frame) return;
    var n = intrinsic(svg);
    var room = frame.clientWidth - 40;
    if (room <= 0 || !n.w) return;
    apply(v, Math.max(8, Math.min(400, room / n.w * 100)));
  }

  function drawn(v) { return !!svgOf(v); }

  document.querySelectorAll('.viewer').forEach(function (v) {
    v.querySelectorAll('.zoombar button').forEach(function (b) {
      b.addEventListener('click', function () {
        if (b.hasAttribute('data-full')) {
          var on = v.classList.toggle('full');
          document.body.classList.toggle('locked-scroll', on);
          b.textContent = on ? '닫기' : '크게 보기';
          requestAnimationFrame(function () { fit(v); });
          return;
        }
        if (!drawn(v)) return;
        var k = b.dataset.z;
        if (k === 'reset') apply(v, 100);
        else if (k === 'fit') fit(v);
        else apply(v, step(pctOf(v), k === 'in' ? 1 : -1));
      });
    });

    var frame = v.querySelector('.frame');

    // 두 번 누르면 폭 맞추기 ↔ 원래 크기
    frame.addEventListener('dblclick', function () {
      if (Math.abs(pctOf(v) - 100) < 1) fit(v); else apply(v, 100);
    });

    // Ctrl+휠 로도 확대
    frame.addEventListener('wheel', function (e) {
      if (!e.ctrlKey || !drawn(v)) return;
      e.preventDefault();
      apply(v, step(pctOf(v), e.deltaY < 0 ? 1 : -1));
    }, { passive: false });

    // 끌어서 움직이기.
    // 틀은 세로로 스크롤하지 않습니다(겹친 스크롤을 없앴기 때문에). 그래서
    // 세로로 끌면 **페이지**를 움직입니다. 그러면 확대한 상태에서도 위아래를
    // 다 볼 수 있습니다. 크게 보기 상태에서는 틀 자체가 세로로 스크롤합니다.
    var drag = null;
    var page = function () {
      return document.scrollingElement || document.documentElement;
    };
    frame.addEventListener('pointerdown', function (e) {
      if (e.target.closest('button, a, input, select')) return;
      drag = { x: e.clientX, y: e.clientY,
               l: frame.scrollLeft, t: frame.scrollTop,
               p: page().scrollTop, id: e.pointerId };
      frame.style.cursor = 'grabbing';
      frame.style.userSelect = 'none';
      // 포인터를 가둬 두면 틀 밖으로 나가도 계속 끌립니다.
      try { frame.setPointerCapture(e.pointerId); } catch (err) { /* 무시 */ }
    });
    frame.addEventListener('pointermove', function (e) {
      if (!drag) return;
      var dx = e.clientX - drag.x;
      var dy = e.clientY - drag.y;
      frame.scrollLeft = drag.l - dx;
      if (frame.scrollHeight - frame.clientHeight > 1) {
        frame.scrollTop = drag.t - dy;      // 크게 보기 — 틀이 스크롤됨
      } else {
        page().scrollTop = drag.p - dy;     // 보통 — 페이지가 움직임
      }
    });
    function endDrag(e) {
      if (!drag) return;
      try { frame.releasePointerCapture(drag.id); } catch (err) { /* 무시 */ }
      drag = null;
      frame.style.cursor = '';
      frame.style.userSelect = '';
    }
    frame.addEventListener('pointerup', endDrag);
    frame.addEventListener('pointercancel', endDrag);
  });

  // Esc 로 크게 보기 닫기
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    var v = document.querySelector('.viewer.full');
    if (!v) return;
    v.classList.remove('full');
    document.body.classList.remove('locked-scroll');
    var b = v.querySelector('[data-full]');
    if (b) b.textContent = '크게 보기';
    fit(v);
  });

  // mermaid 가 그리는 시점을 알 수 없으니, 그려진 것만 차례로 폭에 맞춥니다.
  var tries = 0;
  var timer = setInterval(function () {
    var all = Array.prototype.slice.call(document.querySelectorAll('.viewer'));
    var left = 0;
    all.forEach(function (v) {
      if (!drawn(v)) { left++; return; }
      if (v.dataset.pct) return;         // 이미 맞춘 것
      fit(v);
    });
    if (!left || ++tries > 60) clearInterval(timer);
  }, 250);

  // ── 노드 그래프 ─────────────────────────────────────────────────────────
  // 배치를 여기서 계산합니다 (반응형). 파이썬은 '무엇이 무엇과 이어지는가' 만
  // 냅니다. 칸 폭·글자 줄 수를 화면 폭에 맞춰 바꾸고, 창 크기가 변하면 다시
  // 배치합니다.
  //
  // 열(가로 칸)은 '질문의 깊이' 를 뜻합니다. 좁다고 열을 접어 흘리면 흐름이
  // 깨지므로 접지 않습니다. 대신 칸을 작게 만들고 확대/이동으로 봅니다.
  var G = window.__ART_NODES__ || {};
  var names = Object.keys(G);
  if (names.length) {
    var tabs = document.getElementById('ntabs');
    var view = document.getElementById('nview');
    var size = document.getElementById('nsize');
    var canvas = document.getElementById('ncanvas');
    var wires = document.getElementById('nwires');
    var layer = document.getElementById('nlayer');
    var zout = document.getElementById('nzval');
    var cur = names[0];
    var z = 1;
    var laid = null;          // 지금 배치된 결과

    function esc(t) {
      return String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;')
        .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    // 글자 폭 실측. 짐작으로 줄 수를 세면 칸 높이가 어긋나 선이 엉뚱한 곳에
    // 붙습니다. 캔버스로 재면 정확합니다.
    var mctx = document.createElement('canvas').getContext('2d');
    function widthOf(text, font) {
      mctx.font = font;
      return mctx.measureText(text).width;
    }
    // 한글은 단어 경계가 없으니 글자 단위로 접습니다.
    function lineCount(text, font, room, max) {
      mctx.font = font;
      var lines = 1, w = 0;
      for (var i = 0; i < text.length; i++) {
        var cw = mctx.measureText(text[i]).width;
        if (w + cw > room) {
          lines++;
          w = cw;
          if (lines >= max) return max;
        } else {
          w += cw;
        }
      }
      return lines;
    }

    // 화면 폭에 따른 칸 크기
    function metrics(room) {
      if (room < 420) {
        return { W: 158, FS: 10, LH: 14, ROW: 19, RFS: 9.5, PAD: 7,
                 CGAP: 46, RGAP: 15, M: 18, MAXL: 4, screen: false };
      }
      if (room < 760) {
        return { W: 196, FS: 10.5, LH: 15, ROW: 21, RFS: 10, PAD: 8,
                 CGAP: 64, RGAP: 19, M: 28, MAXL: 3, screen: false };
      }
      if (room < 1200) {
        return { W: 228, FS: 11, LH: 16, ROW: 22, RFS: 10.5, PAD: 8,
                 CGAP: 80, RGAP: 22, M: 36, MAXL: 3, screen: true };
      }
      return { W: 252, FS: 11.5, LH: 17, ROW: 23, RFS: 11, PAD: 9,
               CGAP: 92, RGAP: 24, M: 44, MAXL: 3, screen: true };
    }

    function layout(name, room) {
      var g = G[name];
      var m = metrics(room);
      var headFont = '500 ' + m.FS + 'px "IBM Plex Sans KR", sans-serif';
      var byId = {};
      var nodes = g.nodes.map(function (n) {
        var lines = lineCount(n.title, headFont, m.W - m.PAD * 2 - 4, m.MAXL);
        var head = m.PAD * 2 + lines * m.LH;
        var h = head + (n.ports.length ? 4 + n.ports.length * m.ROW + 6 : 0)
              + (m.screen && n.screen ? 14 : 0);
        var o = { id: n.id, title: n.title, kind: n.kind, branch: n.branch,
                  screen: m.screen ? n.screen : '', ports: n.ports,
                  head: head, h: h, w: m.W };
        byId[n.id] = o;
        return o;
      });

      var succ = {}, pred = {};
      nodes.forEach(function (n) { succ[n.id] = []; pred[n.id] = []; });
      g.edges.forEach(function (e) {
        if (byId[e.f] && byId[e.t]) {
          succ[e.f].push(e.t);
          pred[e.t].push(e.f);
        }
      });

      // 깊이 = 시작에서의 최장 거리
      var depth = {};
      nodes.forEach(function (n) { depth[n.id] = 0; });
      for (var it = 0; it <= nodes.length; it++) {
        var moved = false;
        for (var i = 0; i < nodes.length; i++) {
          var id = nodes[i].id;
          for (var k = 0; k < succ[id].length; k++) {
            var t = succ[id][k];
            if (depth[t] < depth[id] + 1) { depth[t] = depth[id] + 1; moved = true; }
          }
        }
        if (!moved) break;
      }

      var cols = {};
      nodes.forEach(function (n) {
        (cols[depth[n.id]] = cols[depth[n.id]] || []).push(n);
      });
      var keys = Object.keys(cols).map(Number).sort(function (a, b) { return a - b; });

      // 같은 열 안 순서: 들어오는 선의 평균 위치로 맞춰 꼬임을 줄입니다
      var order = {};
      keys.forEach(function (c) {
        cols[c].forEach(function (n, i) { order[n.id] = i; });
      });
      for (var pass = 0; pass < 4; pass++) {
        for (var ci = 1; ci < keys.length; ci++) {
          var col = cols[keys[ci]];
          col.sort(function (a, b) {
            function bary(n) {
              var ps = pred[n.id].filter(function (p) { return p in order; });
              if (!ps.length) return 1e9;
              var sum = 0;
              ps.forEach(function (p) { sum += order[p]; });
              return sum / ps.length;
            }
            return bary(a) - bary(b);
          });
          col.forEach(function (n, i) { order[n.id] = i; });
        }
      }

      var x = m.M, tall = 0, colh = {};
      keys.forEach(function (c) {
        var hh = 0;
        cols[c].forEach(function (n) { hh += n.h; });
        hh += m.RGAP * (cols[c].length - 1);
        colh[c] = hh;
        if (hh > tall) tall = hh;
      });
      keys.forEach(function (c) {
        var y = m.M + (tall - colh[c]) / 2;
        cols[c].forEach(function (n) {
          n.x = x;
          n.y = y;
          y += n.h + m.RGAP;
        });
        x += m.W + m.CGAP;
      });

      // 선은 간선마다 따로 만듭니다. 하나로 합치면 개별 강조를 못 합니다.
      var wireList = [];
      g.edges.forEach(function (e) {
        var n = byId[e.f], t = byId[e.t];
        if (!n || !t) return;
        var x1 = n.x + n.w;
        var y1 = n.y + n.head + 4 + e.p * m.ROW + m.ROW / 2;
        var x2 = t.x, y2 = t.y + t.head / 2;
        var dx = x2 - x1;
        var kk = dx > 0 ? Math.max(26, Math.min(130, dx * 0.45))
                        : Math.max(60, Math.abs(dx) * 0.26 + 60);
        wireList.push({
          f: e.f, p: e.p, t: e.t,
          d: 'M' + x1.toFixed(1) + ',' + y1.toFixed(1)
             + 'C' + (x1 + kk).toFixed(1) + ',' + y1.toFixed(1)
             + ' ' + (x2 - kk).toFixed(1) + ',' + y2.toFixed(1)
             + ' ' + x2.toFixed(1) + ',' + y2.toFixed(1)
        });
      });

      return { m: m, nodes: nodes, wires: wireList, byId: byId,
               succ: succ, pred: pred,
               w: Math.round(x - m.CGAP + m.M), h: Math.round(tall + m.M * 2) };
    }

    function render() {
      var g = laid;
      canvas.style.width = g.w + 'px';
      canvas.style.height = g.h + 'px';
      wires.setAttribute('width', g.w);
      wires.setAttribute('height', g.h);
      wires.setAttribute('viewBox', '0 0 ' + g.w + ' ' + g.h);
      var wh = [];
      g.wires.forEach(function (w, i) {
        wh.push('<path data-i="' + i + '" d="' + w.d + '"></path>');
      });
      wires.innerHTML = wh.join('');

      var m = g.m;
      var h = [];
      g.nodes.forEach(function (n) {
        h.push('<div class="nnode" data-kind="' + n.kind + '" data-id="'
          + esc(n.id) + '" tabindex="0" style="left:'
          + Math.round(n.x) + 'px;top:' + Math.round(n.y) + 'px;width:'
          + n.w + 'px">');
        h.push('<div class="nin" style="top:' + (n.head / 2 - 3.5) + 'px"></div>');
        h.push('<div class="nhead" style="font-size:' + m.FS + 'px;line-height:'
          + m.LH + 'px;padding:' + m.PAD + 'px ' + (m.PAD + 1) + 'px">');
        if (n.branch) h.push('<span class="nbadge">' + esc(n.branch) + '</span>');
        h.push(esc(n.title) + '</div>');
        if (n.ports.length) {
          h.push('<div class="nrows" style="padding:4px 0 6px">');
          n.ports.forEach(function (p, pi) {
            h.push('<div class="nrow" data-p="' + pi + '" title="' + esc(p)
              + '" style="height:' + m.ROW + 'px;line-height:' + m.ROW
              + 'px;font-size:' + m.RFS + 'px;--rh:' + m.ROW + 'px"><span>'
              + esc(p) + '</span></div>');
          });
          h.push('</div>');
        }
        if (n.screen) h.push('<div class="nscreen">' + esc(n.screen) + '</div>');
        h.push('</div>');
      });
      layer.innerHTML = h.join('');
    }

    // ── 선택과 강조 ───────────────────────────────────────────────────
    var selBar = document.getElementById('nsel');
    var sel = null;              // {id, p} — p 가 null 이면 칸 전체

    // 선택자에 넣을 때 안전하게. 화면 id 에 점·괄호가 들어갈 수 있습니다.
    function cssEsc(v) {
      if (window.CSS && CSS.escape) return CSS.escape(v);
      return String(v).replace(/["\\]/g, '\$&');
    }

    function clearSel() {
      sel = null;
      view.classList.remove('sel');
      layer.querySelectorAll('.hot').forEach(function (e) {
        e.classList.remove('hot');
      });
      wires.querySelectorAll('.hot').forEach(function (e) {
        e.classList.remove('hot');
      });
      if (selBar) selBar.innerHTML = '';
    }

    function titleOf(id) {
      var n = laid.byId[id];
      return n ? n.title : id;
    }

    function select(id, p) {
      if (!laid.byId[id]) return;
      if (sel && sel.id === id && sel.p === p) { clearSel(); return; }
      clearSel();
      sel = { id: id, p: p };
      view.classList.add('sel');

      var hotNodes = {};
      hotNodes[id] = 1;
      var ins = [], outs2 = [];
      laid.wires.forEach(function (w, i) {
        var hit = false;
        if (p === null) {
          if (w.f === id) { hit = true; outs2.push(w); }
          else if (w.t === id) { hit = true; ins.push(w); }
        } else if (w.f === id && w.p === p) {
          hit = true;
          outs2.push(w);
        }
        if (hit) {
          hotNodes[w.f] = 1;
          hotNodes[w.t] = 1;
          var el = wires.querySelector('path[data-i="' + i + '"]');
          if (el) el.classList.add('hot');
        }
      });

      layer.querySelectorAll('.nnode').forEach(function (el) {
        if (hotNodes[el.dataset.id]) el.classList.add('hot');
      });
      var me = layer.querySelector('.nnode[data-id="' + cssEsc(id) + '"]');
      if (me) {
        var rows = me.querySelectorAll('.nrow');
        if (p === null) {
          outs2.forEach(function (w) {
            if (rows[w.p]) rows[w.p].classList.add('hot');
          });
        } else if (rows[p]) {
          rows[p].classList.add('hot');
        }
      }

      if (selBar) {
        var b = [];
        var n = laid.byId[id];
        if (p === null) {
          b.push('<b>' + esc(n.title) + '</b>');
          b.push('들어오는 곳 ' + ins.length + '개');
          b.push('<span class="to">나가는 곳 ' + outs2.length + '개</span>');
        } else {
          b.push('<b>' + esc(n.ports[p] || '') + '</b>');
          b.push('&rarr;');
          b.push('<span class="to">'
            + esc(outs2.length ? titleOf(outs2[0].t) : '(이어진 곳 없음)')
            + '</span>');
        }
        b.push('<button type="button" id="nselclear">해제</button>');
        selBar.innerHTML = b.join(' ');
        var cb = document.getElementById('nselclear');
        if (cb) cb.addEventListener('click', clearSel);
      }
    }

    function apply(nz) {
      z = Math.max(0.08, Math.min(3, nz));
      canvas.style.transform = 'scale(' + z + ')';
      size.style.width = Math.round(laid.w * z) + 'px';
      size.style.height = Math.round(laid.h * z) + 'px';
      zout.textContent = Math.round(z * 100) + '%';
      // 다 들어오면 안쪽 스크롤을 만들지 않습니다.
      view.classList.toggle('pan', laid.w * z > view.clientWidth + 2);
    }

    function build(name, keepZoom) {
      cur = name;
      clearSel();
      var room = view.clientWidth || 900;
      laid = layout(name, room);
      render();
      if (keepZoom) apply(z); else fitWidth();
    }

    function fitWidth() {
      var room = view.clientWidth - 4;
      apply(room > 0 ? room / laid.w : 1);
    }

    var STEPS2 = [0.08, 0.12, 0.18, 0.25, 0.35, 0.5, 0.7, 1, 1.4, 2, 3];
    function stepZ(dir) {
      var i;
      if (dir > 0) {
        for (i = 0; i < STEPS2.length; i++) if (STEPS2[i] > z + 0.005) return STEPS2[i];
        return STEPS2[STEPS2.length - 1];
      }
      for (i = STEPS2.length - 1; i >= 0; i--) if (STEPS2[i] < z - 0.005) return STEPS2[i];
      return STEPS2[0];
    }

    names.forEach(function (nm, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.textContent = nm;
      b.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
      b.addEventListener('click', function () {
        tabs.querySelectorAll('button').forEach(function (x) {
          x.setAttribute('aria-selected', 'false');
        });
        b.setAttribute('aria-selected', 'true');
        build(nm, false);
      });
      tabs.appendChild(b);
    });

    document.getElementById('nzin').addEventListener('click', function () { apply(stepZ(1)); });
    document.getElementById('nzout').addEventListener('click', function () { apply(stepZ(-1)); });
    document.getElementById('nzfit').addEventListener('click', fitWidth);
    document.getElementById('nz100').addEventListener('click', function () { apply(1); });

    view.addEventListener('wheel', function (e) {
      if (!e.ctrlKey) return;
      e.preventDefault();
      apply(stepZ(e.deltaY < 0 ? 1 : -1));
    }, { passive: false });

    // 끌어서 이동. 세로로 갈 곳이 없으면 페이지를 움직입니다.
    var nd = null;
    var pageEl = function () {
      return document.scrollingElement || document.documentElement;
    };
    view.addEventListener('pointerdown', function (e) {
      if (e.target.closest('button')) return;
      nd = { x: e.clientX, y: e.clientY, l: view.scrollLeft, t: view.scrollTop,
             p: pageEl().scrollTop, id: e.pointerId, moved: 0,
             target: e.target };
      view.classList.add('grabbing');
      try { view.setPointerCapture(e.pointerId); } catch (err) { /* 무시 */ }
    });
    view.addEventListener('pointermove', function (e) {
      if (!nd) return;
      nd.moved = Math.max(nd.moved,
        Math.abs(e.clientX - nd.x) + Math.abs(e.clientY - nd.y));
      view.scrollLeft = nd.l - (e.clientX - nd.x);
      if (view.scrollHeight - view.clientHeight > 1) {
        view.scrollTop = nd.t - (e.clientY - nd.y);
      } else {
        pageEl().scrollTop = nd.p - (e.clientY - nd.y);
      }
    });
    function endN() {
      if (!nd) return;
      try { view.releasePointerCapture(nd.id); } catch (err) { /* 무시 */ }
      // 거의 안 움직였으면 끌기가 아니라 '누름' 으로 봅니다.
      if (nd.moved < 5) {
        var t = nd.target;
        var node = (t && t.closest) ? t.closest('.nnode') : null;
        if (node) {
          var row = t.closest('.nrow');
          select(node.dataset.id, row ? Number(row.dataset.p) : null);
        } else {
          clearSel();
        }
      }
      nd = null;
      view.classList.remove('grabbing');
    }
    view.addEventListener('pointerup', endN);
    view.addEventListener('pointercancel', endN);

    layer.addEventListener('keydown', function (e) {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      var node = e.target.closest && e.target.closest('.nnode');
      if (!node) return;
      e.preventDefault();
      select(node.dataset.id, null);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && sel) clearSel();
    });

    // 창 크기가 바뀌면 칸 크기 단계가 달라질 수 있으니 다시 배치합니다.
    var lastRoom = 0;
    var rt = null;
    window.addEventListener('resize', function () {
      clearTimeout(rt);
      rt = setTimeout(function () {
        var room = view.clientWidth || 900;
        var reflow = metrics(room).W !== laid.m.W;
        if (reflow) {
          build(cur, false);
        } else if (!view.classList.contains('pan')) {
          fitWidth();
        }
        lastRoom = room;
      }, 180);
    });

    // 글꼴이 늦게 오면 글자 폭이 달라지므로 한 번 다시 배치합니다.
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () { build(cur, false); });
    }
    build(cur, false);
  }
})();
"""


def esc(t):
    return (str(t).replace('&', '&amp;').replace('<', '&lt;')
            .replace('>', '&gt;').replace('"', '&quot;'))


def read(p, default=''):
    if not os.path.exists(p):
        return default
    with io.open(p, encoding='utf-8') as f:
        return f.read()



def load_json(path, default):
    if not os.path.exists(path):
        return default
    with io.open(path, encoding='utf-8') as f:
        return json.load(f)

def diagram(path, start=100):
    """그림 하나를 확대 조작과 함께 내놓습니다.

    mermaid 원본의 `<br/>` 는 반드시 이스케이프해야 합니다 — 안 하면 브라우저가
    먼저 태그로 읽어 `textContent` 에 진짜 줄바꿈이 들어가고 노드 문법이 깨집니다.
    """
    src = read(path).strip()
    if not src:
        return ''
    return (
        '<div class="viewer">'
        '<div class="zoombar" role="group" aria-label="그림 크기">'
        '<button type="button" data-z="out" aria-label="축소">&minus;</button>'
        '<span class="zval">' + str(start) + '%</span>'
        '<button type="button" data-z="in" aria-label="확대">+</button>'
        '<button type="button" data-z="fit" class="txt">폭 맞추기</button>'
        '<button type="button" data-z="reset" class="txt">원래대로</button>'
        '<button type="button" data-full class="txt">크게 보기</button>'
        '</div>'
        '<div class="frame"><pre class="mermaid" data-start="' + str(start) + '">'
        + esc(src) + '</pre></div></div>'
    )


def main():
    d = json.loads(read(os.path.join(OUTDIR, 'one.json'), '{}'))
    st = d.get('stats', {})
    h = []
    a = h.append

    a('<title>ART 질문 흐름</title>')
    a('<meta name="viewport" content="width=device-width, initial-scale=1">')
    a('<link rel="preconnect" href="https://fonts.googleapis.com">')
    a('<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>')
    a('<link rel="stylesheet" href="https://fonts.googleapis.com/css2?'
      'family=Hahmlet:wght@400;600;700&family=IBM+Plex+Sans+KR:wght@300;400;500;600'
      '&family=IBM+Plex+Mono:wght@400;500&display=swap">')
    a('<style>' + CSS + '</style>')

    secs = [
        ('one', '한 장 흐름도'),
        ('why', '왜 한 장이 되는가'),
        ('spine', '공통 척추 9단계'),
        ('b1', '① 제품 성상 질문'),
        ('b2', '② 활동별 세부 질문'),
        ('locked', '잠긴 선택지'),
        ('nodes', '노드 그래프'),
        ('detail', '제품 유형별 상세'),
        ('table', '전체 표'),
        ('how', '어떻게 모았나'),
    ]

    a('<div class="shell">')

    # ── 왼쪽 눈금 ────────────────────────────────────────────────────────
    a('<nav class="rail" aria-label="목차">')
    a('<p class="rail-title">차례</p><ol>')
    for sid, name in secs:
        a('<li><a href="#%s">%s</a></li>' % (sid, esc(name)))
    a('</ol></nav>')

    a('<main>')

    # ── 머리 ─────────────────────────────────────────────────────────────
    a('<header class="masthead">')
    a('<p class="eyebrow">Advanced REACH Tool · 기계론적 모델</p>')
    a('<h1>ART는 무엇을 순서대로 묻는가</h1>')
    a('<p class="standfirst">노출 시나리오 하나를 구성할 때 ART가 던지는 '
      '질문과 그 답이 다음 질문을 어떻게 고르는지, 화면 단위로 옮긴 것입니다.</p>')
    a('<div class="stats">')
    for label, val in [('화면', st.get('screens', 0)),
                       ('공통 척추', st.get('spine', 0)),
                       ('간선', st.get('edges', 0)),
                       ('확인됨', st.get('done', 0)),
                       ('미탐색', st.get('open', 0))]:
        a('<div class="stat"><b>%s</b><span>%s</span></div>' % (val, esc(label)))
    a('</div></header>')

    # ── 한 장 흐름도 ─────────────────────────────────────────────────────
    a('<section id="one"><h2><span class="num">01</span>한 장 흐름도</h2>')
    a('<p class="lede">척추 9칸은 실제 화면 그대로 두고, 갈래가 퍼지는 두 구간만 '
      '묶음 상자로 접었습니다. 상자 속 질문은 아래 ①②에 펼쳐 놓았습니다.</p>')
    a('<div class="frame">' + diagram(os.path.join(OUTDIR, 'one.mmd')) + '</div>')
    a('<p class="caption">마름모 = 질문 화면 · 상자 = 접은 묶음 · '
      '점선 = ART가 잠가 둔 선택지</p></section>')

    # ── 왜 한 장이 되는가 ────────────────────────────────────────────────
    b1 = d.get('bulge1', [])
    b2 = d.get('bulge2', [])
    a('<section id="why"><h2><span class="num">02</span>왜 한 장이 되는가</h2>')
    a('<p>화면 %d개 중 <strong>%d개</strong>는 제품 유형이 무엇이든 똑같이 '
      '지나갑니다. 나머지는 딱 두 군데서만 퍼지고, 곧 다시 합쳐집니다 — '
      '제품 성상을 묻는 구간과 활동 세부를 묻는 구간입니다. '
      '그래서 척추를 세로로 그리고 두 구간만 접으면 노드 %d개가 됩니다.</p>'
      % (st.get('screens', 0), st.get('spine', 0), 9 + len(b1) + len(b2)))
    a('</section>')

    # ── 척추 ─────────────────────────────────────────────────────────────
    a('<section id="spine"><h2><span class="num">03</span>공통 척추 9단계</h2>')
    a('<p class="lede">순서가 실제로 정해져 있습니다. 마지막 단계에서 활동을 '
      '더 넣으면 1번으로 돌아갑니다.</p><ol class="spine">')
    for x in d.get('spine', []):
        a('<li><div><span class="q">%s</span>'
          '<span class="id">%s</span></div></li>' % (esc(x['q']), esc(x['id'])))
    a('</ol></section>')

    # ── 묶음 ① ──────────────────────────────────────────────────────────
    a('<section id="b1"><h2><span class="num">04</span>① 제품 성상 질문</h2>')
    a('<p class="lede">제품 유형을 고른 직후, 유형마다 다른 질문이 나옵니다. '
      '끝나면 모두 같은 자리로 합쳐집니다.</p><div class="cards">')
    for x in b1:
        a('<div class="card"><h3>%s</h3>'
          '<span class="count">%d문항</span><ul>' % (esc(x['ctx']), len(x['questions'])))
        for qq in x['questions']:
            a('<li>%s</li>' % esc(qq))
        a('</ul></div>')
    a('</div></section>')

    # ── 묶음 ② ──────────────────────────────────────────────────────────
    common = d.get('common') or []
    a('<section id="b2"><h2><span class="num">05</span>② 활동별 세부 질문</h2>')
    if common:
        a('<p class="lede">활동 등급을 고르면 %d갈래로 갈립니다. '
          '어느 활동이든 먼저 “%s” 를 묻고, 그다음이 활동마다 다릅니다.</p>'
          % (len(b2), esc(common[0])))
    a('<div class="cards">')
    for x in b2:
        rest = [qq for qq in x['questions'] if qq not in common]
        a('<div class="card"><h3>%s</h3>' % esc(x['cls']))
        if rest:
            a('<span class="count">세부 %d문항</span><ul>' % len(rest))
            for qq in rest:
                a('<li>%s</li>' % esc(qq))
            a('</ul>')
        else:
            a('<span class="count">세부 질문 없음</span>')
        a('<div class="chips">')
        for c in x['ctx']:
            a('<span class="chip">%s</span>' % esc(c))
        a('</div></div>')
    a('</div></section>')

    # ── 잠긴 것 ─────────────────────────────────────────────────────────
    a('<section id="locked"><h2><span class="num">06</span>잠긴 선택지</h2>')
    a('<div class="locked"><h3>제품 유형 8개 중 3개는 고를 수 없습니다</h3>')
    a('<p>화면에는 보이지만 <code>disabled</code> 상태입니다. ART가 스스로 '
      '이유를 밝혀 둡니다.</p>')
    a('<blockquote>%s</blockquote>' % esc(ART_QUOTE))
    a('<ul class="locked-list">')
    for x in d.get('locked', []):
        a('<li>%s</li>' % esc(x))
    a('</ul></div>')
    a('<div class="note-block" style="margin-top:1.5rem">'
      '<p>이 셋을 고르려 하면 클릭이 조용히 무시되고, 원래 골라져 있던 유형이 '
      '그대로 남습니다. 자동 수집 도구가 그걸 모르면 <em>다른 유형의 동작</em>을 '
      '이 셋의 기록으로 적게 됩니다. 실제로 그렇게 잘못 적힌 간선 141개를 '
      '찾아 지웠습니다.</p></div>')
    a('</section>')


    # ── 노드 그래프 ─────────────────────────────────────────────────────
    nodes = load_json(os.path.join(OUTDIR, 'nodes.json'), {})
    a('<section id="nodes"><h2><span class="num">07</span>노드 그래프</h2>')
    a('<p class="lede">답마다 출력 핀이 하나씩 있고, 그 핀에서 다음 화면으로 '
      '선이 이어집니다. 화살표 하나에 답을 여러 개 묶는 위 그림들과 달리 '
      '“이 답을 고르면 이 화면” 이 일대일로 보입니다.</p>')
    a('<div class="ntabs" id="ntabs" role="tablist"></div>')
    a('<div class="zoombar">'
      '<button type="button" id="nzout" aria-label="축소">&minus;</button>'
      '<span class="zval" id="nzval">100%</span>'
      '<button type="button" id="nzin" aria-label="확대">+</button>'
      '<button type="button" id="nzfit" class="txt">폭 맞추기</button>'
      '<button type="button" id="nz100" class="txt">100%</button>'
      '</div>')
    a('<div class="nsel" id="nsel"></div>')
    a('<div class="nview" id="nview"><div class="nsize" id="nsize">'
      '<div class="ncanvas" id="ncanvas">'
      '<svg class="nwires" id="nwires"></svg>'
      '<div id="nlayer"></div>'
      '</div></div></div>')
    a('<div class="nlegend">'
      '<span><i style="background:var(--n-entry)"></i>시작</span>'
      '<span><i style="background:var(--n-spine)"></i>공통 척추</span>'
      '<span><i style="background:var(--n-branch)"></i>갈래 질문</span>'
      '<span><i style="background:var(--n-far)"></i>원거리 전용</span>'
      '<span><i style="background:var(--n-end)"></i>활동 완료</span>'
      '<span><i style="background:var(--n-stub)"></i>막힘 · 선택 불가</span>'
      '</div>')
    a('<p class="caption">칸 머리 = 질문 화면 · 줄 = 답 하나 · 줄 오른쪽 점 = 그 답의 '
      '출력 핀 · 배지 <b>근거리</b>/<b>원거리</b> = 발생원 위치 갈래</p>')
    a('<p class="caption"><b>칸을 누르면</b> 이어진 곳만 남고 나머지는 흐려집니다. '
      '<b>답 줄을 누르면</b> 그 답 하나의 선만 남습니다. 빈 곳을 누르거나 '
      '<kbd>Esc</kbd> 로 해제합니다.</p>')
    if nodes:
        tot_n = sum(len(v['nodes']) for v in nodes.values())
        tot_e = sum(len(v['edges']) for v in nodes.values())
        pins = [p for v in nodes.values() for x in v['nodes'] for p in x['ports']]
        miss = sum(1 for x in pins if x.startswith('(미수집)'))
        a('<p class="caption">칸 %d개 · 선 %d개 · 핀 %d개 (제품 유형 %d종)</p>'
          % (tot_n, tot_e, len(pins), len(nodes)))
        if miss:
            a('<div class="note-block" style="margin-top:1rem">'
              '<p><strong>(미수집) %d개.</strong> 최근에 그래프에 들어온 화면들의 '
              '답 문구를 아직 화면에서 읽지 못했습니다. 값(<code>rbNo</code> 같은 '
              '내부 이름)을 그대로 보여 주고 있습니다 — 짐작으로 채우지 '
              '않았습니다. <code>node labels.js</code> 를 한 번 돌리면 '
              '한국어 문구로 바뀝니다.</p></div>' % miss)
    a('</section>')
    a('<script>window.__ART_NODES__=%s;</script>'
      % json.dumps(nodes, ensure_ascii=False).replace('</', r'<\/'))

    # ── 제품 유형별 상세 ────────────────────────────────────────────────
    a('<section id="detail"><h2><span class="num">08</span>제품 유형별 상세</h2>')
    a('<p class="lede">접지 않은 그림입니다. 화면 하나하나와 답 문구가 모두 '
      '들어 있어 넓습니다 — 상자 안에서 좌우로 움직여 보십시오.</p>')
    files = {}
    for p in glob.glob(os.path.join(OUTDIR, 'flow_*.mmd')):
        files[os.path.basename(p)[5:-4]] = p
    for name in DETAIL_ORDER + sorted(x for x in files if x not in DETAIL_ORDER):
        if name not in files:
            continue
        src = read(files[name])
        nodes = len(re.findall(r'^\s{2}S\w+\{', src, re.M))
        arrows = src.count('-->')
        a('<details><summary>%s<span class="meta">화면 %d · 화살표 %d</span>'
          '</summary><div class="body"><div class="frame">%s</div></div></details>'
          % (esc(name), nodes, arrows, diagram(files[name])))
        del files[name]
    a('</section>')

    # ── 표 ──────────────────────────────────────────────────────────────
    rows = []
    csvp = os.path.join(OUTDIR, 'flow.csv')
    if os.path.exists(csvp):
        with io.open(csvp, encoding='utf-8-sig', newline='') as f:
            rows = list(csv.DictReader(f))
    pts = sorted(set(r['제품유형'] for r in rows))
    a('<section id="table"><h2><span class="num">09</span>전체 표</h2>')
    a('<p class="lede">화면 · 질문 · 답 · 다음 화면. 엑셀로 옮기려면 '
      '<code>flow/flow.csv</code> 를 쓰십시오.</p>')
    a('<div class="controls">')
    a('<input id="q" type="search" placeholder="질문이나 답으로 찾기" '
      'aria-label="표 안에서 찾기">')
    a('<select id="pt" aria-label="제품 유형으로 걸러 보기">'
      '<option value="">제품 유형 전체</option>')
    for p in pts:
        a('<option value="%s">%s</option>' % (esc(p), esc(p)))
    a('</select><span class="hits" id="hits"></span></div>')
    a('<div class="tablewrap"><table id="flowtable"><thead><tr>'
      '<th>제품 유형</th><th>화면</th><th>질문</th><th>답</th>'
      '<th>다음 화면</th><th>비고</th></tr></thead><tbody>')
    for r in rows:
        hay = ' '.join([r['질문'], r['답'], r['화면'], r['다음화면']]).lower()
        a('<tr data-pt="%s" data-hay="%s">' % (esc(r['제품유형']), esc(hay)))
        a('<td class="pt">%s</td>' % esc(r['제품유형']))
        a('<td class="scr">%s</td>' % esc(r['화면']))
        a('<td>%s</td>' % esc(r['질문']))
        a('<td>%s</td>' % esc(r['답']))
        a('<td class="next">%s</td>' % esc(r['다음화면']))
        a('<td class="note">%s</td>' % esc(r['비고']))
        a('</tr>')
    a('</tbody></table></div></section>')

    # ── 어떻게 모았나 ───────────────────────────────────────────────────
    a('<section id="how"><h2><span class="num">10</span>어떻게 모았나</h2>')
    a('<div class="note-block">')
    a('<h3>방법</h3><ul>'
      '<li>디버그 브라우저를 CDP로 몰아 시나리오 하나를 실제로 걸어 다녔습니다. '
      '사람이 클릭하는 것과 같은 경로입니다.</li>'
      '<li>화면마다 선택지를 하나씩 눌러 보고 어디로 가는지 적었습니다. '
      '간선 하나 = 화면 + 답 + 다음 화면.</li>'
      '<li>같은 화면이 제품 유형에 따라 다른 선택지를 내놓기 때문에, '
      '간선의 열쇠에 제품 유형을 함께 넣었습니다.</li>'
      '<li>문구는 별도로 다시 걸어가 화면에서 직접 읽었습니다. '
      '한국어 문구는 번역 스크립트가 붙인 것입니다.</li></ul>')
    a('<h3>남은 것</h3><ul>'
      '<li>미탐색 %d개 — 아직 걸어 보지 않은 답입니다.</li>'
      '<li>막힘 %d개 — 검증 오류로 다음 화면에 못 간 조합입니다.</li>'
      '<li>선택 불가 3개 — ART가 잠가 둔 제품 유형.</li></ul>'
      % (st.get('open', 0), st.get('blocked', 0)))
    a('<h3>믿을 수 있는 범위</h3>'
      '<p>“확인됨”으로 적힌 간선은 실제로 눌러서 도착지를 본 것입니다. '
      '추정이 아닙니다. 미탐색으로 적힌 것은 아직 모른다는 뜻이며, '
      '빈칸을 짐작으로 채우지 않았습니다.</p>')
    a('</div></section>')

    a('<footer>수집: 시나리오 1개 · 간선 %d개 · 화면 %d개 · '
      'ART 기계론적 모델 (Advanced REACH Tool)</footer>'
      % (st.get('edges', 0), st.get('screens', 0)))
    a('</main></div>')
    a('<script>' + JS + '</script>')

    with io.open(OUT, 'w', encoding='utf-8') as f:
        f.write('\n'.join(h) + '\n')
    print('%s  (%.0f KB)' % (OUT, os.path.getsize(OUT) / 1024.0))
    print('  표 %d행 · 상세 그림 %d개' % (len(rows), len(DETAIL_ORDER)))


if __name__ == '__main__':
    main()
