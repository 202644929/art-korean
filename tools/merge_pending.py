# -*- coding: utf-8 -*-
"""_pending_tr*.json 의 번역을 사전에 병합합니다.

키는 실제 DOM 문자열 전체이거나, 그 앞부분(접두사)일 수 있습니다. 접두사면
art-dom-untranslated.json 에서 전체 키를 찾아 치환합니다 — 긴 도움말 문단을
스크립트에 그대로 적어 넣다가 오타로 매칭이 깨지는 것을 막기 위함입니다.

    python merge_pending.py _pending_tr.json [...]
"""
import json, io, sys, collections, glob, os

miss = []
if os.path.exists('art-dom-untranslated.json'):
    miss = list(json.load(io.open('art-dom-untranslated.json', encoding='utf-8')))

p = '../art-ko-dict.json'
d = json.load(io.open(p, encoding='utf-8'), object_pairs_hook=collections.OrderedDict)

files = sys.argv[1:] or sorted(glob.glob('_pending_tr*.json'))
added, unresolved = 0, []
for f in files:
    pend = json.load(io.open(f, encoding='utf-8'))
    for sec, entries in pend.items():
        if sec.startswith('_'):
            continue
        for key, ko in entries.items():
            full = key
            if key not in miss:
                cand = [m for m in miss if m.startswith(key)]
                if len(cand) == 1:
                    full = cand[0]
                elif len(cand) > 1:
                    full = min(cand, key=len)
                    print('  주의: 접두사가 %d개와 일치, 가장 짧은 것 사용 — %s' % (len(cand), key[:60]))
                else:
                    # 접두사로 못 찾으면 키를 그대로 씁니다. 조용히 버리면 번역이
                    # 사라진 줄도 모르게 되므로, 추가하되 경고를 남깁니다.
                    unresolved.append((f, key))
            d.setdefault(sec, collections.OrderedDict())[full] = ko
            added += 1

io.open(p, 'w', encoding='utf-8', newline='\n').write(
    json.dumps(d, ensure_ascii=False, indent=2) + '\n')
print('병합 %d개' % added)
if unresolved:
    print('접두사 매칭 실패 %d개 (키 그대로 추가했습니다 — 실제 DOM 문자열과 일치하는지 확인하십시오):' % len(unresolved))
    for f, k in unresolved[:10]:
        print('  [%s] %s' % (f, k[:80]))
