# -*- coding: utf-8 -*-
"""mermaid 원본을 올리기 전에 문법을 검사합니다.

mermaid 를 설치하지 않고, 실제로 깨지는 것들만 봅니다.
  - subgraph / end 짝
  - 따옴표 짝
  - 라벨 안에서 mermaid 가 구문으로 읽는 글자 (#, ;, 대괄호, 중괄호)
  - 예약어를 쓴 노드 id
  - 정의 없이 화살표에만 나오는 노드 id

  python lint_mmd.py [파일...]      (없으면 flow/*.mmd 전부)
"""
import io
import os
import re
import sys
import glob

HERE = os.path.dirname(os.path.abspath(__file__))
RESERVED = {'end', 'graph', 'subgraph', 'style', 'class', 'click', 'o', 'x',
            'flowchart', 'direction'}
BAD_IN_LABEL = {'#': '엔티티 시작으로 읽습니다', ';': '문장 끝으로 읽습니다',
                '[': '노드 문법', ']': '노드 문법',
                '{': '노드 문법', '}': '노드 문법'}
# mermaid 가 지원하는 인라인 태그. 이 밖의 태그는 그대로 글자로 보입니다.
OK_TAGS = {'br', 'br/'}


def lint(path):
    src = io.open(path, encoding='utf-8').read()
    errs = []
    warns = []

    depth = 0
    for i, line in enumerate(src.splitlines(), 1):
        t = line.strip()
        if t.startswith('subgraph'):
            depth += 1
        elif t == 'end':
            depth -= 1
            if depth < 0:
                errs.append('%d행: end 가 subgraph 보다 많습니다' % i)
        if t.count('"') % 2:
            errs.append('%d행: 따옴표 짝이 안 맞습니다 — %s' % (i, t[:60]))
    if depth:
        errs.append('subgraph %d개가 end 없이 남았습니다' % depth)

    # 라벨 안 내용 검사
    for m in re.finditer(r'"([^"]*)"', src):
        lab = m.group(1)
        line = src[:m.start()].count('\n') + 1
        for ch, why in BAD_IN_LABEL.items():
            if ch in lab:
                errs.append('%d행: 라벨에 %r — %s: %s'
                            % (line, ch, why, lab[:50]))
        for tag in re.findall(r'<\s*/?\s*([a-zA-Z][a-zA-Z0-9/]*)\s*>', lab):
            if tag.lower().strip('/') not in {'br'}:
                warns.append('%d행: 라벨의 <%s> 는 그대로 글자로 보입니다: %s'
                             % (line, tag, lab[:40]))

    # 노드 id 수집
    defined = set(re.findall(r'^\s*([A-Za-z][\w]*)\s*[\[{(]', src, re.M))
    used = set()
    for m in re.finditer(r'^\s*([A-Za-z][\w]*)\s*-[.-]*->', src, re.M):
        used.add(m.group(1))
    for m in re.finditer(r'->\s*(?:\|[^|]*\|\s*)?([A-Za-z][\w]*)\s*$', src, re.M):
        used.add(m.group(1))
    for nid in sorted(defined | used):
        if nid.lower() in RESERVED:
            errs.append('노드 id %r 는 예약어입니다' % nid)
    ghost = sorted(used - defined)
    if ghost:
        warns.append('정의 없이 화살표에만 나오는 id %d개 (모양이 기본값이 됩니다): %s'
                     % (len(ghost), ', '.join(ghost[:6])))

    return errs, warns


def main():
    files = sys.argv[1:] or sorted(glob.glob(os.path.join(HERE, 'flow', '*.mmd')))
    bad = 0
    for p in files:
        errs, warns = lint(p)
        name = os.path.basename(p)
        if not errs and not warns:
            print('OK    %s' % name)
            continue
        print('%-5s %s' % ('오류' if errs else '참고', name))
        for e in errs:
            print('   ✗ %s' % e)
            bad += 1
        for w in warns:
            print('   · %s' % w)
    print('\n%s' % ('오류 %d건' % bad if bad else '문법 오류 없음'))
    return 1 if bad else 0


if __name__ == '__main__':
    sys.exit(main())
