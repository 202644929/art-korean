# -*- coding: utf-8 -*-
"""Flatten art-ko-dict.json into the userscript template.

Usage: python build.py [out.user.js]
"""
import json, sys, io

import os
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)          # dictionary and built script live one level up

def find(name):
    for d in (ROOT, HERE):
        p = os.path.join(d, name)
        if os.path.exists(p):
            return p
    raise SystemExit('not found: ' + name)

DICT_PATH = find('art-ko-dict.json')
TPL_PATH  = find('art-korean.template.js')
OUT_PATH  = sys.argv[1] if len(sys.argv) > 1 else os.path.join(ROOT, 'art-korean.user.js')

data = json.load(io.open(DICT_PATH, encoding='utf-8'))
flat, origin, conflicts = {}, {}, []
for section, entries in data.items():
    if section == '_meta':
        continue
    for en, ko in entries.items():
        if en in flat and flat[en] != ko:
            conflicts.append((en, origin[en], flat[en], section, ko))
        flat[en] = ko
        origin[en] = section

if conflicts:
    print('CONFLICTING TRANSLATIONS:')
    for en, s1, v1, s2, v2 in conflicts:
        print('  %r\n    %s -> %r\n    %s -> %r' % (en, s1, v1, s2, v2))
    sys.exit(1)

empty = [k for k, v in flat.items() if not str(v).strip()]
if empty:
    print('EMPTY TRANSLATIONS (%d):' % len(empty))
    for k in empty[:20]:
        print('  ', k)
    sys.exit(1)

# longest keys first so phrase substitution prefers the most specific match
blob = json.dumps({k: flat[k] for k in sorted(flat, key=lambda s: (-len(s), s))},
                  ensure_ascii=False, indent=4)
blob = '\n'.join(('  ' + l) if i else l for i, l in enumerate(blob.split('\n')))

tpl = io.open(TPL_PATH, encoding='utf-8').read()
assert '/*__DICT__*/' in tpl, 'template placeholder missing'
io.open(OUT_PATH, 'w', encoding='utf-8', newline='\n').write(
    tpl.replace('/*__DICT__*/', blob))
print('built %s  (%d entries)' % (OUT_PATH, len(flat)))
