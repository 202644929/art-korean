# -*- coding: utf-8 -*-
"""ART 마법사의 질문 흐름을 그림(mermaid)과 표(csv/markdown)로 만듭니다.

입력
  crawl_edges.json    화면 -> 답 -> 다음 화면   (값만 있음)
  crawl_labels.json   화면의 질문 문구, 답의 문구

출력  flow/
  flow_<제품유형>.mmd   제품 유형별 흐름도 (mermaid)
  flow.csv              전체 표
  flow.md               전체 표 (읽기용)
  flow_summary.txt      덮은 범위 요약

  python flow.py
"""
import json
import io
import os
import re
import csv
import collections

HERE = os.path.dirname(os.path.abspath(__file__))
OUTDIR = os.path.join(HERE, 'flow')
PAIR_SEP = '~~'

# 제품 유형 값 -> 짧은 이름 (파일명·제목용)
CTX_NAME = {
    '': '공통',
    'rbGranularMaterial': '분말·과립',
    'rbSolidObjects': '고체물체',
    'rbLiquids': '액체',
    'rbPowderInLiquid': '액체내분말',
    'rbPasteSlurry': '페이스트·슬러리',
    'rbHotMetal': '고온금속',
    'rbFibrous': '섬유상',
    'rbGas': '가스',
}

# 문구를 아직 못 긁은 답에 붙입니다. 값만 보여 주면 번역된 줄 오해합니다.
MARK = '(미수집) '

DEST_NOTE = {
    None: '미탐색',
    'BLOCKED': '막힘(검증오류)',
    'PRUNED': '가지치기(형제 선택지와 같은 곳)',
    'UNREACHABLE': '경로 재현 실패',
    # ART 자체 문구: '흄, 섬유, 가스, 고온 금속 공정 배출 분진은 (당분간)
    # 평가할 수 없습니다.' 그래서 이 셋은 화면에 보이지만 잠겨 있습니다.
    'DISABLED': '선택 불가 (ART 미지원)',
}


def jload(name, default):
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



def short(url):
    return url.split('/')[-1].replace('.aspx', '')


def nid(url):
    """mermaid 노드 id. 영숫자만 남깁니다."""
    return 'S' + re.sub(r'[^0-9A-Za-z]', '_', short(url))


def clean(s, n=46):
    s = re.sub(r'\s+', ' ', str(s or '')).strip()
    s = s.replace('"', "'")
    # mermaid 는 대괄호·중괄호를 구문으로 씁니다.
    s = s.replace('[', '(').replace(']', ')').replace('{', '(').replace('}', ')')
    if len(s) > n:
        s = s[:n - 1] + '…'
    return s


def main():
    E = jload('crawl_edges.json', {'edges': {}})['edges']
    # crawl.js 의 ctxOf 가 '제품유형+근거리답' 으로 바뀌었습니다. mermaid 그림은
    # 제품 유형 단위 개요이므로 맥락을 제품 유형으로 되돌려 묶습니다.
    # 근거리/원거리 구분은 노드 그래프(flow_nodes.py)에서 보여 줍니다.
    for _e in E.values():
        _e['ctx'] = (_e.get('ctx') or '').split('+')[0]
    L = jload('crawl_labels.json', {})

    # ── 화면 질문 문구 ──────────────────────────────────────────────────────
    # 맥락별로 다를 수 있으니 (화면,맥락) 먼저 보고, 없으면 아무 맥락이나 씁니다.
    q_by_pair = {}
    q_by_screen = {}
    for key, v in L.items():
        q = v.get('q') or {}
        text = ''
        if q.get('legends'):
            text = q['legends'][0]
        elif q.get('main'):
            text = q['main'][0]
        if not text:
            text = q.get('title') or short(v['at'])
        q_by_pair[(v['at'], v.get('ctx') or '')] = text
        q_by_screen.setdefault(v['at'], text)

    def question(at, ctx):
        return q_by_pair.get((at, ctx)) or q_by_screen.get(at) or short(at)

    # ── 답 문구 ────────────────────────────────────────────────────────────
    def radio_label(at, ctx, name, val):
        for k in ((at, ctx), (at, '')):
            v = L.get(k[0] + '@' + k[1])
            if not v:
                continue
            for nm, g in (v.get('radios') or {}).items():
                if nm != name:
                    continue
                for o in g:
                    if o['v'] == val:
                        return o['t']
        return None

    def select_label(at, ctx, name, val):
        for k in ((at, ctx), (at, '')):
            v = L.get(k[0] + '@' + k[1])
            if not v:
                continue
            for s in (v.get('selects') or []):
                if (s.get('name') or s.get('id')) != name:
                    continue
                for o in s['opts']:
                    if o['v'] == val:
                        return o['t']
        return None

    def answer(e):
        at, ctx = e['at'], e.get('ctx') or ''
        if e['kind'] == 'linear':
            return '(선택지 없음 - 값 입력 후 다음)'
        if e['kind'] == 'pair':
            rn, sn = e['name'].split(PAIR_SEP)
            rv, sv = e['v'].split(PAIR_SEP)
            a = radio_label(at, ctx, rn, rv) or (MARK + rv)
            b = select_label(at, ctx, sn, sv) or (MARK + sv)
            return a + ' / ' + b
        if e['kind'] == 'radio':
            return (radio_label(at, ctx, e['name'], e['v'])
                    or MARK + e['v'])
        return (select_label(at, ctx, e['name'], e['v'])
                or MARK + e['v'])

    # '— 선택 —' 은 아무것도 고르지 않은 자리표시자입니다. 답이 아닙니다.
    # (순회기가 값 '0' 을 갈래로 잡았는데, 실제로는 첫 실제 선택지와 같은 곳으로
    #  갑니다 — 표와 그림에서 빼야 흐름이 제대로 읽힙니다.)
    def placeholder(e):
        if e['kind'] != 'select':
            return False
        t = select_label(e['at'], e.get('ctx') or '', e['name'], e['v'])
        if t is None:
            return False
        return re.sub(r'[^0-9A-Za-z가-힣]', '', t) in ('선택', 'Select')

    edges = [e for e in E.values() if not placeholder(e)]
    dropped = len(E) - len(edges)
    for e in edges:
        e['_q'] = question(e['at'], e.get('ctx') or '')
        e['_a'] = answer(e)
        e['_ctx'] = e.get('ctx') or ''

    if not os.path.isdir(OUTDIR):
        os.makedirs(OUTDIR)
    # 지난번 그림 파일을 지웁니다. 안 지우면 데이터에서 없앤 갈래(예: ART 가
    # 잠가 둔 제품 유형)의 옛 그림이 그대로 남아 페이지에 다시 실립니다.
    import glob as _glob
    for old_mmd in _glob.glob(os.path.join(OUTDIR, 'flow_*.mmd')):
        os.remove(old_mmd)

    # ── 표 ────────────────────────────────────────────────────────────────
    rows = []
    for e in sorted(edges, key=lambda x: (x['_ctx'], x['at'], x['_a'])):
        dest = e['dest']
        if dest in DEST_NOTE:
            nxt, note = '', DEST_NOTE[dest]
        else:
            nxt, note = short(dest), ''
        rows.append({
            '제품유형': CTX_NAME.get(e['_ctx'], e['_ctx']),
            '화면': short(e['at']),
            '질문': re.sub(r'\s+', ' ', e['_q']).strip(),
            '답': re.sub(r'\s+', ' ', e['_a']).strip(),
            '다음화면': nxt,
            '비고': note,
            '컨트롤': e['name'],
            '값': e['v'],
        })

    cols = ['제품유형', '화면', '질문', '답', '다음화면', '비고', '컨트롤', '값']
    with io.open(os.path.join(OUTDIR, 'flow.csv'), 'w',
                 encoding='utf-8-sig', newline='') as f:
        w = csv.DictWriter(f, fieldnames=cols)
        w.writeheader()
        w.writerows(rows)

    with io.open(os.path.join(OUTDIR, 'flow.md'), 'w', encoding='utf-8') as f:
        f.write('# ART 질문 흐름 표\n\n')
        f.write('간선 %d개 (탐색 완료 %d개)\n\n'
                % (len(rows), sum(1 for r in rows if r['다음화면'])))
        f.write('| ' + ' | '.join(cols[:6]) + ' |\n')
        f.write('|' + '---|' * 6 + '\n')
        for r in rows:
            f.write('| ' + ' | '.join(
                str(r[c]).replace('|', '\\|') for c in cols[:6]) + ' |\n')

    # ── 그림 ──────────────────────────────────────────────────────────────
    by_ctx = collections.defaultdict(list)
    for e in edges:
        by_ctx[e['_ctx']].append(e)

    summary = []
    for ctx in sorted(by_ctx, key=lambda c: -len(by_ctx[c])):
        es = by_ctx[ctx]
        name = CTX_NAME.get(ctx, ctx)

        # (출발, 도착) 로 묶어 같은 화살표에 답을 모읍니다.
        grp = collections.OrderedDict()
        nodes = collections.OrderedDict()
        for e in sorted(es, key=lambda x: (x['at'], x['_a'])):
            nodes[e['at']] = e['_q']
            d = e['dest']
            if d in DEST_NOTE:
                tgt = 'X_' + nid(e['at']) + '_' + str(d)
                grp.setdefault((e['at'], tgt, DEST_NOTE[d]), []).append(e['_a'])
            else:
                nodes.setdefault(d, q_by_screen.get(d, short(d)))
                grp.setdefault((e['at'], d, None), []).append(e['_a'])

        # 원래 크기로 그립니다 (아래 주석은 flow_one.py 와 같은 이유)
        lines = ['%%{init: {"flowchart": {"useMaxWidth": false, "nodeSpacing": 45, "rankSpacing": 55}, "themeVariables": {"fontSize": "15px"}} }%%', 'flowchart TD']
        for u, q in nodes.items():
            lines.append('  %s{"%s"}' % (nid(u), clean(q, 52)))
        stubs = set()
        for (u, t, note), labs in grp.items():
            if note is not None:
                if t not in stubs:
                    stubs.add(t)
                    lines.append('  %s[/"%s"/]' % (re.sub(r'[^0-9A-Za-z_]', '_', t),
                                                   clean(note, 40)))
                tid = re.sub(r'[^0-9A-Za-z_]', '_', t)
            else:
                tid = nid(t)
            if len(labs) > 4:
                lab = '%d개 선택지' % len(labs)
            else:
                lab = '<br/>'.join(clean(x, 34) for x in labs)
            lines.append('  %s -->|"%s"| %s' % (nid(u), lab, tid))

        safe = re.sub(r'[^0-9A-Za-z가-힣·]', '_', name)
        with io.open(os.path.join(OUTDIR, 'flow_%s.mmd' % safe), 'w',
                     encoding='utf-8') as f:
            f.write('\n'.join(lines) + '\n')
        summary.append('%-16s 화면 %3d  화살표 %3d  (간선 %3d)'
                       % (name, len(nodes), len(grp), len(es)))

    done = sum(1 for e in edges if e['dest'] not in DEST_NOTE)
    summary.append('')
    summary.append("자리표시자('— 선택 —') 간선 %d개는 제외했습니다." % dropped)
    txt = ('간선 %d개, 탐색 완료 %d개 (%.0f%%)\n\n' % (
        len(edges), done, 100.0 * done / max(1, len(edges)))
        + '\n'.join(summary) + '\n\n'
        + '문구를 못 찾은 답: %d개\n' % sum(
            1 for e in edges if e['_a'] == e['v'])
        + '문구를 못 찾은 화면: %d개\n' % len(
            set(e['at'] for e in edges if e['_q'] == short(e['at']))))
    with io.open(os.path.join(OUTDIR, 'flow_summary.txt'), 'w',
                 encoding='utf-8') as f:
        f.write(txt)
    print(txt)


if __name__ == '__main__':
    main()
