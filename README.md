# Illuminathon 2026 — strona wydarzenia

Statyczna strona wydarzenia **Illuminathon 2026: Światło na Gdynię** (24-godzinny hackathon, PPNT Gdynia, 23–24.10.2026) + zakładka **0h Game Jam w trolejbusie**.

Czysty HTML + CSS + vanilla JS — **bez kroku budowania**. Każda osoba z dostępem do repo może poprawić tekst wprost w HTML.

## Struktura
- `index.html` — strona główna
- `game-jam/index.html` — zakładka 0h Game Jam
- `polityka-prywatnosci.html`
- `shared/` — wspólne: `tokens.css` (paleta, fonty), `poswiata.js` (poświata kursora), `lightbox.js`
- `assets/` — fonty lokalne (OFL), logo, zdjęcia (webp), mapa Gdyni (SVG, dane OpenStreetMap, ODbL)

## Podgląd lokalny
```
python -m http.server 8765
```
potem otwórz http://localhost:8765

## Przed publikacją na hs3.pl (checklista go-live)
- [ ] zdjąć `<meta name="robots" content="noindex">` z `index.html` (jest na czas podglądu)
- [ ] podmienić `<link rel="canonical">` i `og:image` na docelowy adres hs3.pl
- [ ] domknąć sprawę logotypów (patrz niżej)

## Logotypy partnerów
Widoczne: **Organizatorzy** (CODE:ME, Hackerspace Trójmiasto) oraz **Partnerzy strategiczni** (Gdynia — logo 100-lecia miasta, PPNT, Uniwersytet Morski). Logotypy społeczności gamedev są **ukryte w kodzie przez atrybut `hidden`** — nic nie usunięto, wracają po zdjęciu `hidden`, gdy społeczności zatwierdzą swoje znaki.

## Prywatność
Strona nie ustawia ciasteczek, zero trackerów, zero zasobów z obcych domen (fonty i skrypty lokalne). Mapa Gdyni: dane OpenStreetMap (ODbL), atrybucja w stopce.
