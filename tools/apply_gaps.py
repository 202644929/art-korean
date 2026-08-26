# -*- coding: utf-8 -*-
"""gaps.json 의 미번역 문장에 번역을 붙여 사전에 넣습니다.

긴 문단을 손으로 다시 적으면 오타 한 글자로 매칭이 조용히 깨집니다. 그래서
**앞부분(접두사)** 으로만 지목하고 전체 문장은 gaps.json 에서 그대로 가져옵니다.
접두사가 0개 또는 2개 이상과 맞으면 실패시킵니다 — 조용히 넘어가면 번역이
사라진 줄도 모르게 됩니다.

    python apply_gaps.py TR/<파일>.py       번역 정의 파일을 지정
    python apply_gaps.py --check           맞춤 여부만 확인
"""
import collections
import io
import json
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
DICT = os.path.join(ROOT, 'art-ko-dict.json')


def norm(s):
    return ' '.join(str(s).split())


def load_gaps():
    p = os.path.join(HERE, 'gaps.json')
    with io.open(p, encoding='utf-8') as f:
        return list(json.load(f))


def resolve(pairs, gaps):
    """pairs: [(prefix, section, korean)] -> {(section, fullkey): korean}"""
    out = collections.OrderedDict()
    problems = []
    for prefix, sec, ko in pairs:
        pn = norm(prefix)
        hits = [g for g in gaps if g.startswith(pn)]
        if len(hits) == 1:
            out[(sec, hits[0])] = ko
            continue
        exact = [g for g in hits if g == pn]
        if len(exact) == 1:
            out[(sec, exact[0])] = ko
            continue
        problems.append((len(hits), prefix[:70]))
    return out, problems


def merge(resolved):
    with io.open(DICT, encoding='utf-8') as f:
        d = json.load(f, object_pairs_hook=collections.OrderedDict)
    n = 0
    for (sec, key), ko in resolved.items():
        d.setdefault(sec, collections.OrderedDict())[key] = ko
        n += 1
    with io.open(DICT, 'w', encoding='utf-8') as f:
        json.dump(d, f, ensure_ascii=False, indent=1)
        f.write(u'\n')
    return n


def run(pairs):
    gaps = load_gaps()
    resolved, problems = resolve(pairs, gaps)
    for cnt, pre in problems:
        print('  실패(%d개 일치): %s' % (cnt, pre))
    if problems:
        print('\n%d개를 못 붙였습니다. 접두사를 고치십시오.' % len(problems))
        sys.exit(1)
    if '--check' in sys.argv:
        print('%d개 모두 매칭됨 (사전에는 안 넣음)' % len(resolved))
        return
    n = merge(resolved)
    print('%d개를 사전에 추가했습니다.' % n)
