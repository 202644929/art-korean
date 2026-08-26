# 병렬로 모은 문구 조각들을 crawl_labels.json 하나로 합칩니다.
#
#   python merge_labels.py            crawl_labels.s*.json 을 찾아 합침
#   python merge_labels.py --write    실제로 씀
#
# 일꾼마다 맡은 조합이 겹치지 않으므로 보통 충돌이 없습니다. 그래도 같은 키가
# 두 곳에 있으면 **내용이 같은지** 봅니다. 다르면 그 화면은 계정/세션에 따라
# 달리 보인다는 뜻이라 그냥 덮어쓰면 안 됩니다 — 목록으로 뽑아 보여 줍니다.

import glob
import json
import sys

BASE = 'crawl_labels.json'


def load(p):
    try:
        with open(p, encoding='utf-8') as f:
            return json.load(f)
    except (OSError, ValueError):
        return {}


def main():
    write = '--write' in sys.argv
    parts = sorted(glob.glob('crawl_labels.s*.json'))
    if not parts:
        print('합칠 조각이 없습니다 (crawl_labels.s*.json).')
        return

    out = load(BASE)
    print(f'{BASE}: {len(out)}개로 시작')

    added = 0
    conflicts = []
    for p in parts:
        d = load(p)
        new = 0
        for k, v in d.items():
            if k not in out:
                out[k] = v
                new += 1
                added += 1
            elif json.dumps(out[k], sort_keys=True, ensure_ascii=False) \
                    != json.dumps(v, sort_keys=True, ensure_ascii=False):
                conflicts.append((k, p))
        print(f'  {p}: {len(d)}개 중 새로 {new}개')

    print(f'\n합계 {len(out)}개 (새로 {added}개)')
    if conflicts:
        print(f'\n같은 조합인데 내용이 다릅니다 — {len(conflicts)}개:')
        for k, p in conflicts[:20]:
            print(f'  {k}   ({p})')
        print('  기존 값을 그대로 두었습니다. 확인이 필요합니다.')

    if write:
        with open(BASE, 'w', encoding='utf-8') as f:
            json.dump(out, f, ensure_ascii=False, indent=1)
        print(f'\n{BASE} 갱신했습니다.')
    else:
        print('\n(미리보기입니다. 실제로 쓰려면 --write)')


if __name__ == '__main__':
    main()
