# -*- coding: utf-8 -*-
"""순회 10차 구멍 번역.

`Contamination < 10 % of surface` — ART 자체 문구가 일관되지 않습니다.
사전에는 `< 10 % surface`(of 없음)만 있었고, 다른 구간은 `10-90 % of surface`
(of 있음)입니다. 규칙으로 만들면 노이즈만 늘어나므로 이 하나만 직접 넣습니다.
"""
import apply_gaps

PAIRS = [
    ('Contamination < 10 % of surface', 'options', '표면의 < 10 % 오염'),
]

apply_gaps.run(PAIRS)
