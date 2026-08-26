# -*- coding: utf-8 -*-
"""순회 6차 구멍 번역 (활동 예시·예시 상황)."""
import apply_gaps

PAIRS = [
    ('Manual mixing', 'examples', '수동 혼합'),
    ('Manual dumping of powders', 'examples', '분말 수동 투하'),
    ('Vacuum transfer from reservoir with small opening to enclosed reservoir',
     'examples', '작은 개구부가 있는 저장조에서 밀폐 저장조로의 진공 이송'),
    ('Example situation: Enclosed tabletting machine', 'options',
     '예시 상황: 밀폐형 타정기 (비교적 작은 개구부는 있을 수 있음)'),
]

apply_gaps.run(PAIRS)
