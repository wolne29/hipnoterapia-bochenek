# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Strona marketingowa hipnoterapeutki (hipnoterapiabochenek.pl) — statyczny HTML/CSS/JS bez frameworka ani bundlera. Projekt w fazie restrukturyzacji: migracja z dumpu live site do czysto utrzymywanej wersji.

## Development

Brak build systemu, package.json, lintingu ani testów. Serwowanie statyczne:

```bash
# Z katalogu src/
python -m http.server 8000
```

Playwright MCP dostępny do testowania w przeglądarce.

## Architecture

**Struktura plików:**
- `index.html` — strona główna (hero, usługi, galeria, video, o mnie, blog preview, FAQ, kontakt)
- `pages/` — podstrony (blog, oferta, umów wizytę, polityka prywatności, regulamin)
- `styles/tokens.css` — design tokens (kolory, spacing, typografia, breakpointy)
- `styles/main.css` — style komponentów (BEM naming)
- `scripts/main.js` — minimalne JS (toggle menu mobilnego)
- `assets/images/`, `assets/video/` — zasoby medialne

**Design system (tokens.css):**
- Brand color: `rgb(125, 135, 110)` (zielony)
- Breakpointy: Desktop 1200px, Tablet 768px, Mobile Large 480px, Mobile Small 320px
- Spacing scale: `--space-xs` do `--space-2xl`

## Conventions

- **CSS**: BEM (`.nav__menu`, `.service-card`), mobile-first, CSS custom properties
- **HTML**: semantyczny HTML5, atrybuty dostępności (`aria-label`, `aria-expanded`), lazy loading obrazków
- **JS**: vanilla, bez bibliotek zewnętrznych
- Nagłówek i stopka kopiowane identycznie na każdej podstronie
- Język treści: polski

## Work in Progress

Strony `oferta.html` i `umow-wizyte.html` mają placeholder — do uzupełnienia. `blog.html` wymaga listingu artykułów.
