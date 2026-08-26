# -*- coding: utf-8 -*-
"""근거리장 / 원거리장 짝 맞추기.

ART 는 같은 질문을 근거리장과 원거리장 양쪽에서 물어봅니다. 문구는 발생원 이름만
다릅니다.

    Are there any control measures in close proximity of the far field  emission source ...
    Are there any control measures in close proximity of the near-field emission source ...

사전에는 원거리장 판만 있어서 근거리장 화면에서 영어로 남았습니다.

**모든 far field 문구를 뒤집지는 않습니다.** 뜻이 안 통하는 것이 있습니다.
  "Is the worker located further than 4 metres from this far field source?"
  → 근거리장은 정의상 1 m 이내이므로 이 질문의 근거리장 판은 존재하지 않습니다.
그래서 양쪽에 실제로 존재하는 **제어수단 질문 계열만** 짝을 만듭니다.

    python nearfield_variants.py --dry
    python nearfield_variants.py
"""
import collections
import io
import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DICT = os.path.join(ROOT, 'art-ko-dict.json')

# 양쪽에 다 존재하는 질문 계열만
SAFE = re.compile(r'control measures in close proximity of the far[- ]field '
                  r'emission source', re.I)
FAR = re.compile(r'far([- ])field', re.I)


def norm(s):
    return ' '.join(str(s).split())


with io.open(DICT, encoding='utf-8') as f:
    d = json.load(f, object_pairs_hook=collections.OrderedDict)

have = set()
for sec, kv in d.items():
    if sec == '_meta':
        continue
    for k in kv:
        have.add(norm(k))

add = []
for sec, kv in list(d.items()):
    if sec == '_meta':
        continue
    for k, v in list(kv.items()):
        kn = norm(k)
        if not SAFE.search(kn):
            continue
        near = FAR.sub(lambda m: 'near' + m.group(1) + 'field', kn)
        if near == kn or near in have:
            continue
        ko = v.replace(u'원거리장', u'근거리장')
        if ko == v:
            print(u'  건너뜀(한국어에 원거리장이 없음): %s' % kn[:70])
            continue
        add.append((sec, near, ko))
        have.add(near)

if '--dry' in sys.argv:
    for sec, k, v in add:
        print(u'  [%s] %s\n        -> %s' % (sec, k[:110], v[:90]))
    print(u'\n추가 대상 %d개' % len(add))
else:
    for sec, k, v in add:
        d[sec][k] = v
    with io.open(DICT, 'w', encoding='utf-8') as f:
        json.dump(d, f, ensure_ascii=False, indent=1)
        f.write(u'\n')
    print(u'사전에 근거리장 짝 %d개 추가' % len(add))
