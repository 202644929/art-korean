# -*- coding: utf-8 -*-
"""영국식/미국식 철자 변형 키를 사전에 자동으로 덧붙입니다.

4장 PDF 는 미국식(-ize, -yze)을 쓰는 곳이 있는데 실제 사이트는 영국식(-ise, -yse)을
씁니다. 철자 하나 차이로 매칭이 통째로 실패하므로, 번역이 같은 변형 키를 미리
넣어 둡니다. 조회 규칙은 건드리지 않습니다(3.4절 부분 치환 정책과 충돌하므로).

    python spelling_variants.py --dry     무엇이 추가될지만 출력
    python spelling_variants.py           실제로 사전에 추가
"""
import json, io, re, sys, collections

# -ize 계열이지만 어간이 짧지 않아 규칙에 걸려드는 예외
STOP = {'capsize', 'capsized', 'capsizes', 'capsizing'}

RULES = [
    # (찾을 패턴, 바꿀 형태)  — 어간 4자 이상만 (size/prize/seize 등 오탐 방지)
    (re.compile(r'\b(\w{4,})ization\b'), r'\1isation'),
    (re.compile(r'\b(\w{4,})izations\b'), r'\1isations'),
    (re.compile(r'\b(\w{4,})ize\b'), r'\1ise'),
    (re.compile(r'\b(\w{4,})ized\b'), r'\1ised'),
    (re.compile(r'\b(\w{4,})izes\b'), r'\1ises'),
    (re.compile(r'\b(\w{4,})izing\b'), r'\1ising'),
    (re.compile(r'\b(\w{3,})yze\b'), r'\1yse'),
    (re.compile(r'\b(\w{3,})yzed\b'), r'\1ysed'),
    (re.compile(r'\b(\w{3,})yzing\b'), r'\1ysing'),
]
# -our / -or 는 four->for 같은 오탐이 있어 낱말을 지정합니다
WORDS = {
    'vapor': 'vapour', 'vapors': 'vapours',
    'color': 'colour', 'colors': 'colours',
    'behavior': 'behaviour', 'behaviors': 'behaviours',
    'odor': 'odour', 'odors': 'odours',
    'labor': 'labour', 'fiber': 'fibre', 'fibers': 'fibres',
    'meter': 'metre', 'meters': 'metres', 'liter': 'litre', 'liters': 'litres',
    'aluminum': 'aluminium', 'sulfur': 'sulphur', 'sulfuric': 'sulphuric',
}


def variants(key):
    """key 의 철자 변형들을 만들어 돌려줍니다(양방향)."""
    out = set()

    def apply(pats, s):
        got = s
        for pat, rep in pats:
            got = pat.sub(lambda m: (m.group(0) if m.group(0).lower() in STOP
                                     else pat.sub(rep, m.group(0))), got)
        return got

    # -ize -> -ise
    v = apply(RULES, key)
    if v != key:
        out.add(v)

    # -ise -> -ize (역방향)
    back = key
    for pat, rep in [(re.compile(r'\b(\w{4,})isation\b'), r'\1ization'),
                     (re.compile(r'\b(\w{4,})ise\b'), r'\1ize'),
                     (re.compile(r'\b(\w{4,})ised\b'), r'\1ized'),
                     (re.compile(r'\b(\w{4,})ises\b'), r'\1izes'),
                     (re.compile(r'\b(\w{4,})ising\b'), r'\1izing'),
                     (re.compile(r'\b(\w{3,})yse\b'), r'\1yze'),
                     (re.compile(r'\b(\w{3,})ysed\b'), r'\1yzed')]:
        back = pat.sub(rep, back)
    if back != key:
        out.add(back)

    # 낱말 치환 (양방향)
    for a, b in list(WORDS.items()) + [(b, a) for a, b in WORDS.items()]:
        pat = re.compile(r'\b' + a + r'\b', re.I)
        if pat.search(key):
            # 원문의 첫 글자 대소문자를 유지합니다 ('Vapour' -> 'Vapor')
            def keep_case(m, rep=b):
                return rep.capitalize() if m.group(0)[:1].isupper() else rep
            out.add(pat.sub(keep_case, key))

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
for var, (sec, v, orig) in list(added.items())[:25]:
    print('  [%s] %s\n        (원래 키: %s)' % (sec, var[:95], orig[:70]))
if len(added) > 25:
    print('  ... 외 %d개' % (len(added) - 25))

if '--dry' in sys.argv:
    raise SystemExit(0)

for var, (sec, v, orig) in added.items():
    d[sec][var] = v
io.open(p, 'w', encoding='utf-8', newline='\n').write(
    json.dumps(d, ensure_ascii=False, indent=2) + '\n')
print('사전에 %d개 변형 키 추가' % len(added))
