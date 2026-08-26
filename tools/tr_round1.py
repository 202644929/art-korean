# -*- coding: utf-8 -*-
"""순회 1차에서 나온 구멍 번역.
접두사로 지목하고 전체 문장은 gaps.json 에서 가져옵니다 (apply_gaps.py 참고).
용어는 사전 _meta.glossary 를 따릅니다: Segregation=격리(발생원),
Personal enclosure=개인 밀폐/격리(작업자), Localised controls=국소 제어.
"""
import apply_gaps

PAIRS = [
    # ── 화면 제목·이미지 대체문구 ────────────────────────────────────────────
    ('ART Standard', 'site', 'ART 표준판'),
    ('Configure Activity - ART Mechanistic Model', 'wizard',
     '활동 구성 - ART 기계론적 모델'),

    # ── 화면 안내문 ─────────────────────────────────────────────────────────
    ('Select Segregation', 'workflow', '격리(발생원) 선택'),
    ('Specify the segregation for this emission source then click Next.', 'guidance',
     "이 배출 발생원의 격리(발생원)를 지정한 뒤 '다음'을 클릭하십시오."),
    ('Select the secondary type of localised controls present for this emission source.',
     'guidance', '이 배출 발생원에 설치된 2차 국소 제어 유형을 선택하십시오.'),
    ('Select the personal enclosure available to the worker then click Next to continue.',
     'guidance', "작업자가 사용할 수 있는 개인 밀폐를 선택한 뒤 '다음'을 클릭해 계속하십시오."),
    ('Segregation of the source is defined as isolation of sources', 'guidance',
     '발생원의 격리(발생원)란 발생원 자체를 직접 밀폐하지 않고 별도의 실에서 '
     '발생원을 작업 환경으로부터 분리하는 것을 말합니다. 격리된 구역에는 해당 '
     '활동이나 작업 교대 시간 동안 작업자가 들어가지 않습니다.'),
    ('The system is not protected against any non-existing combinations', 'guidance',
     '이 시스템은 실제로 존재할 수 없는 국소 제어 조합을 걸러내지 않습니다. 따라서 '
     '앞선 질문에서 지정한 1차 국소 제어와 함께 쓸 수 있는 2차 국소 제어만 '
     '선택하도록 주의하십시오.'),

    # ── 화면 제목(활동 등급) ────────────────────────────────────────────────
    ('Fracturing of Powders, Granules or Pelletised Material', 'wizard',
     '분말, 과립 또는 펠릿형 재료의 파쇄'),

    # ── 선택지 ──────────────────────────────────────────────────────────────
    ('Open process (e.g. bulk milling in an open surface)', 'options',
     '개방 공정 (예: 개방된 표면에서의 벌크 분쇄)'),

    # ── 설명 상자: 격리(발생원) ──────────────────────────────────────────────
    ('The source is not isolated from the work environment.', 'descriptions',
     '발생원이 작업 환경으로부터 격리되어 있지 않습니다.'),
    ('Sources are partially segregated from the work environment by isolating the '
     'source in a separate room (e.g. with open doors', 'descriptions',
     '발생원을 별도의 실(예: 인접 구역으로 문이나 창문이 열려 있음)에 두어 작업 '
     '환경으로부터 부분적으로 격리합니다. 이 격리 구역에는 해당 활동이나 작업 교대 '
     '시간 동안 작업자가 대체로 들어가지 않습니다. 별도 실 내부의 공기는 능동적으로 '
     '환기되지 않습니다.'),
    ('Sources are partially segregated from the work environment by isolating the '
     'source in a separate room (with open doors', 'descriptions',
     '발생원을 별도의 실(문이나 창문이 열려 있음)에 두어 작업 환경으로부터 '
     '부분적으로 격리합니다. 이 격리 구역에는 해당 활동이나 작업 교대 시간 동안 '
     '작업자가 대체로 들어가지 않습니다. 별도 구역의 공기는 능동적으로 환기되며, '
     '재순환 공기는 여과되거나 공기 재순환이 없습니다.'),
    ('Sources are completely segregated from the work environment by isolating the '
     'source in a fully enclosed and separate room (incl. closed doors & windows). '
     'This segregated area', 'descriptions',
     '발생원을 완전히 밀폐된 별도의 실(문과 창문을 닫은 상태 포함)에 두어 작업 '
     '환경으로부터 완전히 격리합니다. 이 격리 구역에는 해당 활동이나 작업 교대 시간 '
     '동안 작업자가 대체로 들어가지 않습니다. 별도 구역의 공기는 환기되지 않습니다.'),
    ('Sources are completely segregated from the work environment by isolating the '
     'source in a fully enclosed and separate room (incl. closed doors & windows). '
     'The air within', 'descriptions',
     '발생원을 완전히 밀폐된 별도의 실(문과 창문을 닫은 상태 포함)에 두어 작업 '
     '환경으로부터 완전히 격리합니다. 별도 구역의 공기는 능동적으로 환기되며, '
     '재순환 공기는 여과되거나 공기 재순환이 없습니다. 이 격리 구역에는 해당 '
     '활동이나 작업 교대 시간 동안 작업자가 대체로 들어가지 않습니다.'),

    # ── 설명 상자: 개인 밀폐 ────────────────────────────────────────────────
    ('No personal enclosure within a work environment.', 'descriptions',
     '작업 환경 내에 개인 밀폐가 없습니다.'),
    ('Partial personal enclosure is a partially open cabin or room (e.g. open windows, '
     'door) where a worker is partially protected but still in direct contact with the '
     'work environment. The air within the personal enclosure is not actively',
     'descriptions',
     '부분 개인 밀폐란 일부가 개방된 캐빈이나 실(예: 창문이나 문이 열려 있음)로, '
     '작업자가 부분적으로 보호되지만 여전히 작업 환경과 직접 접촉하는 상태입니다. '
     '개인 밀폐 내부의 공기는 능동적으로 환기되지 않습니다.'),
    ('Partial personal enclosure is a partially open cabin or room (e.g. open windows, '
     'door) where a worker is partially protected but still in direct contact with the '
     'work environment. The air within the personal enclosure is ventilated',
     'descriptions',
     '부분 개인 밀폐란 일부가 개방된 캐빈이나 실(예: 창문이나 문이 열려 있음)로, '
     '작업자가 부분적으로 보호되지만 여전히 작업 환경과 직접 접촉하는 상태입니다. '
     '개인 밀폐 내부의 공기는 환기되며, 내부는 양압으로 유지됩니다.'),
    ('Worker resides inside an enclosed cabin or room (door & windows closed)',
     'descriptions',
     '작업자가 활동 전체 시간 동안 밀폐된 캐빈이나 실(문과 창문을 닫은 상태) 내부에 '
     '있습니다. 그 별도 공간의 공기는 능동적으로 환기되지 않습니다.'),
    ('Worker resides inside an enclosed cabin or room (door and/or windows closed)',
     'descriptions',
     '작업자가 활동 전체 시간 동안 밀폐된 캐빈이나 실(문 및/또는 창문을 닫은 상태) '
     '내부에 있습니다. 개인 밀폐 내부의 공기는 능동적으로 환기·여과되며, 내부는 '
     '양압으로 유지됩니다.'),
]

apply_gaps.run(PAIRS)
