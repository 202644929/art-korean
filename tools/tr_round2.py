# -*- coding: utf-8 -*-
"""순회 2차 구멍 번역. 사용법은 apply_gaps.py 참고."""
import apply_gaps

PAIRS = [
    ('Scenario Overview - ART Mechanistic Model', 'wizard',
     '시나리오 개요 - ART 기계론적 모델'),
    ('ART Mechanistic Scenario', 'wizard', 'ART 기계론적 시나리오 — 활동 구성'),
    ('Compressing of Powders, Granules or Pelletised Material', 'wizard',
     '분말, 과립 또는 펠릿형 재료의 압축'),
    ('Process fully enclosed (air tight) and the integrity of the enclosure is '
     'monitored at least once a month.', 'descriptions',
     '공정이 완전히 밀폐(기밀)되어 있고, 밀폐 상태의 건전성을 최소 월 1회 점검합니다. '
     '시료 채취나 일상 청소 등을 위해 밀폐를 해제하지 않습니다.'),
]

apply_gaps.run(PAIRS)
