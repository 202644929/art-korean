# -*- coding: utf-8 -*-
"""순회 8차 구멍 번역 — 연마 블라스팅 화면(이전 세션이 못 갔던 곳)."""
import apply_gaps

PAIRS = [
    # 화면 제목
    ('Abrasive Blasting Technique', 'wizard', '연마 블라스팅 기법'),
    ('Abrasive Blasting Direction', 'wizard', '연마 블라스팅 방향'),

    # 안내문 — 기존 긴 안내문의 앞부분만 따로 쓰이는 판
    ('For this activity class, exposure is estimated to the solid material',
     'guidance',
     '이 활동 등급에서는 마모되는 고체 재료(또는 고체 기질 내부나 표면의 액체)에 '
     '대한 노출을 추정합니다.'),

    # 설명 상자 — 습식 블라스팅
    ('Includes systems where a mixture of abrasive and water is propelled',
     'descriptions',
     '연마재와 물의 혼합물을 압축공기로 분사하는 방식, 연마 블라스팅 노즐에 물을 '
     '공급하는 방식, 또는 워터젯 박리 방식을 포함합니다.'),
]

apply_gaps.run(PAIRS)
