# -*- coding: utf-8 -*-
"""16차 — 측정자료 올리기 화면 + 노출 데이터 라이브러리 도움말.

시나리오를 끝까지 완성하고 모델을 실행한 뒤에야 열리는 화면들입니다.
(`run_model.js` → `crawl_pages.js`)

주의: CSV **열 이름**(dataset, concentration, isnondetect, uncertaintyfactor)은
번역하지 않습니다. 사용자가 파일에 그대로 적어야 하는 식별자라 한국어로 바꾸면
업로드가 깨집니다. `scope_filter.py` 의 EXPLICIT 목록에 넣었습니다.

문장이 인라인 링크·강조 때문에 여러 텍스트 노드로 쪼개져 있습니다. 각 조각을
이어 붙였을 때 한국어로 읽히도록 번역했습니다.
"""
import apply_gaps

PAIRS = [
    # ── 화면 제목 ───────────────────────────────────────────────────────────
    ('Upload Analogous Data - ART', 'bayesian', '유사 데이터 올리기 - ART'),
    ('ART — Upload Analogous Data', 'bayesian', 'ART — 유사 데이터 올리기'),
    ('Exposure Data Library - ART', 'bayesian', '노출 데이터 라이브러리 - ART'),
    ('About the Exposure Data Library', 'bayesian', '노출 데이터 라이브러리 소개'),
    ('Analogous Data', 'bayesian', '유사 데이터'),
    ("'Analogous data'", 'bayesian', "'유사 데이터'"),
    ('Example Data', 'bayesian', '예시 데이터'),
    ('Selecting analogous measurement data', 'bayesian', '유사 측정 데이터 선택'),
    ('Separation, segregation, and local controls', 'bayesian',
     '격리(작업자), 격리(발생원), 국소 제어'),
    ('How potentially analogous measurement data are identified in ART v1.5',
     'bayesian', 'ART v1.5 가 유사 가능성이 있는 측정 데이터를 찾는 방법'),
    ('Concentration adjustments to exposure measurements used in a Bayesian update',
     'bayesian', '베이지안 업데이트에 쓰는 노출 측정값의 농도 보정'),

    # ── 표 머리글·짧은 항목 ─────────────────────────────────────────────────
    ('Activity', 'bayesian', '활동'),
    ('Exposure duration', 'bayesian', '노출 지속시간'),
    ('Exposure form', 'bayesian', '노출 형태'),
    ('exposure form', 'bayesian', '노출 형태'),
    ('activity class', 'bayesian', '활동 등급'),
    ('Vapour pressure', 'bayesian', '증기압'),
    ('Substance product type', 'bayesian', '물질 제품 유형'),
    ('Powder dissolved in liquid', 'bayesian', '액체에 용해된 분말'),
    ('Paste or slurry', 'bayesian', '페이스트 또는 슬러리'),
    ('Solid objects (54)', 'bayesian', '고체 물체 (54)'),
    ('Vapours (870)', 'bayesian', '증기 (870)'),
    ('Low volatility liquids (mists) (88)', 'bayesian',
     '저휘발성 액체(미스트) (88)'),
    ('Powder in liquids (mists) (433)', 'bayesian', '액체 내 분말(미스트) (433)'),
    ('Continental Europe', 'bayesian', '유럽 대륙권'),

    # ── 올리기 화면 안내 (인라인 링크로 조각남) ──────────────────────────────
    ('Use this page to upload analogous data.', 'bayesian',
     '이 페이지에서 유사 데이터를 올립니다.'),
    ('are exposure records from scenarios similar to this one.', 'bayesian',
     '란 이 시나리오와 유사한 시나리오에서 얻은 노출 기록입니다.'),
    ('Enter the path to your data file. The file must be in', 'bayesian',
     '데이터 파일 경로를 입력하십시오. 파일 형식은'),
    ('comma-separated value (CSV)', 'bayesian', '쉼표로 구분된 값(CSV)'),
    ('format (', 'bayesian', '이어야 합니다 ('),
    ('see help', 'bayesian', '도움말 참조'),
    ('Data file includes a header row', 'bayesian', '데이터 파일에 머리글 행이 있음'),
    ("CSV data is in European format (';' delimiter and ',' decimal place)",
     'bayesian', "CSV 데이터가 유럽식 형식입니다 (구분자 ';', 소수점 ',')"),
    ('Tip: Ensure your file has a .csv extension.', 'bayesian',
     '참고: 파일 확장자가 .csv 인지 확인하십시오.'),
    ('Select the file that best matches your locale:', 'bayesian',
     '사용 환경에 맞는 파일을 선택하십시오:'),
    ('Use this page to upload your own analogous exposure data to perform a Bayesian',
     'bayesian',
     '이 페이지에서 직접 보유한 유사 노출 데이터를 올려 기계론적 모델 예측값에 대한 '
     '베이지안 업데이트를 수행합니다. ART v1.5 에서는 그 노출 측정값이 사용자의 '
     '시나리오와 유사한지를 사용자가 직접 판단해야 합니다. ART v1.5 에서는 완전히 '
     '유사하다고 판단되는 측정값만 올리십시오.'),

    # ── CSV 열 설명 ─────────────────────────────────────────────────────────
    ('Analogous data are uploaded to ART in the form of CSV.', 'bayesian',
     '유사 데이터는 CSV 형식으로 ART 에 올립니다. CSV 파일에는 다음 열이 있어야 합니다:'),
    ('An identifier for the dataset, as a string.', 'bayesian',
     '데이터셋 식별자, 문자열.'),
    ('An identifier for the site, as a string.', 'bayesian', '사업장 식별자, 문자열.'),
    ('An identifier for the worker, as a string.', 'bayesian', '작업자 식별자, 문자열.'),
    ('The value of exposure in mg/m', 'bayesian', '노출값 (단위 mg/m'),
    (", as a floating point number ('with a '.' or ',' as the decimal place",
     'bayesian',
     "), 실수. 소수점은 컴퓨터 설정에 따라 '.' 또는 ',' 를 씁니다."),
    ('The concentration of the active substance in the measured formulation',
     'bayesian',
     '측정 대상 제형 내 유효물질의 농도(해당하는 경우). 0 과 1 사이의 실수 '
     '(즉 0~100 %). 비워 두면 농도 보정을 하지 않습니다.'),
    ('Whether or not the exposure was below the limit of detection.', 'bayesian',
     '노출값이 검출한계 미만이었는지 여부. TRUE, 1, T, < 는 참으로 인식합니다'
     '(대소문자 무관). FALSE, 0, F, 빈 문자열은 거짓으로 인식합니다(대소문자 무관). '
     '그 밖의 값은 오류가 됩니다.'),
    ('The ratio of exposures for the dataset, as a positive floating point number.',
     'bayesian',
     '해당 데이터셋의 노출 비율, 양의 실수. 빈 값도 허용되지만 열 자체는 있어야 합니다.'),
    ('Currently, all data are assumed to be fully analogous and so this value is ignored.',
     'bayesian',
     '현재는 모든 데이터를 완전히 유사한 것으로 가정하므로 이 값은 무시됩니다.'),
    ('The level of analogy for the dataset, as a floating point number', 'bayesian',
     '해당 데이터셋의 유사도 수준, 1 이상의 실수. 빈 값도 허용되지만 열 자체는 '
     '있어야 합니다.'),
    ('If no header row is included, then the columns are assumed to be in the above order.',
     'bayesian',
     '머리글 행이 없으면 열이 위 순서대로 있다고 봅니다. 머리글 행을 지정한 경우에는 '
     '각 열 머리글을 위 표의 값과 대조해(대소문자 무관) 위치를 판단합니다.'),

    # ── 유사 데이터 판단 기준 ────────────────────────────────────────────────
    ('The measurements should relate to the same activity;', 'bayesian',
     '측정값은 같은 활동에 관한 것이어야 합니다. 분무 활동의 방향, 낙하 높이처럼 '
     '부수적인 결정인자도 비교 가능해야 합니다.'),
    ("Separation and segregation of the workers and sources should be comparable",
     'bayesian',
     '작업자와 발생원의 격리(작업자)·격리(발생원)가 사용자 시나리오의 조건과 비교 '
     '가능해야 하고, 국소 제어는 같은 유형이어야 합니다.'),
    ('ART assumes that dispersion of an airborne substance is related to levels of ventilation',
     'bayesian',
     'ART 는 공기 중 물질의 확산이 환기 수준, 그리고 실내인 경우 실 용적과 관계있다고 '
     '봅니다. 이 두 요소 모두 사용자 시나리오와 비교 가능해야 합니다.'),
    ('For scenarios relating to exposures to vapours, data should relate to the same substance',
     'bayesian',
     '증기 노출 시나리오에서는 데이터가 같은 물질에 관한 것이어야 하고 공정 온도도 '
     '비슷해야 합니다. 순물질이 아니라면 물질 농도가 대체로 같아야 하고 혼합물의 '
     '활성화 인자도 비슷해야 합니다. 비휘발성 액체(미스트)와 분진에서는 베이지안 '
     '업데이트 때 농도 보정을 하므로 물질 농도가 사용자 시나리오와 일치할 필요가 '
     '없습니다(다음 절 참조). 따라서 비휘발성 액체에는 점도가 비슷해야 한다는 것 외에 '
     '물질 관련 요구사항이 없습니다. 분진의 경우, 사용자 시나리오와 발진성 점수가 '
     '비슷하고(즉 같은 발진성 범주) 수분 수준도 비슷할 때만 완전히 유사하다고 '
     '봅니다.'),
    ('Measurements in the EDL generally relate to a monitored period of exposure generating',
     'bayesian',
     'EDL 의 측정값은 대체로 전 교대시간의 시간가중평균이 아니라, 노출이 발생하는 '
     '활동을 측정한 구간에 관한 것입니다. ART 는 시간가중평균 노출을 예측하므로, '
     '비노출 기간을 지정한 뒤 노출 발생 활동만 측정한 값으로 베이지안 업데이트를 '
     '하지 않는 것이 중요합니다. 그 밖에는 측정 지속시간이 사용자 시나리오와 비교 '
     '가능할 필요는 없습니다. 다만 ART 는 단기 노출(15분 미만)을 예측하도록 만들어져 '
     '있지 않고, 그보다 짧게 채취한 측정값은 변동이 더 클 수 있음을 유념하십시오.'),
    ('As implemented in ART v1.5 the Bayesian model only supports the use of fully analogous',
     'bayesian',
     'ART v1.5 의 베이지안 모델은 완전히 유사한 노출 측정값만 지원합니다. 즉 ART 로 '
     '평가하려는 노출 시나리오와 본질적으로 같은 상황에 해당하는 측정값이어야 합니다. '
     'ART v1.5 의 검색 알고리즘은 ART 노출 라이브러리에서 유사 가능성이 있는 모든 '
     '측정 계열을 찾아냅니다. 그중 어떤 데이터셋이 자신의 시나리오 노출 평가에 '
     '적합한지는 사용자가 전문적 판단으로 결정해야 하며, 완전히 유사한 데이터셋에 '
     '대해 ART v1.5 는 시나리오 간 외삽 불확실성을 추가로 고려하지 않는다는 점을 '
     '유념해야 합니다. ART v1.5.'),

    # ── 검색 방식 ───────────────────────────────────────────────────────────
    ('ART v1.5 identifies potentially analogous measurement data by searching', 'bayesian',
     'ART v1.5 는 노출 형태와 활동 등급으로 ART EDL 을 검색해 유사 가능성이 있는 측정 '
     '데이터를 찾습니다. 검색 결과로 같은'),
    (', or in the case of composite scenarios with multiple activities,', 'bayesian',
     ', 여러 활동으로 구성된 복합 시나리오라면 사용자 시나리오와 활동이 하나 이상 '
     '겹치면서 노출 형태가 같은 모든 데이터셋을 돌려줍니다. 노출 형태는 제품 유형에 '
     '따라 정해지며, 액체의 경우 공정 온도에서의 증기압에 따라 정해집니다.'),

    # ── 농도 보정 ───────────────────────────────────────────────────────────
    ('An underlying assumption made in ART, similar to those made in exposure assessments',
     'bayesian',
     'ART 의 기본 가정은 살생물제·식물보호제 노출평가에서의 가정과 비슷합니다. 즉 '
     '분진과 비휘발성 액체(미스트)의 경우, 물질에 대한 노출은 분진이나 미스트에 대한 '
     '측정 또는 모델 예측 노출에서, 물질 노출이 분진이나 액체 내 물질 농도에 비례한다는 '
     '가정 아래 도출할 수 있다는 것입니다.'),
    ('As ART predicts exposure to the substance and not the total dust or mist', 'bayesian',
     'ART 는 총 분진이나 미스트가 아니라 물질에 대한 노출을 예측하므로(순물질을 쓰는 '
     '경우는 예외), 베이지안 업데이트에서 다음과 같이 농도를 보정합니다. 각 측정값에 '
     '사용자가 입력한 물질 농도와 그 측정값의 물질 농도의 비를 곱합니다. 예를 들어 '
     '사용자가 물질 농도를 2 % 로 지정하고 측정값의 물질 농도가 1 % 였다면, ART 는 '
     '기계론적 모델 예측값을 갱신하기 전에 모든 측정 노출값을 두 배로 만듭니다.'),
    ('In more complex situations where users have defined multiple exposure sources',
     'bayesian',
     '물질 농도가 서로 다른 배출 발생원을 여러 개 지정한 복잡한 경우에는, 기계론적 '
     '모델이 예측한 시간가중 노출 기여도가 가장 큰 발생원을 기준으로 농도를 '
     '보정합니다.'),
    ('Concentration adjustments for dusts and mists are also applied to users own',
     'bayesian',
     '분진과 미스트에 대한 농도 보정은 사용자가 올린 노출 데이터에도 적용됩니다'),
    ('provided', 'bayesian', '단,'),
    ('substance-product concentrations are included in the uploaded data.', 'bayesian',
     '올린 데이터에 물질-제품 농도가 포함되어 있어야 합니다.'),

    # ── 노출 데이터 라이브러리 소개 ─────────────────────────────────────────
    ('ART 1.5 provides an extensive library of different exposure measurement datasets',
     'bayesian',
     'ART 1.5 는 다양한 노출 측정 데이터셋으로 이루어진 방대한 라이브러리를 제공합니다. '
     '각 데이터셋에는 노출 시나리오에 대한 간결한 설명이 붙어 있어, 자신의 시나리오와 '
     '유사한 노출 측정값을 고르는 데 도움이 됩니다. 노출 데이터는 활동 등급(작업 범주)과 '
     '사용 제품을 기준으로 묶여 있습니다. 원칙적으로 같은 현장조사에서 같은 활동(예: 액체 '
     '분무)과 같은 제품(예: 방오도료)으로 얻은 노출 데이터는 하나의 시나리오로 묶습니다. '
     '노출 결정인자나 제어수단에 뚜렷한 차이가 있고 데이터셋의 측정 개수가 충분하면, '
     '같은 연구를 여러 시나리오로 나누기도 합니다(예: LEV 가 있는 분무와 없는 분무). '
     '어떤 시나리오는 특정 노출 기간 동안 노출 잠재력이 높다고 보는 여러 활동(같은 제품 '
     '노출)으로 설명되기도 합니다(예: 전 교대시간 동안의 분무, 붓칠, 쓸기).'),
    ('The measurements included in the ART Exposure Data Library (EDL)', 'bayesian',
     'ART 노출 데이터 라이브러리(EDL)에 실린 측정값은 모두 ART 기계론적 모델의 보정에 '
     '사용됐고, 그 작업에 쓰인 데이터 품질 기준을 충족합니다(즉 시료 채취와 분석 방법에 '
     '대한 핵심 정보가 문서화되어 있고, 측정 기간의 모든 활동에 대해 ART 의 모든 '
     '보정인자를 평가했거나 신뢰할 수 있게 가정했습니다). 보정 작업에서 측정값이 5개 '
     '이상인 연구만 EDL 에 포함했습니다.'),
    ('The ART v1.5 EDL currently has 129 different scenarios', 'bayesian',
     '현재 ART v1.5 EDL 에는 서로 다른 시나리오 129개, 측정값 1944개가 있으며 다음 '
     '물질 유형을 다룹니다:'),
    ('An important feature of ART is the continual updating of the exposure model.',
     'bayesian',
     'ART 의 중요한 특징은 노출 모델을 계속 갱신한다는 점입니다. 앞으로 노출 데이터를 '
     '추가해, 노출 추정이 가장 최신 데이터에 기반하도록 할 것입니다.'),
    ('A short description of each measurement dataset provides details', 'bayesian',
     '각 측정 데이터셋에는 이러한 노출 보정인자 각각에 대한 세부 내용을 담은 짧은 '
     '설명이 있고, ART 검색 결과에서 볼 수 있습니다. 대부분의 경우 이 설명만으로도 '
     '데이터셋의 적합성을 판단할 만큼 충분합니다. 다만 더 자세한 내용이 필요하고 그 '
     '데이터가 공개된 것이라면, 인용된 보고서나 학술지 논문을 참고하십시오.'),
]

apply_gaps.run(PAIRS)
