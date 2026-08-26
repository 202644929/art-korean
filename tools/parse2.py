# -*- coding: utf-8 -*-
"""Extract ART UI strings (questions + dropdown option labels) from the v1.5
mechanistic model report, Chapter 4. Uses non-layout pdftotext output so table
columns do not interleave with question text."""
import json, re, unicodedata

B1, B3 = '', ''          # level-1 and level-3 bullets
NOISE_LINE = re.compile(r'^\s*(TNO report \| V9009.*|\d+\s*/\s*374|Chapter 4: Workflow of mechanistic model)\s*$')
QHEAD  = re.compile(r'^Question ([0-9.]+):\s*(.*)$', re.S)
SECHEAD= re.compile(r'^4(\.\d+)+\s+\S')
# authoring notes / branch hints that never render in the UI
NOTE   = re.compile(r'\[(?!Warning text)[^\]]*\]')
GOTO   = re.compile(r'->\s*go to[^.•]*?(?=(?:\s*$)|(?=[.]))', re.I)
# phrases that begin an explanatory sentence appended after an option label
DESC_START = re.compile(
    r'\s+(?=(?:This (?:category|class|includes|also|is|applies|option)|'
    r'These |Note that|For example|E\.g\.|Includes |Examples?:))')

def norm(s):
    s = unicodedata.normalize('NFKC', s)
    for a, b in (('‘', "'"), ('’', "'"), ('“', '"'), ('”', '"'),
                 ('–', '-'), ('—', '-'), ('−', '-'), ('\xa0', ' ')):
        s = s.replace(a, b)
    return s

def clean(s, is_option=False):
    s = norm(s)
    s = GOTO.sub('', s)
    s = re.sub(r'->\s*go to.*$', '', s, flags=re.I)
    s = re.sub(r'->\s*separate dropdown list[^.]*', '', s, flags=re.I)
    s = NOTE.sub('', s)
    s = re.sub(r'\s+', ' ', s).strip()
    if is_option:
        s = DESC_START.split(s)[0].strip()
        # a trailing full sentence after the label is description, not label
        if len(s) > 90 and '. ' in s:
            s = s.split('. ')[0].strip()
    return s.strip(' \t.;:,-')

raw = [l.rstrip() for l in open('ch4_raw.txt', encoding='utf-8')]
lines = [l for l in raw if not NOISE_LINE.match(l)]

# Chapter 4 prose (incl. the "Remarks" bullet list) precedes Question 0 - skip it
start = next(i for i, l in enumerate(lines) if l.startswith('Question 0'))
lines = lines[start:]

# Rebuild logical blocks: a block starts at a Question heading and runs until the next one
blocks, cur = [], None
for l in lines:
    if QHEAD.match(l):
        if cur: blocks.append(cur)
        cur = [l]
    elif cur is not None:
        cur.append(l)
if cur: blocks.append(cur)

questions, options, warnings = {}, {}, {}

def split_options(text):
    """Split an Answer body into option labels across the 4 nesting levels."""
    # unify all four markers into one delimiter, recording depth
    text = re.sub(r'(?<=[\s•])o\s+', B3 + ' ', text)      # 'o ' level-2
    text = re.sub(r'(?<=[\s•])-\s+', B3 + ' ', text)      # '- ' level-4
    parts = re.split('[' + B1 + B3 + ']', text)
    return parts[1:] if len(parts) > 1 else []

for blk in blocks:
    m = QHEAD.match(blk[0])
    qno = m.group(1)
    body = ' '.join([m.group(2)] + [l for l in blk[1:] if not SECHEAD.match(l)])
    body = norm(body)

    # capture user-facing warning text before stripping notes
    for w in re.findall(r'\[Warning text:\s*(.*?)\]', body):
        w = clean(w.strip(' "\''))
        if w: warnings.setdefault(w, qno)
    body = re.sub(r'\[Warning text:[^\]]*\]', '', body)

    # question text = up to 'Answer:'
    qpart, _, rest = body.partition('Answer:')
    qpart = re.split(r'Guidance text:', qpart)[0]
    q = clean(qpart)
    if q and len(q) > 3 and '?' in q or (q and len(q) > 8 and not rest):
        questions.setdefault(q, qno)

    # answer body = up to 'Guidance text:' or a table caption
    apart = re.split(r'Guidance text:|Descriptions? and assigned values|'
                     r'Classes and related exposure weights', rest)[0]
    for seg in split_options(apart):
        o = clean(seg, is_option=True)
        if o and 1 < len(o) <= 140:
            options.setdefault(o, qno)

out = {
    '_meta': {
        'source': 'ART Mechanistic model report v1.5 (2013-01-18), Chapter 4 (pp. 177-370)',
        'extraction': 'pdftotext (no -layout) to avoid table-column interleaving',
        'scope': 'UI questions, dropdown option labels, warning texts. Guidance prose excluded.',
        'counts': {'questions': len(questions), 'options': len(options), 'warnings': len(warnings)},
        'note': 'Values are empty until translated. Keys are PDF-derived and may differ '
                'slightly from live DOM text; use the userscript collect mode (Alt+C) to reconcile.',
    },
    'questions': {k: '' for k in sorted(questions)},
    'options':   {k: '' for k in sorted(options)},
    'warnings':  {k: '' for k in sorted(warnings)},
}
json.dump(out, open('art-ch4-strings.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
print('questions:', len(questions), ' options:', len(options), ' warnings:', len(warnings))
