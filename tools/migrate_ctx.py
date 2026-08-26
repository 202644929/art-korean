# crawl_edges.json 의 문맥(ctx) 형식을 바꿉니다.
#
#   전: 제품 유형만            "rbGranularMaterial"
#   후: 제품 유형 + 근거리/원거리  "rbGranularMaterial+rbYes"
#
# 왜: 근거리로 도착한 화면과 원거리로 도착한 화면이 같은 키가 되어, 먼저 도착한
# 쪽만 자식 갈래를 열거하고 끝났습니다. 그래서 원거리에서만 나오는 격리·개인 밀폐
# 화면이 그래프에서 통째로 빠졌습니다.
#
# 간선마다 path 가 통째로 남아 있으므로 **다시 순회하지 않고** 계산으로 옮길 수
# 있습니다. 옮긴 뒤 crawl.js 를 돌리면 새로 생긴 빈 문맥만 채웁니다.
#
#   python migrate_ctx.py          미리보기 (파일 안 건드림)
#   python migrate_ctx.py --write  실제로 씀

import json
import sys

CTX_SCREENS = ['q016_nearfieldsource']          # crawl.js 와 같아야 합니다
SRC = 'crawl_edges.json'


def ctx_of(path):
    """crawl.js 의 ctxOf 와 같은 규칙."""
    if not path:
        return ''
    parts = [str(path[0].get('v'))]
    for ch in path:
        at = ch.get('at') or ''
        if any(s in at for s in CTX_SCREENS):
            parts.append(str(ch.get('v')))
    return '+'.join(parts)


def edge_key(e):
    """crawl.js 의 edgeKey 와 같은 규칙."""
    return (e['at'] + '@' + (e.get('ctx') or '')
            + '|' + e['kind'] + '|' + e['name'] + '|' + str(e['v']))


def main():
    write = '--write' in sys.argv
    d = json.load(open(SRC, encoding='utf-8'))
    edges = d['edges']

    out = {}
    collisions = []
    for old_key, e in edges.items():
        path = e.get('path') or []
        # path 각 단계의 ctx = 그 단계 **이전까지**의 문맥
        for i, ch in enumerate(path):
            ch['ctx'] = ctx_of(path[:i])
        # 간선 자신의 ctx = 마지막 단계를 뺀 문맥
        e['ctx'] = ctx_of(path[:-1]) if path else ''
        k = edge_key(e)
        if k in out:
            collisions.append((old_key, k))
            continue
        out[k] = e

    # enumerated 재구성 — 간선이 있다는 것은 그 (화면@문맥) 이 열거됐다는 뜻입니다.
    # 새 문맥으로 갈라진 쪽은 여기 없으므로, crawl.js 가 다음에 가서 열거합니다.
    enumerated = sorted({e['at'] + '@' + (e.get('ctx') or '') for e in out.values()})

    by_ctx = {}
    for e in out.values():
        by_ctx[e.get('ctx') or '(뿌리)'] = by_ctx.get(e.get('ctx') or '(뿌리)', 0) + 1

    print(f'간선      {len(edges)} -> {len(out)}   (키 충돌로 합쳐짐 {len(collisions)})')
    print(f'enumerated {len(d["enumerated"])} -> {len(enumerated)}')
    print('\n문맥별 간선 수 (상위 12):')
    for k, v in sorted(by_ctx.items(), key=lambda x: -x[1])[:12]:
        print(f'  {v:5d}  {k}')

    far = [e for e in out.values() if '+rbNo' in (e.get('ctx') or '')]
    print(f'\n원거리(+rbNo) 문맥 간선: {len(far)}개')

    if write:
        d['edges'] = out
        d['enumerated'] = enumerated
        json.dump(d, open(SRC, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
        print(f'\n{SRC} 갱신했습니다.')
    else:
        print('\n(미리보기입니다. 실제로 쓰려면 --write)')


if __name__ == '__main__':
    main()
