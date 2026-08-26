# -*- coding: utf-8 -*-
"""순회 12차 구멍 번역 — 활동 예시와 발진성 구간."""
import apply_gaps

PAIRS = [
    ('Replacing filters', 'examples', '필터 교체'),
    ('Transportation of drums', 'examples', '드럼 운반'),
    ('Coupling/decoupling of transfer line', 'examples', '이송 배관의 연결/분리'),
    ('Transport of contaminated metal objects', 'examples', '오염된 금속 물체 운반'),
    # 발진성 구간. 단위는 기존 방침대로 원문 유지.
    ('Inhalable fraction: 2000 - 5000 mg/kg', 'options',
     '흡입성 분율: 2000 - 5000 mg/kg'),
]

apply_gaps.run(PAIRS)
