# -*- coding: utf-8 -*-
"""14차 — 선택지별 `예시:` 상자 (6차 세션에서 처음 수집).

이 상자는 선택지를 고를 때만 채워지므로 4차 순회에서 통째로 빠져 있었습니다.
`sweep_boxes.js` 로 61개 화면을 돌아 모았습니다. 전부 활동 예시입니다.

용어: 기존 `examples` 구역의 번역 방식을 따릅니다 — 짧은 명사구, 단위는 원문 유지.
"""
import apply_gaps

PAIRS = [
    # ── 고체 물체의 파쇄·마모 (q018) ─────────────────────────────────────────
    ('Lathe', 'examples', '선반(旋盤)'),
    ('Planer', 'examples', '플레이너(평삭기)'),
    ('Chainsaw', 'examples', '전기톱'),
    ('Shredder', 'examples', '파쇄기'),
    ('Circular saw', 'examples', '원형톱'),
    ('Screw setting', 'examples', '나사 조립'),
    ('Manual planing', 'examples', '수동 대패질'),
    ('Drilling of holes', 'examples', '구멍 천공'),
    ('Scraping of paint', 'examples', '도막 긁어내기'),
    ('Milling operations', 'examples', '밀링 작업'),
    ('Manual sawing or sanding', 'examples', '수동 톱질 또는 샌딩'),

    # ── 분말·과립의 낙하·이동·교반 ───────────────────────────────────────────
    ('Filling bottles', 'examples', '병 충전'),
    ('Scooping activities', 'examples', '퍼담기 작업'),
    ('Small-scale scooping for sampling', 'examples', '시료 채취용 소규모 퍼담기'),
    ('Sweeping of floors', 'examples', '바닥 쓸기'),
    ('Mixing on laboratory scale', 'examples', '실험실 규모 혼합'),
    ('Manual sieving, mixing or blending', 'examples', '수동 체질, 혼합 또는 배합'),
    ('Sieving, mixing or blending in vessels', 'examples', '용기 내 체질, 혼합 또는 배합'),
    ('Sieving, mixing or blending in large buckets', 'examples',
     '대형 통 내 체질, 혼합 또는 배합'),
    ('Using compressed air to clean e.g. machines', 'examples',
     '압축공기로 청소 (예: 기계)'),
    ('Bulk milling in an open surface', 'examples', '개방된 표면에서의 벌크 분쇄'),
    ('Very small scale tableting, granulation', 'examples',
     '극소규모 타정·조립(造粒)'),
    ('Large scale bulk compression of soil or wood pellets', 'examples',
     '토양 또는 목재 펠릿의 대규모 벌크 압축'),
    ('Sieving big bag volumes in large production plants', 'examples',
     '대형 생산설비에서 빅백 단위 체질 (예: 피트모스 체질)'),
    ('Automated dumping of powders', 'examples',
     '분말 자동 투하 (예: 스크루 컨베이어 또는 벨트 컨베이어)'),
    ('Very small scale weighing (fine adjustments) and scooping in laboratory',
     'examples', '실험실에서 극소규모 계량(미세 조정) 및 퍼담기'),

    # ── 진공 이송 ───────────────────────────────────────────────────────────
    ('Micro powder transfer systems', 'examples', '미량 분말 이송 시스템'),
    ('Large scale vacuum transfer from large vessels', 'examples',
     '대형 용기에서의 대규모 진공 이송'),
    ('Vacuum transfer from open reservoir to enclosed reservoir', 'examples',
     '개방 저장조에서 밀폐 저장조로의 진공 이송'),

    # ── 분말 분무 ───────────────────────────────────────────────────────────
    ('Dusting crops with knapsack dust blower', 'examples',
     '배낭식 살분기로 작물에 분제 살포'),
    ('Powder spraying using electrostatic spray gun', 'examples',
     '정전 분무기를 이용한 분말 분무'),

    # ── 액체 낙하·적재 ──────────────────────────────────────────────────────
    ('(Re)fuelling cars', 'examples', '차량 (재)급유'),
    ('Manual topping up', 'examples', '수동 보충'),
    ('Transfer of small amounts in laboratory', 'examples', '실험실에서 소량 이송'),
    ('Loading of aircraft (under wing)', 'examples', '항공기 급유 (날개 하부)'),
    ('Loading of tanker at bulk terminal', 'examples',
     '벌크 터미널에서 탱커 적재 (선박, 철도차량 또는 트럭)'),

    # ── 액면(정지·교반) ─────────────────────────────────────────────────────
    ('Manual stirring in paint can', 'examples', '도료 캔 내 수동 교반'),
    ('Mechanical mixing in paint can', 'examples', '도료 캔 내 기계적 혼합'),
    ('Storage of laboratory samples', 'examples', '실험실 시료 보관'),
    ('Bath with ultrasonic cleaning', 'examples', '초음파 세척조'),
    ('Mechanical mixing very small amounts in e.g. laboratory', 'examples',
     '극소량 기계적 혼합 (예: 실험실)'),

    # ── 액체 도포 ───────────────────────────────────────────────────────────
    ('Degreasing machines', 'examples', '기계 탈지'),
    ('Gluing e.g. shoe soles', 'examples', '접착 (예: 신발 밑창)'),
    ('Gluing stickers and labels', 'examples', '스티커·라벨 접착'),
    ('Removing (large) graffiti', 'examples', '(대형) 낙서 제거'),
    ('Painting of walls or ships', 'examples', '벽체 또는 선박 도장'),
    ('Painting of casings using a roller or brush', 'examples',
     '롤러 또는 붓으로 케이싱 도장'),
    ('Small scale spreading e.g. in laboratory', 'examples',
     '소규모 도포 (예: 실험실)'),
    ('Degreasing or cleaning small machines/tools', 'examples',
     '소형 기계·공구 탈지 또는 세정'),
    ('Spot degreasing (small objects like knifes)', 'examples',
     '부분 탈지 (칼 같은 소형 물체)'),
    ('Cleaning valves / machinery / equipment with wipe', 'examples',
     '걸레로 밸브·기계·장비 세정'),

    # ── 액체 분무 ───────────────────────────────────────────────────────────
    ('Paint spraying of e.g. ships', 'examples', '도료 분무 (예: 선박)'),
    ('Spot spraying using e.g. controlled droplet application', 'examples',
     '부분 분무 (예: 액적 제어 살포)'),

    # ── 고속 공정 ───────────────────────────────────────────────────────────
    ('Rotating pipes in oil drilling', 'examples', '석유 시추 중 회전 파이프'),
    ('Rotating press during printing', 'examples', '인쇄 중 회전 프레스'),
    ('Application of metal working fluids in machining large work pieces',
     'examples', '대형 가공물 기계가공 시 금속가공유 적용'),
    ('Application of MWF in machining of small scale work pieces', 'examples',
     '소형 가공물 기계가공 시 금속가공유(MWF) 적용 (예: < 10 kg)'),

    # ── 오염된 물체 취급·충격 ───────────────────────────────────────────────
    ('Hammering on contaminated objects', 'examples', '오염된 물체 해머 작업'),
    ('Drums coming out of a cleaning machine', 'examples', '세척기에서 나오는 드럼'),
    ('Impaction on drums coming out of a cleaning machine', 'examples',
     '세척기에서 나오는 드럼에 대한 충격'),
    ('Impaction on limited contaminated drums or transfer line', 'examples',
     '오염이 적은 드럼 또는 이송 배관에 대한 충격'),
    ('Impaction on objects after closed filling operations', 'examples',
     '밀폐 충전 작업 후 물체에 대한 충격'),
    ('Packaging of objects after closed filling operations', 'examples',
     '밀폐 충전 작업 후 물체 포장'),
    ('Transport of contaminated wooden objects', 'examples', '오염된 목재 물체 운반'),
    ('Handling large treated and drying objects', 'examples',
     '처리 후 건조 중인 대형 물체 취급'),
    ('Handling small treated and drying objects', 'examples',
     '처리 후 건조 중인 소형 물체 취급'),
    ('Handling of slightly contaminated glass bottles or plastic kegs', 'examples',
     '경미하게 오염된 유리병 또는 플라스틱 통 취급'),
    ('Handling small tools in laboratory (e.g. pipettes)', 'examples',
     '실험실 소형 기구 취급 (예: 피펫)'),
    ('Carrying contaminated bags, changing contaminated filters', 'examples',
     '오염된 자루 운반, 오염된 필터 교체'),

    # ── 표면 오염 청소 ──────────────────────────────────────────────────────
    ('Using brush and dustpan to clean up small spills', 'examples',
     '빗자루와 쓰레받기로 소량 유출물 청소'),
    ('Cleaning floors (sweeping) covered with fugitive dust', 'examples',
     '비산 분진이 덮인 바닥 청소(쓸기)'),
    ('Cleaning large heaps of dust or debris (after demolition)', 'examples',
     '대량의 분진·잔재 청소 (해체 작업 후)'),
    ('Cleaning heavily contaminated floors', 'examples',
     '심하게 오염된 바닥 청소 (예: 자루 포장이나 마모 같은 분진 발생 작업 후)'),

    # ── 연마 블라스팅 ───────────────────────────────────────────────────────
    ('Blasting of e.g. car bodies, trailer frames.', 'examples',
     '블라스팅 (예: 차체, 트레일러 프레임)'),
    ('Blast cleaning of small statues, bicycle frame parts.', 'examples',
     '소형 조형물·자전거 프레임 부품 블라스팅 세정'),
    ('Small-scale abrasive blasting process in e.g. medical aids', 'examples',
     '소규모 연마 블라스팅 공정 (예: 의료보조기구, 블라스팅 면적 수 cm 정도)'),
]

apply_gaps.run(PAIRS)
