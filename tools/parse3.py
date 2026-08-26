# -*- coding: utf-8 -*-
"""Extract ART UI strings from the v1.5 mechanistic model report, Chapter 4.

Uses non-layout pdftotext output so table columns do not interleave with the
question text (see handover trap 3).
"""
import json, re, unicodedata

B1, B3 = chr(0xF0B7), chr(0xF0A7)
NOISE_LINE = re.compile(
    r'^\s*(TNO report \| V9009.*|\d+\s*/\s*374|Chapter 4: Workflow of mechanistic model)\s*$')
QHEAD   = re.compile(r'^Question ([0-9.]+):\s*(.*)$')
SECHEAD = re.compile(r'^4(\.\d+)+\s+\S')

# Where an Answer block stops and table/figure material begins.
TABLE_CUT = re.compile(
    r'(Guidance text:|Descriptions? and assigned values|Classes and related exposure'
    r'|Exposure weights?\b|Assigned values?\b|Classification\b|Examples?\b'
    r'|Description\b|Table \d|Figure \d|Example activities)')
EXAMPLES_RE = re.compile(r'Example activities\s*(.*?)(?=(?:Classification|Description|'
                         r'Exposure weight|Assigned value|Table \d|Question |$))', re.S)

NOTE = re.compile(r'\[(?!Warning text)[^\]]*\]')
DESC_START = re.compile(
    r'\s+(?=(?:This (?:category|class|includes|also|is|applies|option|process)|'
    r'These |Note that|For example|Includes |A safe work line|Booth sizes))')

def norm(s):
    s = unicodedata.normalize('NFKC', s)
    for a, b in (('‘', "'"), ('’', "'"), ('“', '"'), ('”', '"'),
                 ('–', '-'), ('—', '-'), ('−', '-'), ('\xa0', ' ')):
        s = s.replace(a, b)
    return s

TRAIL_BLEED = re.compile(
    r'\s+(?:Dispersion category(?:\s+Indoors)?|Classes? and (?:related )?exposure weights?.*'
    r'|Exposure weights?\b.*|Assigned values?\b.*|Classification\b.*|Examples?\b.*'
    r'|Metal|Stone|Wood|Glass|Plastic|Leather|Textile fabrics)\s*$')

def clean(s, is_option=False):
    s = norm(s)
    s = re.sub(r'->.*$', '', s)                        # any branch/flow annotation
    s = re.sub(r'\(clarifying text:.*$', '', s, flags=re.I)
    s = NOTE.sub('', s)
    s = re.sub(r'\s+', ' ', s).strip()
    if is_option:
        s = DESC_START.split(s)[0].strip()
        if len(s) > 90 and '. ' in s:
            g = s.replace('e.g.', 'e\x00g\x00').replace('i.e.', 'i\x00e\x00')
            g = g.split('. ')[0]
            s = g.replace('e\x00g\x00', 'e.g.').replace('i\x00e\x00', 'i.e.').strip()
        s = TRAIL_BLEED.sub('', s)
        if s.count('(') > s.count(')'):                # trailing '(e.g' from a hard wrap
            s = s[:s.rfind('(')].strip()
    return s.strip(' \t.;:,')

def has_words(s):
    """Reject pure numeric/unit fragments - nothing there to translate."""
    return bool(re.search(r'[A-Za-z]{3}', re.sub(r'\b(kg|l|m2|m3|oC|ACH|gram|hour|minute)\b',
                                                 '', s, flags=re.I)))

def split_options(text):
    """Split an Answer body across the four nesting markers.

    'o ' and '- ' only count as markers when followed by a capital letter, so
    numeric ranges such as '0.1 - 1 kg/minute' stay intact.
    """
    text = re.sub(r'(?<=[\s' + B1 + B3 + r'])o\s+(?=[A-Z(])', B3 + ' ', text)
    text = re.sub(r'(?<=[\s' + B1 + B3 + r'])-\s+(?=[A-Z(])', B3 + ' ', text)
    parts = re.split('[' + B1 + B3 + ']', text)
    return parts[1:] if len(parts) > 1 else []

raw = [l.rstrip() for l in open('ch4_raw.txt', encoding='utf-8')]
lines = [l for l in raw if not NOISE_LINE.match(l)]
_j = re.sub(r'(?<=\S) (?=Question \d+(?:\.\d+)*:)', '\n', '\n'.join(lines))
lines = _j.split('\n')
lines = lines[next(i for i, l in enumerate(lines) if l.startswith('Question 0')):]

blocks, cur = [], None
for l in lines:
    if QHEAD.match(l):
        if cur: blocks.append(cur)
        cur = [l]
    elif cur is not None:
        cur.append(l)
if cur: blocks.append(cur)

questions, options, warnings, examples = {}, {}, {}, {}

for blk in blocks:
    m = QHEAD.match(blk[0])
    qno = m.group(1)
    body = norm(' '.join([m.group(2)] + [l for l in blk[1:] if not SECHEAD.match(l)]))

    for w in re.findall(r'\[Warning text:\s*(.*?)\]', body):
        w = clean(w.strip(' "\''))
        if w: warnings.setdefault(w, qno)
    for w in re.findall(r'Warning text if this option is selected:\s*"(.*?)"', body):
        w = clean(w)
        if w: warnings.setdefault(w, qno)
    body = re.sub(r'\[Warning text:[^\]]*\]', '', body)

    # Example-activity lists (shown alongside activity subclass pickers)
    for mm in EXAMPLES_RE.finditer(body):
        for seg in split_options(mm.group(1)):
            e = clean(seg, is_option=True)
            if e and 1 < len(e) <= 90 and has_words(e):
                examples.setdefault(e, qno)

    qpart, sep, rest = re.split(r'(Answers?:)', body, maxsplit=1) + ['', ''] \
        if not re.search(r'Answers?:', body) else re.split(r'Answers?:', body, maxsplit=1)[0:1] \
        + [''] + [re.split(r'Answers?:', body, maxsplit=1)[1]]
    qpart = re.split(r'Guidance text:', qpart)[0]
    # if the Answer: marker was missing, the option list and its tables run on
    # into the question text - cut at the first bullet and cap the length
    qpart = re.split('[' + B1 + B3 + ']', qpart)[0]
    q = clean(qpart)
    if len(q) > 400:
        q = ''
    if q and len(q) > 8 and ('?' in q or not rest):
        questions.setdefault(q, qno)

    # Some blocks carry no 'Answer:' marker; fall back to the bullet run in the body
    src = rest if rest.strip() else body
    if not rest.strip():
        i0 = min([p for p in (src.find(B1), src.find(B3)) if p >= 0] or [-1])
        src = src[i0:] if i0 >= 0 else ''
    apart = TABLE_CUT.split(src)[0] if src else ''
    for seg in split_options(apart):
        o = clean(seg, is_option=True)
        if o and 1 < len(o) <= 140 and has_words(o) and not o.startswith('Question '):
            options.setdefault(o, qno)

out = {
    '_meta': {
        'source': 'ART Mechanistic model report v1.5 (2013-01-18), Chapter 4 (pp. 177-370)',
        'extraction': 'pdftotext without -layout, to avoid table-column interleaving',
        'scope': 'UI questions, dropdown option labels, warning texts, example activities. '
                 'Guidance prose and numeric-only range labels excluded.',
        'counts': {'questions': len(questions), 'options': len(options),
                   'warnings': len(warnings), 'examples': len(examples)},
        'note': 'Keys are PDF-derived and may differ slightly from live DOM text; '
                'reconcile with the userscript collect mode (Alt+C).',
    },
    'questions': {k: '' for k in sorted(questions)},
    'options':   {k: '' for k in sorted(options)},
    'warnings':  {k: '' for k in sorted(warnings)},
    'examples':  {k: '' for k in sorted(examples)},
}
json.dump(out, open('art-ch4-strings.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
print('questions %d  options %d  warnings %d  examples %d'
      % (len(questions), len(options), len(warnings), len(examples)))
