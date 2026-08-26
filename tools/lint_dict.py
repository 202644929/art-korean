# -*- coding: utf-8 -*-
"""사전 품질 점검. 빌드를 막지는 않고 의심스러운 항목만 보고합니다.

찾는 것
  1. 값이 비었거나 원문과 같음 (번역이 안 된 것)
  2. 값에 한글이 전혀 없음 (영어를 그대로 넣어둔 것)
  3. 같은 원문이 여러 구역에서 서로 다르게 번역됨
  4. 다른 키의 앞부분인 짧은 키 — **대개 정상입니다**. 부분 치환은 긴 키부터
     적용하므로 긴 쪽이 먼저 맞습니다. 다만 수집기가 문장을 잘라 넣은 경우
     (예: 80자 절단)를 잡아내는 데 쓸모가 있어 남겨 둡니다.
  5. 값 안에 HTML 태그가 남아 있음 (조각으로 쪼개야 하는데 통째로 넣은 것)
"""
import collections
import io
import json
import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
HAN = re.compile(u'[가-힣]')
TAG = re.compile(r'<[a-zA-Z/][^>]*>')
PHRASE_MIN = 14   # 템플릿의 부분 치환 하한과 같아야 합니다


def norm(s):
    return ' '.join(str(s).split())


with io.open(os.path.join(ROOT, 'art-ko-dict.json'), encoding='utf-8') as f:
    d = json.load(f)

flat = {}
bysec = collections.defaultdict(list)
for sec, kv in d.items():
    if sec == '_meta':
        continue
    for k, v in kv.items():
        flat.setdefault(norm(k), []).append((sec, v))
        bysec[sec].append((k, v))

problems = collections.OrderedDict()


def add(kind, msg):
    problems.setdefault(kind, []).append(msg)


for k, hits in flat.items():
    vals = set(v for _, v in hits)
    if len(vals) > 1:
        add(u'같은 원문, 다른 번역',
            u'%s\n      %s' % (k[:90], u' | '.join(u'[%s] %s' % (s, v[:50]) for s, v in hits)))
    for sec, v in hits:
        if not v or not v.strip():
            add(u'값이 빔', u'[%s] %s' % (sec, k[:90]))
        elif norm(v) == k:
            add(u'원문과 같음', u'[%s] %s' % (sec, k[:90]))
        elif not HAN.search(v):
            add(u'한글 없음', u'[%s] %s -> %s' % (sec, k[:70], v[:50]))
        if TAG.search(v):
            add(u'값에 HTML 태그', u'[%s] %s -> %s' % (sec, k[:60], v[:60]))

# 부분 치환 사고를 만드는 접두사 키
keys = sorted(flat, key=len)
for i, a in enumerate(keys):
    if len(a) < PHRASE_MIN:
        continue
    for b in keys[i + 1:]:
        if b != a and b.startswith(a):
            add(u'다른 키의 앞부분 (대개 정상 — 절단 사고만 확인)',
                u'%s\n      (전체: %s)' % (a[:90], b[:90]))
            break

total = 0
for kind, items in problems.items():
    print(u'\n== %s  (%d)' % (kind, len(items)))
    total += len(items)
    for m in items[:25]:
        print(u'   %s' % m)
    if len(items) > 25:
        print(u'   ... %d개 더' % (len(items) - 25))

print(u'\n사전 고유 키 %d개 / 의심 항목 %d개' % (len(flat), total))
