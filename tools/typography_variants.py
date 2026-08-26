# -*- coding: utf-8 -*-
"""활자(문자) 변형 키를 사전에 덧붙입니다.

4장 PDF 를 pdftotext 로 뽑으면 도(°) 기호가 문자 'o' 로 뭉개지고 엔대시(–)가
하이픈(-)으로 떨어집니다. 실제 사이트는 원래 문자를 씁니다:

    사전 : Room temperature (15 - 25 oC)
    화면 : Room temperature (15 – 25 ºC)

한 글자 차이로 매칭이 통째로 실패합니다. 조회 규칙을 느슨하게 푸는 대신
(3.4절 부분 치환 정책과 충돌) 같은 번역을 가진 변형 키를 미리 넣습니다.

    python typography_variants.py --dry
    python typography_variants.py
"""
import json, io, re, sys, collections, itertools

# 숫자 범위의 대시만 바꿉니다. 단어 내부 하이픈(non-intrusive, REACH-related)까지
# 건드리면 절대 나타나지 않을 키가 수백 개 생기고, 14자 이상이면 부분 치환에
# 참여해 오탐 위험까지 늘어납니다.
DASH_FORMS = ['-', '–']          # 하이픈 / 엔대시
DEG_FORMS = ['o', 'º', '°']    # oC / ºC / °C

# 앞뒤가 숫자 또는 공백인 대시만 대상
NUM_DASH = re.compile('(?<=[0-9 ])[-–—−](?=[0-9 ])')
DEG_RE = re.compile('[oº°]C')
# 사이트는 제곱/세제곱을 상단 첨자로 씁니다 (0.3 m² / 30 m³). PDF 추출본은 m2 / m3.
# 단어 안의 m2 까지 건드리지 않도록 앞뒤를 영문·숫자로 막습니다.
SUP_RE = re.compile(r'(?<![A-Za-z])m([23])(?![0-9A-Za-z])')
SUP_MAP = {'2': '²', '3': '³'}


def variants(key):
    has_dash = bool(NUM_DASH.search(key))
    has_deg = bool(DEG_RE.search(key))
    has_sup = bool(SUP_RE.search(key))
    if not (has_dash or has_deg or has_sup):
        return set()
    out = set()
    dash_opts = DASH_FORMS if has_dash else [None]
    deg_opts = DEG_FORMS if has_deg else [None]
    for d, g in itertools.product(dash_opts, deg_opts):
        v = key
        if d is not None:
            v = NUM_DASH.sub(d, v)
        if g is not None:
            v = DEG_RE.sub(g + 'C', v)
        out.add(v)
        if has_sup:
            out.add(SUP_RE.sub(lambda m: 'm' + SUP_MAP[m.group(1)], v))
    out.discard(key)
    return out


p = '../art-ko-dict.json'
d = json.load(io.open(p, encoding='utf-8'), object_pairs_hook=collections.OrderedDict)
existing = set()
for sec, e in d.items():
    if sec != '_meta':
        existing.update(e)

added = collections.OrderedDict()
for sec, e in list(d.items()):
    if sec == '_meta':
        continue
    for k, v in list(e.items()):
        for var in variants(k):
            if var not in existing and var not in added:
                added[var] = (sec, v, k)

print('추가 대상 %d개' % len(added))
for var, (sec, v, orig) in list(added.items())[:12]:
    print('  [%s] %s' % (sec, var[:100]))
if len(added) > 12:
    print('  ... 외 %d개' % (len(added) - 12))

if '--dry' in sys.argv:
    raise SystemExit(0)

for var, (sec, v, orig) in added.items():
    d[sec][var] = v
io.open(p, 'w', encoding='utf-8', newline='\n').write(
    json.dumps(d, ensure_ascii=False, indent=2) + '\n')
print('사전에 %d개 활자 변형 키 추가' % len(added))
