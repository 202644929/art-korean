# -*- coding: utf-8 -*-
"""dom_diff.py 가 뽑은 art-dom-nearmiss.json 을 사전에 반영합니다.

'표기 차이' 는 번역이 이미 있는데 실제 화면의 표기(대소문자·문장부호·공백)가
사전 키와 달라서 안 걸리는 경우입니다. 조회 규칙을 느슨하게 푸는 대신
(3.4절 부분 치환 정책과 충돌) 화면 표기를 변형 키로 추가합니다.

    python apply_nearmiss.py --dry
    python apply_nearmiss.py
"""
import json, io, sys, collections

near = json.load(io.open('art-dom-nearmiss.json', encoding='utf-8'))
if not near:
    raise SystemExit('표기 차이 없음')

p = '../art-ko-dict.json'
d = json.load(io.open(p, encoding='utf-8'), object_pairs_hook=collections.OrderedDict)

# 원본 키가 어느 섹션에 있는지 찾아 같은 섹션에 넣습니다
where = {}
for sec, e in d.items():
    if sec != '_meta':
        for k in e:
            where.setdefault(k, sec)

added = 0
for r in near:
    dom, key, ko = r['dom'], r['dict_key'], r['ko']
    sec = where.get(key, 'wizard')
    if dom in d.get(sec, {}):
        continue
    print('  [%s] %s' % (sec, dom[:90]))
    if '--dry' not in sys.argv:
        d.setdefault(sec, collections.OrderedDict())[dom] = ko
    added += 1

print('%s %d개' % ('추가 예정' if '--dry' in sys.argv else '추가', added))
if '--dry' not in sys.argv:
    io.open(p, 'w', encoding='utf-8', newline='\n').write(
        json.dumps(d, ensure_ascii=False, indent=2) + '\n')
