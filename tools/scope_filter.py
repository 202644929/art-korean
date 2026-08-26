# -*- coding: utf-8 -*-
"""번역 범위 밖의 수집물을 걸러냅니다.

세 부류입니다.

1. **IIS / ASP.NET 진단 화면** — 'Server Error in', 'Version Information:',
   'Description:', 'Add a "Debug=true" directive', HTTP 404 안내 등.
   순회기가 시나리오를 미완성으로 남기거나 없는 URL 을 찔러서 나온 것으로,
   ART UI 가 아닙니다. 정상 사용자는 볼 일이 없습니다.

2. **학술 인용문헌** (`science.aspx`) — 저자 목록, 논문 제목, 학술지명.
   인용문헌은 원문 표기가 원칙입니다. 한국어로 옮기면 문헌을 찾을 수 없게 됩니다.
   (기존 결정과 같은 방침: 노출 데이터베이스 내용도 원문 유지)

3. **기술 식별자** (`cookie.aspx`) — 쿠키 이름(`ART.ASPXAUTH`,
   `ASP.NET_SessionId`), 세션 키. 번역하면 안 되는 값입니다.

걸러낸 것은 `crawl_outofscope.json` 에 남겨 둡니다 — 나중에 판단을 뒤집을 수
있게, 그리고 '조용히 줄이지 않았다' 는 기록으로.
"""
import io
import json
import re

BAD_TEXT = re.compile(
    r'Server Error in|unhandled exception|stack trace|Stack Trace|'
    r'Debug\s*=\s*"?true|<%@|<configuration|<system\.web|compilation debug|'
    r'Microsoft\.NET|ASP\.NET Version|Runtime Version|Exception Details|'
    r'Source Error|Source File:|debug mode|memory/performance overhead|'
    r'System\.(InvalidOperationException|Exception|Web)|@import|'
    r'Found invalid enabled activity|'
    r'^Version Information:$|^Description:$|'
    r'Add the following section to the configuration file|'
    r'The resource cannot be found|^HTTP 404\.|^Requested URL:|'
    r'^ART\.ASPXAUTH$|^ASP\.NET_SessionId$|^art_cookie$|^.eu_compliance.$',
    re.I)

# 하나하나 판단해 범위 밖으로 둔 것. 이유를 함께 적습니다.
EXPLICIT = {
    # CSV 열 이름입니다. 사용자가 파일에 그대로 적어야 하는 식별자라
    # 한국어로 바꾸면 업로드가 깨집니다. 설명문만 번역했습니다.
    'dataset': u'CSV 열 이름 (번역하면 업로드가 깨집니다)',
    'concentration': u'CSV 열 이름 (번역하면 업로드가 깨집니다)',
    'isnondetect': u'CSV 열 이름 (번역하면 업로드가 깨집니다)',
    'uncertaintyfactor': u'CSV 열 이름 (번역하면 업로드가 깨집니다)',
    'ratio': u'CSV 열 이름 (번역하면 업로드가 깨집니다)',
    'exposure': u'CSV 열 이름 (번역하면 업로드가 깨집니다)',
    'site': u'CSV 열 이름 (번역하면 업로드가 깨집니다)',
    'worker': u'CSV 열 이름 (번역하면 업로드가 깨집니다)',
    'NFA/NRCWE': u'기관 약어 (한국어 명칭은 로고 title 속성에 넣었습니다)',
    'Tuesday 24': u'달력 날짜 조각 — 뒤에 월 이름이 붙어 어순이 깨집니다',
    '/consortium.aspx': u'404 페이지가 표시한 요청 URL',
}

# 학술 인용문헌이 실린 화면. 이 화면의 본문 텍스트는 전부 범위 밖입니다.
CITATION_PAGES = ('science.aspx',)

# 노출 데이터베이스 레코드가 실린 화면. 측정 시나리오 이름·맥락 설명·프로젝트
# 참조번호는 **화면 UI 가 아니라 기술 자료**입니다. 원문 유지 결정(인계문서
# '범위 결정 — 노출 데이터베이스 내용은 원문 유지'):
#   1. 학술 인용문헌과 같은 성격
#   2. 활동 조합마다 다른 시나리오가 나와 끝이 없음
#   3. 번역하면 '내 시나리오와 유사한가' 판단을 왜곡할 위험
# 단, 그 화면의 **UI 문구**(버튼, 표 머리글, 안내문)는 번역 대상입니다.
# 그래서 화면 전체를 빼지 않고, 도움말 문서에 없는 = 데이터 레코드만 뺍니다.
EDB_PAGES = ('browseedb.aspx',)

TODO = 'crawl_todo.json'
SCREENS = 'crawl_screens.json'
OUT = 'crawl_outofscope.json'


def load(p, d):
    try:
        with io.open(p, encoding='utf-8') as f:
            return json.load(f)
    except IOError:
        return d


todo = load(TODO, {})
screens = load(SCREENS, {})
oos = load(OUT, {})

# 인용문헌 화면에서만 나오는 문장 모으기
from_cit = set()
elsewhere = set()
for url, kinds in screens.items():
    page = url.split('/')[-1]
    # 인용문헌 화면과 노출DB 화면은 '다른 곳' 집계에서 빼야 합니다.
    # 자기 자신이 '다른 곳' 에 들어가면 차집합이 항상 비게 됩니다.
    special = page in CITATION_PAGES or page in EDB_PAGES
    for kind, items in kinds.items():
        for s in items:
            n2 = ' '.join(s.split())
            if page in CITATION_PAGES:
                from_cit.add(n2)
            elif not special:
                elsewhere.add(n2)
cit_only = from_cit - elsewhere

# 노출DB 화면에서만 나오고, 그 화면의 도움말 문서에는 없는 문장 = 데이터 레코드
from_edb = set()
edb_help = set()
for url, kinds in screens.items():
    page = url.split('/')[-1]
    if page in EDB_PAGES:
        for kind, items in kinds.items():
            if kind == 'title':
                continue        # 화면 제목은 UI 입니다 (데이터 레코드가 아님)
            for s2 in items:
                from_edb.add(' '.join(s2.split()))
    elif 'pagehelp-browseedb' in page:
        for kind, items in kinds.items():
            for s2 in items:
                edb_help.add(' '.join(s2.split()))
edb_only = from_edb - elsewhere - edb_help

dropped = 0
for k in list(todo):
    n = ' '.join(k.split())
    why = None
    if n in EXPLICIT:
        why = EXPLICIT[n]
    elif BAD_TEXT.search(n):
        why = 'iis/aspnet 진단 화면'
    elif n in cit_only:
        why = '학술 인용문헌 (원문 표기 유지)'
    elif n in edb_only:
        why = '노출 데이터베이스 레코드 (원문 유지 — 유사성 판단 왜곡 방지)'
    if why:
        oos[n] = why
        del todo[k]
        dropped += 1

for url, kinds in screens.items():
    for kind, items in list(kinds.items()):
        keep = [s for s in items if ' '.join(s.split()) not in oos]
        if keep:
            kinds[kind] = keep
        else:
            del kinds[kind]

with io.open(TODO, 'w', encoding='utf-8') as f:
    json.dump(todo, f, ensure_ascii=False, indent=1)
with io.open(SCREENS, 'w', encoding='utf-8') as f:
    json.dump(screens, f, ensure_ascii=False, indent=1)
with io.open(OUT, 'w', encoding='utf-8') as f:
    json.dump(oos, f, ensure_ascii=False, indent=1)

print(u'범위 밖 %d개 제외 (누적 %d개) -> %s' % (dropped, len(oos), OUT))
print(u'남은 수집 문장 %d개' % len(todo))
