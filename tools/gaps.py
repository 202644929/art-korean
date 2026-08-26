# 순회로 모은 문장(crawl_todo.json)에서 **사전에 아직 없는 것만** 뽑습니다.
#
# crawl.js 는 'DOM 에 남은 영어' 와 '페이지 전역 Descriptions 원본' 을 함께
# 모읍니다. 후자는 페이지 JS 데이터라 번역 여부와 무관하게 항상 영어입니다.
# 그래서 브라우저에 어떤 빌드가 깔려 있든 상관없이, 사전과 직접 비교해야
# 진짜 구멍이 나옵니다.
#
#   python gaps.py            > 요약 + gaps.json 생성
#   python gaps.py --by-page  화면별로 나눠 보기
import html
import io
import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
HERE = os.path.dirname(os.path.abspath(__file__))
DICT = os.path.join(ROOT, 'art-ko-dict.json')


def norm(s):
    return ' '.join(str(s).split())


# 단위만으로 된 문장은 번역 대상이 아닙니다.
# 기존 방침: 단위는 원문 유지 ('파쇄 10 - 100 gram/minute').
# 그래서 '< 0.1 l/minute' 같은 것은 번역할 것이 없습니다. 억지로 넣으면
# 원문과 같은 값이 사전에 쌓이고 lint 가 계속 경고합니다.
UNIT_WORDS = set((
    'l ml cl dl kg g mg ug ng m cm mm km nm um s sec second seconds min minute '
    'minutes h hr hour hours day days week weeks month months year years '
    'ppm ppb pa kpa mpa bar mbar psi ach rpm oc c f k m2 m3 gram grams kilogram '
    'kilograms litre litres liter liters tonne tonnes lb kw w mw v a '
    'mmhg torr atm hpa mbar db pas cp cst'
).split())
WORD_RE = re.compile(r'[A-Za-z]+')


def unit_only(s):
    words = WORD_RE.findall(s)
    return bool(words) and all(w.lower() in UNIT_WORDS for w in words)


def load(p, d=None):
    if not os.path.exists(p):
        return d
    with io.open(p, encoding='utf-8') as f:
        return json.load(f)


d = load(DICT, {})
flat = {}
for sec, kv in d.items():
    if sec == '_meta':
        continue
    for k, v in kv.items():
        flat.setdefault(norm(k), (sec, v))

todo = load(os.path.join(HERE, 'crawl_todo.json'), {}) or {}
screens = load(os.path.join(HERE, 'crawl_screens.json'), {}) or {}

# 문장 -> 어떤 화면/종류에서 나왔는지
where = {}
for url, kinds in screens.items():
    page = url.split('/')[-1]
    for kind, items in kinds.items():
        for s in items:
            where.setdefault(norm(s), set()).add(page + ':' + kind)

# HTML 이 섞인 설명은 DOM 에서 조각으로 쪼개집니다.
# 전역 Descriptions 값은 innerHTML 로 들어가므로 <br/>, <li> 마다 텍스트 노드가
# 따로 생깁니다. 사전 키도 그 조각 단위여야 실제 화면에서 매칭됩니다.
TAG = re.compile(r'<[^>]+>')


def fragments(s):
    # innerHTML 로 들어가므로 엔티티도 풀어야 실제 DOM 문자열과 같아집니다.
    # 예: 'volume between 30 and 1000 m&#179;' -> '... 1000 m³'
    s = html.unescape(s).replace(u' ', u' ')
    if '<' not in s:
        return [norm(s)]
    parts = TAG.split(s)
    return [norm(x) for x in parts if norm(x)]


units = {}
for raw in todo:
    for fr in fragments(raw):
        if len(fr) < 4:
            continue
        units[fr] = raw

# 다른 수집 문장의 '앞부분'인 것은 버립니다.
# 초기 pagelib 이 설명 textarea 를 80자로 잘라 기록해서, 잘린 조각이 그대로
# 구멍 목록에 올라왔습니다. 잘린 문장을 사전에 넣으면 부분 치환(14자 이상)에
# 걸려 '한국어 + 영어 꼬리' 가 화면에 나옵니다.
srt = sorted(units, key=len)
prefix_of = set()
for i, a in enumerate(srt):
    for b in srt[i + 1:]:
        if b.startswith(a) and b != a:
            prefix_of.add(a)
            break

gaps = {}
unit_dropped = 0
for n in units:
    if n in flat or n in prefix_of:
        continue
    if unit_only(n):
        unit_dropped += 1
        continue
    gaps[n] = ''

# 부분 문자열로 이미 덮이는지(긴 사전 키가 이 문장을 포함) — 참고용
covered_by = {}
long_keys = [k for k in flat if len(k) >= 14]
for g in list(gaps):
    for k in long_keys:
        if g != k and g in k:
            covered_by[g] = k
            break

out = os.path.join(HERE, 'gaps.json')
with io.open(out, 'w', encoding='utf-8') as f:
    json.dump(gaps, f, ensure_ascii=False, indent=1)

print('수집 %d개 -> 조각 %d개 / 사전 %d개 / 미번역 %d개'
      % (len(todo), len(units), len(flat), len(gaps)))
print('(긴 사전 키의 일부 %d개, 앞부분이라 버린 것 %d개, 단위뿐이라 버린 것 %d개)'
      % (len(covered_by), len(prefix_of), unit_dropped))
print('-> %s' % out)

if '--by-page' in sys.argv:
    per = {}
    for g in gaps:
        for w in sorted(where.get(g, ['?'])):
            per.setdefault(w.split(':')[0], []).append((w.split(':')[1], g))
    for page in sorted(per):
        print('\n== %s  (%d)' % (page, len(per[page])))
        for kind, g in per[page][:40]:
            print('   [%s] %s' % (kind, g[:150]))
elif '--list' in sys.argv:
    for g in sorted(gaps, key=len):
        tag = ','.join(sorted(where.get(g, ['?'])))[:60]
        print('%-4d %s\n       %s' % (len(g), g[:200], tag))
