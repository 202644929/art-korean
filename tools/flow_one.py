# -*- coding: utf-8 -*-
"""ART 질문 흐름을 **한 장**으로 그립니다.

왜 한 장이 되는가
  화면 61개 중 9개가 모든 제품 유형이 똑같이 지나가는 '척추' 입니다.
  나머지 45개는 두 군데서만 퍼집니다 — ① 제품 성상 질문 ② 활동별 세부 질문.
  그래서 척추는 그대로 그리고 퍼지는 두 구간만 묶음 상자로 접으면 한 장에 들어갑니다.

출력
  flow/one.mmd        한 장 흐름도 (mermaid)
  flow/one_detail.md  묶음 상자 안에 무엇이 들어 있는지

  python flow_one.py
"""
import io
import json
import os
import re
import collections

HERE = os.path.dirname(os.path.abspath(__file__))
OUTDIR = os.path.join(HERE, 'flow')

NOTE = ('BLOCKED', 'PRUNED', 'DISABLED', 'UNREACHABLE')
PAIR_SEP = '~~'

CTX_NAME = {
    'rbGranularMaterial': '분말·과립',
    'rbSolidObjects': '고체 물체',
    'rbLiquids': '액체',
    'rbPowderInLiquid': '액체 내 분말',
    'rbPasteSlurry': '페이스트·슬러리',
}
# ART 가 잠가 둔 것. ART 자체 설명: 흄·섬유·가스·고온금속 배출 분진은 평가 불가.
LOCKED = {'rbHotMetal': '고온·용융 금속', 'rbFibrous': '섬유상 물질', 'rbGas': '가스'}

PT = 'q003_090_producttype'
NF = 'q016_nearfieldsource'
AC = 'q017_055_103_activityclass'
LC1 = 'q042_080_130_primarylocalizedcontrols'
LC2 = 'q042_5_080_5_130_5_secondarylocalizedcontrols'
SC = 'q045_081_surfacecontamination'
DP = 'q084_dispersion'
FF = 'q089_0_secondaryfarfieldsources'
ACTS = 'q002_7_activities'
SPINE = [PT, NF, AC, LC1, LC2, SC, DP, FF, ACTS]

SPINE_FALLBACK = {
    PT: '제품 유형은 무엇입니까?',
    NF: '1차 배출 발생원이 작업자의 호흡 영역 안에 있습니까?',
    AC: '어떤 활동 등급입니까?',
    LC1: '1차 국소 제어',
    LC2: '2차 국소 제어',
    SC: '표면 오염',
    DP: '확산',
    FF: '2차 원거리 발생원',
    ACTS: '활동 목록 — 완료 및 실행',
}


def s(u):
    return str(u).split('/')[-1].replace('.aspx', '')


def clean(t, n=40):
    t = re.sub(r'\s+', ' ', str(t or '')).strip()
    t = t.replace('"', "'").replace('[', '(').replace(']', ')')
    t = t.replace('{', '(').replace('}', ')').replace('|', '/')
    return t[:n - 1] + '…' if len(t) > n else t


def load(name, default):
    return _retry_json(os.path.join(HERE, name), default)

def _retry_json(path, default, tries=8):
    """다른 세션이 같은 파일에 쓰는 중일 수 있어 읽다 깨지면 다시 읽습니다."""
    import time
    if not os.path.exists(path):
        return default
    for i in range(tries):
        try:
            with io.open(path, encoding='utf-8') as f:
                return json.load(f)
        except ValueError:
            if i == tries - 1:
                raise
            time.sleep(0.4)
    return default



def main():
    E = list(load('crawl_edges.json', {'edges': {}})['edges'].values())
    # crawl.js 의 ctxOf 가 '제품유형+근거리답' 으로 바뀌었습니다. mermaid 그림은
    # 제품 유형 단위 개요이므로 맥락을 제품 유형으로 되돌려 묶습니다.
    # 근거리/원거리 구분은 노드 그래프(flow_nodes.py)에서 보여 줍니다.
    for _e in E:
        _e['ctx'] = (_e.get('ctx') or '').split('+')[0]
    L = load('crawl_labels.json', {})

    # 화면 -> 질문 문구
    q = {}
    for v in L.values():
        t = (v['q'].get('legends') or v['q'].get('main') or [''])[0]
        if t:
            q.setdefault(s(v['at']), t)
    for k, t in SPINE_FALLBACK.items():
        q.setdefault(k, t)

    # 답 문구
    def label(e):
        at, ctx = e['at'], e.get('ctx') or ''
        key = at + '@' + ctx
        v = L.get(key) or L.get(at + '@') or {}
        if e['kind'] == 'linear':
            return '(값 입력)'
        if e['kind'] == 'pair':
            rn, sn = e['name'].split(PAIR_SEP)
            rv, sv = e['v'].split(PAIR_SEP)
            a = _find(v, 'radios', rn, rv) or rv
            b = _find(v, 'selects', sn, sv) or sv
            return a + ' / ' + b
        kind = 'radios' if e['kind'] == 'radio' else 'selects'
        return _find(v, kind, e['name'], e['v']) or e['v']

    def _find(v, kind, name, val):
        if kind == 'radios':
            for nm, g in (v.get('radios') or {}).items():
                if nm != name:
                    continue
                for o in g:
                    if o['v'] == val:
                        return o['t']
        else:
            for sel in (v.get('selects') or []):
                if (sel.get('name') or sel.get('id')) != name:
                    continue
                for o in sel['opts']:
                    if o['v'] == val:
                        return o['t']
        return None

    # 인접
    out = collections.defaultdict(list)
    for e in E:
        out[(s(e['at']), e.get('ctx') or '')].append(e)

    def dests(at, ctx):
        r = []
        for e in out.get((at, ctx), []):
            if e['dest'] and e['dest'] not in NOTE:
                r.append(s(e['dest']))
        return r

    # ── 구간 ①: 제품 유형 다음부터 근거리 발생원 앞까지 ──────────────────
    def chain(start, ctx, stop):
        """start 부터 stop 을 만나기 전까지의 화면들을 순서대로."""
        seq, cur, guard = [], start, 0
        while cur and cur not in stop and guard < 25:
            guard += 1
            seq.append(cur)
            nxt = [d for d in dests(cur, ctx) if d != cur]
            cur = nxt[0] if nxt else None
        return seq

    stop = set(SPINE)
    bulge1 = collections.OrderedDict()
    for e in out.get((PT, ''), []):
        if e['dest'] in NOTE or not e['dest']:
            continue
        ctx = e['v']
        if ctx not in CTX_NAME:
            continue
        bulge1[ctx] = chain(s(e['dest']), ctx, stop)

    # ── 구간 ②: 활동 등급 다음부터 국소 제어 앞까지 ──────────────────────
    bulge2 = collections.OrderedDict()
    for ctx in CTX_NAME:
        for e in out.get((AC, ctx), []):
            if e['dest'] in NOTE or not e['dest']:
                continue
            # 하위 등급까지 쪼개면 19칸이 되어 한 장에 안 들어갑니다.
            # 하위 등급은 묶음 상자 '안' 의 질문으로 들어갑니다.
            cls = label(e).split(' / ')[0].strip()
            b = bulge2.setdefault(cls, {'dests': [], 'ctx': set(), 'seq': None})
            if s(e['dest']) not in b['dests']:
                b['dests'].append(s(e['dest']))
            b['ctx'].add(CTX_NAME[ctx])
            if b['seq'] is None:
                b['seq'] = chain(s(e['dest']), ctx, stop)

    # ── 그림 ─────────────────────────────────────────────────────────────
    n = []
    a = n.append
    # useMaxWidth 를 끄지 않으면 mermaid 가 그림을 컨테이너 폭에 맞춰 줄입니다.
    # 넓은 그림일수록 글씨가 작아져 못 읽습니다. 원래 크기로 그리고 페이지에서
    # 스크롤·확대하게 합니다.
    a('%%{init: {"flowchart": {"useMaxWidth": false, "nodeSpacing": 45, "rankSpacing": 55}, "themeVariables": {"fontSize": "16px"}} }%%')
    a('flowchart TD')
    a('  PT{"제품 유형은 무엇입니까?"}')
    a('  LOCK[/"고온·용융 금속 · 섬유상 물질 · 가스<br/>선택 불가 — ART 미지원"/]')
    a('  PT -.->|"잠긴 선택지 3개"| LOCK')

    a('  subgraph G1["① 제품 성상 질문 — 유형마다 다름"]')
    a('    direction LR')
    for i, (ctx, seq) in enumerate(bulge1.items()):
        body = '<br/>'.join('· ' + clean(q.get(x, x), 26) for x in seq[:4])
        if len(seq) > 4:
            body += '<br/>· …'
        body = body or '· (질문 없음)'
        # mermaid 는 <b> 를 못 읽습니다. <br/> 만 씁니다.
        a('    B%d["%s · %d문항<br/>%s"]' % (i, CTX_NAME[ctx], len(seq), body))
    a('  end')
    for i, ctx in enumerate(bulge1):
        a('  PT -->|"%s"| B%d' % (clean(CTX_NAME[ctx], 22), i))
        a('  B%d --> NF' % i)

    a('  NF{"%s"}' % clean(q.get(NF), 46))
    a('  NF -->|"예 / 아니오"| AC')
    a('  AC{"어떤 활동 등급입니까? (유형마다 목록이 다름)"}')

    order = sorted(bulge2.items(), key=lambda kv: (-len(kv[1]['ctx']), kv[0]))
    # 상자 대부분에 똑같이 나오는 질문은 상자 안에서 뺍니다. 정보가 없고 자리만
    # 먹습니다 ('아래 상황 중 귀하의 활동을 …' 이 16개 상자 전부에 나왔습니다).
    freq = collections.Counter()
    for _, info in order:
        for x in set(info['seq'] or []):
            freq[q.get(x, x)] += 1
    common = [t for t, c in freq.items() if order and c >= 0.6 * len(order)]
    title = '② 활동별 세부 질문'
    if common:
        title += ' — 모든 활동이 먼저 %s 를 묻습니다' % clean(common[0], 34)
    a('  subgraph G2["%s"]' % title)
    a('    direction LR')
    for i, (dst, info) in enumerate(order):
        seq = [x for x in (info['seq'] or []) if q.get(x, x) not in common]
        sub = '<br/>'.join('· ' + clean(q.get(x, x), 26) for x in seq[:3])
        a('    A%d["%s<br/>%s"]' % (i, clean(dst, 30), sub or '· (세부 질문 없음)'))
    a('  end')
    for i in range(len(order)):
        a('  AC --> A%d' % i)
        a('  A%d --> LC1' % i)

    a('  LC1{"%s"}' % clean(q.get(LC1), 46))
    a('  LC2{"%s"}' % clean(q.get(LC2), 46))
    a('  SC{"%s"}' % clean(q.get(SC), 46))
    a('  DP{"%s"}' % clean(q.get(DP), 46))
    a('  FF{"%s"}' % clean(q.get(FF), 46))
    a('  DONE["활동 목록 — 완료 및 실행"]')
    a('  LC1 -->|"제어 있음"| LC2')
    a('  LC1 -->|"제어 없음"| SC')
    a('  LC2 --> SC')
    a('  SC --> DP')
    a('  DP --> FF')
    a('  FF -->|"활동을 더 넣는다"| PT')
    a('  FF -->|"끝"| DONE')

    if not os.path.isdir(OUTDIR):
        os.makedirs(OUTDIR)
    with io.open(os.path.join(OUTDIR, 'one.mmd'), 'w', encoding='utf-8') as f:
        f.write('\n'.join(n) + '\n')

    # ── 묶음 상자 속 내용 ────────────────────────────────────────────────
    det = ['# 묶음 상자 안에 무엇이 들어 있는가\n']
    det.append('## ① 제품 성상 질문\n')
    for ctx, seq in bulge1.items():
        det.append('### %s (%d문항)\n' % (CTX_NAME[ctx], len(seq)))
        for x in seq:
            det.append('- %s' % (q.get(x) or x))
        det.append('')
    det.append('## ② 활동별 세부 질문\n')
    for dst, info in order:
        det.append('### %s' % dst)
        det.append('적용 제품 유형: %s\n' % ', '.join(sorted(info['ctx'])))
        for x in (info['seq'] or []):
            det.append('- %s' % (q.get(x) or x))
        det.append('')
    with io.open(os.path.join(OUTDIR, 'one_detail.md'), 'w', encoding='utf-8') as f:
        f.write('\n'.join(det) + '\n')

    # 페이지 생성기가 쓸 구조화 데이터. 그림·표를 다시 계산하지 않게 합니다.
    stats = {
        'edges': len(E),
        'done': sum(1 for e in E if e['dest'] and e['dest'] not in NOTE),
        'blocked': sum(1 for e in E if e['dest'] == 'BLOCKED'),
        'open': sum(1 for e in E if not e['dest']),
        'screens': len(set([s(e['at']) for e in E]
                           + [s(e['dest']) for e in E
                              if e['dest'] and e['dest'] not in NOTE])),
        'spine': len(SPINE),
    }
    data = {
        'stats': stats,
        'spine': [{'id': x, 'q': q.get(x, x)} for x in SPINE],
        'locked': sorted(LOCKED.values()),
        'bulge1': [{'ctx': CTX_NAME[c],
                    'questions': [q.get(x, x) for x in seq]}
                   for c, seq in bulge1.items()],
        'bulge2': [{'cls': cls,
                    'ctx': sorted(info['ctx']),
                    'questions': [q.get(x, x) for x in (info['seq'] or [])]}
                   for cls, info in order],
        'common': common,
    }
    with io.open(os.path.join(OUTDIR, 'one.json'), 'w', encoding='utf-8') as f:
        f.write(json.dumps(data, ensure_ascii=False, indent=1))

    print('한 장 흐름도: 노드 %d개 (척추 9 + 성상 묶음 %d + 활동 묶음 %d)'
          % (9 + len(bulge1) + len(order), len(bulge1), len(order)))
    print('flow/one.mmd, flow/one_detail.md 생성')
    for ctx, seq in bulge1.items():
        print('  ① %-14s %d문항' % (CTX_NAME[ctx], len(seq)))
    print('  ② 활동 묶음 %d개' % len(order))


if __name__ == '__main__':
    main()
