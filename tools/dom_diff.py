# -*- coding: utf-8 -*-
"""실제 로그인 화면에서 수집한 문자열을 사전과 대조합니다.

유저스크립트(art-korean.template.js)의 조회 규칙을 그대로 재현합니다:
  1) 원문 그대로 조회
  2) 실패하면 공백을 하나로 접어(NORM) 재조회
  3) 그래도 실패하면 14자 이상 키로 부분 치환(phraseSub)

사용법:
    python dom_diff.py collected.txt      # F12 스니펫 결과(줄바꿈 구분)
    python dom_diff.py collected.json     # Alt+E 내보내기(JSON 객체)

출력:
    art-dom-untranslated.json   전혀 안 걸린 문자열 (번역 채울 자리)
    art-dom-partial.json        일부만 치환되고 영어가 남은 문자열
    art-dom-nearmiss.json       대소문자/문장부호만 다른 문자열 (변형 키 추가 대상)
"""
import json, io, os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
PHRASE_MIN = 14

# ── 사전 로드 (build.py 와 동일한 평탄화) ──────────────────────────────────
data = json.load(io.open(os.path.join(ROOT, 'art-ko-dict.json'), encoding='utf-8'))
DICT = {}
for section, entries in data.items():
    if section == '_meta':
        continue
    DICT.update(entries)

NORM = {}
for k, v in DICT.items():
    NORM.setdefault(re.sub(r'\s+', ' ', k).strip(), v)

PHRASE_KEYS = sorted((k for k in DICT if len(k) >= PHRASE_MIN), key=len, reverse=True)

# 근사 조회용 인덱스. 유저스크립트는 대소문자와 문장부호를 그대로 구분하므로,
# 여기서 걸리는 항목은 "새 번역"이 아니라 "사전에 표기 변형 키를 하나 더 넣을"
# 경우입니다. 조회 규칙을 느슨하게 푸는 대신 사전에 변형을 추가하십시오
# (조회를 느슨하게 하면 오탐이 늘고 3.4절의 부분 치환 정책과 충돌합니다).
def loose(s):
    return re.sub(r'[\s\u00a0]+', ' ', s).strip().strip(' :.*\u00b7\uff1a').lower()

LOOSE = {}
for k, v in DICT.items():
    LOOSE.setdefault(loose(k), (k, v))


def lookup(s):
    key = s.strip()
    if not key:
        return None
    if key in DICT:
        return DICT[key]
    return NORM.get(re.sub(r'\s+', ' ', key))


def phrase_sub(raw):
    if len(raw) < PHRASE_MIN or len(raw) > 4000:
        return None
    out = raw
    for k in PHRASE_KEYS:
        if k in out:
            out = out.replace(k, DICT[k])
    return None if out == raw else out


# 남은 영어 (3자 이상 알파벳 덩어리). 단위·약어는 원문 유지가 정책이므로 제외.
UNITS = {'kg', 'ppm', 'ACH', 'RPE', 'ART', 'REACH', 'CAS', 'mg', 'min',
         'ml', 'cm', 'mm', 'kPa', 'vol', 'wt'}
ENGLISH = re.compile(r'[A-Za-z]{3,}')


def residual_english(s):
    return [w for w in ENGLISH.findall(s) if w not in UNITS]


# ── 입력 ──────────────────────────────────────────────────────────────────
if len(sys.argv) < 2:
    raise SystemExit(__doc__)
src = sys.argv[1]
text = io.open(src, encoding='utf-8-sig').read()

if src.lower().endswith('.json'):
    obj = json.loads(text)
    strings = list(obj.keys()) if isinstance(obj, dict) else list(obj)
else:
    strings = text.split('\n')

seen, items = set(), []
for s in strings:
    # PUA(Wingdings 불릿 등) 제거 — 눈에 안 보이면서 매칭을 깨뜨립니다.
    s = re.sub(r'[\ue000-\uf8ff]', '', s).strip()
    if len(s) <= 1 or not ENGLISH.search(s) or s in seen:
        continue
    seen.add(s)
    items.append(s)

# ── 대조 ──────────────────────────────────────────────────────────────────
exact, partial, near, miss = [], [], [], []
for s in items:
    if lookup(s) is not None:
        exact.append(s)
        continue
    lk = LOOSE.get(loose(s))
    if lk is not None:
        near.append((s, lk[0], lk[1]))
        continue
    sub = phrase_sub(s)
    if sub is not None and not residual_english(sub):
        exact.append(s)
    elif sub is not None:
        partial.append((s, sub))
    else:
        miss.append(s)

total = len(items)
print('수집 문자열 %d개 (중복 제거 후)' % total)
print('  완전 번역   %4d  (%.1f%%)' % (len(exact), 100.0 * len(exact) / total if total else 0))
print('  부분 번역   %4d   <- 영어가 남음' % len(partial))
print('  표기 차이   %4d   <- 사전에 변형 키만 추가하면 됨' % len(near))
print('  미번역      %4d' % len(miss))

# 긴 것부터: 질문문·도움말이 먼저 오도록
miss.sort(key=lambda s: (-len(s), s))
partial.sort(key=lambda p: (-len(p[0]), p[0]))

def dump(name, obj):
    p = os.path.join(HERE, name)
    io.open(p, 'w', encoding='utf-8', newline='\n').write(
        json.dumps(obj, ensure_ascii=False, indent=2))
    return p

p1 = dump('art-dom-untranslated.json', {s: '' for s in miss})
p2 = dump('art-dom-partial.json', dict(partial))
p3 = dump('art-dom-nearmiss.json',
          [{'dom': d, 'dict_key': k, 'ko': v} for d, k, v in near])
print('\n  -> %s\n  -> %s\n  -> %s' % (p1, p2, p3))

if near:
    print('\n표기 차이 (사전 키 <- 실제 화면):')
    for d, k, v in near[:10]:
        print('  %r\n    <- %r' % (k, d))

if miss:
    print('\n미번역 상위 15개:')
    for s in miss[:15]:
        print('  %s' % (s[:110] + ('...' if len(s) > 110 else '')))
