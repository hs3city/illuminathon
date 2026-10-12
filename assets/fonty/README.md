# Fonty lokalne (self-hosted)

Zrodlo: Google Fonts (css2 API, pobrane 2026-10-11, UA Chrome 130), pliki woff2 subsety `latin` + `latin-ext` (polskie znaki). Strona nie laduje nic z googleapis/gstatic (RODO).

- Be Vietnam Pro: 300, 400, 500, 600, 700, 800 (normal) - `fonty.css`
- Jost: 300-900 (300,400,500,600,700,800,900) - `fonty.css`, `fonty-gamejam.css`
- JetBrains Mono: 400, 700 - `fonty.css`, `fonty-gamejam.css`

`fonty-gamejam.css` = tylko Jost + JetBrains Mono (zakladka Game Jam).
Licencja: SIL OFL 1.1 (`OFL.txt`).

Aktualizacja: pobierz css2 z `fonts.googleapis.com` z UA nowoczesnego Chrome, wez bloki `/* latin */` i `/* latin-ext */`, pobierz woff2 do `<rodzina>/<rodzina>-<waga>-<subset>.woff2`, przepisz `@font-face` ze sciezkami wzglednymi. `_test.html` sprawdza renderowanie.
