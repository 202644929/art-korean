# 순회로 모은 화면 문구 중 아직 영어인 것을 골라냅니다.
#
# **화면에 보이는 글만** 봅니다. crawl_labels.json 에는 라디오의 값(rbLiquids)과
# 컨트롤 이름(ctl00$cphMain$...)도 같이 들어 있는데, 그것들은 서버로 가는
# 데이터라 번역 대상이 아닙니다 — 건드리면 이 프로젝트의 제1원칙이 깨집니다.
#
#   python audit_labels.py            요약
#   python audit_labels.py --mixed    한/영 섞인 문구 전부
#   python audit_labels.py --eng      영어만인 문구 전부

import json
import re
import sys

HAN = re.compile('[가-힣]')
LAT = re.compile('[A-Za-z]{3}')
DICT = '../art-ko-dict.json'

# 단위·기호는 번역하지 않기로 한 것들입니다 (인수인계서 정책).
UNIT = re.compile(r'^[\d.,\s%<>=+/()-]*(l/minute|ACH|m3|kg|mg|ppm|°C|µm|m2|m/s)?[\s\d.,<>=/-]*$',
                  re.I)


def texts(lab):
    """(문구, 어디서 왔는지) 목록."""
    out = []
    for key, v in lab.items():
        q = v.get('q') or {}
        for f in ('title',):
            if q.get(f):
                out.append((q[f], key + ' q.' + f))
        for f in ('legends', 'main', 'sect'):
            for s in q.get(f) or []:
                out.append((s, key + ' q.' + f))
        for nm, opts in (v.get('radios') or {}).items():
            for o in opts:
                if o.get('t'):
                    out.append((o['t'], key + ' radio ' + o.get('v', '')))
        for s in v.get('selects') or []:
            for o in s.get('opts') or []:
                t = o.get('t') or o.get('text')
                if t:
                    out.append((t, key + ' select ' + str(o.get('v', ''))))
    return out


def main():
    lab = json.load(open('crawl_labels.json', encoding='utf-8'))
    d = json.load(open(DICT, encoding='utf-8'))
    keys = set()
    for sec, m in d.items():
        if sec.startswith('_') or not isinstance(m, dict):
            continue
        keys |= set(m)

    seen = {}
    for t, where in texts(lab):
        t = ' '.join(str(t).split())
        if len(t) < 3:
            continue
        seen.setdefault(t, where)

    kor = [t for t in seen if HAN.search(t) and not LAT.search(t)]
    eng = sorted(t for t in seen if LAT.search(t) and not HAN.search(t))
    mix = sorted(t for t in seen if LAT.search(t) and HAN.search(t))
    other = [t for t in seen if t not in kor and t not in eng and t not in mix]

    print(f'화면 문구 {len(seen)}개')
    print(f'  한글만   {len(kor)}')
    print(f'  한/영 섞임 {len(mix)}')
    print(f'  영어만   {len(eng)}')
    print(f'  그 외(숫자·기호) {len(other)}')

    eng_unit = [t for t in eng if UNIT.match(t)]
    eng_real = [t for t in eng if t not in eng_unit]
    in_dict = [t for t in eng_real if t in keys]
    miss = [t for t in eng_real if t not in keys]

    print(f'\n영어만 {len(eng)} 중')
    print(f'  단위·숫자라 번역 안 함  {len(eng_unit)}')
    print(f'  사전에 있음(수집 시점 문제) {len(in_dict)}')
    print(f'  사전에 없음 — 진짜 구멍  {len(miss)}')
    for t in miss:
        print(f'      {t!r}   <- {seen[t]}')

    # 섞임: 영어 조각이 사전 키로 남아 있는지 봅니다.
    print(f'\n한/영 섞임 {len(mix)}개 중 영어 조각이 걱정되는 것:')
    sus = []
    for t in mix:
        # 괄호 안 화학식·약어·단위는 원래 그대로 둡니다.
        bare = re.sub(r'\([^)]*\)', '', t)
        words = re.findall(r'[A-Za-z][A-Za-z\'-]{2,}', bare)
        if words:
            sus.append((t, words))
    for t, w in sus:
        print(f'      {t!r}  <- 영어낱말 {w}')
    if not sus:
        print('      없습니다 (괄호 안 약어·화학식뿐).')

    if '--mixed' in sys.argv:
        print('\n--- 섞임 전체 ---')
        for t in mix:
            print(' ', t)
    if '--eng' in sys.argv:
        print('\n--- 영어만 전체 ---')
        for t in eng:
            print(' ', t)


if __name__ == '__main__':
    main()
