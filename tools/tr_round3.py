# -*- coding: utf-8 -*-
"""순회 3차 구멍 번역 (활동 등급 화면 제목의 제목대문자 변형).
사용법은 apply_gaps.py 참고."""
import apply_gaps

PAIRS = [
    ('Spray Application of Powders', 'wizard', '분말의 분무 적용'),
    ('Movement and Agitation of Powders, Granules or Pelletised Material', 'wizard',
     '분말, 과립 또는 펠릿형 재료의 이동 및 교반'),
]

apply_gaps.run(PAIRS)
