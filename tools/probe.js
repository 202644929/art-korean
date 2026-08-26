/* 한 갈래만 앞으로 걸어가며 각 화면의 설명 상자 정체를 확인합니다.
 *   node probe.js [걸음수]
 */
const { connect } = require('./cdp.js');
const P = require('./pagelib.js');

(async () => {
  const c = await connect();
  const MAX = Number(process.argv[2] || 12);
  try {
    for (let step = 0; step < MAX; step++) {
      const h = await c.run(P.harvest);
      console.log('\n[' + step + '] ' + h.url.split('/').pop() + '   ' + (h.title || ''));
      if (h.descBox) {
        console.log('  설명상자: <' + h.descBox.tag + '> id=' + h.descBox.id
          + ' name=' + JSON.stringify(h.descBox.name)
          + ' readOnly=' + h.descBox.ro + ' disabled=' + h.descBox.dis);
        console.log('  내용: ' + h.descBox.val.slice(0, 120));
      }
      if (h.tas.length) console.log('  textarea: ' + JSON.stringify(h.tas));
      if (h.legends.length) console.log('  legend 영어: ' + JSON.stringify(h.legends));
      if (h.desc) console.log('  Descriptions 전역: ' + Object.keys(h.desc).length + '개');
      if (h.residue.length) {
        console.log('  남은 영어 ' + h.residue.length + '개: '
          + h.residue.slice(0, 6).map((s) => s.slice(0, 70)).join(' | '));
      }

      const g = await c.run(P.radioGroups);
      const names = Object.keys(g);
      if (names.length) {
        const first = g[names[0]];
        if (!first.some((r) => r.c)) {
          await c.run(P.pickRadio, names[0], first[0].v);
          await c.settle();
        }
      }
      const filled = await c.run(P.fillBlanks);
      if (filled.length) { console.log('  채움: ' + filled.join(', ')); await c.settle(); }

      const sels = await c.run(P.selectInfo);
      for (const s of sels) {
        if (s.opts.length > 1 && s.idx <= 0) {
          await c.run(P.pickSelect, s.name, s.opts[1].v);
          await c.settle();
        }
      }

      const before = h.url;
      const r = await c.run(P.clickBtn, ['다음', 'next']);
      if (r === 'NOTFOUND') { console.log('  다음 버튼 없음, 종료'); break; }
      await c.settle();
      const after = await c.run(function () { return location.pathname; });
      if (after === before) {
        console.log('  진행 못함. 오류: ' + JSON.stringify(await c.run(P.errors)));
        break;
      }
    }
  } finally { c.close(); }
})();
