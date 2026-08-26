# -*- coding: utf-8 -*-
"""ART 는 같은 문구를 두 가지 대소문자로 씁니다.

    선택지(왼쪽 패널)  Fracturing of powders, granules or pelletised material
    화면 제목          Fracturing of Powders, Granules or Pelletised Material

사전에 하나만 있으면 다른 쪽이 영어로 남습니다. 하나씩 발견해 넣는 대신
제목대문자 변형을 규칙으로 만들어 둡니다.

규칙
  * 관사·전치사·접속사(of, or, and, with, in, to ...)는 소문자로 둡니다.
    단 맨 앞이거나 '(' 또는 '/' 바로 뒤면 대문자로 올립니다.
  * 이미 대문자가 섞인 낱말(LEV, ART, RPE, HEPA)은 그대로 둡니다.
  * 마침표로 끝나는 문장은 제목이 아니므로 건너뜁니다.

**기본 빌드 파이프라인에 넣지 마십시오.** 순회기(crawl.js)가 실제 화면의 제목을
그대로 수집하고 gaps.py 가 빠진 것을 알려주므로, 실측이 항상 더 정확합니다.
규칙으로 157개를 만들면 화면에 없는 키로 사전만 부풀고 대소문자 오변환 위험만
커집니다. 순회기가 못 가는 화면이 생겼을 때의 **비상용**입니다.

    python titlecase_variants.py --dry      추가할 목록만 보기
    python titlecase_variants.py            (비상시에만) 사전에 추가
"""
import collections
import io
import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DICT = os.path.join(ROOT, 'art-ko-dict.json')

SMALL = set('a an and as at but by for from in into nor of on or the to with'.split())
# '(e.g. copper...)' 를 '(E.g. Copper...)' 로 만들면 안 됩니다.
KEEP_LOWER = set(['e.g.', 'i.e.', 'incl.', 'etc.', 'vs.'])
# 단위는 절대 대문자로 올리면 안 됩니다. '0.5 Kg' 같은 것은 사이트에 없습니다.
UNITS = set(('kg g mg ug min h s m cm mm km ml l ppm ppb kpa pa bar '
             'gram grams kilogram minute minutes hour hours').split())
# 제목대문자 변형을 만들 구역. 질문문·안내문은 제목으로 쓰이지 않습니다.
SECTIONS = ('options', 'wizard', 'workflow', 'results', 'bayesian')
WORD = re.compile(r"^([^A-Za-z]*)([A-Za-z][A-Za-z'’-]*)(.*)$", re.S)


def titlecase(s):
    words = s.split(' ')
    out = []
    start = True          # 다음 낱말을 반드시 대문자로 올려야 하는가
    for w in words:
        m = WORD.match(w)
        if not m:
            out.append(w)
            if w.endswith('(') or w.endswith('/'):
                start = True
            continue
        pre, core, post = m.groups()
        if pre.endswith('(') or pre.endswith('/') or pre.endswith('–') \
                or pre.endswith('-'):
            force = True
        else:
            force = start
        low_all = (core + post).lower()
        if low_all.startswith(tuple(KEEP_LOWER)) or core.lower() in UNITS:
            new = core.lower()
        elif core[1:] != core[1:].lower():
            new = core                       # LEV, HEPA, ART 처럼 대문자가 섞인 것
        elif not force and core.lower() in SMALL:
            new = core.lower()
        else:
            new = core[0].upper() + core[1:]
        out.append(pre + new + post)
        start = post.endswith(':') or post.endswith('/') or post.endswith('(')
    return ' '.join(out)


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
for sec in SECTIONS:
    for k, v in list(d.get(sec, {}).items()):
        kn = norm(k)
        if kn.endswith('.') or kn.endswith('?') or kn.endswith('!'):
            continue
        if len(kn) < 20 or len(kn) > 110:
            continue
        # ART 가 제목대문자로 쓰는 것은 '활동 등급/하위등급 이름' 뿐입니다.
        # (예: 'Fracturing of powders...' -> 'Fracturing of Powders...')
        # 나머지(수분 함량 구간, 온도 구간 등)는 제목으로 안 쓰이므로 만들지
        # 않습니다. 677개를 다 넣으면 쓰이지도 않는 키로 사전만 부풀고
        # 'E.g.' 같은 오변환 위험만 커집니다. 못 잡은 건 순회기가 찾아냅니다.
        low = ' ' + kn.lower() + ' '
        # 'Activities with agitated surfaces' -> 'Activities with Agitated Surfaces'
        if ' of ' not in low and ' and ' not in low and ' with ' not in low:
            continue
        if kn[0].islower():
            continue
        t = titlecase(kn)
        if t == kn or t in have:
            continue
        add.append((sec, t, v))
        have.add(t)

if '--dry' in sys.argv:
    for sec, t, v in add:
        print(u'  [%s] %s\n        -> %s' % (sec, t, v[:70]))
    print(u'\n추가 대상 %d개' % len(add))
else:
    for sec, t, v in add:
        d[sec][t] = v
    with io.open(DICT, 'w', encoding='utf-8') as f:
        json.dump(d, f, ensure_ascii=False, indent=1)
        f.write(u'\n')
    print(u'사전에 제목대문자 변형 %d개 추가' % len(add))
