# -*- coding: utf-8 -*-
"""흐름을 **노드 그래프**(비주얼 스크립팅 편집기 모양)로 놓을 좌표를 계산합니다.

왜 mermaid 가 아닌가
  mermaid 는 답 여러 개를 화살표 하나에 묶어 라벨로 적습니다. 노드 그래프는
  답마다 출력 핀을 하나씩 두어 '이 답 -> 이 화면' 을 선으로 직접 잇습니다.
  ART 흐름의 의미에 더 맞습니다.

좌표를 파이썬에서 계산하는 이유
  칸 높이를 글자 줄 수로 정해 두면 브라우저 줄바꿈에 의존하지 않아 결과가 항상
  같습니다. 그림이 틀어지는 사고를 막습니다.

맥락(ctx) 다루기
  crawl.js 의 ctxOf 가 '제품유형+근거리답' 형태입니다 (예 rbLiquids+rbNo).
  같은 화면이 근거리/원거리에서 다른 곳으로 가므로 **핀 하나에 선 두 개**가
  생기면 안 됩니다. 그래서 노드 id 를 '화면@맥락' 으로 두어 갈래를 나눕니다.
  근거리 발생원 화면의 두 핀이 각 갈래의 첫 칸으로 이어집니다.

출력  flow/nodes.json

  python flow_nodes.py
"""
import io
import json
import os
import re
import time
import collections

HERE = os.path.dirname(os.path.abspath(__file__))
OUTDIR = os.path.join(HERE, 'flow')
PAIR_SEP = '~~'
NOTE = ('BLOCKED', 'PRUNED', 'DISABLED', 'UNREACHABLE')
NF = 'q016_nearfieldsource'

CTX_NAME = collections.OrderedDict([
    ('rbGranularMaterial', '분말·과립'),
    ('rbLiquids', '액체'),
    ('rbPowderInLiquid', '액체 내 분말'),
    ('rbSolidObjects', '고체 물체'),
    ('rbPasteSlurry', '페이스트·슬러리'),
])
BRANCH = {'rbYes': '근거리', 'rbNo': '원거리'}

SPINE = {'q003_090_producttype', NF, 'q017_055_103_activityclass',
         'q042_080_130_primarylocalizedcontrols',
         'q042_5_080_5_130_5_secondarylocalizedcontrols',
         'q045_081_surfacecontamination', 'q084_dispersion',
         'q089_0_secondaryfarfieldsources', 'q002_7_activities'}
FARFIELD = {'q043_131_segregation', 'q044_personalenclosure'}

# 답 문구를 자르는 길이만 여기서 정합니다. 칸 크기·좌표는 브라우저가 정합니다.
ROW_CH = 30

# 문구를 아직 못 긁은 답에 붙입니다. 값만 보여 주면 번역된 줄 오해합니다.
MARK = '(미수집) '

STUB_TEXT = {'BLOCKED': '막힘 — 검증 오류',
             'DISABLED': '선택 불가 — ART 미지원',
             'PRUNED': '가지치기',
             'UNREACHABLE': '경로 재현 실패'}


def s(u):
    return str(u).split('/')[-1].replace('.aspx', '')


def clip(t, n):
    t = re.sub(r'\s+', ' ', str(t or '')).strip()
    return t[:n - 1] + '…' if len(t) > n else t


def jload(name, default, tries=8):
    """쓰이는 중인 파일을 읽다 깨지면 잠깐 기다리고 다시 읽습니다.
    다른 세션이 같은 파일에 쓰고 있기 때문입니다."""
    p = os.path.join(HERE, name)
    if not os.path.exists(p):
        return default
    for i in range(tries):
        try:
            with io.open(p, encoding='utf-8') as f:
                return json.load(f)
        except ValueError:
            if i == tries - 1:
                raise
            time.sleep(0.4)
    return default


def kind_of(sid):
    if sid in FARFIELD:
        return 'far'
    if sid == 'q002_7_activities':
        return 'end'
    if sid in SPINE:
        return 'spine'
    return 'branch'


def main():
    E = list(jload('crawl_edges.json', {'edges': {}})['edges'].values())
    L = jload('crawl_labels.json', {})

    q = {}
    for v in L.values():
        t = (v['q'].get('legends') or v['q'].get('main') or [''])[0]
        if t:
            q.setdefault(s(v['at']), t)

    # 문구 수집이 안 된 화면(이번에 새로 그래프에 들어온 원거리 계열 등)은
    # 방문 기록의 영어 문장을 사전으로 번역해 씁니다. 브라우저를 다시 몰지
    # 않고도 읽히게 하려는 것입니다. labels.js 를 돌리면 정식 문구로 대체됩니다.
    SCR = jload('crawl_screens.json', {})
    DICT = {}
    for sec, m in (jload(os.path.join('..', 'art-ko-dict.json'), {}) or {}).items():
        if sec.startswith('_') or not isinstance(m, dict):
            continue
        for k, v in m.items():
            DICT.setdefault(k.strip(), v)

    def guess(sid):
        for url, kinds in SCR.items():
            if s(url) != sid:
                continue
            cands = list(kinds.get('text') or [])
            def score(t):
                t = str(t)
                sc = 0
                if 'then click' in t.lower():
                    sc -= 40
                if t.rstrip().endswith('?'):
                    sc -= 60
                if t[:8].lower() in ('what is ', 'is the w', 'select t'):
                    sc -= 20
                return (sc, len(t))
            for t in sorted(cands, key=score):
                ko = DICT.get(str(t).strip())
                if ko:
                    return ko
            for t in sorted(cands, key=score):
                return str(t)
        return None

    def _find(v, kind, name, val):
        if kind == 'radios':
            for nm, g in (v.get('radios') or {}).items():
                if nm == name:
                    for o in g:
                        if o['v'] == val:
                            return o['t']
        else:
            for sel in (v.get('selects') or []):
                if (sel.get('name') or sel.get('id')) == name:
                    for o in sel['opts']:
                        if o['v'] == val:
                            return o['t']
        return None

    def lab(at, ctx):
        # 문구는 맥락별로 모았지만, 맥락 형식이 바뀌었을 수 있으니 넓게 찾습니다.
        for key in (at + '@' + ctx, at + '@' + ctx.split('+')[0], at + '@'):
            if key in L:
                return L[key]
        for key in L:
            if key.startswith(at + '@'):
                return L[key]
        return {}

    def answer(e):
        v = lab(e['at'], e.get('ctx') or '')
        if e['kind'] == 'linear':
            return '(값 입력 후 다음)'
        if e['kind'] == 'pair':
            rn, sn = e['name'].split(PAIR_SEP)
            rv, sv = e['v'].split(PAIR_SEP)
            return ((_find(v, 'radios', rn, rv) or MARK + rv) + ' / '
                    + (_find(v, 'selects', sn, sv) or MARK + sv))
        kind = 'radios' if e['kind'] == 'radio' else 'selects'
        return _find(v, kind, e['name'], e['v']) or MARK + e['v']

    def placeholder(e):
        if e['kind'] != 'select':
            return False
        t = _find(lab(e['at'], e.get('ctx') or ''), 'selects', e['name'], e['v'])
        return t is not None and re.sub(r'[^0-9A-Za-z가-힣]', '', t) in ('선택', 'Select')

    edges = [e for e in E if not placeholder(e)]

    # 뒤따르는 맥락. crawl.js 의 ctxOf 와 같은 규칙이어야 합니다.
    def succ_ctx(e):
        ctx = e.get('ctx') or ''
        if NF in e['at']:
            return (ctx + '+' + e['v']) if ctx else e['v']
        return ctx

    root = [e for e in edges if not (e.get('ctx') or '')]
    first = {}
    for e in root:
        if e['dest'] and e['dest'] not in NOTE:
            first[e['v']] = s(e['dest'])

    out = collections.OrderedDict()

    for base, name in CTX_NAME.items():
        es = [e for e in edges
              if (e.get('ctx') or '') == base
              or (e.get('ctx') or '').startswith(base + '+')]
        if not es:
            continue

        ENTRY = '@entry'
        rows = collections.OrderedDict()          # 노드 id -> [(답, 도착 노드 id)]
        for e in sorted(es, key=lambda x: (x.get('ctx') or '', x['at'], answer(x))):
            nid = s(e['at']) + '@' + (e.get('ctx') or '')
            rows.setdefault(nid, [])
            d = e['dest']
            tgt = ('!' + d) if d in NOTE else (s(d) + '@' + succ_ctx(e))
            rows[nid].append((answer(e), tgt))

        stubs = collections.OrderedDict()
        for nid in list(rows):
            for _, tgt in rows[nid]:
                if tgt in rows:
                    continue
                if tgt.startswith('!'):
                    stubs.setdefault(tgt, STUB_TEXT.get(tgt[1:], tgt[1:]))
                else:
                    sid1 = tgt.split('@')[0]
                    stubs.setdefault(tgt, q.get(sid1) or guess(sid1) or sid1)

        node_ids = [ENTRY] + list(rows) + list(stubs)
        entry_to = (first.get(base) or '') + '@' + base

        def title(nid):
            if nid == ENTRY:
                return '제품 유형: ' + name
            if nid in stubs:
                return stubs[nid]
            sid0 = nid.split('@')[0]
            return q.get(sid0) or guess(sid0) or sid0

        def outs(nid):
            if nid == ENTRY:
                return [('시작', entry_to)] if entry_to in rows else []
            return rows.get(nid, [])

        # 좌표는 계산하지 않습니다. 화면 폭에 맞춰 브라우저가 배치합니다
        # (반응형). 여기서는 '무엇이 무엇과 이어지는가' 만 냅니다.
        jnodes = []
        for nid in node_ids:
            ctx = nid.split('@')[1] if ('@' in nid and not nid.startswith('!')) else ''
            br = ''
            for k, v in BRANCH.items():
                if ctx.endswith('+' + k):
                    br = v
            sid = nid.split('@')[0]
            jnodes.append({
                'id': nid,
                'title': clip(title(nid), 120),
                'kind': ('entry' if nid == ENTRY
                         else 'stub' if nid in stubs else kind_of(sid)),
                'screen': '' if nid == ENTRY or nid in stubs else sid,
                'branch': br,
                'ports': [clip(a, ROW_CH) for a, _ in outs(nid)],
            })
        have = set(n['id'] for n in jnodes)
        jedges = []
        for nid in node_ids:
            for i, (_, tgt) in enumerate(outs(nid)):
                if tgt in have:
                    jedges.append({'f': nid, 'p': i, 't': tgt})
        out[name] = {'nodes': jnodes, 'edges': jedges}

    if not os.path.isdir(OUTDIR):
        os.makedirs(OUTDIR)
    with io.open(os.path.join(OUTDIR, 'nodes.json'), 'w', encoding='utf-8') as f:
        f.write(json.dumps(out, ensure_ascii=False))

    print('flow/nodes.json 생성  (간선 원본 %d개)' % len(E))
    for k, v in out.items():
        far = sum(1 for n in v['nodes'] if n['branch'] == '원거리')
        pins = sum(len(n['ports']) for n in v['nodes'])
        print('  %-14s 칸 %3d개 (원거리 %2d)  핀 %3d개  선 %3d개'
              % (k, len(v['nodes']), far, pins, len(v['edges'])))


if __name__ == '__main__':
    main()
