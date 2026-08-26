# -*- coding: utf-8 -*-
"""순회 9차 구멍 번역 — 액체 공간 분무 화면(이전 세션이 못 갔던 곳)."""
import apply_gaps

PAIRS = [
    ('Pest control operations', 'examples', '방제 작업'),
    ('Spraying Liquids in Space', 'wizard', '공간 내 액체 분무'),
    # 기존 긴 안내문의 앞부분만 따로 쓰이는 판
    ('This activity class includes the spraying of liquids into an open space',
     'guidance',
     '이 활동 등급에는 개방된 공간에 액체를 분무하는 작업(예: 연무 처리 또는 '
     '살충 스프레이)이 포함됩니다.'),
]

apply_gaps.run(PAIRS)
