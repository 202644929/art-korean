# -*- coding: utf-8 -*-
"""순회 11차 구멍 번역 — 액체 이송 계열(이전 세션이 못 갔던 곳)."""
import apply_gaps

PAIRS = [
    ('Falling Liquids', 'wizard', '낙하 액체'),
    ('Transfer Loading Type', 'wizard', '이송 적재 방식'),
    ('Transfer of additives in tanker', 'examples', '탱커에 첨가제 이송'),
    ('Example situation: Enclosing panels around machining process', 'options',
     '예시 상황: 기계가공 공정을 둘러싼 밀폐 패널'),
    ('Example situation: Transfer of liquid through a small filling opening',
     'options', '예시 상황: 작은 주입구를 통한 액체 이송 (예: 차량 급유)'),
]

apply_gaps.run(PAIRS)
