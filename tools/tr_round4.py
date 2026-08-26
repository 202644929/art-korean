# -*- coding: utf-8 -*-
"""순회 4차 구멍 번역.

둘 다 기존 항목의 변형입니다.
  * 2차 제어수단 질문의 **근거리장** 판 (사전에는 원거리장 판만 있었음)
  * 정리정돈 문구의 **서술형** 판 ('Are ... in place?' 가 아닌 설명문, 'eg' 표기)
"""
import apply_gaps

PAIRS = [
    ('Are there any secondary control measures in close proximity of the '
     'near-field emission source', 'questions',
     '이전 질문에서 지정한 1차 제어수단 외에, 근거리장 배출 발생원 근처에 배출을 '
     '최소화하기 위한 2차 제어수단이 있습니까?'),
    ('Demonstrable and effective housekeeping practices', 'descriptions',
     '입증 가능하고 효과적인 정리정돈 관행 (예: 적절한 방법(예: 진공청소)을 이용한 '
     '매일 청소, 기계 및 제어수단의 예방적 유지보수, 유출물을 튕겨내어 개인 분진운을 '
     '줄이는 보호복 착용).'),
]

apply_gaps.run(PAIRS)
