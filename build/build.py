"""Builds the game page: packs the word lists into template.html.

Usage: python3 build/build.py
Writes artifact.html (no document skeleton, for publishing) and index.html (standalone, open locally).
"""
import json
import pathlib
import random
import re

HERE = pathlib.Path(__file__).parent
ROOT = HERE.parent
FINALS = str.maketrans('ךםןףץ', 'כמנפצ')
LETTERS = 'אבגדהוזחטיכלמנסעפצקרשת'
ENCODE = str.maketrans(LETTERS, 'abcdefghijklmnopqrstuv')
WORD = re.compile(r'^[א-ת]{2,10}$')


def read_words(name):
    words = []
    for line in (HERE / name).read_text(encoding='utf-8').split():
        if WORD.match(line):
            words.append(line.translate(FINALS))
    return words


extra = read_words('extra.txt')
valid = set(read_words('valid.txt')) | set(extra)

# Secret words grouped by length; the game picks a length first, then a word of that length.
secrets = {}
for w in read_words('secrets.txt') + extra:
    if len(w) < 4:  # too short to be a fun secret word; still a valid guess
        continue
    group = secrets.setdefault(len(w), [])
    if w not in group:
        group.append(w)
# Fixed order so every player gets the same daily word.
for n in sorted(secrets):
    random.Random(5786 + n).shuffle(secrets[n])
secrets = {n: secrets[n] for n in sorted(secrets)}

by_len = {}
for w in sorted(valid):
    by_len.setdefault(len(w), []).append(w.translate(ENCODE))
packed = {n: ''.join(ws) for n, ws in sorted(by_len.items())}

data = 'const DICT=' + json.dumps(packed) + ';\nconst SECRETS=' + json.dumps(secrets, ensure_ascii=False) + ';'
page = (HERE / 'template.html').read_text(encoding='utf-8')
scorer = (HERE / 'score.js').read_text(encoding='utf-8').replace(
    "if(typeof module!=='undefined')module.exports={score,norm};", '')
page = page.replace('/*@SCORER@*/', scorer).replace('/*@DATA@*/', data)

(ROOT / 'artifact.html').write_text(page, encoding='utf-8')
standalone = ('<!doctype html>\n<html lang="he" dir="rtl">\n<head>\n<meta charset="utf-8">\n'
              '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'
              '</head>\n<body>\n' + page + '\n</body>\n</html>\n')
(ROOT / 'index.html').write_text(standalone, encoding='utf-8')
print(f'{len(valid)} valid words, secret words by length: {({n: len(ws) for n, ws in secrets.items()})}, {len(page.encode()) // 1024} KB')
