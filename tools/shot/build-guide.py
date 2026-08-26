# 설치 가이드 HTML 을 다시 만듭니다.
#
#   cd tools/shot && python build-guide.py
#
# 입력:  install-tpl.html      (본문 템플릿, {{파일명}} 자리에 이미지가 들어감)
#        screenshots/*.webp    (화면 캡처)
#        standalone-extra.css  (단독 파일 전용 CSS — 테마 버튼·인쇄)
#        ../../art-korean.user.js
#
# 출력:  ../../ART-한글판-설치가이드.html   단독 실행 파일 (브라우저로 바로 열림)
#        artifact-body.html                 아티팩트 게시용 조각 (head/body 없음)
#
# 두 출력의 차이는 감싸는 껍데기와 테마 버튼뿐이고 본문은 같습니다.

import base64
import html
import json
import os
import re

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '..', '..'))
SCRIPT = os.path.join(ROOT, 'art-korean.user.js')


def build():
    tpl = open(os.path.join(HERE, 'install-tpl.html'), encoding='utf-8').read()

    # ── 스크립트 원문을 페이지에 심습니다 ──────────────────────────────
    # '<' 를 < 로 바꿔야 소스 안의 문자열이 </script> 로 오인되지 않습니다.
    src = open(SCRIPT, encoding='utf-8').read()
    lines = src.split('\n')
    lit = json.dumps(src, ensure_ascii=False).replace('<', '\\u003c')

    # 치환문 안에 백슬래시-u 가 들어 있어서 re.sub 가 이스케이프로 오해합니다.
    # 람다로 넘기면 치환문을 그대로 씁니다.
    tpl = re.sub(r'const ART_SRC = ".*?";\n',
                 lambda m: 'const ART_SRC = ' + lit + ';\n', tpl, count=1, flags=re.S)

    # 파일 카드의 메타 정보도 실제 파일에 맞춰 갱신
    # 버전은 스크립트에서 읽습니다. 예전에는 v1.4.1 로 박아 두어, 본문은 최신인데
    # 화면 표기만 낡는 일이 있었습니다.
    ver = (re.search(r'@version\s+([\d.]+)', src) or [None, '?'])[1]
    tpl = re.sub(r'v\d+\.\d+\.\d+ &middot; [\d,]+줄 &middot; \d+ KB',
                 f'v{ver} &middot; {len(lines):,}줄 &middot; {len(src.encode("utf-8")) // 1024} KB',
                 tpl)
    # 설치 확인 절의 '스크립트 목록에 ART 한국어 1.4.1 이 …' 같은 안내 문구도 같이.
    tpl = re.sub(r'(ART 한국어 )\d+\.\d+\.\d+', lambda m: m.group(1) + ver, tpl)

    # ── 이미지 인라인 ────────────────────────────────────────────────
    def put(m):
        p = os.path.join(HERE, 'screenshots', m.group(1))
        return 'data:image/webp;base64,' + base64.b64encode(open(p, 'rb').read()).decode()

    body = re.sub(r'\{\{([^}]+)\}\}', put, tpl)
    assert '{{' not in body, '치환 못 한 이미지가 남았습니다'

    # ── 1) 아티팩트용 조각 ───────────────────────────────────────────
    art = os.path.join(HERE, 'artifact-body.html')
    open(art, 'w', encoding='utf-8').write(body)

    # ── 2) 단독 파일 ─────────────────────────────────────────────────
    extra = open(os.path.join(HERE, 'standalone-extra.css'), encoding='utf-8').read()
    solo = body.replace('</style>', extra + '</style>', 1)

    m = re.match(r'(?s)^(.*?</style>)\s*(.*)$', solo)
    head, rest = m.group(1), m.group(2)

    theme = '''
<button class="theme-btn" id="themeBtn" type="button"
        aria-label="밝게/어둡게 전환" title="밝게 / 어둡게">◐</button>
<script>
(function () {
  var b = document.getElementById('themeBtn');
  var root = document.documentElement;
  try {
    var saved = localStorage.getItem('art-guide-theme');
    if (saved) root.setAttribute('data-theme', saved);
  } catch (e) {}
  b.addEventListener('click', function () {
    var cur = root.getAttribute('data-theme');
    if (!cur) cur = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    var next = cur === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('art-guide-theme', next); } catch (e) {}
  });
})();
</script>
'''

    doc = ('<!doctype html>\n<html lang="ko">\n<head>\n'
           '<meta charset="utf-8">\n'
           '<meta name="viewport" content="width=device-width, initial-scale=1">\n'
           '<meta name="description" content="Advanced REACH Tool(ART) 한글판을 크롬에 '
           '설치하는 5단계 안내. 실제 화면 캡처와 스크립트 전문 포함.">\n'
           '<meta name="color-scheme" content="light dark">\n'
           + head + '\n</head>\n<body>\n'
           + rest.rstrip() + '\n' + theme + '\n</body>\n</html>\n')

    out = os.path.join(ROOT, 'ART-한글판-설치가이드.html')
    open(out, 'w', encoding='utf-8').write(doc)

    print(f'단독 파일   {out}  ({os.path.getsize(out) / 1024 / 1024:.2f} MB)')
    print(f'아티팩트용  {art}  ({os.path.getsize(art) / 1024 / 1024:.2f} MB)')
    print(f'심은 스크립트 {len(src):,}자 / 이미지 {body.count("data:image/webp")}장')


if __name__ == '__main__':
    build()
