# -*- coding: utf-8 -*-
"""Extract the 'Guidance text' help blocks from ART Ch.4 (v1.5 report).

The NF (4.4.x) and FF (4.16.x) halves of the chapter mirror each other, so the
blocks are deduplicated: only distinct help strings need translating.
"""
import io, json, re, unicodedata

NOISE = re.compile(r'^\s*(TNO report \| V9009.*|\d+\s*/\s*374|Chapter 4: Workflow of mechanistic model)\s*$')
QHEAD = re.compile(r'^Question ([0-9.]+):')
SEC   = re.compile(r'^4(\.\d+)+\s+\S')
NOTE  = re.compile(r'\[[^\]]*\]')

def norm(s):
    s = unicodedata.normalize('NFKC', s)
    for a, b in (('‘', "'"), ('’', "'"), ('“', '"'), ('”', '"'),
                 ('–', '-'), ('—', '-'), ('−', '-'), ('\xa0', ' ')):
        s = s.replace(a, b)
    return s

lines = [l.rstrip() for l in io.open('ch4_raw.txt', encoding='utf-8') if not NOISE.match(l.rstrip())]

blocks, cur_q, i = [], None, 0
while i < len(lines):
    m = QHEAD.match(lines[i])
    if m:
        cur_q = m.group(1)
    if 'Guidance text:' in lines[i]:
        buf = [lines[i].split('Guidance text:', 1)[1]]
        i += 1
        while i < len(lines):
            nx = lines[i]
            if QHEAD.match(nx) or SEC.match(nx) or 'Guidance text:' in nx:
                break
            # a table caption ends the guidance prose
            if re.match(r'^(Classification|Examples?|Description|Exposure weights?|'
                        r'Assigned values?|Table \d|Figure \d)\b', nx):
                break
            buf.append(nx)
            i += 1
        txt = norm(' '.join(buf))
        txt = NOTE.sub('', txt)
        # header text can land mid-line, so scrub it from the joined string too
        txt = re.sub(r'Chapter \d+: [A-Z][^.]*?(?=[A-Z][a-z]|$)', ' ', txt)
        txt = re.sub(r'CHAPTER \d+.*$', '', txt)
        # numeric conversion tables and leaked follow-up questions are not prose
        txt = re.split(r'Conversion table:|Maximum oC K|Question \d', txt)[0]
        txt = re.sub(r'\s*go to question [\d.]+\s*', ' ', txt, flags=re.I)
        txt = re.sub(r'\s+', ' ', txt).strip()
        if len(txt) > 20:
            blocks.append((cur_q, txt))
        continue
    i += 1

def final_clean(t):
    """Second pass over the collected blocks: drop anything that is authoring
    apparatus rather than on-screen help, then re-space."""
    t = re.sub(r'Chapter \d+: [A-Z][a-z]+[^.]*', ' ', t)
    t = re.sub(r'CHAPTER \d+.*$', '', t)
    t = re.split(r'Conversion table:|Maximum oC K|Question \d', t)[0]
    t = re.sub(r'(?i)\s*(->\s*)?go to (question|the relevant section)[^.]*', ' ', t)
    # list markers from the private-use area are structure, not prose
    # private-use codepoints are Wingdings list markers and mangled equation
    # glyphs - neither survives into real HTML, so drop the whole range
    t = ''.join(' ' if 0xE000 <= ord(c) <= 0xF8FF else c for c in t)
    t = re.sub(r'\s+', ' ', t)
    return t.strip(' 	.;:,-') + ('.' if t.strip().endswith('.') else '')

blocks = [(q, final_clean(t)) for q, t in blocks]
blocks = [(q, t) for q, t in blocks if len(t) > 20]

seen, uniq = {}, []
for q, t in blocks:
    if t in seen:
        seen[t].append(q)
        continue
    seen[t] = [q]
    uniq.append(t)

out = {
    '_meta': {
        'source': 'ART Mechanistic model report v1.5, Ch.4 - "Guidance text:" help blocks',
        'raw_blocks': len(blocks),
        'unique_blocks': len(uniq),
        'chars_unique': sum(len(t) for t in uniq),
        'note': 'question numbers each block appears under are in _where',
    },
    '_where': {t: seen[t] for t in uniq},
    'guidance': {t: '' for t in uniq},
}
json.dump(out, io.open('art-guidance.json', 'w', encoding='utf-8'),
          ensure_ascii=False, indent=2)
print('raw blocks    :', len(blocks))
print('unique blocks :', len(uniq))
print('unique chars  :', sum(len(t) for t in uniq))
print('dup saving    : %.0f%%' % (100 * (1 - len(uniq) / max(1, len(blocks)))))
