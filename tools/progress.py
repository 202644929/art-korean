# 돌고 있는 자동화의 진행률을 막대바로 보여줍니다.
#
#   python progress.py                  한 번 찍고 끝
#   python progress.py --watch          2초마다 갱신 (Ctrl+C 로 종료)
#   python progress.py labels_ctx7.log  다른 기록 파일 지정
#
# crawl.js 는 "### 12/150", labels.js 는 "[70/178]", probe_all.js 는 "### 3"
# 형태로 찍습니다. 셋 다 알아봅니다.

import os
import re
import sys
import time

DEFAULT_LOGS = ['labels_ctx7.log', 'crawl_ctx7b.log', 'crawl_ctx7.log', 'probe_ctx7.log']
BAR_W = 42

PATTERNS = [
    re.compile(r'\[(\d+)/(\d+)\]'),        # labels.js
    re.compile(r'###\s+(\d+)/(\d+)'),      # crawl.js
]


def read(path):
    """기록 파일에서 (현재, 전체, 마지막줄) 을 뽑습니다."""
    try:
        with open(path, encoding='utf-8', errors='replace') as f:
            txt = f.read()
    except OSError:
        return None
    cur = tot = 0
    for pat in PATTERNS:
        m = pat.findall(txt)
        if m:
            cur, tot = int(m[-1][0]), int(m[-1][1])
            break
    done = '=== 끝' in txt or '남은 갈래가 없습니다' in txt
    last = ''
    for line in reversed(txt.strip().split('\n')):
        if line.strip():
            last = line.strip()
            break
    return cur, tot, done, last


def bar(cur, tot, started, done):
    if tot <= 0:
        return '진행률을 아직 못 읽었습니다.'
    frac = min(cur / tot, 1.0)
    filled = round(BAR_W * frac)
    b = '█' * filled + '·' * (BAR_W - filled)

    el = time.time() - started if started else 0
    if cur > 0 and el > 0 and not done:
        per = el / cur
        left = per * (tot - cur)
        eta = f'  남은 시간 약 {int(left // 60)}분 {int(left % 60):02d}초'
        spd = f'  ({per:.1f}초/개)'
    else:
        eta = '  완료' if done else ''
        spd = ''
    return f'[{b}] {frac * 100:5.1f}%  {cur}/{tot}{eta}{spd}'


def pick_log(argv):
    given = [a for a in argv[1:] if not a.startswith('--')]
    if given:
        return given[0]
    best, best_m = None, -1
    for f in DEFAULT_LOGS:
        if os.path.exists(f):
            m = os.path.getmtime(f)
            if m > best_m:
                best, best_m = f, m
    return best


def main():
    log = pick_log(sys.argv)
    if not log or not os.path.exists(log):
        print('기록 파일을 못 찾았습니다. 파일 이름을 인자로 주십시오.')
        return
    watch = '--watch' in sys.argv
    started = os.path.getmtime(log) - 0  # 파일이 처음 만들어진 뒤로 흐른 시간의 근사
    try:
        started = os.path.getctime(log)
    except OSError:
        pass

    while True:
        r = read(log)
        if r is None:
            print('기록 파일을 읽지 못했습니다.')
            return
        cur, tot, done, last = r
        line = bar(cur, tot, started, done)
        if watch:
            sys.stdout.write('\r\033[K' + line)
            sys.stdout.flush()
            if done:
                print('\n' + last)
                return
            time.sleep(2)
        else:
            print(f'{log}')
            print(line)
            print(f'지금: {last[:90]}')
            return


if __name__ == '__main__':
    main()
