# -*- coding: utf-8 -*-
"""순회 5차 구멍 번역 (활동 예시 문구)."""
import apply_gaps

PAIRS = [
    ('Manual hammering, beating carpets', 'examples',
     '수동 해머 작업, 카펫 두드리기'),
    ('Example situation: Contained sieving of big bags with only small opening',
     'options', '예시 상황: 작은 개구부만 있는 빅백의 밀폐 체질'),
]

apply_gaps.run(PAIRS)
