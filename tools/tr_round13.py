# -*- coding: utf-8 -*-
"""순회 13차 — 마법사 밖 화면(결과 도움말 문서, 컨소시엄, 화면 제목).

`pagehelp-mechanisticresults.aspx` 는 결과 화면의 '?' 도움말 문서입니다.
전 교대시간 노출과 장기 평균 노출의 차이, 백분위수와 신뢰구간을 설명하는
부분이라 실제 사용에 가장 중요한 문단입니다.

기관명은 **한국어 명칭 + 약어** 형태로 씁니다. 원래 이름을 통째로 지우면
로고 옆 설명이 무슨 기관인지 확인할 수 없게 됩니다.
"""
import apply_gaps

PAIRS = [
    # ── 화면 제목 ────────────────────────────────────────────────────────────
    ('The Advanced Reach Tool - ART', 'site', 'ART — 고급 REACH 도구'),
    ('Advanced REACH Tool', 'site', 'ART (고급 REACH 도구)'),
    ('ART — Scenarios', 'site', 'ART — 시나리오'),
    ('Support - ART', 'site', '지원 - ART'),
    ('Training - ART', 'site', '교육 - ART'),
    ('Consortium - ART', 'site', '컨소시엄 - ART'),
    ('Start new scenario', 'nav', '새 시나리오 시작'),

    # ── 컨소시엄 화면 본문 조각 ──────────────────────────────────────────────
    (', the Dutch Government, the', 'site', ', 네덜란드 정부, '),
    (', Shell, Eurometaux, the', 'site', ', Shell, Eurometaux, '),

    # ── 기관명 (로고의 title 속성) ───────────────────────────────────────────
    ('Health and Safety Executive', 'site', '영국 보건안전청(HSE)'),
    ('Health and Safety Laboratory', 'site', '영국 보건안전연구소(HSL)'),
    ('Institute of Occupational Medicine', 'site', '산업의학연구소(IOM)'),
    ('Institute of Risk Assessment Sciences', 'site', '위험성평가과학연구소(IRAS)'),
    ('British Occupational Hygiene Society', 'site', '영국산업위생학회(BOHS)'),
    ('Long-range Research Initiative', 'site', '장기연구 이니셔티브(LRI)'),
    ('GlaxoSmithKline', 'site', '글락소스미스클라인(GSK)'),
    ('Nederlandse Organisatie voor Toegepast Natuurwetenschappelijk Onderzoek',
     'site', '네덜란드 응용과학연구기구(TNO)'),
    ('Bundesanstalt für Arbeitsschutz und Arbeitsmedizin', 'site',
     '독일 연방 산업안전보건연구원(BAuA)'),
    ('Det Nationale Forskningscenter for Aberjdsmiljø', 'site',
     '덴마크 국립산업환경연구센터(NRCWE)'),
    ('Agence Française de Sécurité Sanitaire de l', 'site',
     '프랑스 환경·산업보건안전청(AFSSET)'),
    ('Conseil Europeen des Federations de l', 'site', '유럽화학산업협의회(Cefic)'),

    # ── 결과 화면 도움말 문서 ────────────────────────────────────────────────
    ('ART offers two types of exposure prediction:', 'results',
     'ART 는 두 가지 유형의 노출 예측을 제공합니다:'),
    ('Full-Shift exposure', 'results', '전 교대시간 노출'),
    ('ART calculates an overall distribution for full-shift exposures.', 'results',
     'ART 는 전 교대시간 노출에 대한 전체 분포를 계산합니다. 이때 90 백분위수는, '
     '무작위로 고른 작업자가 무작위로 고른 날에 받는 노출이 그 값을 넘을 확률이 '
     '10 % 인 노출 수준을 뜻합니다.'),
    ('This measure can also be used for short-term estimates', 'results',
     '이 지표는 단기 추정에도 쓸 수 있지만, 단기 노출(60분 미만)은 변동 양상이 다를 '
     '수 있음을 감안해야 합니다. ART 의 전 교대시간 지표는 4시간 이상 측정한 자료에서 '
     '도출한 변동성 추정값에 기반합니다.'),
    ("ART calculates the distribution of workers' long-term average", 'results',
     'ART 는 작업자의 장기 평균 노출 분포를 계산합니다(예: 수개월 기간). 이때 '
     '90 백분위수는, 무작위로 고른 작업자의 장기 노출이 그 값을 넘을 확률이 10 % 인 '
     '장기 평균 노출 수준을 뜻합니다.'),
    ('From a scientific perspective, the distribution of long-term average exposure',
     'results',
     '과학적으로는 만성 건강 지표를 다룰 때, 또는 노출 수준을 만성 독성 자료와 '
     '비교할 때 장기 평균 노출 분포가 가장 적절합니다.'),
    ('For each type of exposure ART supports a range of percentiles', 'results',
     '각 노출 유형에 대해 ART 는 여러 백분위수(50, 75, 90, 95, 99)와 '
     '신뢰구간(50 %, 80 %, 90 %, 95 %)을 지원합니다.'),
    ('ART calculates percentiles and confidence intervals using mathematical',
     'results',
     'ART 는 수학적 시뮬레이션 기법으로 백분위수와 신뢰구간을 계산합니다. 반복 '
     '횟수가 매우 많지만, 모델을 실행할 때마다 결과에 아주 작은 차이가 생길 수 '
     '있습니다.'),
]

apply_gaps.run(PAIRS)
