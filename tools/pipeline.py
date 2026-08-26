# -*- coding: utf-8 -*-
"""번역을 사전에 넣은 뒤 항상 이 순서로 돌립니다.

    python pipeline.py

순서가 중요합니다.
  1. 변형 생성 (철자·활자·제목대문자·근거리장 짝) — 원본 항목이 있어야 파생됩니다
  2. 빌드 — 사전을 템플릿에 넣어 유저스크립트를 만듭니다
  3. 테스트 — 폼 전송 데이터 동일성이 합격 기준입니다. 실패하면 배포하지 마십시오
  4. 사전 점검 — 빈 값·절단 키·구역 간 충돌

제목대문자 변형 도구는 **비상용이라 여기 넣지 않습니다.** 실제 화면 제목은
순회기가 수집하고 gaps.py 가 알려줍니다 (titlecase_variants.py 머리말 참고).
"""
import os
import subprocess
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
STEPS = [
    (u'철자 변형 (minimise/minimize, far-field/far field)', ['spelling_variants.py']),
    (u'활자 변형 (m² / m2, 붙임표, 곱셈표)', ['typography_variants.py']),
    (u'근거리장 짝 맞추기', ['nearfield_variants.py']),
    (u'빌드', ['build.py']),
]

env = dict(os.environ, PYTHONIOENCODING='utf-8')
fail = 0

for label, cmd in STEPS:
    print(u'\n>>> %s' % label, flush=True)
    r = subprocess.run([sys.executable] + cmd, cwd=HERE, env=env)
    if r.returncode:
        print(u'    실패 — 중단합니다', flush=True)
        sys.exit(r.returncode)

print(u'\n>>> 테스트', flush=True)
r = subprocess.run(['node', 'test.js'], cwd=HERE, env=env)
if r.returncode:
    print(u'\n테스트 실패. 배포하지 마십시오.', flush=True)
    sys.exit(r.returncode)

print(u'\n>>> 사전 점검', flush=True)
subprocess.run([sys.executable, 'lint_dict.py'], cwd=HERE, env=env)

print(u'\n>>> 남은 구멍', flush=True)
subprocess.run([sys.executable, 'gaps.py'], cwd=HERE, env=env)
print(u'\n완료.', flush=True)
