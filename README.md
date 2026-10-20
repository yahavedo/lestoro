# אותיות בסדר

A Hebrew word game in the style of [Letroso](https://letroso.com/). Find the secret word (up to 10 letters) with guesses of any length. Tile colors and shapes tell you which letters are in the word, which are in the right order, which sit next to each other, and how the word starts and ends.

- Daily word (the same for everyone) and an unlimited mode
- Right-to-left layout, Hebrew keyboard, final letters (ך ם ן ף ץ) handled automatically
- Hints reveal the word one letter at a time from the start
- Copyable emoji result for sharing

## Play

Open `index.html` in a browser. It is a single self-contained file.

## Build

The page is generated from `build/template.html` with the word lists packed in:

```sh
python3 build/build.py
```

This writes `index.html` (standalone) and `artifact.html` (the same page without a document skeleton, for publishing as a Claude artifact).

- `build/secrets.txt` — the secret words
- `build/extra.txt` — words added to both the guess dictionary and the secret words
- `build/valid.txt` — the guess dictionary
- `build/score.js` — the scorer, ported from Letroso's alignment algorithm

## Word list license

`build/valid.txt` comes from [Hspell](http://hspell.ivrix.org.il/) via [eyaler/hebrew_wordlists](https://github.com/eyaler/hebrew_wordlists). Hspell and the word lists generated from it are released under the GNU AGPL v3.
