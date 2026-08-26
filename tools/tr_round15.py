# -*- coding: utf-8 -*-
"""15차 — 검증 메시지와 안내 툴팁 (6차 세션 `probe_all.js` 로 처음 수집).

이 문구들은 **값을 일부러 틀리게 넣거나 비워야만** 뜹니다. 순회기는 값을 맞게
채워서 넘어갔으니 한 번도 본 적이 없었습니다. `warnings` 구역이 17개뿐이던 이유.

원문에 오타가 있는 것도 있습니다 ('Please a supply a valid value for dustiness.').
원문은 그대로 키로 쓰고, 번역만 자연스럽게 합니다.
"""
import apply_gaps

PAIRS = [
    # ── 화면 제목·표기 ──────────────────────────────────────────────────────
    ('Liquid Weight Fraction', 'wizard', '액체 질량분율'),
    ('(0.0 < liquid weight fraction', 'info', '(0.0 < 액체 질량분율 ≤ 1.0)'),
    ('What is the weight fraction of the substance in the liquid mixture?',
     'questions', '액체 혼합물 내 물질의 질량분율은 얼마입니까?'),

    # ── 값이 없을 때 (둘 중 하나는 채워야 함) ────────────────────────────────
    ('Supply a dustiness value or choose a dustiness class.', 'warnings',
     '발진성 값을 입력하거나 발진성 등급을 선택하십시오.'),
    ('Supply a weight fraction value or choose a weight fraction category.',
     'warnings', '질량분율 값을 입력하거나 질량분율 범주를 선택하십시오.'),
    ('Supply a temperature value or choose a process temperature category.',
     'warnings', '온도 값을 입력하거나 공정 온도 범주를 선택하십시오.'),
    ('Enter a value for vapour pressure.', 'warnings', '증기압 값을 입력하십시오.'),

    # ── 값이 유효하지 않을 때 ───────────────────────────────────────────────
    ('Please enter a valid value for temperature.', 'warnings',
     '온도에 유효한 값을 입력하십시오.'),
    ('Please a supply a valid value for dustiness.', 'warnings',
     '발진성에 유효한 값을 입력하십시오.'),
    ('Please enter a valid value for vapour pressure.', 'warnings',
     '증기압에 유효한 값을 입력하십시오.'),
    ('Please enter a value for weight fraction in the range >0 to 1.', 'warnings',
     '질량분율 값을 0 초과 1 이하 범위로 입력하십시오.'),

    # ── 선택을 안 했을 때 ───────────────────────────────────────────────────
    ('Please select the material of the solid object.', 'warnings',
     '고체 물체의 재료를 선택하십시오.'),
    ('Please configure the direction before continuing.', 'warnings',
     '계속하기 전에 방향을 지정하십시오.'),
    ('Please configure the drop height before continuing.', 'warnings',
     '계속하기 전에 낙하 높이를 지정하십시오.'),
    ('Please configure the handling type before continuing.', 'warnings',
     '계속하기 전에 취급 방식을 지정하십시오.'),
    ('Please configure the spray direction before continuing.', 'warnings',
     '계속하기 전에 분무 방향을 지정하십시오.'),
    ('Please configure the containment level before continuing.', 'warnings',
     '계속하기 전에 밀폐 수준을 지정하십시오.'),
    ('Please configure the level of agitation before continuing.', 'warnings',
     '계속하기 전에 교반 정도를 지정하십시오.'),
    ('Assess contamination of the paste/slurry before continuing.', 'warnings',
     '계속하기 전에 페이스트/슬러리의 오염 정도를 평가하십시오.'),
    ('Select the moisture content of the solid object before continuing.', 'warnings',
     '계속하기 전에 고체 물체의 수분 함량을 선택하십시오.'),
    ('Select the viscosity of the substance/preparation before continuing.', 'warnings',
     '계속하기 전에 물질/조제품의 점도를 선택하십시오.'),

    # ── 마우스를 올려야 뜨는 안내 ───────────────────────────────────────────
    ('Click the padlock icon to toggle the enabled/disabled state of an activity.',
     'guidance', '자물쇠 아이콘을 클릭하면 활동의 사용/사용 안 함 상태가 바뀝니다.'),
    ('Set the duration of each activity in minutes so that the total duration is 480',
     'guidance',
     '총 지속시간이 480분(또는 그 이하)이 되도록 각 활동의 지속시간을 분 단위로 '
     '지정하십시오.'),
    ('Give each activity a descriptive name.', 'guidance',
     '각 활동에 내용을 알 수 있는 이름을 붙이십시오. 구성할 활동을 선택할 때 이 '
     '이름이 표시됩니다.'),

    # ── 증기압 안내 (기체는 ART 적용 범위 밖) ────────────────────────────────
    ('Substances with a vapour pressure of > 100,000 Pa at room temperature',
     'info',
     '실온에서 증기압이 100,000 Pa 을 넘는 물질은 기체로 봅니다. 증기와 기체의 '
     '차이는, 주위 환경 조건에서 증기는 휘발성 액체와 평형을 이루며 존재한다는 '
     '점입니다. 반면 기체는 통상적인 환경 조건에서 액체가 함께 존재하지 않습니다. '
     'ART 모델은 아직 기체 노출 평가에는 적합하지 않습니다.'),
]

apply_gaps.run(PAIRS)
