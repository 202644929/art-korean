# ART 질문 흐름 표

간선 805개 (탐색 완료 665개)

| 제품유형 | 화면 | 질문 | 답 | 다음화면 | 비고 |
|---|---|---|---|---|---|
| 공통 | q003_090_producttype | 물질/조제품의 제품 유형은 무엇입니까? | 가스 |  | 선택 불가 (ART 미지원) |
| 공통 | q003_090_producttype | 물질/조제품의 제품 유형은 무엇입니까? | 고온 또는 용융 금속 |  | 선택 불가 (ART 미지원) |
| 공통 | q003_090_producttype | 물질/조제품의 제품 유형은 무엇입니까? | 고체 물체 | q007_094_solidweightfraction |  |
| 공통 | q003_090_producttype | 물질/조제품의 제품 유형은 무엇입니까? | 분말, 과립 또는 펠릿형 재료 | q004_091_dustiness |  |
| 공통 | q003_090_producttype | 물질/조제품의 제품 유형은 무엇입니까? | 섬유상 물질 |  | 선택 불가 (ART 미지원) |
| 공통 | q003_090_producttype | 물질/조제품의 제품 유형은 무엇입니까? | 액체 | q009_096_processtemperature |  |
| 공통 | q003_090_producttype | 물질/조제품의 제품 유형은 무엇입니까? | 액체에 용해되거나 액상 매트릭스에 포함된 분말 (예: 방오도료 내 구리) | q015_5_1_102_5_1_liquidmatrixweightfraction |  |
| 공통 | q003_090_producttype | 물질/조제품의 제품 유형은 무엇입니까? | 페이스트, 슬러리 또는 명백히 (젖은) 습윤 분말 (휘발성 액체 성분 불포함) | q015_1_102_1_contaminatedwithpowder |  |
| 분말·과립 | q004_091_dustiness | 측정된 재료의 발진성은 얼마입니까? (흡입성 분율, mg/kg) | 견고한 과립, 플레이크 또는 펠릿 | q006_093_moisturecontent |  |
| 분말·과립 | q004_091_dustiness | 측정된 재료의 발진성은 얼마입니까? (흡입성 분율, mg/kg) | 과립, 플레이크 또는 펠릿 | q006_093_moisturecontent |  |
| 분말·과립 | q004_091_dustiness | 측정된 재료의 발진성은 얼마입니까? (흡입성 분율, mg/kg) | 극도로 미세하고 가벼운 분말 | q006_093_moisturecontent |  |
| 분말·과립 | q004_091_dustiness | 측정된 재료의 발진성은 얼마입니까? (흡입성 분율, mg/kg) | 미세 분진 | q006_093_moisturecontent |  |
| 분말·과립 | q004_091_dustiness | 측정된 재료의 발진성은 얼마입니까? (흡입성 분율, mg/kg) | 조대 분진 | q006_093_moisturecontent |  |
| 분말·과립 | q006_093_moisturecontent | 제품의 수분 함량은 얼마입니까? | 건조 제품 (수분 함량 <5 %) | q006_5_093_5_powderweightfraction |  |
| 분말·과립 | q006_093_moisturecontent | 제품의 수분 함량은 얼마입니까? | 수분 함량 5 - 10 % | q006_5_093_5_powderweightfraction |  |
| 분말·과립 | q006_093_moisturecontent | 제품의 수분 함량은 얼마입니까? | 수분 함량 >10 % | q006_5_093_5_powderweightfraction |  |
| 분말·과립 | q006_5_093_5_powderweightfraction | 분말, 과립 또는 펠릿형 재료 내 물질의 질량분율은 얼마입니까? | 극미량 (0.01 - 0.1 %) | q016_nearfieldsource |  |
| 분말·과립 | q006_5_093_5_powderweightfraction | 분말, 과립 또는 펠릿형 재료 내 물질의 질량분율은 얼마입니까? | 극미량 (< 0.01 %) | q016_nearfieldsource |  |
| 분말·과립 | q006_5_093_5_powderweightfraction | 분말, 과립 또는 펠릿형 재료 내 물질의 질량분율은 얼마입니까? | 극히 적음 (0.1 - 0.5 %) | q016_nearfieldsource |  |
| 분말·과립 | q006_5_093_5_powderweightfraction | 분말, 과립 또는 펠릿형 재료 내 물질의 질량분율은 얼마입니까? | 매우 적음 (0.5 - 1 %) | q016_nearfieldsource |  |
| 분말·과립 | q006_5_093_5_powderweightfraction | 분말, 과립 또는 펠릿형 재료 내 물질의 질량분율은 얼마입니까? | 상당량 (10 - 50 %) | q016_nearfieldsource |  |
| 분말·과립 | q006_5_093_5_powderweightfraction | 분말, 과립 또는 펠릿형 재료 내 물질의 질량분율은 얼마입니까? | 소량 (5 - 10 %) | q016_nearfieldsource |  |
| 분말·과립 | q006_5_093_5_powderweightfraction | 분말, 과립 또는 펠릿형 재료 내 물질의 질량분율은 얼마입니까? | 순수 물질 (100%) | q016_nearfieldsource |  |
| 분말·과립 | q006_5_093_5_powderweightfraction | 분말, 과립 또는 펠릿형 재료 내 물질의 질량분율은 얼마입니까? | 적음 (1 - 5 %) | q016_nearfieldsource |  |
| 분말·과립 | q006_5_093_5_powderweightfraction | 분말, 과립 또는 펠릿형 재료 내 물질의 질량분율은 얼마입니까? | 주성분 (50 - 90 %) | q016_nearfieldsource |  |
| 분말·과립 | q016_nearfieldsource | 1차 배출 발생원이 작업자의 호흡 영역(즉, 작업자 머리로부터 모든 방향으로 1미터 이내의 공기 체적) 안에 있습니까? | 아니오 | q017_055_103_activityclass |  |
| 분말·과립 | q016_nearfieldsource | 1차 배출 발생원이 작업자의 호흡 영역(즉, 작업자 머리로부터 모든 방향으로 1미터 이내의 공기 체적) 안에 있습니까? | 예 | q017_055_103_activityclass |  |
| 분말·과립 | q017_055_103_activityclass | 활동 등급 선택 | 분말, 과립 또는 펠릿형 재료의 압축 | q025_063_111_compressinggranularmaterial |  |
| 분말·과립 | q017_055_103_activityclass | 활동 등급 선택 | 분말, 과립 또는 펠릿형 재료의 압축 | q025_063_111_compressinggranularmaterial |  |
| 분말·과립 | q017_055_103_activityclass | 활동 등급 선택 | 분말, 과립 또는 펠릿형 재료의 이동 및 교반 | q023_061_109_movementagitationgranularmaterial |  |
| 분말·과립 | q017_055_103_activityclass | 활동 등급 선택 | 분말, 과립 또는 펠릿형 재료의 이동 및 교반 | q023_061_109_movementagitationgranularmaterial |  |
| 분말·과립 | q017_055_103_activityclass | 활동 등급 선택 | 분말, 과립 또는 펠릿형 재료의 이송 / — 선택 — | q024_062_110_fallinggranularmaterial |  |
| 분말·과립 | q017_055_103_activityclass | 활동 등급 선택 | 분말, 과립 또는 펠릿형 재료의 이송 / — 선택 — | q024_062_110_fallinggranularmaterial |  |
| 분말·과립 | q017_055_103_activityclass | 활동 등급 선택 | 분말, 과립 또는 펠릿형 재료의 이송 / 분말, 과립 또는 펠릿형 재료의 낙하 | q024_062_110_fallinggranularmaterial |  |
| 분말·과립 | q017_055_103_activityclass | 활동 등급 선택 | 분말, 과립 또는 펠릿형 재료의 이송 / 분말, 과립 또는 펠릿형 재료의 낙하 | q024_062_110_fallinggranularmaterial |  |
| 분말·과립 | q017_055_103_activityclass | 활동 등급 선택 | 분말, 과립 또는 펠릿형 재료의 이송 / 분말, 과립 또는 펠릿형 재료의 진공 이송 | q024_9_1_062_9_1_110_9_1_vacuumtransfer |  |
| 분말·과립 | q017_055_103_activityclass | 활동 등급 선택 | 분말, 과립 또는 펠릿형 재료의 이송 / 분말, 과립 또는 펠릿형 재료의 진공 이송 | q024_9_1_062_9_1_110_9_1_vacuumtransfer |  |
| 분말·과립 | q017_055_103_activityclass | 활동 등급 선택 | 분말, 과립 또는 펠릿형 재료의 파쇄 | q025_5_063_5_111_5_fracturinggranularmaterial |  |
| 분말·과립 | q017_055_103_activityclass | 활동 등급 선택 | 분말, 과립 또는 펠릿형 재료의 파쇄 | q025_5_063_5_111_5_fracturinggranularmaterial |  |
| 분말·과립 | q017_055_103_activityclass | 활동 등급 선택 | 분말의 분무 적용 | q022_060_108_sprayapplicationpowders |  |
| 분말·과립 | q017_055_103_activityclass | 활동 등급 선택 | 분말의 분무 적용 | q022_060_108_sprayapplicationpowders |  |
| 분말·과립 | q017_055_103_activityclass | 활동 등급 선택 | 오염된 고체 물체 또는 페이스트의 취급 | q021_059_107_contaminatedobjectspaste |  |
| 분말·과립 | q017_055_103_activityclass | 활동 등급 선택 | 오염된 고체 물체 또는 페이스트의 취급 | q021_059_107_contaminatedobjectspaste |  |
| 분말·과립 | q017_055_103_activityclass | 활동 등급 선택 | 오염된 고체 물체에 대한 충격 | q020_058_106_impactionsolidobjects |  |
| 분말·과립 | q017_055_103_activityclass | 활동 등급 선택 | 오염된 고체 물체에 대한 충격 | q020_058_106_impactionsolidobjects |  |
| 분말·과립 | q020_058_106_impactionsolidobjects | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 경미하게 오염된(수 그램 미만의 층) 물체에 대한 충격 | q020_5_058_5_106_5_impactionsolidobjectshandlingtype |  |
| 분말·과립 | q020_058_106_impactionsolidobjects | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 경미하게 오염된(수 그램 미만의 층) 물체에 대한 충격 |  | 가지치기(형제 선택지와 같은 곳) |
| 분말·과립 | q020_058_106_impactionsolidobjects | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 상당하고 육안으로 보이는 오염이 있는 물체에 대한 충격 (0.5 kg 초과의 층) | q020_5_058_5_106_5_impactionsolidobjectshandlingtype |  |
| 분말·과립 | q020_058_106_impactionsolidobjects | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 상당하고 육안으로 보이는 오염이 있는 물체에 대한 충격 (0.5 kg 초과의 층) | q020_5_058_5_106_5_impactionsolidobjectshandlingtype |  |
| 분말·과립 | q020_058_106_impactionsolidobjects | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 외견상 깨끗한 물체에 대한 충격 | q020_5_058_5_106_5_impactionsolidobjectshandlingtype |  |
| 분말·과립 | q020_058_106_impactionsolidobjects | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 외견상 깨끗한 물체에 대한 충격 |  | 가지치기(형제 선택지와 같은 곳) |
| 분말·과립 | q020_058_106_impactionsolidobjects | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 육안으로 보이는 잔류 분진이 있는 물체에 대한 충격 | q020_5_058_5_106_5_impactionsolidobjectshandlingtype |  |
| 분말·과립 | q020_058_106_impactionsolidobjects | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 육안으로 보이는 잔류 분진이 있는 물체에 대한 충격 | q020_5_058_5_106_5_impactionsolidobjectshandlingtype |  |
| 분말·과립 | q020_058_106_impactionsolidobjects | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 육안으로 보이는 잔류 분진이 적은 물체에 대한 충격 | q020_5_058_5_106_5_impactionsolidobjectshandlingtype |  |
| 분말·과립 | q020_058_106_impactionsolidobjects | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 육안으로 보이는 잔류 분진이 적은 물체에 대한 충격 | q020_5_058_5_106_5_impactionsolidobjectshandlingtype |  |
| 분말·과립 | q020_5_058_5_106_5_impactionsolidobjectshandlingtype | 취급의 종류는 무엇입니까? | 중(重)기계적 충격 | q042_080_130_primarylocalizedcontrols |  |
| 분말·과립 | q020_5_058_5_106_5_impactionsolidobjectshandlingtype | 취급의 종류는 무엇입니까? | 중(重)기계적 충격 | q042_080_130_primarylocalizedcontrols |  |
| 분말·과립 | q020_5_058_5_106_5_impactionsolidobjectshandlingtype | 취급의 종류는 무엇입니까? | 통상적 충격 (수동 또는 경(輕)기계적) | q042_080_130_primarylocalizedcontrols |  |
| 분말·과립 | q020_5_058_5_106_5_impactionsolidobjectshandlingtype | 취급의 종류는 무엇입니까? | 통상적 충격 (수동 또는 경(輕)기계적) | q042_080_130_primarylocalizedcontrols |  |
| 분말·과립 | q021_059_107_contaminatedobjectspaste | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 경미하게 오염된(수 그램 미만의 층) 물체의 취급 | q021_5_059_5_107_5_contaminatedobjectspastehandlingtype |  |
| 분말·과립 | q021_059_107_contaminatedobjectspaste | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 경미하게 오염된(수 그램 미만의 층) 물체의 취급 |  | 가지치기(형제 선택지와 같은 곳) |
| 분말·과립 | q021_059_107_contaminatedobjectspaste | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 상당하고 육안으로 보이는 오염이 있는 물체의 취급 (0.5 kg 초과의 층) | q021_5_059_5_107_5_contaminatedobjectspastehandlingtype |  |
| 분말·과립 | q021_059_107_contaminatedobjectspaste | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 상당하고 육안으로 보이는 오염이 있는 물체의 취급 (0.5 kg 초과의 층) | q021_5_059_5_107_5_contaminatedobjectspastehandlingtype |  |
| 분말·과립 | q021_059_107_contaminatedobjectspaste | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 외견상 깨끗한 물체의 취급 | q021_5_059_5_107_5_contaminatedobjectspastehandlingtype |  |
| 분말·과립 | q021_059_107_contaminatedobjectspaste | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 외견상 깨끗한 물체의 취급 |  | 가지치기(형제 선택지와 같은 곳) |
| 분말·과립 | q021_059_107_contaminatedobjectspaste | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 육안으로 보이는 오염이 있는 물체의 취급 (주변 분진 발생 활동에서 비산된 분진으로 덮인 물체) | q021_5_059_5_107_5_contaminatedobjectspastehandlingtype |  |
| 분말·과립 | q021_059_107_contaminatedobjectspaste | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 육안으로 보이는 오염이 있는 물체의 취급 (주변 분진 발생 활동에서 비산된 분진으로 덮인 물체) | q021_5_059_5_107_5_contaminatedobjectspastehandlingtype |  |
| 분말·과립 | q021_059_107_contaminatedobjectspaste | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 잔류 분진이 적은 물체의 취급 (얇은 층이 보임) | q021_5_059_5_107_5_contaminatedobjectspastehandlingtype |  |
| 분말·과립 | q021_059_107_contaminatedobjectspaste | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 잔류 분진이 적은 물체의 취급 (얇은 층이 보임) | q021_5_059_5_107_5_contaminatedobjectspastehandlingtype |  |
| 분말·과립 | q021_5_059_5_107_5_contaminatedobjectspastehandlingtype | 오염된 물체 또는 페이스트를 어떻게 취급합니까? | 주의 깊은 취급이란 작업자가 잠재적 위험, 오류, 피해에 주의를 기울이며 매우 정확하고 꼼꼼하게(또는 조심스럽게) 작업을 수행하는 것을 말합니다 | q042_080_130_primarylocalizedcontrols |  |
| 분말·과립 | q021_5_059_5_107_5_contaminatedobjectspastehandlingtype | 오염된 물체 또는 페이스트를 어떻게 취급합니까? | 주의 깊은 취급이란 작업자가 잠재적 위험, 오류, 피해에 주의를 기울이며 매우 정확하고 꼼꼼하게(또는 조심스럽게) 작업을 수행하는 것을 말합니다 | q042_080_130_primarylocalizedcontrols |  |
| 분말·과립 | q021_5_059_5_107_5_contaminatedobjectspastehandlingtype | 오염된 물체 또는 페이스트를 어떻게 취급합니까? | 통상적인 작업 절차에서 벗어나 많은 에너지가 수반되는 취급 (예: 거친 취급 또는 자루 던지기) | q042_080_130_primarylocalizedcontrols |  |
| 분말·과립 | q021_5_059_5_107_5_contaminatedobjectspastehandlingtype | 오염된 물체 또는 페이스트를 어떻게 취급합니까? | 통상적인 작업 절차에서 벗어나 많은 에너지가 수반되는 취급 (예: 거친 취급 또는 자루 던지기) | q042_080_130_primarylocalizedcontrols |  |
| 분말·과립 | q021_5_059_5_107_5_contaminatedobjectspastehandlingtype | 오염된 물체 또는 페이스트를 어떻게 취급합니까? | 통상적인 취급, 정규 작업 절차 수반 | q042_080_130_primarylocalizedcontrols |  |
| 분말·과립 | q021_5_059_5_107_5_contaminatedobjectspastehandlingtype | 오염된 물체 또는 페이스트를 어떻게 취급합니까? | 통상적인 취급, 정규 작업 절차 수반 | q042_080_130_primarylocalizedcontrols |  |
| 분말·과립 | q022_060_108_sprayapplicationpowders | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 분체 도장 | q022_5_060_5_108_5_sprayapplicationpowdersspraydirection |  |
| 분말·과립 | q022_060_108_sprayapplicationpowders | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 분체 도장 | q022_5_060_5_108_5_sprayapplicationpowdersspraydirection |  |
| 분말·과립 | q022_060_108_sprayapplicationpowders | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 블로워를 이용한 분말 살포 | q022_5_060_5_108_5_sprayapplicationpowdersspraydirection |  |
| 분말·과립 | q022_060_108_sprayapplicationpowders | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 블로워를 이용한 분말 살포 | q022_5_060_5_108_5_sprayapplicationpowdersspraydirection |  |
| 분말·과립 | q022_5_060_5_108_5_sprayapplicationpowdersspraydirection | 분무 방향은 어떻습니까? | 모든 방향(상향 포함)으로의 분무 | q042_080_130_primarylocalizedcontrols |  |
| 분말·과립 | q022_5_060_5_108_5_sprayapplicationpowdersspraydirection | 분무 방향은 어떻습니까? | 모든 방향(상향 포함)으로의 분무 | q042_080_130_primarylocalizedcontrols |  |
| 분말·과립 | q022_5_060_5_108_5_sprayapplicationpowdersspraydirection | 분무 방향은 어떻습니까? | 수평 또는 하향 분무만 | q042_080_130_primarylocalizedcontrols |  |
| 분말·과립 | q022_5_060_5_108_5_sprayapplicationpowdersspraydirection | 분무 방향은 어떻습니까? | 수평 또는 하향 분무만 | q042_080_130_primarylocalizedcontrols |  |
| 분말·과립 | q022_5_060_5_108_5_sprayapplicationpowdersspraydirection | 분무 방향은 어떻습니까? | 하향 분무만 | q042_080_130_primarylocalizedcontrols |  |
| 분말·과립 | q022_5_060_5_108_5_sprayapplicationpowdersspraydirection | 분무 방향은 어떻습니까? | 하향 분무만 | q042_080_130_primarylocalizedcontrols |  |
| 분말·과립 | q023_061_109_movementagitationgranularmaterial | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 0.1 - 1 kg의 이동 및 교반 | q023_5_061_5_109_5_movementagitationgranularmaterialagitationlevel |  |
| 분말·과립 | q023_061_109_movementagitationgranularmaterial | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 0.1 - 1 kg의 이동 및 교반 |  | 가지치기(형제 선택지와 같은 곳) |
| 분말·과립 | q023_061_109_movementagitationgranularmaterial | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 1 - 10 kg의 이동 및 교반 | q023_5_061_5_109_5_movementagitationgranularmaterialagitationlevel |  |
| 분말·과립 | q023_061_109_movementagitationgranularmaterial | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 1 - 10 kg의 이동 및 교반 |  | 가지치기(형제 선택지와 같은 곳) |
| 분말·과립 | q023_061_109_movementagitationgranularmaterial | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 10 - 100 gram의 이동 및 교반 | q023_5_061_5_109_5_movementagitationgranularmaterialagitationlevel |  |
| 분말·과립 | q023_061_109_movementagitationgranularmaterial | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 10 - 100 gram의 이동 및 교반 |  | 가지치기(형제 선택지와 같은 곳) |
| 분말·과립 | q023_061_109_movementagitationgranularmaterial | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 10 - 100 kg의 이동 및 교반 | q023_5_061_5_109_5_movementagitationgranularmaterialagitationlevel |  |
| 분말·과립 | q023_061_109_movementagitationgranularmaterial | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 10 - 100 kg의 이동 및 교반 | q023_5_061_5_109_5_movementagitationgranularmaterialagitationlevel |  |
| 분말·과립 | q023_061_109_movementagitationgranularmaterial | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 100 - 1000 kg의 이동 및 교반 | q023_5_061_5_109_5_movementagitationgranularmaterialagitationlevel |  |
| 분말·과립 | q023_061_109_movementagitationgranularmaterial | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 100 - 1000 kg의 이동 및 교반 | q023_5_061_5_109_5_movementagitationgranularmaterialagitationlevel |  |
| 분말·과립 | q023_061_109_movementagitationgranularmaterial | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 1000 kg 이상의 이동 및 교반 | q023_5_061_5_109_5_movementagitationgranularmaterialagitationlevel |  |
| 분말·과립 | q023_061_109_movementagitationgranularmaterial | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 1000 kg 이상의 이동 및 교반 | q023_5_061_5_109_5_movementagitationgranularmaterialagitationlevel |  |
| 분말·과립 | q023_061_109_movementagitationgranularmaterial | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | < 10 gram의 이동 및 교반 | q023_5_061_5_109_5_movementagitationgranularmaterialagitationlevel |  |
| 분말·과립 | q023_061_109_movementagitationgranularmaterial | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | < 10 gram의 이동 및 교반 |  | 가지치기(형제 선택지와 같은 곳) |
| 분말·과립 | q023_5_061_5_109_5_movementagitationgranularmaterialagitationlevel | 교반 정도는 어떻습니까? | 교반 정도가 낮은 취급 | q023_7_061_7_109_7_movementagitationgranularmaterialcontainmentlevel |  |
| 분말·과립 | q023_5_061_5_109_5_movementagitationgranularmaterialagitationlevel | 교반 정도는 어떻습니까? | 교반 정도가 낮은 취급 | q023_7_061_7_109_7_movementagitationgranularmaterialcontainmentlevel |  |
| 분말·과립 | q023_5_061_5_109_5_movementagitationgranularmaterialagitationlevel | 교반 정도는 어떻습니까? | 교반 정도가 높은 기타 취급 | q023_7_061_7_109_7_movementagitationgranularmaterialcontainmentlevel |  |
| 분말·과립 | q023_5_061_5_109_5_movementagitationgranularmaterialagitationlevel | 교반 정도는 어떻습니까? | 교반 정도가 높은 기타 취급 | q023_7_061_7_109_7_movementagitationgranularmaterialcontainmentlevel |  |
| 분말·과립 | q023_5_061_5_109_5_movementagitationgranularmaterialagitationlevel | 교반 정도는 어떻습니까? | 압축공기 사용 | q023_7_061_7_109_7_movementagitationgranularmaterialcontainmentlevel |  |
| 분말·과립 | q023_5_061_5_109_5_movementagitationgranularmaterialagitationlevel | 교반 정도는 어떻습니까? | 압축공기 사용 | q023_7_061_7_109_7_movementagitationgranularmaterialcontainmentlevel |  |
| 분말·과립 | q023_7_061_7_109_7_movementagitationgranularmaterialcontainmentlevel | 공정의 밀폐 수준은 어떻습니까? | 개방 공정 | q042_080_130_primarylocalizedcontrols |  |
| 분말·과립 | q023_7_061_7_109_7_movementagitationgranularmaterialcontainmentlevel | 공정의 밀폐 수준은 어떻습니까? | 개방 공정 | q042_080_130_primarylocalizedcontrols |  |
| 분말·과립 | q023_7_061_7_109_7_movementagitationgranularmaterialcontainmentlevel | 공정의 밀폐 수준은 어떻습니까? | 제품과 주변 공기의 접촉을 줄이는 취급 | q042_080_130_primarylocalizedcontrols |  |
| 분말·과립 | q023_7_061_7_109_7_movementagitationgranularmaterialcontainmentlevel | 공정의 밀폐 수준은 어떻습니까? | 제품과 주변 공기의 접촉을 줄이는 취급 | q042_080_130_primarylocalizedcontrols |  |
| 분말·과립 | q024_062_110_fallinggranularmaterial | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 이송 0.1 - 1 kg/minute | q024_5_062_5_110_5_fallinggranularmaterialhandlingtype |  |
| 분말·과립 | q024_062_110_fallinggranularmaterial | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 이송 0.1 - 1 kg/minute |  | 가지치기(형제 선택지와 같은 곳) |
| 분말·과립 | q024_062_110_fallinggranularmaterial | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 이송 1 - 10 kg/minute | q024_5_062_5_110_5_fallinggranularmaterialhandlingtype |  |
| 분말·과립 | q024_062_110_fallinggranularmaterial | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 이송 1 - 10 kg/minute |  | 가지치기(형제 선택지와 같은 곳) |
| 분말·과립 | q024_062_110_fallinggranularmaterial | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 이송 10 - 100 gram/minute | q024_5_062_5_110_5_fallinggranularmaterialhandlingtype |  |
| 분말·과립 | q024_062_110_fallinggranularmaterial | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 이송 10 - 100 gram/minute |  | 가지치기(형제 선택지와 같은 곳) |
| 분말·과립 | q024_062_110_fallinggranularmaterial | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 이송 10 - 100 kg/minute | q024_5_062_5_110_5_fallinggranularmaterialhandlingtype |  |
| 분말·과립 | q024_062_110_fallinggranularmaterial | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 이송 10 - 100 kg/minute | q024_5_062_5_110_5_fallinggranularmaterialhandlingtype |  |
| 분말·과립 | q024_062_110_fallinggranularmaterial | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 이송 10 gram/minute 미만 | q024_5_062_5_110_5_fallinggranularmaterialhandlingtype |  |
| 분말·과립 | q024_062_110_fallinggranularmaterial | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 이송 10 gram/minute 미만 |  | 가지치기(형제 선택지와 같은 곳) |
| 분말·과립 | q024_062_110_fallinggranularmaterial | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 이송 100 - 1000 kg/minute | q024_5_062_5_110_5_fallinggranularmaterialhandlingtype |  |
| 분말·과립 | q024_062_110_fallinggranularmaterial | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 이송 100 - 1000 kg/minute | q024_5_062_5_110_5_fallinggranularmaterialhandlingtype |  |
| 분말·과립 | q024_062_110_fallinggranularmaterial | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 이송 1000 kg/minute 초과 | q024_5_062_5_110_5_fallinggranularmaterialhandlingtype |  |
| 분말·과립 | q024_062_110_fallinggranularmaterial | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 이송 1000 kg/minute 초과 | q024_5_062_5_110_5_fallinggranularmaterialhandlingtype |  |
| 분말·과립 | q024_5_062_5_110_5_fallinggranularmaterialhandlingtype | 취급의 종류는 무엇입니까? | 정형적 이송 | q024_7_062_7_110_7_fallinggranularmaterialdropheight |  |
| 분말·과립 | q024_5_062_5_110_5_fallinggranularmaterialhandlingtype | 취급의 종류는 무엇입니까? | 정형적 이송 | q024_7_062_7_110_7_fallinggranularmaterialdropheight |  |
| 분말·과립 | q024_5_062_5_110_5_fallinggranularmaterialhandlingtype | 취급의 종류는 무엇입니까? | 주의 깊은 이송이란 작업자가 잠재적 위험, 오류, 피해에 주의를 기울이며 매우 정확하고 꼼꼼하게(또는 조심스럽게) 작업을 수행하는 것을 말합니다. 예: 실험실에서 | q024_7_062_7_110_7_fallinggranularmaterialdropheight |  |
| 분말·과립 | q024_5_062_5_110_5_fallinggranularmaterialhandlingtype | 취급의 종류는 무엇입니까? | 주의 깊은 이송이란 작업자가 잠재적 위험, 오류, 피해에 주의를 기울이며 매우 정확하고 꼼꼼하게(또는 조심스럽게) 작업을 수행하는 것을 말합니다. 예: 실험실에서 | q024_7_062_7_110_7_fallinggranularmaterialdropheight |  |
| 분말·과립 | q024_7_062_7_110_7_fallinggranularmaterialdropheight | 낙하 높이는 얼마입니까? | 낙하 높이 < 0.5 m | q024_8_062_8_110_8_fallinggranularmaterialcontainmentlevel |  |
| 분말·과립 | q024_7_062_7_110_7_fallinggranularmaterialdropheight | 낙하 높이는 얼마입니까? | 낙하 높이 < 0.5 m | q024_8_062_8_110_8_fallinggranularmaterialcontainmentlevel |  |
| 분말·과립 | q024_7_062_7_110_7_fallinggranularmaterialdropheight | 낙하 높이는 얼마입니까? | 낙하 높이 > 0.5 m | q024_8_062_8_110_8_fallinggranularmaterialcontainmentlevel |  |
| 분말·과립 | q024_7_062_7_110_7_fallinggranularmaterialdropheight | 낙하 높이는 얼마입니까? | 낙하 높이 > 0.5 m | q024_8_062_8_110_8_fallinggranularmaterialcontainmentlevel |  |
| 분말·과립 | q024_8_062_8_110_8_fallinggranularmaterialcontainmentlevel | 공정의 밀폐 수준은 어떻습니까? | 개방 공정 | q042_080_130_primarylocalizedcontrols |  |
| 분말·과립 | q024_8_062_8_110_8_fallinggranularmaterialcontainmentlevel | 공정의 밀폐 수준은 어떻습니까? | 개방 공정 | q042_080_130_primarylocalizedcontrols |  |
| 분말·과립 | q024_8_062_8_110_8_fallinggranularmaterialcontainmentlevel | 공정의 밀폐 수준은 어떻습니까? | 제품과 주변 공기의 접촉을 줄이는 취급 | q042_080_130_primarylocalizedcontrols |  |
| 분말·과립 | q024_8_062_8_110_8_fallinggranularmaterialcontainmentlevel | 공정의 밀폐 수준은 어떻습니까? | 제품과 주변 공기의 접촉을 줄이는 취급 | q042_080_130_primarylocalizedcontrols |  |
| 분말·과립 | q024_9_1_062_9_1_110_9_1_vacuumtransfer | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 이송 0.1 - 1 kg/minute | q024_9_2_062_9_2_110_9_2_vacuumtransfercontainmentlevel |  |
| 분말·과립 | q024_9_1_062_9_1_110_9_1_vacuumtransfer | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 이송 0.1 - 1 kg/minute |  | 가지치기(형제 선택지와 같은 곳) |
| 분말·과립 | q024_9_1_062_9_1_110_9_1_vacuumtransfer | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 이송 1 - 10 kg/minute | q024_9_2_062_9_2_110_9_2_vacuumtransfercontainmentlevel |  |
| 분말·과립 | q024_9_1_062_9_1_110_9_1_vacuumtransfer | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 이송 1 - 10 kg/minute |  | 가지치기(형제 선택지와 같은 곳) |
| 분말·과립 | q024_9_1_062_9_1_110_9_1_vacuumtransfer | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 이송 10 - 100 gram/minute | q024_9_2_062_9_2_110_9_2_vacuumtransfercontainmentlevel |  |
| 분말·과립 | q024_9_1_062_9_1_110_9_1_vacuumtransfer | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 이송 10 - 100 gram/minute |  | 가지치기(형제 선택지와 같은 곳) |
| 분말·과립 | q024_9_1_062_9_1_110_9_1_vacuumtransfer | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 이송 10 - 100 kg/minute | q024_9_2_062_9_2_110_9_2_vacuumtransfercontainmentlevel |  |
| 분말·과립 | q024_9_1_062_9_1_110_9_1_vacuumtransfer | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 이송 10 - 100 kg/minute | q024_9_2_062_9_2_110_9_2_vacuumtransfercontainmentlevel |  |
| 분말·과립 | q024_9_1_062_9_1_110_9_1_vacuumtransfer | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 이송 10 gram/minute 미만 | q024_9_2_062_9_2_110_9_2_vacuumtransfercontainmentlevel |  |
| 분말·과립 | q024_9_1_062_9_1_110_9_1_vacuumtransfer | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 이송 10 gram/minute 미만 |  | 가지치기(형제 선택지와 같은 곳) |
| 분말·과립 | q024_9_1_062_9_1_110_9_1_vacuumtransfer | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 이송 100 - 1000 kg/minute | q024_9_2_062_9_2_110_9_2_vacuumtransfercontainmentlevel |  |
| 분말·과립 | q024_9_1_062_9_1_110_9_1_vacuumtransfer | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 이송 100 - 1000 kg/minute | q024_9_2_062_9_2_110_9_2_vacuumtransfercontainmentlevel |  |
| 분말·과립 | q024_9_1_062_9_1_110_9_1_vacuumtransfer | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 이송 1000 kg/minute 초과 | q024_9_2_062_9_2_110_9_2_vacuumtransfercontainmentlevel |  |
| 분말·과립 | q024_9_1_062_9_1_110_9_1_vacuumtransfer | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 이송 1000 kg/minute 초과 | q024_9_2_062_9_2_110_9_2_vacuumtransfercontainmentlevel |  |
| 분말·과립 | q024_9_2_062_9_2_110_9_2_vacuumtransfercontainmentlevel | 공정의 밀폐 수준은 어떻습니까? | 개방 공정 | q042_080_130_primarylocalizedcontrols |  |
| 분말·과립 | q024_9_2_062_9_2_110_9_2_vacuumtransfercontainmentlevel | 공정의 밀폐 수준은 어떻습니까? | 개방 공정 | q042_080_130_primarylocalizedcontrols |  |
| 분말·과립 | q024_9_2_062_9_2_110_9_2_vacuumtransfercontainmentlevel | 공정의 밀폐 수준은 어떻습니까? | 제품과 주변 공기의 접촉을 줄이는 취급 | q042_080_130_primarylocalizedcontrols |  |
| 분말·과립 | q024_9_2_062_9_2_110_9_2_vacuumtransfercontainmentlevel | 공정의 밀폐 수준은 어떻습니까? | 제품과 주변 공기의 접촉을 줄이는 취급 | q042_080_130_primarylocalizedcontrols |  |
| 분말·과립 | q025_063_111_compressinggranularmaterial | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 압축 0.1 - 1 kg/minute | q025_3_063_3_111_3_compressinggranularmaterialcontainmentlevel |  |
| 분말·과립 | q025_063_111_compressinggranularmaterial | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 압축 0.1 - 1 kg/minute |  | 가지치기(형제 선택지와 같은 곳) |
| 분말·과립 | q025_063_111_compressinggranularmaterial | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 압축 1 - 10 kg/minute | q025_3_063_3_111_3_compressinggranularmaterialcontainmentlevel |  |
| 분말·과립 | q025_063_111_compressinggranularmaterial | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 압축 1 - 10 kg/minute |  | 가지치기(형제 선택지와 같은 곳) |
| 분말·과립 | q025_063_111_compressinggranularmaterial | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 압축 10 - 100 gram/minute | q025_3_063_3_111_3_compressinggranularmaterialcontainmentlevel |  |
| 분말·과립 | q025_063_111_compressinggranularmaterial | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 압축 10 - 100 gram/minute |  | 가지치기(형제 선택지와 같은 곳) |
| 분말·과립 | q025_063_111_compressinggranularmaterial | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 압축 10 - 100 kg/minute | q025_3_063_3_111_3_compressinggranularmaterialcontainmentlevel |  |
| 분말·과립 | q025_063_111_compressinggranularmaterial | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 압축 10 - 100 kg/minute | q025_3_063_3_111_3_compressinggranularmaterialcontainmentlevel |  |
| 분말·과립 | q025_063_111_compressinggranularmaterial | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 압축 10 gram/minute 미만 | q025_3_063_3_111_3_compressinggranularmaterialcontainmentlevel |  |
| 분말·과립 | q025_063_111_compressinggranularmaterial | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 압축 10 gram/minute 미만 |  | 가지치기(형제 선택지와 같은 곳) |
| 분말·과립 | q025_063_111_compressinggranularmaterial | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 압축 100 - 1000 kg/minute | q025_3_063_3_111_3_compressinggranularmaterialcontainmentlevel |  |
| 분말·과립 | q025_063_111_compressinggranularmaterial | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 압축 100 - 1000 kg/minute | q025_3_063_3_111_3_compressinggranularmaterialcontainmentlevel |  |
| 분말·과립 | q025_063_111_compressinggranularmaterial | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 압축 1000 kg/minute 초과 | q025_3_063_3_111_3_compressinggranularmaterialcontainmentlevel |  |
| 분말·과립 | q025_063_111_compressinggranularmaterial | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 압축 1000 kg/minute 초과 | q025_3_063_3_111_3_compressinggranularmaterialcontainmentlevel |  |
| 분말·과립 | q025_3_063_3_111_3_compressinggranularmaterialcontainmentlevel | 공정의 밀폐 수준은 어떻습니까? | 개방 공정 | q042_080_130_primarylocalizedcontrols |  |
| 분말·과립 | q025_3_063_3_111_3_compressinggranularmaterialcontainmentlevel | 공정의 밀폐 수준은 어떻습니까? | 개방 공정 | q042_080_130_primarylocalizedcontrols |  |
| 분말·과립 | q025_3_063_3_111_3_compressinggranularmaterialcontainmentlevel | 공정의 밀폐 수준은 어떻습니까? | 제품과 주변 공기의 접촉을 줄이는 취급 | q042_080_130_primarylocalizedcontrols |  |
| 분말·과립 | q025_3_063_3_111_3_compressinggranularmaterialcontainmentlevel | 공정의 밀폐 수준은 어떻습니까? | 제품과 주변 공기의 접촉을 줄이는 취급 | q042_080_130_primarylocalizedcontrols |  |
| 분말·과립 | q025_5_063_5_111_5_fracturinggranularmaterial | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 파쇄 0.1 - 1 kg/minute | q025_8_063_8_111_8_fracturinggranularmaterialcontainmentlevel |  |
| 분말·과립 | q025_5_063_5_111_5_fracturinggranularmaterial | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 파쇄 0.1 - 1 kg/minute |  | 가지치기(형제 선택지와 같은 곳) |
| 분말·과립 | q025_5_063_5_111_5_fracturinggranularmaterial | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 파쇄 1 - 10 kg/minute | q025_8_063_8_111_8_fracturinggranularmaterialcontainmentlevel |  |
| 분말·과립 | q025_5_063_5_111_5_fracturinggranularmaterial | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 파쇄 1 - 10 kg/minute |  | 가지치기(형제 선택지와 같은 곳) |
| 분말·과립 | q025_5_063_5_111_5_fracturinggranularmaterial | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 파쇄 10 - 100 gram/minute | q025_8_063_8_111_8_fracturinggranularmaterialcontainmentlevel |  |
| 분말·과립 | q025_5_063_5_111_5_fracturinggranularmaterial | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 파쇄 10 - 100 gram/minute |  | 가지치기(형제 선택지와 같은 곳) |
| 분말·과립 | q025_5_063_5_111_5_fracturinggranularmaterial | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 파쇄 10 - 100 kg/minute | q025_8_063_8_111_8_fracturinggranularmaterialcontainmentlevel |  |
| 분말·과립 | q025_5_063_5_111_5_fracturinggranularmaterial | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 파쇄 10 - 100 kg/minute | q025_8_063_8_111_8_fracturinggranularmaterialcontainmentlevel |  |
| 분말·과립 | q025_5_063_5_111_5_fracturinggranularmaterial | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 파쇄 10 gram/minute 미만 | q025_8_063_8_111_8_fracturinggranularmaterialcontainmentlevel |  |
| 분말·과립 | q025_5_063_5_111_5_fracturinggranularmaterial | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 파쇄 10 gram/minute 미만 |  | 가지치기(형제 선택지와 같은 곳) |
| 분말·과립 | q025_5_063_5_111_5_fracturinggranularmaterial | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 파쇄 100 - 1000 kg/minute | q025_8_063_8_111_8_fracturinggranularmaterialcontainmentlevel |  |
| 분말·과립 | q025_5_063_5_111_5_fracturinggranularmaterial | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 파쇄 100 - 1000 kg/minute | q025_8_063_8_111_8_fracturinggranularmaterialcontainmentlevel |  |
| 분말·과립 | q025_5_063_5_111_5_fracturinggranularmaterial | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 파쇄 1000 kg/minute 초과 | q025_8_063_8_111_8_fracturinggranularmaterialcontainmentlevel |  |
| 분말·과립 | q025_5_063_5_111_5_fracturinggranularmaterial | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 파쇄 1000 kg/minute 초과 | q025_8_063_8_111_8_fracturinggranularmaterialcontainmentlevel |  |
| 분말·과립 | q025_8_063_8_111_8_fracturinggranularmaterialcontainmentlevel | 공정의 밀폐 수준은 어떻습니까? | 개방 공정 (예: 개방된 표면에서의 벌크 분쇄) | q042_080_130_primarylocalizedcontrols |  |
| 분말·과립 | q025_8_063_8_111_8_fracturinggranularmaterialcontainmentlevel | 공정의 밀폐 수준은 어떻습니까? | 개방 공정 (예: 개방된 표면에서의 벌크 분쇄) | q042_080_130_primarylocalizedcontrols |  |
| 분말·과립 | q025_8_063_8_111_8_fracturinggranularmaterialcontainmentlevel | 공정의 밀폐 수준은 어떻습니까? | 제품과 주변 공기의 접촉을 줄이는 취급 | q042_080_130_primarylocalizedcontrols |  |
| 분말·과립 | q025_8_063_8_111_8_fracturinggranularmaterialcontainmentlevel | 공정의 밀폐 수준은 어떻습니까? | 제품과 주변 공기의 접촉을 줄이는 취급 | q042_080_130_primarylocalizedcontrols |  |
| 분말·과립 | q042_080_130_primarylocalizedcontrols | 일반 제어수단 | 국소 제어 없음 | q045_081_surfacecontamination |  |
| 분말·과립 | q042_080_130_primarylocalizedcontrols | 일반 제어수단 | 국소 제어 없음 | q043_131_segregation |  |
| 분말·과립 | q042_080_130_primarylocalizedcontrols | 일반 제어수단 | 국소배기장치(LEV) |  | 막힘(검증오류) |
| 분말·과립 | q042_080_130_primarylocalizedcontrols | 일반 제어수단 | 국소배기장치(LEV) |  | 막힘(검증오류) |
| 분말·과립 | q042_080_130_primarylocalizedcontrols | 일반 제어수단 | 글로브 박스 및 글로브 백 |  | 막힘(검증오류) |
| 분말·과립 | q042_080_130_primarylocalizedcontrols | 일반 제어수단 | 글로브 박스 및 글로브 백 |  | 막힘(검증오류) |
| 분말·과립 | q042_080_130_primarylocalizedcontrols | 일반 제어수단 | 밀폐 — 배기 없음 | q042_5_080_5_130_5_secondarylocalizedcontrols |  |
| 분말·과립 | q042_080_130_primarylocalizedcontrols | 일반 제어수단 | 밀폐 — 배기 없음 | q042_5_080_5_130_5_secondarylocalizedcontrols |  |
| 분말·과립 | q042_080_130_primarylocalizedcontrols | 일반 제어수단 | 억제 기법 | q042_5_080_5_130_5_secondarylocalizedcontrols |  |
| 분말·과립 | q042_080_130_primarylocalizedcontrols | 일반 제어수단 | 억제 기법 | q042_5_080_5_130_5_secondarylocalizedcontrols |  |
| 분말·과립 | q042_080_130_primarylocalizedcontrols | 일반 제어수단 | 증기 회수 시스템 | q042_5_080_5_130_5_secondarylocalizedcontrols |  |
| 분말·과립 | q042_080_130_primarylocalizedcontrols | 일반 제어수단 | 증기 회수 시스템 | q042_5_080_5_130_5_secondarylocalizedcontrols |  |
| 분말·과립 | q042_5_080_5_130_5_secondarylocalizedcontrols | 일반 제어수단 | 2차 국소 제어 없음 | q045_081_surfacecontamination |  |
| 분말·과립 | q042_5_080_5_130_5_secondarylocalizedcontrols | 일반 제어수단 | 2차 국소 제어 없음 | q043_131_segregation |  |
| 분말·과립 | q042_5_080_5_130_5_secondarylocalizedcontrols | 일반 제어수단 | 국소배기장치(LEV) |  | 막힘(검증오류) |
| 분말·과립 | q042_5_080_5_130_5_secondarylocalizedcontrols | 일반 제어수단 | 국소배기장치(LEV) |  | 가지치기(형제 선택지와 같은 곳) |
| 분말·과립 | q042_5_080_5_130_5_secondarylocalizedcontrols | 일반 제어수단 | 글로브 박스 및 글로브 백 |  | 막힘(검증오류) |
| 분말·과립 | q042_5_080_5_130_5_secondarylocalizedcontrols | 일반 제어수단 | 글로브 박스 및 글로브 백 |  | 가지치기(형제 선택지와 같은 곳) |
| 분말·과립 | q042_5_080_5_130_5_secondarylocalizedcontrols | 일반 제어수단 | 밀폐 — 배기 없음 | q045_081_surfacecontamination |  |
| 분말·과립 | q042_5_080_5_130_5_secondarylocalizedcontrols | 일반 제어수단 | 밀폐 — 배기 없음 | q043_131_segregation |  |
| 분말·과립 | q042_5_080_5_130_5_secondarylocalizedcontrols | 일반 제어수단 | 억제 기법 | q045_081_surfacecontamination |  |
| 분말·과립 | q042_5_080_5_130_5_secondarylocalizedcontrols | 일반 제어수단 | 억제 기법 | q043_131_segregation |  |
| 분말·과립 | q042_5_080_5_130_5_secondarylocalizedcontrols | 일반 제어수단 | 증기 회수 시스템 | q045_081_surfacecontamination |  |
| 분말·과립 | q042_5_080_5_130_5_secondarylocalizedcontrols | 일반 제어수단 | 증기 회수 시스템 |  | 가지치기(형제 선택지와 같은 곳) |
| 분말·과립 | q043_131_segregation | 격리(발생원) 선택 | (미수집) rbCompleteNoVentilation | q044_personalenclosure |  |
| 분말·과립 | q043_131_segregation | 격리(발생원) 선택 | (미수집) rbCompleteVentilation |  | 가지치기(형제 선택지와 같은 곳) |
| 분말·과립 | q043_131_segregation | 격리(발생원) 선택 | (미수집) rbNoSegregation |  | 가지치기(형제 선택지와 같은 곳) |
| 분말·과립 | q043_131_segregation | 격리(발생원) 선택 | (미수집) rbPartialNoVentilation | q044_personalenclosure |  |
| 분말·과립 | q043_131_segregation | 격리(발생원) 선택 | (미수집) rbPartialVentilation | q044_personalenclosure |  |
| 분말·과립 | q044_personalenclosure | Select 격리(작업자) | (미수집) rbCompleteNoVentilation | q045_081_surfacecontamination |  |
| 분말·과립 | q044_personalenclosure | Select 격리(작업자) | (미수집) rbCompleteVentilation |  | 가지치기(형제 선택지와 같은 곳) |
| 분말·과립 | q044_personalenclosure | Select 격리(작업자) | (미수집) rbNoPersonalEnclosure |  | 가지치기(형제 선택지와 같은 곳) |
| 분말·과립 | q044_personalenclosure | Select 격리(작업자) | (미수집) rbPartialNoVentilation | q045_081_surfacecontamination |  |
| 분말·과립 | q044_personalenclosure | Select 격리(작업자) | (미수집) rbPartialVentilation | q045_081_surfacecontamination |  |
| 분말·과립 | q045_081_surfacecontamination | 공정이 완전히 밀폐되어 있고, 그 밀폐의 건전성을 정기적으로 점검합니까? | 아니오 | q084_dispersion |  |
| 분말·과립 | q045_081_surfacecontamination | 공정이 완전히 밀폐되어 있고, 그 밀폐의 건전성을 정기적으로 점검합니까? | 아니오 | q048_dispersion |  |
| 분말·과립 | q045_081_surfacecontamination | 공정이 완전히 밀폐되어 있고, 그 밀폐의 건전성을 정기적으로 점검합니까? | 예 | q084_dispersion |  |
| 분말·과립 | q045_081_surfacecontamination | 공정이 완전히 밀폐되어 있고, 그 밀폐의 건전성을 정기적으로 점검합니까? | 예 | q048_dispersion |  |
| 분말·과립 | q048_dispersion | 작업을 실내 또는 실외에서 수행합니까? | (미수집) rbIndoors |  | 막힘(검증오류) |
| 분말·과립 | q048_dispersion | 작업을 실내 또는 실외에서 수행합니까? | (미수집) rbOutdoors |  | 막힘(검증오류) |
| 분말·과립 | q084_dispersion | 작업은 실내, 실외, 분무실, 또는 하향 층류 부스 중 어디에서 수행됩니까? | 스프레이 룸 | q089_0_secondaryfarfieldsources |  |
| 분말·과립 | q084_dispersion | 작업은 실내, 실외, 분무실, 또는 하향 층류 부스 중 어디에서 수행됩니까? | 실내 | q089_0_secondaryfarfieldsources |  |
| 분말·과립 | q084_dispersion | 작업은 실내, 실외, 분무실, 또는 하향 층류 부스 중 어디에서 수행됩니까? | 실외 | q089_0_secondaryfarfieldsources |  |
| 분말·과립 | q084_dispersion | 작업은 실내, 실외, 분무실, 또는 하향 층류 부스 중 어디에서 수행됩니까? | 하향 층류 부스 | q089_0_secondaryfarfieldsources |  |
| 분말·과립 | q089_0_secondaryfarfieldsources | 작업자 호흡 영역의 발생원 외에, 작업실 내에 2차 발생원이 존재합니까? | 아니오 | q002_7_activities |  |
| 분말·과립 | q089_0_secondaryfarfieldsources | 작업자 호흡 영역의 발생원 외에, 작업실 내에 2차 발생원이 존재합니까? | 예 | q003_090_producttype |  |
| 액체 | q002_7_activities | 시나리오 개요 - ART 기계론적 모델 | (선택지 없음 - 값 입력 후 다음) |  | 막힘(검증오류) |
| 액체 | q009_096_processtemperature | 공정 중 액체의 온도는 얼마입니까? | 고온 공정 (50 - 150 ℃) | q010_010_5_097_097_5_vapourpressure |  |
| 액체 | q009_096_processtemperature | 공정 중 액체의 온도는 얼마입니까? | 실온 (15 - 25 ℃) | q010_010_5_097_097_5_vapourpressure |  |
| 액체 | q009_096_processtemperature | 공정 중 액체의 온도는 얼마입니까? | 실온 미만 (< 15 ℃) | q010_010_5_097_097_5_vapourpressure |  |
| 액체 | q009_096_processtemperature | 공정 중 액체의 온도는 얼마입니까? | 실온 초과 (25 - 50 ℃) | q010_010_5_097_097_5_vapourpressure |  |
| 액체 | q010_010_5_097_097_5_vapourpressure | 실온에서 물질의 증기압(Pascal)은 얼마입니까? | (선택지 없음 - 값 입력 후 다음) | q012_099_liquidweightfraction |  |
| 액체 | q012_099_liquidweightfraction | 해당 물질은 저휘발성으로 간주되며, 미스트 노출로 추정됩니다. | 극미량 (0.01 - 0.1 %) | q013_100_viscosity |  |
| 액체 | q012_099_liquidweightfraction | 해당 물질은 저휘발성으로 간주되며, 미스트 노출로 추정됩니다. | 극히 적음 (0.1 - 0.5 %) | q013_100_viscosity |  |
| 액체 | q012_099_liquidweightfraction | 해당 물질은 저휘발성으로 간주되며, 미스트 노출로 추정됩니다. | 매우 적음 (0.5 - 1 %) | q013_100_viscosity |  |
| 액체 | q012_099_liquidweightfraction | 해당 물질은 저휘발성으로 간주되며, 미스트 노출로 추정됩니다. | 상당량 (10 - 50 %) | q013_100_viscosity |  |
| 액체 | q012_099_liquidweightfraction | 해당 물질은 저휘발성으로 간주되며, 미스트 노출로 추정됩니다. | 소량 (5 - 10 %) | q013_100_viscosity |  |
| 액체 | q012_099_liquidweightfraction | 해당 물질은 저휘발성으로 간주되며, 미스트 노출로 추정됩니다. | 순수 액체 (100%) | q013_100_viscosity |  |
| 액체 | q012_099_liquidweightfraction | 해당 물질은 저휘발성으로 간주되며, 미스트 노출로 추정됩니다. | 적음 (1 - 5 %) | q013_100_viscosity |  |
| 액체 | q012_099_liquidweightfraction | 해당 물질은 저휘발성으로 간주되며, 미스트 노출로 추정됩니다. | 주성분 (50 - 90 %) | q013_100_viscosity |  |
| 액체 | q013_100_viscosity | 물질/조제품의 점도는 얼마입니까? | 저점도 액체 (물과 유사) | q016_nearfieldsource |  |
| 액체 | q013_100_viscosity | 물질/조제품의 점도는 얼마입니까? | 중점도 액체 (기름과 유사) | q016_nearfieldsource |  |
| 액체 | q016_nearfieldsource | 1차 배출 발생원이 작업자의 호흡 영역(즉, 작업자 머리로부터 모든 방향으로 1미터 이내의 공기 체적) 안에 있습니까? | 아니오 | q017_055_103_activityclass |  |
| 액체 | q016_nearfieldsource | 1차 배출 발생원이 작업자의 호흡 영역(즉, 작업자 머리로부터 모든 방향으로 1미터 이내의 공기 체적) 안에 있습니까? | 예 | q017_055_103_activityclass |  |
| 액체 | q017_055_103_activityclass | 활동 등급 선택 | 개방 액면 또는 개방 저장조에서의 활동 / (미수집) 13 | q028_066_114_liquidopensurfaceundisturbed |  |
| 액체 | q017_055_103_activityclass | 활동 등급 선택 | 개방 액면 또는 개방 저장조에서의 활동 / (미수집) 13 | q028_066_114_liquidopensurfaceundisturbed |  |
| 액체 | q017_055_103_activityclass | 활동 등급 선택 | 개방 액면 또는 개방 저장조에서의 활동 / (미수집) 14 | q028_3_066_3_114_3_liquidopensurfaceagitated |  |
| 액체 | q017_055_103_activityclass | 활동 등급 선택 | 개방 액면 또는 개방 저장조에서의 활동 / (미수집) 14 | q028_3_066_3_114_3_liquidopensurfaceagitated |  |
| 액체 | q017_055_103_activityclass | 활동 등급 선택 | 개방 액면 또는 개방 저장조에서의 활동 / — 선택 — | q028_066_114_liquidopensurfaceundisturbed |  |
| 액체 | q017_055_103_activityclass | 활동 등급 선택 | 개방 액면 또는 개방 저장조에서의 활동 / — 선택 — | q028_066_114_liquidopensurfaceundisturbed |  |
| 액체 | q017_055_103_activityclass | 활동 등급 선택 | 고속 공정에서의 액체 적용 (예: 회전 공구) | q030_068_116_liquidshighspeedprocesses |  |
| 액체 | q017_055_103_activityclass | 활동 등급 선택 | 고속 공정에서의 액체 적용 (예: 회전 공구) | q030_068_116_liquidshighspeedprocesses |  |
| 액체 | q017_055_103_activityclass | 활동 등급 선택 | 액상 제품의 도포 | q029_067_115_spreadingliquidproducts |  |
| 액체 | q017_055_103_activityclass | 활동 등급 선택 | 액상 제품의 도포 | q029_067_115_spreadingliquidproducts |  |
| 액체 | q017_055_103_activityclass | 활동 등급 선택 | 액상 제품의 이송 / (미수집) 18 | q032_070_118_bottomloading |  |
| 액체 | q017_055_103_activityclass | 활동 등급 선택 | 액상 제품의 이송 / (미수집) 18 | q032_070_118_bottomloading |  |
| 액체 | q017_055_103_activityclass | 활동 등급 선택 | 액상 제품의 이송 / (미수집) 19 | q033_071_119_fallingliquids |  |
| 액체 | q017_055_103_activityclass | 활동 등급 선택 | 액상 제품의 이송 / (미수집) 19 | q033_071_119_fallingliquids |  |
| 액체 | q017_055_103_activityclass | 활동 등급 선택 | 액상 제품의 이송 / — 선택 — | q032_070_118_bottomloading |  |
| 액체 | q017_055_103_activityclass | 활동 등급 선택 | 액상 제품의 이송 / — 선택 — | q032_070_118_bottomloading |  |
| 액체 | q017_055_103_activityclass | 활동 등급 선택 | 액체의 분무 적용 / — 선택 — | q026_064_112_surfacesprayingliquids |  |
| 액체 | q017_055_103_activityclass | 활동 등급 선택 | 액체의 분무 적용 / — 선택 — | q026_064_112_surfacesprayingliquids |  |
| 액체 | q017_055_103_activityclass | 활동 등급 선택 | 액체의 분무 적용 / 공간 내 액체 분무 | q027_065_113_sprayingliquidsinspace |  |
| 액체 | q017_055_103_activityclass | 활동 등급 선택 | 액체의 분무 적용 / 공간 내 액체 분무 | q027_065_113_sprayingliquidsinspace |  |
| 액체 | q017_055_103_activityclass | 활동 등급 선택 | 액체의 분무 적용 / 액체의 표면 분무 | q026_064_112_surfacesprayingliquids |  |
| 액체 | q017_055_103_activityclass | 활동 등급 선택 | 액체의 분무 적용 / 액체의 표면 분무 | q026_064_112_surfacesprayingliquids |  |
| 액체 | q017_055_103_activityclass | 활동 등급 선택 | 액체의 연소 / (미수집) 18 | q032_070_118_bottomloading |  |
| 액체 | q017_055_103_activityclass | 활동 등급 선택 | 액체의 연소 / (미수집) 18 | q032_070_118_bottomloading |  |
| 액체 | q017_055_103_activityclass | 활동 등급 선택 | 액체의 연소 / (미수집) 19 | q033_071_119_fallingliquids |  |
| 액체 | q017_055_103_activityclass | 활동 등급 선택 | 액체의 연소 / (미수집) 19 | q033_071_119_fallingliquids |  |
| 액체 | q017_055_103_activityclass | 활동 등급 선택 | 액체의 연소 / — 선택 — | q032_070_118_bottomloading |  |
| 액체 | q017_055_103_activityclass | 활동 등급 선택 | 액체의 연소 / — 선택 — | q032_070_118_bottomloading |  |
| 액체 | q017_055_103_activityclass | 활동 등급 선택 | 오염된 물체의 취급 | q028_5_066_5_114_5_handlingcontaminatedobjects |  |
| 액체 | q017_055_103_activityclass | 활동 등급 선택 | 오염된 물체의 취급 | q028_5_066_5_114_5_handlingcontaminatedobjects |  |
| 액체 | q026_064_112_surfacesprayingliquids | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 낮은 도포율 (0.03 - 0.3 l/minute) | q026_5_064_5_112_5_surfacesprayingliquidsspraydirection |  |
| 액체 | q026_064_112_surfacesprayingliquids | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 낮은 도포율 (0.03 - 0.3 l/minute) | q026_5_064_5_112_5_surfacesprayingliquidsspraydirection |  |
| 액체 | q026_064_112_surfacesprayingliquids | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 높은 도포율 (> 3 l/minute) | q026_5_064_5_112_5_surfacesprayingliquidsspraydirection |  |
| 액체 | q026_064_112_surfacesprayingliquids | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 높은 도포율 (> 3 l/minute) | q026_5_064_5_112_5_surfacesprayingliquidsspraydirection |  |
| 액체 | q026_064_112_surfacesprayingliquids | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 매우 낮은 도포율 (< 0.03 l/minute) | q026_5_064_5_112_5_surfacesprayingliquidsspraydirection |  |
| 액체 | q026_064_112_surfacesprayingliquids | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 매우 낮은 도포율 (< 0.03 l/minute) |  | 가지치기(형제 선택지와 같은 곳) |
| 액체 | q026_064_112_surfacesprayingliquids | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 중간 도포율 (0.3 - 3 l/minute) | q026_5_064_5_112_5_surfacesprayingliquidsspraydirection |  |
| 액체 | q026_064_112_surfacesprayingliquids | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 중간 도포율 (0.3 - 3 l/minute) | q026_5_064_5_112_5_surfacesprayingliquidsspraydirection |  |
| 액체 | q026_5_064_5_112_5_surfacesprayingliquidsspraydirection | 분무 방향은 어떻습니까? | 모든 방향(상향 포함)으로의 분무 | q026_7_064_7_112_7_surfacesprayingliquidsspraytechnique |  |
| 액체 | q026_5_064_5_112_5_surfacesprayingliquidsspraydirection | 분무 방향은 어떻습니까? | 모든 방향(상향 포함)으로의 분무 | q026_7_064_7_112_7_surfacesprayingliquidsspraytechnique |  |
| 액체 | q026_5_064_5_112_5_surfacesprayingliquidsspraydirection | 분무 방향은 어떻습니까? | 수평 또는 하향 분무만 | q026_7_064_7_112_7_surfacesprayingliquidsspraytechnique |  |
| 액체 | q026_5_064_5_112_5_surfacesprayingliquidsspraydirection | 분무 방향은 어떻습니까? | 수평 또는 하향 분무만 | q026_7_064_7_112_7_surfacesprayingliquidsspraytechnique |  |
| 액체 | q026_5_064_5_112_5_surfacesprayingliquidsspraydirection | 분무 방향은 어떻습니까? | 하향만 | q026_7_064_7_112_7_surfacesprayingliquidsspraytechnique |  |
| 액체 | q026_5_064_5_112_5_surfacesprayingliquidsspraydirection | 분무 방향은 어떻습니까? | 하향만 | q026_7_064_7_112_7_surfacesprayingliquidsspraytechnique |  |
| 액체 | q026_7_064_7_112_7_surfacesprayingliquidsspraytechnique | 분무 기법은 무엇입니까? | 압축공기 미사용 또는 사용이 적은 분무 | q042_080_130_primarylocalizedcontrols |  |
| 액체 | q026_7_064_7_112_7_surfacesprayingliquidsspraytechnique | 분무 기법은 무엇입니까? | 압축공기 미사용 또는 사용이 적은 분무 | q042_080_130_primarylocalizedcontrols |  |
| 액체 | q026_7_064_7_112_7_surfacesprayingliquidsspraytechnique | 분무 기법은 무엇입니까? | 압축공기 사용이 많은 분무 | q042_080_130_primarylocalizedcontrols |  |
| 액체 | q026_7_064_7_112_7_surfacesprayingliquidsspraytechnique | 분무 기법은 무엇입니까? | 압축공기 사용이 많은 분무 | q042_080_130_primarylocalizedcontrols |  |
| 액체 | q027_065_113_sprayingliquidsinspace | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 대규모 공간 분무 | q042_080_130_primarylocalizedcontrols |  |
| 액체 | q027_065_113_sprayingliquidsinspace | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 대규모 공간 분무 | q042_080_130_primarylocalizedcontrols |  |
| 액체 | q027_065_113_sprayingliquidsinspace | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 소규모 공간 분무 | q042_080_130_primarylocalizedcontrols |  |
| 액체 | q027_065_113_sprayingliquidsinspace | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 소규모 공간 분무 | q042_080_130_primarylocalizedcontrols |  |
| 액체 | q028_066_114_liquidopensurfaceundisturbed | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 개방 표면 0.1 - 0.3 m2 | q042_080_130_primarylocalizedcontrols |  |
| 액체 | q028_066_114_liquidopensurfaceundisturbed | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 개방 표면 0.1 - 0.3 m2 |  | 가지치기(형제 선택지와 같은 곳) |
| 액체 | q028_066_114_liquidopensurfaceundisturbed | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 개방 표면 0.3 - 1 m2 | q042_080_130_primarylocalizedcontrols |  |
| 액체 | q028_066_114_liquidopensurfaceundisturbed | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 개방 표면 0.3 - 1 m2 | q042_080_130_primarylocalizedcontrols |  |
| 액체 | q028_066_114_liquidopensurfaceundisturbed | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 개방 표면 1 - 3 m2 | q042_080_130_primarylocalizedcontrols |  |
| 액체 | q028_066_114_liquidopensurfaceundisturbed | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 개방 표면 1 - 3 m2 | q042_080_130_primarylocalizedcontrols |  |
| 액체 | q028_066_114_liquidopensurfaceundisturbed | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 개방 표면 < 0.1 m2 | q042_080_130_primarylocalizedcontrols |  |
| 액체 | q028_066_114_liquidopensurfaceundisturbed | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 개방 표면 < 0.1 m2 |  | 가지치기(형제 선택지와 같은 곳) |
| 액체 | q028_066_114_liquidopensurfaceundisturbed | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 개방 표면 > 3 m2 | q042_080_130_primarylocalizedcontrols |  |
| 액체 | q028_066_114_liquidopensurfaceundisturbed | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 개방 표면 > 3 m2 | q042_080_130_primarylocalizedcontrols |  |
| 액체 | q028_3_066_3_114_3_liquidopensurfaceagitated | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 개방 표면 0.1 - 0.3 m2 | q042_080_130_primarylocalizedcontrols |  |
| 액체 | q028_3_066_3_114_3_liquidopensurfaceagitated | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 개방 표면 0.1 - 0.3 m2 |  | 가지치기(형제 선택지와 같은 곳) |
| 액체 | q028_3_066_3_114_3_liquidopensurfaceagitated | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 개방 표면 0.3 - 1 m2 | q042_080_130_primarylocalizedcontrols |  |
| 액체 | q028_3_066_3_114_3_liquidopensurfaceagitated | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 개방 표면 0.3 - 1 m2 | q042_080_130_primarylocalizedcontrols |  |
| 액체 | q028_3_066_3_114_3_liquidopensurfaceagitated | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 개방 표면 1 - 3 m2 | q042_080_130_primarylocalizedcontrols |  |
| 액체 | q028_3_066_3_114_3_liquidopensurfaceagitated | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 개방 표면 1 - 3 m2 | q042_080_130_primarylocalizedcontrols |  |
| 액체 | q028_3_066_3_114_3_liquidopensurfaceagitated | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 개방 표면 < 0.1 m2 | q042_080_130_primarylocalizedcontrols |  |
| 액체 | q028_3_066_3_114_3_liquidopensurfaceagitated | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 개방 표면 < 0.1 m2 |  | 가지치기(형제 선택지와 같은 곳) |
| 액체 | q028_3_066_3_114_3_liquidopensurfaceagitated | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 개방 표면 > 3 m2 | q042_080_130_primarylocalizedcontrols |  |
| 액체 | q028_3_066_3_114_3_liquidopensurfaceagitated | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 개방 표면 > 3 m2 | q042_080_130_primarylocalizedcontrols |  |
| 액체 | q028_5_066_5_114_5_handlingcontaminatedobjects | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 처리/오염된 물체를 다루는 활동 (표면 0.1-0.3 m2) | q028_7_066_7_114_7_handlingcontaminatedobjectscontaminationlevel |  |
| 액체 | q028_5_066_5_114_5_handlingcontaminatedobjects | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 처리/오염된 물체를 다루는 활동 (표면 0.1-0.3 m2) |  | 가지치기(형제 선택지와 같은 곳) |
| 액체 | q028_5_066_5_114_5_handlingcontaminatedobjects | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 처리/오염된 물체를 다루는 활동 (표면 0.3-1 m2) | q028_7_066_7_114_7_handlingcontaminatedobjectscontaminationlevel |  |
| 액체 | q028_5_066_5_114_5_handlingcontaminatedobjects | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 처리/오염된 물체를 다루는 활동 (표면 0.3-1 m2) | q028_7_066_7_114_7_handlingcontaminatedobjectscontaminationlevel |  |
| 액체 | q028_5_066_5_114_5_handlingcontaminatedobjects | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 처리/오염된 물체를 다루는 활동 (표면 1-3 m2) | q028_7_066_7_114_7_handlingcontaminatedobjectscontaminationlevel |  |
| 액체 | q028_5_066_5_114_5_handlingcontaminatedobjects | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 처리/오염된 물체를 다루는 활동 (표면 1-3 m2) | q028_7_066_7_114_7_handlingcontaminatedobjectscontaminationlevel |  |
| 액체 | q028_5_066_5_114_5_handlingcontaminatedobjects | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 처리/오염된 물체를 다루는 활동 (표면 <0.1 m2) | q028_7_066_7_114_7_handlingcontaminatedobjectscontaminationlevel |  |
| 액체 | q028_5_066_5_114_5_handlingcontaminatedobjects | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 처리/오염된 물체를 다루는 활동 (표면 <0.1 m2) |  | 가지치기(형제 선택지와 같은 곳) |
| 액체 | q028_5_066_5_114_5_handlingcontaminatedobjects | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 처리/오염된 물체를 다루는 활동 (표면 > 3 m2) | q028_7_066_7_114_7_handlingcontaminatedobjectscontaminationlevel |  |
| 액체 | q028_5_066_5_114_5_handlingcontaminatedobjects | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 처리/오염된 물체를 다루는 활동 (표면 > 3 m2) | q028_7_066_7_114_7_handlingcontaminatedobjectscontaminationlevel |  |
| 액체 | q028_7_066_7_114_7_handlingcontaminatedobjectscontaminationlevel | 물체 표면의 오염 정도는 어떻습니까? | 표면의 10-90 % 오염 | q042_080_130_primarylocalizedcontrols |  |
| 액체 | q028_7_066_7_114_7_handlingcontaminatedobjectscontaminationlevel | 물체 표면의 오염 정도는 어떻습니까? | 표면의 10-90 % 오염 | q042_080_130_primarylocalizedcontrols |  |
| 액체 | q028_7_066_7_114_7_handlingcontaminatedobjectscontaminationlevel | 물체 표면의 오염 정도는 어떻습니까? | 표면의 < 10 % 오염 | q042_080_130_primarylocalizedcontrols |  |
| 액체 | q028_7_066_7_114_7_handlingcontaminatedobjectscontaminationlevel | 물체 표면의 오염 정도는 어떻습니까? | 표면의 < 10 % 오염 | q042_080_130_primarylocalizedcontrols |  |
| 액체 | q028_7_066_7_114_7_handlingcontaminatedobjectscontaminationlevel | 물체 표면의 오염 정도는 어떻습니까? | 표면의 > 90 % 오염 | q042_080_130_primarylocalizedcontrols |  |
| 액체 | q028_7_066_7_114_7_handlingcontaminatedobjectscontaminationlevel | 물체 표면의 오염 정도는 어떻습니까? | 표면의 > 90 % 오염 | q042_080_130_primarylocalizedcontrols |  |
| 액체 | q029_067_115_spreadingliquidproducts | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 표면 또는 가공물에 대한 액체 도포 0.1 - 0.3 m2 / hour | q042_080_130_primarylocalizedcontrols |  |
| 액체 | q029_067_115_spreadingliquidproducts | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 표면 또는 가공물에 대한 액체 도포 0.1 - 0.3 m2 / hour |  | 가지치기(형제 선택지와 같은 곳) |
| 액체 | q029_067_115_spreadingliquidproducts | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 표면 또는 가공물에 대한 액체 도포 0.3 - 1 m² / hour | q042_080_130_primarylocalizedcontrols |  |
| 액체 | q029_067_115_spreadingliquidproducts | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 표면 또는 가공물에 대한 액체 도포 0.3 - 1 m² / hour | q042_080_130_primarylocalizedcontrols |  |
| 액체 | q029_067_115_spreadingliquidproducts | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 표면 또는 가공물에 대한 액체 도포 1 - 3 m² / hour | q042_080_130_primarylocalizedcontrols |  |
| 액체 | q029_067_115_spreadingliquidproducts | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 표면 또는 가공물에 대한 액체 도포 1 - 3 m² / hour | q042_080_130_primarylocalizedcontrols |  |
| 액체 | q029_067_115_spreadingliquidproducts | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 표면 또는 가공물에 대한 액체 도포 < 0.1 m2 / hour | q042_080_130_primarylocalizedcontrols |  |
| 액체 | q029_067_115_spreadingliquidproducts | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 표면 또는 가공물에 대한 액체 도포 < 0.1 m2 / hour |  | 가지치기(형제 선택지와 같은 곳) |
| 액체 | q029_067_115_spreadingliquidproducts | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 표면 또는 가공물에 대한 액체 도포 > 3 m2 / hour | q042_080_130_primarylocalizedcontrols |  |
| 액체 | q029_067_115_spreadingliquidproducts | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 표면 또는 가공물에 대한 액체 도포 > 3 m2 / hour | q042_080_130_primarylocalizedcontrols |  |
| 액체 | q030_068_116_liquidshighspeedprocesses | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 고속 운동이 수반되는 대규모 활동 | q030_5_068_5_116_5_liquidshighspeedprocessescontainmentlevel |  |
| 액체 | q030_068_116_liquidshighspeedprocesses | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 고속 운동이 수반되는 대규모 활동 | q030_5_068_5_116_5_liquidshighspeedprocessescontainmentlevel |  |
| 액체 | q030_068_116_liquidshighspeedprocesses | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 고속 운동이 수반되는 소규모 활동 | q030_5_068_5_116_5_liquidshighspeedprocessescontainmentlevel |  |
| 액체 | q030_068_116_liquidshighspeedprocesses | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 고속 운동이 수반되는 소규모 활동 | q030_5_068_5_116_5_liquidshighspeedprocessescontainmentlevel |  |
| 액체 | q030_5_068_5_116_5_liquidshighspeedprocessescontainmentlevel | 공정의 밀폐 수준은 어떻습니까? | 개방 공정: 공정과 작업자 간 격리(작업자) 없음 | q042_080_130_primarylocalizedcontrols |  |
| 액체 | q030_5_068_5_116_5_liquidshighspeedprocessescontainmentlevel | 공정의 밀폐 수준은 어떻습니까? | 개방 공정: 공정과 작업자 간 격리(작업자) 없음 | q042_080_130_primarylocalizedcontrols |  |
| 액체 | q030_5_068_5_116_5_liquidshighspeedprocessescontainmentlevel | 공정의 밀폐 수준은 어떻습니까? | 제품과 주변 공기의 접촉을 줄이는 취급 | q042_080_130_primarylocalizedcontrols |  |
| 액체 | q030_5_068_5_116_5_liquidshighspeedprocessescontainmentlevel | 공정의 밀폐 수준은 어떻습니까? | 제품과 주변 공기의 접촉을 줄이는 취급 | q042_080_130_primarylocalizedcontrols |  |
| 액체 | q032_070_118_bottomloading | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 0.1 - 1 l/minute | q042_080_130_primarylocalizedcontrols |  |
| 액체 | q032_070_118_bottomloading | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 0.1 - 1 l/minute |  | 가지치기(형제 선택지와 같은 곳) |
| 액체 | q032_070_118_bottomloading | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 1 - 10 l/minute | q042_080_130_primarylocalizedcontrols |  |
| 액체 | q032_070_118_bottomloading | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 1 - 10 l/minute |  | 가지치기(형제 선택지와 같은 곳) |
| 액체 | q032_070_118_bottomloading | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 10 - 100 l/minute | q042_080_130_primarylocalizedcontrols |  |
| 액체 | q032_070_118_bottomloading | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 10 - 100 l/minute | q042_080_130_primarylocalizedcontrols |  |
| 액체 | q032_070_118_bottomloading | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 100 - 1000 l/minute | q042_080_130_primarylocalizedcontrols |  |
| 액체 | q032_070_118_bottomloading | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 100 - 1000 l/minute | q042_080_130_primarylocalizedcontrols |  |
| 액체 | q032_070_118_bottomloading | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | < 0.1 l/minute | q042_080_130_primarylocalizedcontrols |  |
| 액체 | q032_070_118_bottomloading | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | < 0.1 l/minute |  | 가지치기(형제 선택지와 같은 곳) |
| 액체 | q032_070_118_bottomloading | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | > 1000 l/minute | q042_080_130_primarylocalizedcontrols |  |
| 액체 | q032_070_118_bottomloading | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | > 1000 l/minute | q042_080_130_primarylocalizedcontrols |  |
| 액체 | q033_071_119_fallingliquids | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 0.1 - 1 l/minute | q033_5_071_5_119_5_fallingliquidscontainmentlevel |  |
| 액체 | q033_071_119_fallingliquids | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 0.1 - 1 l/minute |  | 가지치기(형제 선택지와 같은 곳) |
| 액체 | q033_071_119_fallingliquids | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 1 - 10 l/minute | q033_5_071_5_119_5_fallingliquidscontainmentlevel |  |
| 액체 | q033_071_119_fallingliquids | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 1 - 10 l/minute |  | 가지치기(형제 선택지와 같은 곳) |
| 액체 | q033_071_119_fallingliquids | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 10 - 100 l/minute | q033_5_071_5_119_5_fallingliquidscontainmentlevel |  |
| 액체 | q033_071_119_fallingliquids | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 10 - 100 l/minute | q033_5_071_5_119_5_fallingliquidscontainmentlevel |  |
| 액체 | q033_071_119_fallingliquids | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 100 - 1000 l/minute | q033_5_071_5_119_5_fallingliquidscontainmentlevel |  |
| 액체 | q033_071_119_fallingliquids | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 100 - 1000 l/minute | q033_5_071_5_119_5_fallingliquidscontainmentlevel |  |
| 액체 | q033_071_119_fallingliquids | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | < 0.1 l/minute | q033_5_071_5_119_5_fallingliquidscontainmentlevel |  |
| 액체 | q033_071_119_fallingliquids | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | < 0.1 l/minute |  | 가지치기(형제 선택지와 같은 곳) |
| 액체 | q033_071_119_fallingliquids | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | > 1000 l/minute | q033_5_071_5_119_5_fallingliquidscontainmentlevel |  |
| 액체 | q033_071_119_fallingliquids | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | > 1000 l/minute | q033_5_071_5_119_5_fallingliquidscontainmentlevel |  |
| 액체 | q033_5_071_5_119_5_fallingliquidscontainmentlevel | 공정의 밀폐 수준은 어떻습니까? | 개방 공정 | q034_072_120_transferloadingtype |  |
| 액체 | q033_5_071_5_119_5_fallingliquidscontainmentlevel | 공정의 밀폐 수준은 어떻습니까? | 개방 공정 | q034_072_120_transferloadingtype |  |
| 액체 | q033_5_071_5_119_5_fallingliquidscontainmentlevel | 공정의 밀폐 수준은 어떻습니까? | 제품과 주변 공기의 접촉을 줄이는 취급 | q034_072_120_transferloadingtype |  |
| 액체 | q033_5_071_5_119_5_fallingliquidscontainmentlevel | 공정의 밀폐 수준은 어떻습니까? | 제품과 주변 공기의 접촉을 줄이는 취급 | q034_072_120_transferloadingtype |  |
| 액체 | q034_072_120_transferloadingtype | 액체 이송을 상부 낙하식(splash) 적재 또는 침적식(submerged) 적재로 수행합니까? | 상부 낙하식 적재 — 액체 주입구가 저장조 상부에 위치하여 액체가 자유롭게 튀는 방식 | q042_080_130_primarylocalizedcontrols |  |
| 액체 | q034_072_120_transferloadingtype | 액체 이송을 상부 낙하식(splash) 적재 또는 침적식(submerged) 적재로 수행합니까? | 상부 낙하식 적재 — 액체 주입구가 저장조 상부에 위치하여 액체가 자유롭게 튀는 방식 | q042_080_130_primarylocalizedcontrols |  |
| 액체 | q034_072_120_transferloadingtype | 액체 이송을 상부 낙하식(splash) 적재 또는 침적식(submerged) 적재로 수행합니까? | 침적식 적재 — 액체 주입구가 액면 아래에 위치하여 에어로졸 생성량을 줄이는 방식 | q042_080_130_primarylocalizedcontrols |  |
| 액체 | q034_072_120_transferloadingtype | 액체 이송을 상부 낙하식(splash) 적재 또는 침적식(submerged) 적재로 수행합니까? | 침적식 적재 — 액체 주입구가 액면 아래에 위치하여 에어로졸 생성량을 줄이는 방식 | q042_080_130_primarylocalizedcontrols |  |
| 액체 | q042_080_130_primarylocalizedcontrols | 일반 제어수단 | 국소 제어 없음 | q045_081_surfacecontamination |  |
| 액체 | q042_080_130_primarylocalizedcontrols | 일반 제어수단 | 국소 제어 없음 | q043_131_segregation |  |
| 액체 | q042_080_130_primarylocalizedcontrols | 일반 제어수단 | 국소배기장치(LEV) |  | 막힘(검증오류) |
| 액체 | q042_080_130_primarylocalizedcontrols | 일반 제어수단 | 국소배기장치(LEV) |  | 막힘(검증오류) |
| 액체 | q042_080_130_primarylocalizedcontrols | 일반 제어수단 | 글로브 박스 및 글로브 백 |  | 막힘(검증오류) |
| 액체 | q042_080_130_primarylocalizedcontrols | 일반 제어수단 | 글로브 박스 및 글로브 백 |  | 막힘(검증오류) |
| 액체 | q042_080_130_primarylocalizedcontrols | 일반 제어수단 | 밀폐 — 배기 없음 | q042_5_080_5_130_5_secondarylocalizedcontrols |  |
| 액체 | q042_080_130_primarylocalizedcontrols | 일반 제어수단 | 밀폐 — 배기 없음 | q042_5_080_5_130_5_secondarylocalizedcontrols |  |
| 액체 | q042_080_130_primarylocalizedcontrols | 일반 제어수단 | 증기 회수 시스템 | q042_5_080_5_130_5_secondarylocalizedcontrols |  |
| 액체 | q042_080_130_primarylocalizedcontrols | 일반 제어수단 | 증기 회수 시스템 | q042_5_080_5_130_5_secondarylocalizedcontrols |  |
| 액체 | q042_5_080_5_130_5_secondarylocalizedcontrols | 일반 제어수단 | 2차 국소 제어 없음 | q045_081_surfacecontamination |  |
| 액체 | q042_5_080_5_130_5_secondarylocalizedcontrols | 일반 제어수단 | 2차 국소 제어 없음 | q043_131_segregation |  |
| 액체 | q042_5_080_5_130_5_secondarylocalizedcontrols | 일반 제어수단 | 국소배기장치(LEV) |  | 막힘(검증오류) |
| 액체 | q042_5_080_5_130_5_secondarylocalizedcontrols | 일반 제어수단 | 국소배기장치(LEV) |  | 막힘(검증오류) |
| 액체 | q042_5_080_5_130_5_secondarylocalizedcontrols | 일반 제어수단 | 글로브 박스 및 글로브 백 |  | 막힘(검증오류) |
| 액체 | q042_5_080_5_130_5_secondarylocalizedcontrols | 일반 제어수단 | 글로브 박스 및 글로브 백 |  | 막힘(검증오류) |
| 액체 | q042_5_080_5_130_5_secondarylocalizedcontrols | 일반 제어수단 | 밀폐 — 배기 없음 | q045_081_surfacecontamination |  |
| 액체 | q042_5_080_5_130_5_secondarylocalizedcontrols | 일반 제어수단 | 밀폐 — 배기 없음 | q043_131_segregation |  |
| 액체 | q042_5_080_5_130_5_secondarylocalizedcontrols | 일반 제어수단 | 증기 회수 시스템 | q045_081_surfacecontamination |  |
| 액체 | q042_5_080_5_130_5_secondarylocalizedcontrols | 일반 제어수단 | 증기 회수 시스템 | q043_131_segregation |  |
| 액체 | q043_131_segregation | 격리(발생원) 선택 | (미수집) rbCompleteNoVentilation | q044_personalenclosure |  |
| 액체 | q043_131_segregation | 격리(발생원) 선택 | (미수집) rbCompleteVentilation |  | 가지치기(형제 선택지와 같은 곳) |
| 액체 | q043_131_segregation | 격리(발생원) 선택 | (미수집) rbNoSegregation |  | 가지치기(형제 선택지와 같은 곳) |
| 액체 | q043_131_segregation | 격리(발생원) 선택 | (미수집) rbPartialNoVentilation | q044_personalenclosure |  |
| 액체 | q043_131_segregation | 격리(발생원) 선택 | (미수집) rbPartialVentilation | q044_personalenclosure |  |
| 액체 | q044_personalenclosure | Select 격리(작업자) | (미수집) rbCompleteNoVentilation | q045_081_surfacecontamination |  |
| 액체 | q044_personalenclosure | Select 격리(작업자) | (미수집) rbCompleteVentilation |  | 가지치기(형제 선택지와 같은 곳) |
| 액체 | q044_personalenclosure | Select 격리(작업자) | (미수집) rbNoPersonalEnclosure |  | 가지치기(형제 선택지와 같은 곳) |
| 액체 | q044_personalenclosure | Select 격리(작업자) | (미수집) rbPartialNoVentilation | q045_081_surfacecontamination |  |
| 액체 | q044_personalenclosure | Select 격리(작업자) | (미수집) rbPartialVentilation | q045_081_surfacecontamination |  |
| 액체 | q045_081_surfacecontamination | 공정이 완전히 밀폐되어 있고, 그 밀폐의 건전성을 정기적으로 점검합니까? | 아니오 | q084_dispersion |  |
| 액체 | q045_081_surfacecontamination | 공정이 완전히 밀폐되어 있고, 그 밀폐의 건전성을 정기적으로 점검합니까? | 아니오 | q048_dispersion |  |
| 액체 | q045_081_surfacecontamination | 공정이 완전히 밀폐되어 있고, 그 밀폐의 건전성을 정기적으로 점검합니까? | 예 | q084_dispersion |  |
| 액체 | q045_081_surfacecontamination | 공정이 완전히 밀폐되어 있고, 그 밀폐의 건전성을 정기적으로 점검합니까? | 예 | q048_dispersion |  |
| 액체 | q048_dispersion | 작업을 실내 또는 실외에서 수행합니까? | (미수집) rbIndoors |  | 막힘(검증오류) |
| 액체 | q048_dispersion | 작업을 실내 또는 실외에서 수행합니까? | (미수집) rbOutdoors |  | 막힘(검증오류) |
| 액체 | q084_dispersion | 작업은 실내, 실외, 분무실, 또는 하향 층류 부스 중 어디에서 수행됩니까? | 스프레이 룸 | q089_0_secondaryfarfieldsources |  |
| 액체 | q084_dispersion | 작업은 실내, 실외, 분무실, 또는 하향 층류 부스 중 어디에서 수행됩니까? | 실내 | q089_0_secondaryfarfieldsources |  |
| 액체 | q084_dispersion | 작업은 실내, 실외, 분무실, 또는 하향 층류 부스 중 어디에서 수행됩니까? | 실외 | q089_0_secondaryfarfieldsources |  |
| 액체 | q084_dispersion | 작업은 실내, 실외, 분무실, 또는 하향 층류 부스 중 어디에서 수행됩니까? | 하향 층류 부스 | q089_0_secondaryfarfieldsources |  |
| 액체 | q089_0_secondaryfarfieldsources | 작업자 호흡 영역의 발생원 외에, 작업실 내에 2차 발생원이 존재합니까? | 아니오 | q002_7_activities |  |
| 액체 | q089_0_secondaryfarfieldsources | 작업자 호흡 영역의 발생원 외에, 작업실 내에 2차 발생원이 존재합니까? | 예 | q003_090_producttype |  |
| 페이스트·슬러리 | q015_1_102_1_contaminatedwithpowder | 해당 페이스트 또는 슬러리가 분말 물질로 (잠재적으로) 오염되어 있습니까? | 아니오 | q016_nearfieldsource |  |
| 페이스트·슬러리 | q015_1_102_1_contaminatedwithpowder | 해당 페이스트 또는 슬러리가 분말 물질로 (잠재적으로) 오염되어 있습니까? | 예 | q015_2_102_2_dustiness |  |
| 페이스트·슬러리 | q015_2_102_2_dustiness | 페이스트 또는 슬러리 상의 분말 오염물에 대해 측정된 발진성은 얼마입니까? (흡입성 분율, mg/kg) | 견고한 과립, 플레이크 또는 펠릿 | q015_4_102_4_powderweightfraction |  |
| 페이스트·슬러리 | q015_2_102_2_dustiness | 페이스트 또는 슬러리 상의 분말 오염물에 대해 측정된 발진성은 얼마입니까? (흡입성 분율, mg/kg) | 과립, 플레이크 또는 펠릿 | q015_4_102_4_powderweightfraction |  |
| 페이스트·슬러리 | q015_2_102_2_dustiness | 페이스트 또는 슬러리 상의 분말 오염물에 대해 측정된 발진성은 얼마입니까? (흡입성 분율, mg/kg) | 극도로 미세하고 가벼운 분말 | q015_4_102_4_powderweightfraction |  |
| 페이스트·슬러리 | q015_2_102_2_dustiness | 페이스트 또는 슬러리 상의 분말 오염물에 대해 측정된 발진성은 얼마입니까? (흡입성 분율, mg/kg) | 미세 분진 | q015_4_102_4_powderweightfraction |  |
| 페이스트·슬러리 | q015_2_102_2_dustiness | 페이스트 또는 슬러리 상의 분말 오염물에 대해 측정된 발진성은 얼마입니까? (흡입성 분율, mg/kg) | 조대 분진 | q015_4_102_4_powderweightfraction |  |
| 페이스트·슬러리 | q015_4_102_4_powderweightfraction | 페이스트 또는 슬러리 상의 분말 오염물 내 물질의 질량분율은 얼마입니까? | 극미량 (0.01 - 0.1 %) | q016_nearfieldsource |  |
| 페이스트·슬러리 | q015_4_102_4_powderweightfraction | 페이스트 또는 슬러리 상의 분말 오염물 내 물질의 질량분율은 얼마입니까? | 극미량 (< 0.01 %) | q016_nearfieldsource |  |
| 페이스트·슬러리 | q015_4_102_4_powderweightfraction | 페이스트 또는 슬러리 상의 분말 오염물 내 물질의 질량분율은 얼마입니까? | 극히 적음 (0.1 - 0.5 %) | q016_nearfieldsource |  |
| 페이스트·슬러리 | q015_4_102_4_powderweightfraction | 페이스트 또는 슬러리 상의 분말 오염물 내 물질의 질량분율은 얼마입니까? | 매우 적음 (0.5 - 1 %) | q016_nearfieldsource |  |
| 페이스트·슬러리 | q015_4_102_4_powderweightfraction | 페이스트 또는 슬러리 상의 분말 오염물 내 물질의 질량분율은 얼마입니까? | 상당량 (10 - 50 %) | q016_nearfieldsource |  |
| 페이스트·슬러리 | q015_4_102_4_powderweightfraction | 페이스트 또는 슬러리 상의 분말 오염물 내 물질의 질량분율은 얼마입니까? | 소량 (5 - 10 %) | q016_nearfieldsource |  |
| 페이스트·슬러리 | q015_4_102_4_powderweightfraction | 페이스트 또는 슬러리 상의 분말 오염물 내 물질의 질량분율은 얼마입니까? | 순수 물질 (100%) | q016_nearfieldsource |  |
| 페이스트·슬러리 | q015_4_102_4_powderweightfraction | 페이스트 또는 슬러리 상의 분말 오염물 내 물질의 질량분율은 얼마입니까? | 적음 (1 - 5 %) | q016_nearfieldsource |  |
| 페이스트·슬러리 | q015_4_102_4_powderweightfraction | 페이스트 또는 슬러리 상의 분말 오염물 내 물질의 질량분율은 얼마입니까? | 주성분 (50 - 90 %) | q016_nearfieldsource |  |
| 페이스트·슬러리 | q016_nearfieldsource | 1차 배출 발생원이 작업자의 호흡 영역(즉, 작업자 머리로부터 모든 방향으로 1미터 이내의 공기 체적) 안에 있습니까? | 아니오 | q017_055_103_activityclass |  |
| 페이스트·슬러리 | q016_nearfieldsource | 1차 배출 발생원이 작업자의 호흡 영역(즉, 작업자 머리로부터 모든 방향으로 1미터 이내의 공기 체적) 안에 있습니까? | 예 | q017_055_103_activityclass |  |
| 페이스트·슬러리 | q017_055_103_activityclass | 활동 등급 선택 | 오염된 고체 물체 또는 페이스트의 취급 | q021_059_107_contaminatedobjectspaste |  |
| 페이스트·슬러리 | q017_055_103_activityclass | 활동 등급 선택 | 오염된 고체 물체 또는 페이스트의 취급 | q021_059_107_contaminatedobjectspaste |  |
| 페이스트·슬러리 | q021_059_107_contaminatedobjectspaste | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 경미하게 오염된(수 그램 미만의 층) 물체의 취급 | q021_5_059_5_107_5_contaminatedobjectspastehandlingtype |  |
| 페이스트·슬러리 | q021_059_107_contaminatedobjectspaste | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 경미하게 오염된(수 그램 미만의 층) 물체의 취급 |  | 가지치기(형제 선택지와 같은 곳) |
| 페이스트·슬러리 | q021_059_107_contaminatedobjectspaste | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 상당하고 육안으로 보이는 오염이 있는 물체의 취급 (0.5 kg 초과의 층) | q021_5_059_5_107_5_contaminatedobjectspastehandlingtype |  |
| 페이스트·슬러리 | q021_059_107_contaminatedobjectspaste | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 상당하고 육안으로 보이는 오염이 있는 물체의 취급 (0.5 kg 초과의 층) | q021_5_059_5_107_5_contaminatedobjectspastehandlingtype |  |
| 페이스트·슬러리 | q021_059_107_contaminatedobjectspaste | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 외견상 깨끗한 물체의 취급 | q021_5_059_5_107_5_contaminatedobjectspastehandlingtype |  |
| 페이스트·슬러리 | q021_059_107_contaminatedobjectspaste | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 외견상 깨끗한 물체의 취급 |  | 가지치기(형제 선택지와 같은 곳) |
| 페이스트·슬러리 | q021_059_107_contaminatedobjectspaste | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 육안으로 보이는 오염이 있는 물체의 취급 (주변 분진 발생 활동에서 비산된 분진으로 덮인 물체) | q021_5_059_5_107_5_contaminatedobjectspastehandlingtype |  |
| 페이스트·슬러리 | q021_059_107_contaminatedobjectspaste | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 육안으로 보이는 오염이 있는 물체의 취급 (주변 분진 발생 활동에서 비산된 분진으로 덮인 물체) | q021_5_059_5_107_5_contaminatedobjectspastehandlingtype |  |
| 페이스트·슬러리 | q021_059_107_contaminatedobjectspaste | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 잔류 분진이 적은 물체의 취급 (얇은 층이 보임) | q021_5_059_5_107_5_contaminatedobjectspastehandlingtype |  |
| 페이스트·슬러리 | q021_059_107_contaminatedobjectspaste | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 잔류 분진이 적은 물체의 취급 (얇은 층이 보임) | q021_5_059_5_107_5_contaminatedobjectspastehandlingtype |  |
| 페이스트·슬러리 | q021_5_059_5_107_5_contaminatedobjectspastehandlingtype | 오염된 물체 또는 페이스트를 어떻게 취급합니까? | 주의 깊은 취급이란 작업자가 잠재적 위험, 오류, 피해에 주의를 기울이며 매우 정확하고 꼼꼼하게(또는 조심스럽게) 작업을 수행하는 것을 말합니다 | q042_080_130_primarylocalizedcontrols |  |
| 페이스트·슬러리 | q021_5_059_5_107_5_contaminatedobjectspastehandlingtype | 오염된 물체 또는 페이스트를 어떻게 취급합니까? | 주의 깊은 취급이란 작업자가 잠재적 위험, 오류, 피해에 주의를 기울이며 매우 정확하고 꼼꼼하게(또는 조심스럽게) 작업을 수행하는 것을 말합니다 | q042_080_130_primarylocalizedcontrols |  |
| 페이스트·슬러리 | q021_5_059_5_107_5_contaminatedobjectspastehandlingtype | 오염된 물체 또는 페이스트를 어떻게 취급합니까? | 통상적인 작업 절차에서 벗어나 많은 에너지가 수반되는 취급 (예: 거친 취급 또는 자루 던지기) | q042_080_130_primarylocalizedcontrols |  |
| 페이스트·슬러리 | q021_5_059_5_107_5_contaminatedobjectspastehandlingtype | 오염된 물체 또는 페이스트를 어떻게 취급합니까? | 통상적인 작업 절차에서 벗어나 많은 에너지가 수반되는 취급 (예: 거친 취급 또는 자루 던지기) | q042_080_130_primarylocalizedcontrols |  |
| 페이스트·슬러리 | q021_5_059_5_107_5_contaminatedobjectspastehandlingtype | 오염된 물체 또는 페이스트를 어떻게 취급합니까? | 통상적인 취급, 정규 작업 절차 수반 | q042_080_130_primarylocalizedcontrols |  |
| 페이스트·슬러리 | q021_5_059_5_107_5_contaminatedobjectspastehandlingtype | 오염된 물체 또는 페이스트를 어떻게 취급합니까? | 통상적인 취급, 정규 작업 절차 수반 | q042_080_130_primarylocalizedcontrols |  |
| 페이스트·슬러리 | q042_080_130_primarylocalizedcontrols | 일반 제어수단 | 국소 제어 없음 | q045_081_surfacecontamination |  |
| 페이스트·슬러리 | q042_080_130_primarylocalizedcontrols | 일반 제어수단 | 국소 제어 없음 | q043_131_segregation |  |
| 페이스트·슬러리 | q042_080_130_primarylocalizedcontrols | 일반 제어수단 | 국소배기장치(LEV) |  | 막힘(검증오류) |
| 페이스트·슬러리 | q042_080_130_primarylocalizedcontrols | 일반 제어수단 | 국소배기장치(LEV) |  | 막힘(검증오류) |
| 페이스트·슬러리 | q042_080_130_primarylocalizedcontrols | 일반 제어수단 | 글로브 박스 및 글로브 백 |  | 막힘(검증오류) |
| 페이스트·슬러리 | q042_080_130_primarylocalizedcontrols | 일반 제어수단 | 글로브 박스 및 글로브 백 |  | 막힘(검증오류) |
| 페이스트·슬러리 | q042_080_130_primarylocalizedcontrols | 일반 제어수단 | 밀폐 — 배기 없음 | q042_5_080_5_130_5_secondarylocalizedcontrols |  |
| 페이스트·슬러리 | q042_080_130_primarylocalizedcontrols | 일반 제어수단 | 밀폐 — 배기 없음 | q042_5_080_5_130_5_secondarylocalizedcontrols |  |
| 페이스트·슬러리 | q042_080_130_primarylocalizedcontrols | 일반 제어수단 | 증기 회수 시스템 | q042_5_080_5_130_5_secondarylocalizedcontrols |  |
| 페이스트·슬러리 | q042_080_130_primarylocalizedcontrols | 일반 제어수단 | 증기 회수 시스템 | q042_5_080_5_130_5_secondarylocalizedcontrols |  |
| 페이스트·슬러리 | q042_5_080_5_130_5_secondarylocalizedcontrols | 일반 제어수단 | 2차 국소 제어 없음 | q045_081_surfacecontamination |  |
| 페이스트·슬러리 | q042_5_080_5_130_5_secondarylocalizedcontrols | 일반 제어수단 | 2차 국소 제어 없음 | q043_131_segregation |  |
| 페이스트·슬러리 | q042_5_080_5_130_5_secondarylocalizedcontrols | 일반 제어수단 | 국소배기장치(LEV) |  | 막힘(검증오류) |
| 페이스트·슬러리 | q042_5_080_5_130_5_secondarylocalizedcontrols | 일반 제어수단 | 국소배기장치(LEV) |  | 막힘(검증오류) |
| 페이스트·슬러리 | q042_5_080_5_130_5_secondarylocalizedcontrols | 일반 제어수단 | 글로브 박스 및 글로브 백 |  | 막힘(검증오류) |
| 페이스트·슬러리 | q042_5_080_5_130_5_secondarylocalizedcontrols | 일반 제어수단 | 글로브 박스 및 글로브 백 |  | 막힘(검증오류) |
| 페이스트·슬러리 | q042_5_080_5_130_5_secondarylocalizedcontrols | 일반 제어수단 | 밀폐 — 배기 없음 | q045_081_surfacecontamination |  |
| 페이스트·슬러리 | q042_5_080_5_130_5_secondarylocalizedcontrols | 일반 제어수단 | 밀폐 — 배기 없음 | q043_131_segregation |  |
| 페이스트·슬러리 | q042_5_080_5_130_5_secondarylocalizedcontrols | 일반 제어수단 | 증기 회수 시스템 | q045_081_surfacecontamination |  |
| 페이스트·슬러리 | q042_5_080_5_130_5_secondarylocalizedcontrols | 일반 제어수단 | 증기 회수 시스템 | q043_131_segregation |  |
| 페이스트·슬러리 | q043_131_segregation | 격리(발생원) 선택 | (미수집) rbCompleteNoVentilation | q044_personalenclosure |  |
| 페이스트·슬러리 | q043_131_segregation | 격리(발생원) 선택 | (미수집) rbCompleteVentilation |  | 가지치기(형제 선택지와 같은 곳) |
| 페이스트·슬러리 | q043_131_segregation | 격리(발생원) 선택 | (미수집) rbNoSegregation |  | 가지치기(형제 선택지와 같은 곳) |
| 페이스트·슬러리 | q043_131_segregation | 격리(발생원) 선택 | (미수집) rbPartialNoVentilation | q044_personalenclosure |  |
| 페이스트·슬러리 | q043_131_segregation | 격리(발생원) 선택 | (미수집) rbPartialVentilation | q044_personalenclosure |  |
| 페이스트·슬러리 | q044_personalenclosure | Select 격리(작업자) | (미수집) rbCompleteNoVentilation | q045_081_surfacecontamination |  |
| 페이스트·슬러리 | q044_personalenclosure | Select 격리(작업자) | (미수집) rbCompleteVentilation |  | 가지치기(형제 선택지와 같은 곳) |
| 페이스트·슬러리 | q044_personalenclosure | Select 격리(작업자) | (미수집) rbNoPersonalEnclosure |  | 가지치기(형제 선택지와 같은 곳) |
| 페이스트·슬러리 | q044_personalenclosure | Select 격리(작업자) | (미수집) rbPartialNoVentilation | q045_081_surfacecontamination |  |
| 페이스트·슬러리 | q044_personalenclosure | Select 격리(작업자) | (미수집) rbPartialVentilation | q045_081_surfacecontamination |  |
| 페이스트·슬러리 | q045_081_surfacecontamination | 공정이 완전히 밀폐되어 있고, 그 밀폐의 건전성을 정기적으로 점검합니까? | 아니오 | q084_dispersion |  |
| 페이스트·슬러리 | q045_081_surfacecontamination | 공정이 완전히 밀폐되어 있고, 그 밀폐의 건전성을 정기적으로 점검합니까? | 아니오 | q048_dispersion |  |
| 페이스트·슬러리 | q045_081_surfacecontamination | 공정이 완전히 밀폐되어 있고, 그 밀폐의 건전성을 정기적으로 점검합니까? | 예 | q084_dispersion |  |
| 페이스트·슬러리 | q045_081_surfacecontamination | 공정이 완전히 밀폐되어 있고, 그 밀폐의 건전성을 정기적으로 점검합니까? | 예 | q048_dispersion |  |
| 페이스트·슬러리 | q048_dispersion | 작업을 실내 또는 실외에서 수행합니까? | (미수집) rbIndoors |  | 막힘(검증오류) |
| 페이스트·슬러리 | q048_dispersion | 작업을 실내 또는 실외에서 수행합니까? | (미수집) rbOutdoors |  | 막힘(검증오류) |
| 페이스트·슬러리 | q084_dispersion | 작업은 실내, 실외, 분무실, 또는 하향 층류 부스 중 어디에서 수행됩니까? | 스프레이 룸 | q089_0_secondaryfarfieldsources |  |
| 페이스트·슬러리 | q084_dispersion | 작업은 실내, 실외, 분무실, 또는 하향 층류 부스 중 어디에서 수행됩니까? | 실내 | q089_0_secondaryfarfieldsources |  |
| 페이스트·슬러리 | q084_dispersion | 작업은 실내, 실외, 분무실, 또는 하향 층류 부스 중 어디에서 수행됩니까? | 실외 | q089_0_secondaryfarfieldsources |  |
| 페이스트·슬러리 | q084_dispersion | 작업은 실내, 실외, 분무실, 또는 하향 층류 부스 중 어디에서 수행됩니까? | 하향 층류 부스 | q089_0_secondaryfarfieldsources |  |
| 페이스트·슬러리 | q089_0_secondaryfarfieldsources | 작업자 호흡 영역의 발생원 외에, 작업실 내에 2차 발생원이 존재합니까? | 아니오 | q002_7_activities |  |
| 페이스트·슬러리 | q089_0_secondaryfarfieldsources | 작업자 호흡 영역의 발생원 외에, 작업실 내에 2차 발생원이 존재합니까? | 예 | q003_090_producttype |  |
| 액체내분말 | q015_5_1_102_5_1_liquidmatrixweightfraction | 액체 혼합물 내 분말 물질의 질량분율은 얼마입니까? | 극미량 (0.01 - 0.1 %) | q015_5_2_102_5_2_viscosity |  |
| 액체내분말 | q015_5_1_102_5_1_liquidmatrixweightfraction | 액체 혼합물 내 분말 물질의 질량분율은 얼마입니까? | 극히 적음 (0.1 - 0.5 %) | q015_5_2_102_5_2_viscosity |  |
| 액체내분말 | q015_5_1_102_5_1_liquidmatrixweightfraction | 액체 혼합물 내 분말 물질의 질량분율은 얼마입니까? | 매우 적음 (0.5 - 1 %) | q015_5_2_102_5_2_viscosity |  |
| 액체내분말 | q015_5_1_102_5_1_liquidmatrixweightfraction | 액체 혼합물 내 분말 물질의 질량분율은 얼마입니까? | 상당량 (10 - 50 %) | q015_5_2_102_5_2_viscosity |  |
| 액체내분말 | q015_5_1_102_5_1_liquidmatrixweightfraction | 액체 혼합물 내 분말 물질의 질량분율은 얼마입니까? | 소량 (5 - 10 %) | q015_5_2_102_5_2_viscosity |  |
| 액체내분말 | q015_5_1_102_5_1_liquidmatrixweightfraction | 액체 혼합물 내 분말 물질의 질량분율은 얼마입니까? | 적음 (1 - 5 %) | q015_5_2_102_5_2_viscosity |  |
| 액체내분말 | q015_5_1_102_5_1_liquidmatrixweightfraction | 액체 혼합물 내 분말 물질의 질량분율은 얼마입니까? | 주성분 (50 - 90 %) | q015_5_2_102_5_2_viscosity |  |
| 액체내분말 | q015_5_2_102_5_2_viscosity | 분말/액체 혼합물의 점도는 얼마입니까? | 저점도 액체 (물과 유사) | q016_nearfieldsource |  |
| 액체내분말 | q015_5_2_102_5_2_viscosity | 분말/액체 혼합물의 점도는 얼마입니까? | 중점도 액체 (기름과 유사) | q016_nearfieldsource |  |
| 액체내분말 | q016_nearfieldsource | 1차 배출 발생원이 작업자의 호흡 영역(즉, 작업자 머리로부터 모든 방향으로 1미터 이내의 공기 체적) 안에 있습니까? | 아니오 | q017_055_103_activityclass |  |
| 액체내분말 | q016_nearfieldsource | 1차 배출 발생원이 작업자의 호흡 영역(즉, 작업자 머리로부터 모든 방향으로 1미터 이내의 공기 체적) 안에 있습니까? | 예 | q017_055_103_activityclass |  |
| 액체내분말 | q017_055_103_activityclass | 활동 등급 선택 | 개방 액면 또는 개방 저장조에서의 활동 / (미수집) 13 | q028_066_114_liquidopensurfaceundisturbed |  |
| 액체내분말 | q017_055_103_activityclass | 활동 등급 선택 | 개방 액면 또는 개방 저장조에서의 활동 / (미수집) 13 | q028_066_114_liquidopensurfaceundisturbed |  |
| 액체내분말 | q017_055_103_activityclass | 활동 등급 선택 | 개방 액면 또는 개방 저장조에서의 활동 / (미수집) 14 | q028_3_066_3_114_3_liquidopensurfaceagitated |  |
| 액체내분말 | q017_055_103_activityclass | 활동 등급 선택 | 개방 액면 또는 개방 저장조에서의 활동 / (미수집) 14 | q028_3_066_3_114_3_liquidopensurfaceagitated |  |
| 액체내분말 | q017_055_103_activityclass | 활동 등급 선택 | 개방 액면 또는 개방 저장조에서의 활동 / (하위 활동 등급 없음) | q028_066_114_liquidopensurfaceundisturbed |  |
| 액체내분말 | q017_055_103_activityclass | 활동 등급 선택 | 개방 액면 또는 개방 저장조에서의 활동 / (하위 활동 등급 없음) | q028_066_114_liquidopensurfaceundisturbed |  |
| 액체내분말 | q017_055_103_activityclass | 활동 등급 선택 | 고속 공정에서의 액체 적용 (예: 회전 공구) | q030_068_116_liquidshighspeedprocesses |  |
| 액체내분말 | q017_055_103_activityclass | 활동 등급 선택 | 고속 공정에서의 액체 적용 (예: 회전 공구) | q030_068_116_liquidshighspeedprocesses |  |
| 액체내분말 | q017_055_103_activityclass | 활동 등급 선택 | 액상 제품의 도포 | q029_067_115_spreadingliquidproducts |  |
| 액체내분말 | q017_055_103_activityclass | 활동 등급 선택 | 액상 제품의 도포 | q029_067_115_spreadingliquidproducts |  |
| 액체내분말 | q017_055_103_activityclass | 활동 등급 선택 | 액상 제품의 이송 / (미수집) 18 | q032_070_118_bottomloading |  |
| 액체내분말 | q017_055_103_activityclass | 활동 등급 선택 | 액상 제품의 이송 / (미수집) 18 | q032_070_118_bottomloading |  |
| 액체내분말 | q017_055_103_activityclass | 활동 등급 선택 | 액상 제품의 이송 / (미수집) 19 | q033_071_119_fallingliquids |  |
| 액체내분말 | q017_055_103_activityclass | 활동 등급 선택 | 액상 제품의 이송 / (미수집) 19 | q033_071_119_fallingliquids |  |
| 액체내분말 | q017_055_103_activityclass | 활동 등급 선택 | 액상 제품의 이송 / (하위 활동 등급 없음) | q032_070_118_bottomloading |  |
| 액체내분말 | q017_055_103_activityclass | 활동 등급 선택 | 액상 제품의 이송 / (하위 활동 등급 없음) | q032_070_118_bottomloading |  |
| 액체내분말 | q017_055_103_activityclass | 활동 등급 선택 | 액체의 분무 적용 / (미수집) 11 | q026_064_112_surfacesprayingliquids |  |
| 액체내분말 | q017_055_103_activityclass | 활동 등급 선택 | 액체의 분무 적용 / (미수집) 11 | q026_064_112_surfacesprayingliquids |  |
| 액체내분말 | q017_055_103_activityclass | 활동 등급 선택 | 액체의 분무 적용 / (미수집) 12 | q027_065_113_sprayingliquidsinspace |  |
| 액체내분말 | q017_055_103_activityclass | 활동 등급 선택 | 액체의 분무 적용 / (미수집) 12 | q027_065_113_sprayingliquidsinspace |  |
| 액체내분말 | q017_055_103_activityclass | 활동 등급 선택 | 액체의 분무 적용 / (하위 활동 등급 없음) | q026_064_112_surfacesprayingliquids |  |
| 액체내분말 | q017_055_103_activityclass | 활동 등급 선택 | 액체의 분무 적용 / (하위 활동 등급 없음) | q026_064_112_surfacesprayingliquids |  |
| 액체내분말 | q017_055_103_activityclass | 활동 등급 선택 | 액체의 연소 / (미수집) 18 | q032_070_118_bottomloading |  |
| 액체내분말 | q017_055_103_activityclass | 활동 등급 선택 | 액체의 연소 / (미수집) 18 | q032_070_118_bottomloading |  |
| 액체내분말 | q017_055_103_activityclass | 활동 등급 선택 | 액체의 연소 / (미수집) 19 | q033_071_119_fallingliquids |  |
| 액체내분말 | q017_055_103_activityclass | 활동 등급 선택 | 액체의 연소 / (미수집) 19 | q033_071_119_fallingliquids |  |
| 액체내분말 | q017_055_103_activityclass | 활동 등급 선택 | 액체의 연소 / (하위 활동 등급 없음) | q032_070_118_bottomloading |  |
| 액체내분말 | q017_055_103_activityclass | 활동 등급 선택 | 액체의 연소 / (하위 활동 등급 없음) | q032_070_118_bottomloading |  |
| 액체내분말 | q017_055_103_activityclass | 활동 등급 선택 | 오염된 물체의 취급 | q028_5_066_5_114_5_handlingcontaminatedobjects |  |
| 액체내분말 | q017_055_103_activityclass | 활동 등급 선택 | 오염된 물체의 취급 | q028_5_066_5_114_5_handlingcontaminatedobjects |  |
| 액체내분말 | q026_064_112_surfacesprayingliquids | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 낮은 도포율 (0.03 - 0.3 l/minute) | q026_5_064_5_112_5_surfacesprayingliquidsspraydirection |  |
| 액체내분말 | q026_064_112_surfacesprayingliquids | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 낮은 도포율 (0.03 - 0.3 l/minute) | q026_5_064_5_112_5_surfacesprayingliquidsspraydirection |  |
| 액체내분말 | q026_064_112_surfacesprayingliquids | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 높은 도포율 (> 3 l/minute) | q026_5_064_5_112_5_surfacesprayingliquidsspraydirection |  |
| 액체내분말 | q026_064_112_surfacesprayingliquids | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 높은 도포율 (> 3 l/minute) | q026_5_064_5_112_5_surfacesprayingliquidsspraydirection |  |
| 액체내분말 | q026_064_112_surfacesprayingliquids | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 매우 낮은 도포율 (< 0.03 l/minute) | q026_5_064_5_112_5_surfacesprayingliquidsspraydirection |  |
| 액체내분말 | q026_064_112_surfacesprayingliquids | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 매우 낮은 도포율 (< 0.03 l/minute) |  | 가지치기(형제 선택지와 같은 곳) |
| 액체내분말 | q026_064_112_surfacesprayingliquids | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 중간 도포율 (0.3 - 3 l/minute) | q026_5_064_5_112_5_surfacesprayingliquidsspraydirection |  |
| 액체내분말 | q026_064_112_surfacesprayingliquids | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 중간 도포율 (0.3 - 3 l/minute) | q026_5_064_5_112_5_surfacesprayingliquidsspraydirection |  |
| 액체내분말 | q026_5_064_5_112_5_surfacesprayingliquidsspraydirection | 분무 방향은 어떻습니까? | 모든 방향(상향 포함)으로의 분무 | q026_7_064_7_112_7_surfacesprayingliquidsspraytechnique |  |
| 액체내분말 | q026_5_064_5_112_5_surfacesprayingliquidsspraydirection | 분무 방향은 어떻습니까? | 모든 방향(상향 포함)으로의 분무 | q026_7_064_7_112_7_surfacesprayingliquidsspraytechnique |  |
| 액체내분말 | q026_5_064_5_112_5_surfacesprayingliquidsspraydirection | 분무 방향은 어떻습니까? | 수평 또는 하향 분무만 | q026_7_064_7_112_7_surfacesprayingliquidsspraytechnique |  |
| 액체내분말 | q026_5_064_5_112_5_surfacesprayingliquidsspraydirection | 분무 방향은 어떻습니까? | 수평 또는 하향 분무만 | q026_7_064_7_112_7_surfacesprayingliquidsspraytechnique |  |
| 액체내분말 | q026_5_064_5_112_5_surfacesprayingliquidsspraydirection | 분무 방향은 어떻습니까? | 하향만 | q026_7_064_7_112_7_surfacesprayingliquidsspraytechnique |  |
| 액체내분말 | q026_5_064_5_112_5_surfacesprayingliquidsspraydirection | 분무 방향은 어떻습니까? | 하향만 | q026_7_064_7_112_7_surfacesprayingliquidsspraytechnique |  |
| 액체내분말 | q026_7_064_7_112_7_surfacesprayingliquidsspraytechnique | 분무 기법은 무엇입니까? | 압축공기 미사용 또는 사용이 적은 분무 | q042_080_130_primarylocalizedcontrols |  |
| 액체내분말 | q026_7_064_7_112_7_surfacesprayingliquidsspraytechnique | 분무 기법은 무엇입니까? | 압축공기 미사용 또는 사용이 적은 분무 | q042_080_130_primarylocalizedcontrols |  |
| 액체내분말 | q026_7_064_7_112_7_surfacesprayingliquidsspraytechnique | 분무 기법은 무엇입니까? | 압축공기 사용이 많은 분무 | q042_080_130_primarylocalizedcontrols |  |
| 액체내분말 | q026_7_064_7_112_7_surfacesprayingliquidsspraytechnique | 분무 기법은 무엇입니까? | 압축공기 사용이 많은 분무 | q042_080_130_primarylocalizedcontrols |  |
| 액체내분말 | q027_065_113_sprayingliquidsinspace | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 대규모 공간 분무 | q042_080_130_primarylocalizedcontrols |  |
| 액체내분말 | q027_065_113_sprayingliquidsinspace | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 대규모 공간 분무 | q042_080_130_primarylocalizedcontrols |  |
| 액체내분말 | q027_065_113_sprayingliquidsinspace | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 소규모 공간 분무 | q042_080_130_primarylocalizedcontrols |  |
| 액체내분말 | q027_065_113_sprayingliquidsinspace | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 소규모 공간 분무 | q042_080_130_primarylocalizedcontrols |  |
| 액체내분말 | q028_066_114_liquidopensurfaceundisturbed | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 개방 표면 0.1 - 0.3 m2 | q042_080_130_primarylocalizedcontrols |  |
| 액체내분말 | q028_066_114_liquidopensurfaceundisturbed | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 개방 표면 0.1 - 0.3 m2 |  | 가지치기(형제 선택지와 같은 곳) |
| 액체내분말 | q028_066_114_liquidopensurfaceundisturbed | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 개방 표면 0.3 - 1 m2 | q042_080_130_primarylocalizedcontrols |  |
| 액체내분말 | q028_066_114_liquidopensurfaceundisturbed | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 개방 표면 0.3 - 1 m2 | q042_080_130_primarylocalizedcontrols |  |
| 액체내분말 | q028_066_114_liquidopensurfaceundisturbed | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 개방 표면 1 - 3 m2 | q042_080_130_primarylocalizedcontrols |  |
| 액체내분말 | q028_066_114_liquidopensurfaceundisturbed | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 개방 표면 1 - 3 m2 | q042_080_130_primarylocalizedcontrols |  |
| 액체내분말 | q028_066_114_liquidopensurfaceundisturbed | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 개방 표면 < 0.1 m2 | q042_080_130_primarylocalizedcontrols |  |
| 액체내분말 | q028_066_114_liquidopensurfaceundisturbed | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 개방 표면 < 0.1 m2 |  | 가지치기(형제 선택지와 같은 곳) |
| 액체내분말 | q028_066_114_liquidopensurfaceundisturbed | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 개방 표면 > 3 m2 | q042_080_130_primarylocalizedcontrols |  |
| 액체내분말 | q028_066_114_liquidopensurfaceundisturbed | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 개방 표면 > 3 m2 | q042_080_130_primarylocalizedcontrols |  |
| 액체내분말 | q028_3_066_3_114_3_liquidopensurfaceagitated | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 개방 표면 0.1 - 0.3 m2 | q042_080_130_primarylocalizedcontrols |  |
| 액체내분말 | q028_3_066_3_114_3_liquidopensurfaceagitated | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 개방 표면 0.1 - 0.3 m2 |  | 가지치기(형제 선택지와 같은 곳) |
| 액체내분말 | q028_3_066_3_114_3_liquidopensurfaceagitated | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 개방 표면 0.3 - 1 m2 | q042_080_130_primarylocalizedcontrols |  |
| 액체내분말 | q028_3_066_3_114_3_liquidopensurfaceagitated | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 개방 표면 0.3 - 1 m2 | q042_080_130_primarylocalizedcontrols |  |
| 액체내분말 | q028_3_066_3_114_3_liquidopensurfaceagitated | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 개방 표면 1 - 3 m2 | q042_080_130_primarylocalizedcontrols |  |
| 액체내분말 | q028_3_066_3_114_3_liquidopensurfaceagitated | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 개방 표면 1 - 3 m2 | q042_080_130_primarylocalizedcontrols |  |
| 액체내분말 | q028_3_066_3_114_3_liquidopensurfaceagitated | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 개방 표면 < 0.1 m2 | q042_080_130_primarylocalizedcontrols |  |
| 액체내분말 | q028_3_066_3_114_3_liquidopensurfaceagitated | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 개방 표면 < 0.1 m2 |  | 가지치기(형제 선택지와 같은 곳) |
| 액체내분말 | q028_3_066_3_114_3_liquidopensurfaceagitated | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 개방 표면 > 3 m2 | q042_080_130_primarylocalizedcontrols |  |
| 액체내분말 | q028_3_066_3_114_3_liquidopensurfaceagitated | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 개방 표면 > 3 m2 | q042_080_130_primarylocalizedcontrols |  |
| 액체내분말 | q028_5_066_5_114_5_handlingcontaminatedobjects | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 처리/오염된 물체를 다루는 활동 (표면 0.1-0.3 m2) | q028_7_066_7_114_7_handlingcontaminatedobjectscontaminationlevel |  |
| 액체내분말 | q028_5_066_5_114_5_handlingcontaminatedobjects | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 처리/오염된 물체를 다루는 활동 (표면 0.1-0.3 m2) |  | 가지치기(형제 선택지와 같은 곳) |
| 액체내분말 | q028_5_066_5_114_5_handlingcontaminatedobjects | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 처리/오염된 물체를 다루는 활동 (표면 0.3-1 m2) | q028_7_066_7_114_7_handlingcontaminatedobjectscontaminationlevel |  |
| 액체내분말 | q028_5_066_5_114_5_handlingcontaminatedobjects | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 처리/오염된 물체를 다루는 활동 (표면 0.3-1 m2) | q028_7_066_7_114_7_handlingcontaminatedobjectscontaminationlevel |  |
| 액체내분말 | q028_5_066_5_114_5_handlingcontaminatedobjects | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 처리/오염된 물체를 다루는 활동 (표면 1-3 m2) | q028_7_066_7_114_7_handlingcontaminatedobjectscontaminationlevel |  |
| 액체내분말 | q028_5_066_5_114_5_handlingcontaminatedobjects | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 처리/오염된 물체를 다루는 활동 (표면 1-3 m2) | q028_7_066_7_114_7_handlingcontaminatedobjectscontaminationlevel |  |
| 액체내분말 | q028_5_066_5_114_5_handlingcontaminatedobjects | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 처리/오염된 물체를 다루는 활동 (표면 <0.1 m2) | q028_7_066_7_114_7_handlingcontaminatedobjectscontaminationlevel |  |
| 액체내분말 | q028_5_066_5_114_5_handlingcontaminatedobjects | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 처리/오염된 물체를 다루는 활동 (표면 <0.1 m2) |  | 가지치기(형제 선택지와 같은 곳) |
| 액체내분말 | q028_5_066_5_114_5_handlingcontaminatedobjects | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 처리/오염된 물체를 다루는 활동 (표면 > 3 m2) | q028_7_066_7_114_7_handlingcontaminatedobjectscontaminationlevel |  |
| 액체내분말 | q028_5_066_5_114_5_handlingcontaminatedobjects | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 처리/오염된 물체를 다루는 활동 (표면 > 3 m2) | q028_7_066_7_114_7_handlingcontaminatedobjectscontaminationlevel |  |
| 액체내분말 | q028_7_066_7_114_7_handlingcontaminatedobjectscontaminationlevel | 물체 표면의 오염 정도는 어떻습니까? | 표면의 10-90 % 오염 | q042_080_130_primarylocalizedcontrols |  |
| 액체내분말 | q028_7_066_7_114_7_handlingcontaminatedobjectscontaminationlevel | 물체 표면의 오염 정도는 어떻습니까? | 표면의 10-90 % 오염 | q042_080_130_primarylocalizedcontrols |  |
| 액체내분말 | q028_7_066_7_114_7_handlingcontaminatedobjectscontaminationlevel | 물체 표면의 오염 정도는 어떻습니까? | 표면의 < 10 % 오염 | q042_080_130_primarylocalizedcontrols |  |
| 액체내분말 | q028_7_066_7_114_7_handlingcontaminatedobjectscontaminationlevel | 물체 표면의 오염 정도는 어떻습니까? | 표면의 < 10 % 오염 | q042_080_130_primarylocalizedcontrols |  |
| 액체내분말 | q028_7_066_7_114_7_handlingcontaminatedobjectscontaminationlevel | 물체 표면의 오염 정도는 어떻습니까? | 표면의 > 90 % 오염 | q042_080_130_primarylocalizedcontrols |  |
| 액체내분말 | q028_7_066_7_114_7_handlingcontaminatedobjectscontaminationlevel | 물체 표면의 오염 정도는 어떻습니까? | 표면의 > 90 % 오염 | q042_080_130_primarylocalizedcontrols |  |
| 액체내분말 | q029_067_115_spreadingliquidproducts | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 표면 또는 가공물에 대한 액체 도포 0.1 - 0.3 m2 / hour | q042_080_130_primarylocalizedcontrols |  |
| 액체내분말 | q029_067_115_spreadingliquidproducts | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 표면 또는 가공물에 대한 액체 도포 0.1 - 0.3 m2 / hour |  | 가지치기(형제 선택지와 같은 곳) |
| 액체내분말 | q029_067_115_spreadingliquidproducts | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 표면 또는 가공물에 대한 액체 도포 0.3 - 1 m² / hour | q042_080_130_primarylocalizedcontrols |  |
| 액체내분말 | q029_067_115_spreadingliquidproducts | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 표면 또는 가공물에 대한 액체 도포 0.3 - 1 m² / hour | q042_080_130_primarylocalizedcontrols |  |
| 액체내분말 | q029_067_115_spreadingliquidproducts | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 표면 또는 가공물에 대한 액체 도포 1 - 3 m² / hour | q042_080_130_primarylocalizedcontrols |  |
| 액체내분말 | q029_067_115_spreadingliquidproducts | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 표면 또는 가공물에 대한 액체 도포 1 - 3 m² / hour | q042_080_130_primarylocalizedcontrols |  |
| 액체내분말 | q029_067_115_spreadingliquidproducts | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 표면 또는 가공물에 대한 액체 도포 < 0.1 m2 / hour | q042_080_130_primarylocalizedcontrols |  |
| 액체내분말 | q029_067_115_spreadingliquidproducts | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 표면 또는 가공물에 대한 액체 도포 < 0.1 m2 / hour |  | 가지치기(형제 선택지와 같은 곳) |
| 액체내분말 | q029_067_115_spreadingliquidproducts | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 표면 또는 가공물에 대한 액체 도포 > 3 m2 / hour | q042_080_130_primarylocalizedcontrols |  |
| 액체내분말 | q029_067_115_spreadingliquidproducts | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 표면 또는 가공물에 대한 액체 도포 > 3 m2 / hour | q042_080_130_primarylocalizedcontrols |  |
| 액체내분말 | q030_068_116_liquidshighspeedprocesses | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 고속 운동이 수반되는 대규모 활동 | q030_5_068_5_116_5_liquidshighspeedprocessescontainmentlevel |  |
| 액체내분말 | q030_068_116_liquidshighspeedprocesses | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 고속 운동이 수반되는 대규모 활동 | q030_5_068_5_116_5_liquidshighspeedprocessescontainmentlevel |  |
| 액체내분말 | q030_068_116_liquidshighspeedprocesses | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 고속 운동이 수반되는 소규모 활동 | q030_5_068_5_116_5_liquidshighspeedprocessescontainmentlevel |  |
| 액체내분말 | q030_068_116_liquidshighspeedprocesses | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 고속 운동이 수반되는 소규모 활동 | q030_5_068_5_116_5_liquidshighspeedprocessescontainmentlevel |  |
| 액체내분말 | q030_5_068_5_116_5_liquidshighspeedprocessescontainmentlevel | 공정의 밀폐 수준은 어떻습니까? | 개방 공정: 공정과 작업자 간 격리(작업자) 없음 | q042_080_130_primarylocalizedcontrols |  |
| 액체내분말 | q030_5_068_5_116_5_liquidshighspeedprocessescontainmentlevel | 공정의 밀폐 수준은 어떻습니까? | 개방 공정: 공정과 작업자 간 격리(작업자) 없음 | q042_080_130_primarylocalizedcontrols |  |
| 액체내분말 | q030_5_068_5_116_5_liquidshighspeedprocessescontainmentlevel | 공정의 밀폐 수준은 어떻습니까? | 제품과 주변 공기의 접촉을 줄이는 취급 | q042_080_130_primarylocalizedcontrols |  |
| 액체내분말 | q030_5_068_5_116_5_liquidshighspeedprocessescontainmentlevel | 공정의 밀폐 수준은 어떻습니까? | 제품과 주변 공기의 접촉을 줄이는 취급 | q042_080_130_primarylocalizedcontrols |  |
| 액체내분말 | q032_070_118_bottomloading | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 0.1 - 1 l/minute | q042_080_130_primarylocalizedcontrols |  |
| 액체내분말 | q032_070_118_bottomloading | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 0.1 - 1 l/minute |  | 가지치기(형제 선택지와 같은 곳) |
| 액체내분말 | q032_070_118_bottomloading | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 1 - 10 l/minute | q042_080_130_primarylocalizedcontrols |  |
| 액체내분말 | q032_070_118_bottomloading | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 1 - 10 l/minute |  | 가지치기(형제 선택지와 같은 곳) |
| 액체내분말 | q032_070_118_bottomloading | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 10 - 100 l/minute | q042_080_130_primarylocalizedcontrols |  |
| 액체내분말 | q032_070_118_bottomloading | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 10 - 100 l/minute | q042_080_130_primarylocalizedcontrols |  |
| 액체내분말 | q032_070_118_bottomloading | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 100 - 1000 l/minute | q042_080_130_primarylocalizedcontrols |  |
| 액체내분말 | q032_070_118_bottomloading | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 100 - 1000 l/minute | q042_080_130_primarylocalizedcontrols |  |
| 액체내분말 | q032_070_118_bottomloading | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | < 0.1 l/minute | q042_080_130_primarylocalizedcontrols |  |
| 액체내분말 | q032_070_118_bottomloading | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | < 0.1 l/minute |  | 가지치기(형제 선택지와 같은 곳) |
| 액체내분말 | q032_070_118_bottomloading | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | > 1000 l/minute | q042_080_130_primarylocalizedcontrols |  |
| 액체내분말 | q032_070_118_bottomloading | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | > 1000 l/minute | q042_080_130_primarylocalizedcontrols |  |
| 액체내분말 | q033_071_119_fallingliquids | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 0.1 - 1 l/minute | q033_5_071_5_119_5_fallingliquidscontainmentlevel |  |
| 액체내분말 | q033_071_119_fallingliquids | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 0.1 - 1 l/minute |  | 가지치기(형제 선택지와 같은 곳) |
| 액체내분말 | q033_071_119_fallingliquids | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 1 - 10 l/minute | q033_5_071_5_119_5_fallingliquidscontainmentlevel |  |
| 액체내분말 | q033_071_119_fallingliquids | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 1 - 10 l/minute |  | 가지치기(형제 선택지와 같은 곳) |
| 액체내분말 | q033_071_119_fallingliquids | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 10 - 100 l/minute | q033_5_071_5_119_5_fallingliquidscontainmentlevel |  |
| 액체내분말 | q033_071_119_fallingliquids | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 10 - 100 l/minute | q033_5_071_5_119_5_fallingliquidscontainmentlevel |  |
| 액체내분말 | q033_071_119_fallingliquids | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 100 - 1000 l/minute | q033_5_071_5_119_5_fallingliquidscontainmentlevel |  |
| 액체내분말 | q033_071_119_fallingliquids | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 100 - 1000 l/minute | q033_5_071_5_119_5_fallingliquidscontainmentlevel |  |
| 액체내분말 | q033_071_119_fallingliquids | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | < 0.1 l/minute | q033_5_071_5_119_5_fallingliquidscontainmentlevel |  |
| 액체내분말 | q033_071_119_fallingliquids | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | < 0.1 l/minute |  | 가지치기(형제 선택지와 같은 곳) |
| 액체내분말 | q033_071_119_fallingliquids | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | > 1000 l/minute | q033_5_071_5_119_5_fallingliquidscontainmentlevel |  |
| 액체내분말 | q033_071_119_fallingliquids | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | > 1000 l/minute | q033_5_071_5_119_5_fallingliquidscontainmentlevel |  |
| 액체내분말 | q033_5_071_5_119_5_fallingliquidscontainmentlevel | 공정의 밀폐 수준은 어떻습니까? | 개방 공정 | q034_072_120_transferloadingtype |  |
| 액체내분말 | q033_5_071_5_119_5_fallingliquidscontainmentlevel | 공정의 밀폐 수준은 어떻습니까? | 개방 공정 | q034_072_120_transferloadingtype |  |
| 액체내분말 | q033_5_071_5_119_5_fallingliquidscontainmentlevel | 공정의 밀폐 수준은 어떻습니까? | 제품과 주변 공기의 접촉을 줄이는 취급 | q034_072_120_transferloadingtype |  |
| 액체내분말 | q033_5_071_5_119_5_fallingliquidscontainmentlevel | 공정의 밀폐 수준은 어떻습니까? | 제품과 주변 공기의 접촉을 줄이는 취급 | q034_072_120_transferloadingtype |  |
| 액체내분말 | q034_072_120_transferloadingtype | 액체 이송을 상부 낙하식(splash) 적재 또는 침적식(submerged) 적재로 수행합니까? | 상부 낙하식 적재 — 액체 주입구가 저장조 상부에 위치하여 액체가 자유롭게 튀는 방식 | q042_080_130_primarylocalizedcontrols |  |
| 액체내분말 | q034_072_120_transferloadingtype | 액체 이송을 상부 낙하식(splash) 적재 또는 침적식(submerged) 적재로 수행합니까? | 상부 낙하식 적재 — 액체 주입구가 저장조 상부에 위치하여 액체가 자유롭게 튀는 방식 | q042_080_130_primarylocalizedcontrols |  |
| 액체내분말 | q034_072_120_transferloadingtype | 액체 이송을 상부 낙하식(splash) 적재 또는 침적식(submerged) 적재로 수행합니까? | 침적식 적재 — 액체 주입구가 액면 아래에 위치하여 에어로졸 생성량을 줄이는 방식 | q042_080_130_primarylocalizedcontrols |  |
| 액체내분말 | q034_072_120_transferloadingtype | 액체 이송을 상부 낙하식(splash) 적재 또는 침적식(submerged) 적재로 수행합니까? | 침적식 적재 — 액체 주입구가 액면 아래에 위치하여 에어로졸 생성량을 줄이는 방식 | q042_080_130_primarylocalizedcontrols |  |
| 액체내분말 | q042_080_130_primarylocalizedcontrols | 일반 제어수단 | 국소 제어 없음 | q045_081_surfacecontamination |  |
| 액체내분말 | q042_080_130_primarylocalizedcontrols | 일반 제어수단 | 국소 제어 없음 | q043_131_segregation |  |
| 액체내분말 | q042_080_130_primarylocalizedcontrols | 일반 제어수단 | 국소배기장치(LEV) |  | 막힘(검증오류) |
| 액체내분말 | q042_080_130_primarylocalizedcontrols | 일반 제어수단 | 국소배기장치(LEV) |  | 막힘(검증오류) |
| 액체내분말 | q042_080_130_primarylocalizedcontrols | 일반 제어수단 | 글로브 박스 및 글로브 백 |  | 막힘(검증오류) |
| 액체내분말 | q042_080_130_primarylocalizedcontrols | 일반 제어수단 | 글로브 박스 및 글로브 백 |  | 막힘(검증오류) |
| 액체내분말 | q042_080_130_primarylocalizedcontrols | 일반 제어수단 | 밀폐 — 배기 없음 | q042_5_080_5_130_5_secondarylocalizedcontrols |  |
| 액체내분말 | q042_080_130_primarylocalizedcontrols | 일반 제어수단 | 밀폐 — 배기 없음 | q042_5_080_5_130_5_secondarylocalizedcontrols |  |
| 액체내분말 | q042_080_130_primarylocalizedcontrols | 일반 제어수단 | 증기 회수 시스템 | q042_5_080_5_130_5_secondarylocalizedcontrols |  |
| 액체내분말 | q042_080_130_primarylocalizedcontrols | 일반 제어수단 | 증기 회수 시스템 | q042_5_080_5_130_5_secondarylocalizedcontrols |  |
| 액체내분말 | q042_5_080_5_130_5_secondarylocalizedcontrols | 일반 제어수단 | 2차 국소 제어 없음 | q045_081_surfacecontamination |  |
| 액체내분말 | q042_5_080_5_130_5_secondarylocalizedcontrols | 일반 제어수단 | 2차 국소 제어 없음 | q043_131_segregation |  |
| 액체내분말 | q042_5_080_5_130_5_secondarylocalizedcontrols | 일반 제어수단 | 국소배기장치(LEV) |  | 막힘(검증오류) |
| 액체내분말 | q042_5_080_5_130_5_secondarylocalizedcontrols | 일반 제어수단 | 국소배기장치(LEV) |  | 막힘(검증오류) |
| 액체내분말 | q042_5_080_5_130_5_secondarylocalizedcontrols | 일반 제어수단 | 글로브 박스 및 글로브 백 |  | 막힘(검증오류) |
| 액체내분말 | q042_5_080_5_130_5_secondarylocalizedcontrols | 일반 제어수단 | 글로브 박스 및 글로브 백 |  | 막힘(검증오류) |
| 액체내분말 | q042_5_080_5_130_5_secondarylocalizedcontrols | 일반 제어수단 | 밀폐 — 배기 없음 | q045_081_surfacecontamination |  |
| 액체내분말 | q042_5_080_5_130_5_secondarylocalizedcontrols | 일반 제어수단 | 밀폐 — 배기 없음 | q043_131_segregation |  |
| 액체내분말 | q042_5_080_5_130_5_secondarylocalizedcontrols | 일반 제어수단 | 증기 회수 시스템 | q045_081_surfacecontamination |  |
| 액체내분말 | q042_5_080_5_130_5_secondarylocalizedcontrols | 일반 제어수단 | 증기 회수 시스템 | q043_131_segregation |  |
| 액체내분말 | q043_131_segregation | 격리(발생원) 선택 | (미수집) rbCompleteNoVentilation | q044_personalenclosure |  |
| 액체내분말 | q043_131_segregation | 격리(발생원) 선택 | (미수집) rbCompleteVentilation |  | 가지치기(형제 선택지와 같은 곳) |
| 액체내분말 | q043_131_segregation | 격리(발생원) 선택 | (미수집) rbNoSegregation |  | 가지치기(형제 선택지와 같은 곳) |
| 액체내분말 | q043_131_segregation | 격리(발생원) 선택 | (미수집) rbPartialNoVentilation | q044_personalenclosure |  |
| 액체내분말 | q043_131_segregation | 격리(발생원) 선택 | (미수집) rbPartialVentilation | q044_personalenclosure |  |
| 액체내분말 | q044_personalenclosure | Select 격리(작업자) | (미수집) rbCompleteNoVentilation | q045_081_surfacecontamination |  |
| 액체내분말 | q044_personalenclosure | Select 격리(작업자) | (미수집) rbCompleteVentilation |  | 가지치기(형제 선택지와 같은 곳) |
| 액체내분말 | q044_personalenclosure | Select 격리(작업자) | (미수집) rbNoPersonalEnclosure |  | 가지치기(형제 선택지와 같은 곳) |
| 액체내분말 | q044_personalenclosure | Select 격리(작업자) | (미수집) rbPartialNoVentilation | q045_081_surfacecontamination |  |
| 액체내분말 | q044_personalenclosure | Select 격리(작업자) | (미수집) rbPartialVentilation | q045_081_surfacecontamination |  |
| 액체내분말 | q045_081_surfacecontamination | 공정이 완전히 밀폐되어 있고, 그 밀폐의 건전성을 정기적으로 점검합니까? | 아니오 | q084_dispersion |  |
| 액체내분말 | q045_081_surfacecontamination | 공정이 완전히 밀폐되어 있고, 그 밀폐의 건전성을 정기적으로 점검합니까? | 아니오 | q048_dispersion |  |
| 액체내분말 | q045_081_surfacecontamination | 공정이 완전히 밀폐되어 있고, 그 밀폐의 건전성을 정기적으로 점검합니까? | 예 | q084_dispersion |  |
| 액체내분말 | q045_081_surfacecontamination | 공정이 완전히 밀폐되어 있고, 그 밀폐의 건전성을 정기적으로 점검합니까? | 예 | q048_dispersion |  |
| 액체내분말 | q048_dispersion | 작업을 실내 또는 실외에서 수행합니까? | (미수집) rbIndoors |  | 막힘(검증오류) |
| 액체내분말 | q048_dispersion | 작업을 실내 또는 실외에서 수행합니까? | (미수집) rbOutdoors |  | 막힘(검증오류) |
| 액체내분말 | q084_dispersion | 작업은 실내, 실외, 분무실, 또는 하향 층류 부스 중 어디에서 수행됩니까? | 스프레이 룸 | q089_0_secondaryfarfieldsources |  |
| 액체내분말 | q084_dispersion | 작업은 실내, 실외, 분무실, 또는 하향 층류 부스 중 어디에서 수행됩니까? | 실내 | q089_0_secondaryfarfieldsources |  |
| 액체내분말 | q084_dispersion | 작업은 실내, 실외, 분무실, 또는 하향 층류 부스 중 어디에서 수행됩니까? | 실외 | q089_0_secondaryfarfieldsources |  |
| 액체내분말 | q084_dispersion | 작업은 실내, 실외, 분무실, 또는 하향 층류 부스 중 어디에서 수행됩니까? | 하향 층류 부스 | q089_0_secondaryfarfieldsources |  |
| 액체내분말 | q089_0_secondaryfarfieldsources | 작업자 호흡 영역의 발생원 외에, 작업실 내에 2차 발생원이 존재합니까? | 아니오 | q002_7_activities |  |
| 액체내분말 | q089_0_secondaryfarfieldsources | 작업자 호흡 영역의 발생원 외에, 작업실 내에 2차 발생원이 존재합니까? | 예 | q003_090_producttype |  |
| 고체물체 | q007_094_solidweightfraction | 고체 물체 내 물질의 질량분율은 얼마입니까? | 극미량 (0.01 - 0.1 %) | q008_095_solidmaterial |  |
| 고체물체 | q007_094_solidweightfraction | 고체 물체 내 물질의 질량분율은 얼마입니까? | 극히 적음 (0.1 - 0.5 %) | q008_095_solidmaterial |  |
| 고체물체 | q007_094_solidweightfraction | 고체 물체 내 물질의 질량분율은 얼마입니까? | 매우 적음 (0.5 - 1 %) | q008_095_solidmaterial |  |
| 고체물체 | q007_094_solidweightfraction | 고체 물체 내 물질의 질량분율은 얼마입니까? | 상당량 (10 - 50 %) | q008_095_solidmaterial |  |
| 고체물체 | q007_094_solidweightfraction | 고체 물체 내 물질의 질량분율은 얼마입니까? | 소량 (5 - 10 %) | q008_095_solidmaterial |  |
| 고체물체 | q007_094_solidweightfraction | 고체 물체 내 물질의 질량분율은 얼마입니까? | 순수 물질 (100%) | q008_095_solidmaterial |  |
| 고체물체 | q007_094_solidweightfraction | 고체 물체 내 물질의 질량분율은 얼마입니까? | 적음 (1 - 5 %) | q008_095_solidmaterial |  |
| 고체물체 | q007_094_solidweightfraction | 고체 물체 내 물질의 질량분율은 얼마입니까? | 주성분 (50 - 90 %) | q008_095_solidmaterial |  |
| 고체물체 | q008_095_solidmaterial | 고체 물체의 재질은 무엇입니까? | 가죽 (현재 ART 의 적용 범위를 벗어납니다) |  | 선택 불가 (ART 미지원) |
| 고체물체 | q008_095_solidmaterial | 고체 물체의 재질은 무엇입니까? | 금속 | q008_5_095_5_moisturecontent |  |
| 고체물체 | q008_095_solidmaterial | 고체 물체의 재질은 무엇입니까? | 기타 (현재 ART 의 적용 범위를 벗어납니다) |  | 선택 불가 (ART 미지원) |
| 고체물체 | q008_095_solidmaterial | 고체 물체의 재질은 무엇입니까? | 목재 | q008_5_095_5_moisturecontent |  |
| 고체물체 | q008_095_solidmaterial | 고체 물체의 재질은 무엇입니까? | 석재 | q008_5_095_5_moisturecontent |  |
| 고체물체 | q008_095_solidmaterial | 고체 물체의 재질은 무엇입니까? | 유리 (현재 ART 의 적용 범위를 벗어납니다) |  | 선택 불가 (ART 미지원) |
| 고체물체 | q008_095_solidmaterial | 고체 물체의 재질은 무엇입니까? | 직물 (현재 ART 의 적용 범위를 벗어납니다) |  | 선택 불가 (ART 미지원) |
| 고체물체 | q008_095_solidmaterial | 고체 물체의 재질은 무엇입니까? | 플라스틱 (현재 ART 의 적용 범위를 벗어납니다) |  | 선택 불가 (ART 미지원) |
| 고체물체 | q008_5_095_5_moisturecontent | 고체 물체의 수분 함량은 얼마입니까? | 건조 고체 물체 (수분 함량 <5 %) | q016_nearfieldsource |  |
| 고체물체 | q008_5_095_5_moisturecontent | 고체 물체의 수분 함량은 얼마입니까? | 수분 함량 5 - 10 % | q016_nearfieldsource |  |
| 고체물체 | q008_5_095_5_moisturecontent | 고체 물체의 수분 함량은 얼마입니까? | 수분 함량 >10 % | q016_nearfieldsource |  |
| 고체물체 | q016_nearfieldsource | 1차 배출 발생원이 작업자의 호흡 영역(즉, 작업자 머리로부터 모든 방향으로 1미터 이내의 공기 체적) 안에 있습니까? | 아니오 | q017_055_103_activityclass |  |
| 고체물체 | q016_nearfieldsource | 1차 배출 발생원이 작업자의 호흡 영역(즉, 작업자 머리로부터 모든 방향으로 1미터 이내의 공기 체적) 안에 있습니까? | 예 | q017_055_103_activityclass |  |
| 고체물체 | q017_055_103_activityclass | 활동 등급 선택 | 고체 물체의 파쇄 및 마모 | q018_056_104_fracturingabrasionsolids |  |
| 고체물체 | q017_055_103_activityclass | 활동 등급 선택 | 고체 물체의 파쇄 및 마모 | q018_056_104_fracturingabrasionsolids |  |
| 고체물체 | q017_055_103_activityclass | 활동 등급 선택 | 연마재 분사 | q019_057_105_abrasiveblasting |  |
| 고체물체 | q017_055_103_activityclass | 활동 등급 선택 | 연마재 분사 | q019_057_105_abrasiveblasting |  |
| 고체물체 | q018_056_104_fracturingabrasionsolids | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 극소량의 분진이 발생하는 목재의 수동 취급 | q018_6_056_6_104_6_fracturingabrasionsolidscontainmentlevel |  |
| 고체물체 | q018_056_104_fracturingabrasionsolids | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 극소량의 분진이 발생하는 목재의 수동 취급 |  | 가지치기(형제 선택지와 같은 곳) |
| 고체물체 | q018_056_104_fracturingabrasionsolids | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 다량의 분진이 발생하는 목재의 기계적 샌딩 | q018_6_056_6_104_6_fracturingabrasionsolidscontainmentlevel |  |
| 고체물체 | q018_056_104_fracturingabrasionsolids | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 다량의 분진이 발생하는 목재의 기계적 샌딩 | q018_6_056_6_104_6_fracturingabrasionsolidscontainmentlevel |  |
| 고체물체 | q018_056_104_fracturingabrasionsolids | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 다량의 분진이 발생하는 목재의 기계적 취급 (예: 가공물의 빠른 이동 속도 또는 회전 절단 날) | q018_6_056_6_104_6_fracturingabrasionsolidscontainmentlevel |  |
| 고체물체 | q018_056_104_fracturingabrasionsolids | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 다량의 분진이 발생하는 목재의 기계적 취급 (예: 가공물의 빠른 이동 속도 또는 회전 절단 날) | q018_6_056_6_104_6_fracturingabrasionsolidscontainmentlevel |  |
| 고체물체 | q018_056_104_fracturingabrasionsolids | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 소량의 분진이 발생하는 목재의 기계적 취급 | q018_6_056_6_104_6_fracturingabrasionsolidscontainmentlevel |  |
| 고체물체 | q018_056_104_fracturingabrasionsolids | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 소량의 분진이 발생하는 목재의 기계적 취급 | q018_6_056_6_104_6_fracturingabrasionsolidscontainmentlevel |  |
| 고체물체 | q018_056_104_fracturingabrasionsolids | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 소량의 분진이 발생하는 목재의 수동 취급 | q018_6_056_6_104_6_fracturingabrasionsolidscontainmentlevel |  |
| 고체물체 | q018_056_104_fracturingabrasionsolids | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 소량의 분진이 발생하는 목재의 수동 취급 |  | 가지치기(형제 선택지와 같은 곳) |
| 고체물체 | q018_6_056_6_104_6_fracturingabrasionsolidscontainmentlevel | 공정의 밀폐 수준은 어떻습니까? | 개방 공정 | q042_080_130_primarylocalizedcontrols |  |
| 고체물체 | q018_6_056_6_104_6_fracturingabrasionsolidscontainmentlevel | 공정의 밀폐 수준은 어떻습니까? | 개방 공정 | q042_080_130_primarylocalizedcontrols |  |
| 고체물체 | q018_6_056_6_104_6_fracturingabrasionsolidscontainmentlevel | 공정의 밀폐 수준은 어떻습니까? | 제품과 주변 공기의 접촉을 줄이는 취급 | q042_080_130_primarylocalizedcontrols |  |
| 고체물체 | q018_6_056_6_104_6_fracturingabrasionsolidscontainmentlevel | 공정의 밀폐 수준은 어떻습니까? | 제품과 주변 공기의 접촉을 줄이는 취급 | q042_080_130_primarylocalizedcontrols |  |
| 고체물체 | q019_057_105_abrasiveblasting | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 대형 표면의 연마 블라스팅 | q019_3_057_3_105_3_abrasiveblastingtechnique |  |
| 고체물체 | q019_057_105_abrasiveblasting | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 대형 표면의 연마 블라스팅 | q019_3_057_3_105_3_abrasiveblastingtechnique |  |
| 고체물체 | q019_057_105_abrasiveblasting | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 마이크로 연마 블라스팅 | q019_3_057_3_105_3_abrasiveblastingtechnique |  |
| 고체물체 | q019_057_105_abrasiveblasting | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 마이크로 연마 블라스팅 |  | 가지치기(형제 선택지와 같은 곳) |
| 고체물체 | q019_057_105_abrasiveblasting | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 소형 부품의 연마 블라스팅 | q019_3_057_3_105_3_abrasiveblastingtechnique |  |
| 고체물체 | q019_057_105_abrasiveblasting | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 소형 부품의 연마 블라스팅 | q019_3_057_3_105_3_abrasiveblastingtechnique |  |
| 고체물체 | q019_057_105_abrasiveblasting | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 초대형 표면의 연마 블라스팅 | q019_3_057_3_105_3_abrasiveblastingtechnique |  |
| 고체물체 | q019_057_105_abrasiveblasting | 아래 상황 중 귀하의 활동을 가장 잘 나타내는 것은 무엇입니까? | 초대형 표면의 연마 블라스팅 | q019_3_057_3_105_3_abrasiveblastingtechnique |  |
| 고체물체 | q019_3_057_3_105_3_abrasiveblastingtechnique | 연마 블라스팅 기법의 종류는 무엇입니까? | 건식 연마 블라스팅 | q019_5_057_5_105_5_abrasiveblastingdirection |  |
| 고체물체 | q019_3_057_3_105_3_abrasiveblastingtechnique | 연마 블라스팅 기법의 종류는 무엇입니까? | 건식 연마 블라스팅 | q019_5_057_5_105_5_abrasiveblastingdirection |  |
| 고체물체 | q019_3_057_3_105_3_abrasiveblastingtechnique | 연마 블라스팅 기법의 종류는 무엇입니까? | 습식 연마 블라스팅 | q019_5_057_5_105_5_abrasiveblastingdirection |  |
| 고체물체 | q019_3_057_3_105_3_abrasiveblastingtechnique | 연마 블라스팅 기법의 종류는 무엇입니까? | 습식 연마 블라스팅 | q019_5_057_5_105_5_abrasiveblastingdirection |  |
| 고체물체 | q019_5_057_5_105_5_abrasiveblastingdirection | 연마 블라스팅의 방향은 어떻습니까? | 모든 방향(상향 포함)으로의 연마 블라스팅 | q042_080_130_primarylocalizedcontrols |  |
| 고체물체 | q019_5_057_5_105_5_abrasiveblastingdirection | 연마 블라스팅의 방향은 어떻습니까? | 모든 방향(상향 포함)으로의 연마 블라스팅 | q042_080_130_primarylocalizedcontrols |  |
| 고체물체 | q019_5_057_5_105_5_abrasiveblastingdirection | 연마 블라스팅의 방향은 어떻습니까? | 수평 또는 하향 블라스팅만 | q042_080_130_primarylocalizedcontrols |  |
| 고체물체 | q019_5_057_5_105_5_abrasiveblastingdirection | 연마 블라스팅의 방향은 어떻습니까? | 수평 또는 하향 블라스팅만 | q042_080_130_primarylocalizedcontrols |  |
| 고체물체 | q019_5_057_5_105_5_abrasiveblastingdirection | 연마 블라스팅의 방향은 어떻습니까? | 하향 블라스팅만 | q042_080_130_primarylocalizedcontrols |  |
| 고체물체 | q019_5_057_5_105_5_abrasiveblastingdirection | 연마 블라스팅의 방향은 어떻습니까? | 하향 블라스팅만 | q042_080_130_primarylocalizedcontrols |  |
| 고체물체 | q042_080_130_primarylocalizedcontrols | 일반 제어수단 | 국소 제어 없음 | q045_081_surfacecontamination |  |
| 고체물체 | q042_080_130_primarylocalizedcontrols | 일반 제어수단 | 국소 제어 없음 | q043_131_segregation |  |
| 고체물체 | q042_080_130_primarylocalizedcontrols | 일반 제어수단 | 국소배기장치(LEV) |  | 막힘(검증오류) |
| 고체물체 | q042_080_130_primarylocalizedcontrols | 일반 제어수단 | 국소배기장치(LEV) |  | 막힘(검증오류) |
| 고체물체 | q042_080_130_primarylocalizedcontrols | 일반 제어수단 | 글로브 박스 및 글로브 백 |  | 막힘(검증오류) |
| 고체물체 | q042_080_130_primarylocalizedcontrols | 일반 제어수단 | 글로브 박스 및 글로브 백 |  | 막힘(검증오류) |
| 고체물체 | q042_080_130_primarylocalizedcontrols | 일반 제어수단 | 밀폐 — 배기 없음 | q042_5_080_5_130_5_secondarylocalizedcontrols |  |
| 고체물체 | q042_080_130_primarylocalizedcontrols | 일반 제어수단 | 밀폐 — 배기 없음 | q042_5_080_5_130_5_secondarylocalizedcontrols |  |
| 고체물체 | q042_080_130_primarylocalizedcontrols | 일반 제어수단 | 억제 기법 | q042_5_080_5_130_5_secondarylocalizedcontrols |  |
| 고체물체 | q042_080_130_primarylocalizedcontrols | 일반 제어수단 | 억제 기법 | q042_5_080_5_130_5_secondarylocalizedcontrols |  |
| 고체물체 | q042_080_130_primarylocalizedcontrols | 일반 제어수단 | 증기 회수 시스템 | q042_5_080_5_130_5_secondarylocalizedcontrols |  |
| 고체물체 | q042_080_130_primarylocalizedcontrols | 일반 제어수단 | 증기 회수 시스템 | q042_5_080_5_130_5_secondarylocalizedcontrols |  |
| 고체물체 | q042_5_080_5_130_5_secondarylocalizedcontrols | 일반 제어수단 | 2차 국소 제어 없음 | q045_081_surfacecontamination |  |
| 고체물체 | q042_5_080_5_130_5_secondarylocalizedcontrols | 일반 제어수단 | 2차 국소 제어 없음 | q043_131_segregation |  |
| 고체물체 | q042_5_080_5_130_5_secondarylocalizedcontrols | 일반 제어수단 | 국소배기장치(LEV) |  | 막힘(검증오류) |
| 고체물체 | q042_5_080_5_130_5_secondarylocalizedcontrols | 일반 제어수단 | 국소배기장치(LEV) |  | 가지치기(형제 선택지와 같은 곳) |
| 고체물체 | q042_5_080_5_130_5_secondarylocalizedcontrols | 일반 제어수단 | 글로브 박스 및 글로브 백 |  | 막힘(검증오류) |
| 고체물체 | q042_5_080_5_130_5_secondarylocalizedcontrols | 일반 제어수단 | 글로브 박스 및 글로브 백 |  | 가지치기(형제 선택지와 같은 곳) |
| 고체물체 | q042_5_080_5_130_5_secondarylocalizedcontrols | 일반 제어수단 | 밀폐 — 배기 없음 | q045_081_surfacecontamination |  |
| 고체물체 | q042_5_080_5_130_5_secondarylocalizedcontrols | 일반 제어수단 | 밀폐 — 배기 없음 | q043_131_segregation |  |
| 고체물체 | q042_5_080_5_130_5_secondarylocalizedcontrols | 일반 제어수단 | 억제 기법 | q045_081_surfacecontamination |  |
| 고체물체 | q042_5_080_5_130_5_secondarylocalizedcontrols | 일반 제어수단 | 억제 기법 | q043_131_segregation |  |
| 고체물체 | q042_5_080_5_130_5_secondarylocalizedcontrols | 일반 제어수단 | 증기 회수 시스템 | q045_081_surfacecontamination |  |
| 고체물체 | q042_5_080_5_130_5_secondarylocalizedcontrols | 일반 제어수단 | 증기 회수 시스템 |  | 가지치기(형제 선택지와 같은 곳) |
| 고체물체 | q043_131_segregation | 격리(발생원) 선택 | (미수집) rbCompleteNoVentilation | q044_personalenclosure |  |
| 고체물체 | q043_131_segregation | 격리(발생원) 선택 | (미수집) rbCompleteVentilation |  | 가지치기(형제 선택지와 같은 곳) |
| 고체물체 | q043_131_segregation | 격리(발생원) 선택 | (미수집) rbNoSegregation |  | 가지치기(형제 선택지와 같은 곳) |
| 고체물체 | q043_131_segregation | 격리(발생원) 선택 | (미수집) rbPartialNoVentilation | q044_personalenclosure |  |
| 고체물체 | q043_131_segregation | 격리(발생원) 선택 | (미수집) rbPartialVentilation | q044_personalenclosure |  |
| 고체물체 | q044_personalenclosure | Select 격리(작업자) | (미수집) rbCompleteNoVentilation | q045_081_surfacecontamination |  |
| 고체물체 | q044_personalenclosure | Select 격리(작업자) | (미수집) rbCompleteVentilation |  | 가지치기(형제 선택지와 같은 곳) |
| 고체물체 | q044_personalenclosure | Select 격리(작업자) | (미수집) rbNoPersonalEnclosure |  | 가지치기(형제 선택지와 같은 곳) |
| 고체물체 | q044_personalenclosure | Select 격리(작업자) | (미수집) rbPartialNoVentilation | q045_081_surfacecontamination |  |
| 고체물체 | q044_personalenclosure | Select 격리(작업자) | (미수집) rbPartialVentilation | q045_081_surfacecontamination |  |
| 고체물체 | q045_081_surfacecontamination | 공정이 완전히 밀폐되어 있고, 그 밀폐의 건전성을 정기적으로 점검합니까? | 아니오 | q084_dispersion |  |
| 고체물체 | q045_081_surfacecontamination | 공정이 완전히 밀폐되어 있고, 그 밀폐의 건전성을 정기적으로 점검합니까? | 아니오 | q048_dispersion |  |
| 고체물체 | q045_081_surfacecontamination | 공정이 완전히 밀폐되어 있고, 그 밀폐의 건전성을 정기적으로 점검합니까? | 예 | q084_dispersion |  |
| 고체물체 | q045_081_surfacecontamination | 공정이 완전히 밀폐되어 있고, 그 밀폐의 건전성을 정기적으로 점검합니까? | 예 | q048_dispersion |  |
| 고체물체 | q048_dispersion | 작업을 실내 또는 실외에서 수행합니까? | (미수집) rbIndoors |  | 막힘(검증오류) |
| 고체물체 | q048_dispersion | 작업을 실내 또는 실외에서 수행합니까? | (미수집) rbOutdoors |  | 막힘(검증오류) |
| 고체물체 | q084_dispersion | 작업은 실내, 실외, 분무실, 또는 하향 층류 부스 중 어디에서 수행됩니까? | 스프레이 룸 | q089_0_secondaryfarfieldsources |  |
| 고체물체 | q084_dispersion | 작업은 실내, 실외, 분무실, 또는 하향 층류 부스 중 어디에서 수행됩니까? | 실내 | q089_0_secondaryfarfieldsources |  |
| 고체물체 | q084_dispersion | 작업은 실내, 실외, 분무실, 또는 하향 층류 부스 중 어디에서 수행됩니까? | 실외 | q089_0_secondaryfarfieldsources |  |
| 고체물체 | q084_dispersion | 작업은 실내, 실외, 분무실, 또는 하향 층류 부스 중 어디에서 수행됩니까? | 하향 층류 부스 | q089_0_secondaryfarfieldsources |  |
| 고체물체 | q089_0_secondaryfarfieldsources | 작업자 호흡 영역의 발생원 외에, 작업실 내에 2차 발생원이 존재합니까? | 아니오 | q002_7_activities |  |
| 고체물체 | q089_0_secondaryfarfieldsources | 작업자 호흡 영역의 발생원 외에, 작업실 내에 2차 발생원이 존재합니까? | 예 | q003_090_producttype |  |
