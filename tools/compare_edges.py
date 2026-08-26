# 계정을 달리해 따로 돌린 순회 결과들을 맞대 봅니다.
#
#   python compare_edges.py crawl_edges.json crawl_edges.b.json [...]
#   python compare_edges.py                  (인자 없으면 crawl_edges*.json 전부)
#
# 왜 하는가: 이 순회는 오류 없이 조용히 틀릴 수 있습니다. 7차 세션에서 잠긴
# 라디오를 눌러 놓고 성공했다고 믿은 탓에 거짓 간선 141개가 쌓였는데 예외는
# 하나도 안 났습니다. **같은 자리를 두 계정이 서로 다르게 적었다면** 거기가
# 그때그때 달라지는 곳이고, 곧 의심할 자리입니다.
#
# 보는 것 세 가지:
#   1. 한쪽에만 있는 간선  — 순회가 놓쳤거나 계정마다 화면이 다름
#   2. 같은 간선인데 도착지가 다름 — 제일 위험. 흐름도가 갈립니다.
#   3. 상태(BLOCKED/DISABLED/PRUNED)가 엇갈림 — 판정이 흔들리는 자리

import glob
import json
import sys
from collections import defaultdict

STATUS = {'BLOCKED', 'DISABLED', 'PRUNED', 'UNREACHABLE'}


def load(p):
    with open(p, encoding='utf-8') as f:
        return json.load(f).get('edges', {})


def main():
    files = [a for a in sys.argv[1:] if not a.startswith('--')]
    if not files:
        files = sorted(glob.glob('crawl_edges*.json'))
    # .pre-* 는 형식을 바꾸기 전 백업이라 맞대 볼 대상이 아닙니다.
    if not sys.argv[1:]:
        files = [f for f in files if '.pre-' not in f]
    if len(files) < 2:
        print(f'맞대 볼 파일이 둘 이상 필요합니다. 지금: {files}')
        return

    sets = {}
    for f in files:
        sets[f] = load(f)
        print(f'{f}: 간선 {len(sets[f])}개')

    allkeys = set()
    for d in sets.values():
        allkeys |= set(d)
    print(f'\n간선 자리 합집합: {len(allkeys)}개')

    only = defaultdict(list)
    destdiff = []
    statdiff = []
    for k in sorted(allkeys):
        have = [f for f in files if k in sets[f]]
        if len(have) < len(files):
            only[tuple(have)].append(k)
            continue
        ds = {f: sets[f][k].get('dest') for f in have}
        vals = set(map(str, ds.values()))
        if len(vals) == 1:
            continue
        if vals & STATUS and not (vals - STATUS):
            statdiff.append((k, ds))
        else:
            destdiff.append((k, ds))

    print(f'\n--- 1. 한쪽에만 있는 간선 ---')
    if not only:
        print('  없습니다. 세 순회가 같은 자리를 찾았습니다.')
    for have, ks in sorted(only.items(), key=lambda x: -len(x[1])):
        print(f'  {len(ks):4d}개  {" + ".join(have)} 에만')
        for k in ks[:6]:
            print(f'        {k}')
        if len(ks) > 6:
            print(f'        ... 외 {len(ks) - 6}개')

    print(f'\n--- 2. 도착지가 다름 (제일 위험) ---')
    if not destdiff:
        print('  없습니다.')
    for k, ds in destdiff[:30]:
        print(f'  {k}')
        for f, v in ds.items():
            print(f'      {f}: {v}')
    if len(destdiff) > 30:
        print(f'  ... 외 {len(destdiff) - 30}개')

    print(f'\n--- 3. 판정이 엇갈림 ---')
    if not statdiff:
        print('  없습니다.')
    for k, ds in statdiff[:30]:
        print(f'  {k}   ' + ', '.join(f'{f.split(".")[-2]}={v}' for f, v in ds.items()))
    if len(statdiff) > 30:
        print(f'  ... 외 {len(statdiff) - 30}개')

    bad = len(destdiff) + len(statdiff) + sum(len(v) for v in only.values())
    print(f'\n어긋난 자리 합계: {bad}개')
    if bad == 0:
        print('순회 결과가 계정을 바꿔도 그대로입니다. 믿을 만합니다.')


if __name__ == '__main__':
    main()
