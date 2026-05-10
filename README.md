# skillingup

**Reskilling mit Persönlichkeit.**

Ein KI-gestütztes Fake-Door-Test-Tool, das Menschen nach Job-Displacement nicht einfach Kurse empfiehlt — sondern auf Basis von Persönlichkeit, Werten und Biografie herausfindet welcher Weg wirklich passt.

Gebaut als Fake Door Test um Nachfrage vor der vollständigen Produktentwicklung zu validieren.

## Flow

Hero → Beruf → Persönlichkeit (4 Fragen) → Werte (2 Fragen) → E-Mail Gate → KI-Ergebnis (3 Wege)

## Tech Stack

| Schicht | Technologie |
|---|---|
| Frontend | React 19 + Vite 5 + Framer Motion |
| Analyse | Claude API (claude-sonnet-4-6) |
| Backend | Express.js (`/api/submit`, `/admin`) |
| Analytics | Umami (self-hosted) |
| Fonts | Playfair Display + Inter (Google Fonts) |
| Deployment | Docker → Coolify |

## Lokales Setup

```bash
npm install
npm run dev
```

Für die KI-Analyse: `VITE_ANTHROPIC_API_KEY` in `.env.local` setzen:
```
VITE_ANTHROPIC_API_KEY=sk-ant-...
```

## Produktions-Deployment (Docker)

```bash
docker build -t skillingup .
docker run -p 3000:3000 \
  -e ANTHROPIC_API_KEY=sk-ant-... \
  -e ADMIN_PASSWORD=sicheres-passwort \
  -v skillingup-data:/data \
  skillingup
```

**Admin-Dashboard:** `https://skillingup.de/admin` (HTTP Basic Auth)

## Coolify

- Build Pack: **Dockerfile** (nicht Nixpacks)
- Port: `3000`
- ENV Variables: `ANTHROPIC_API_KEY`, `ADMIN_PASSWORD`
- Volume: `/data` für persistente E-Mail-Speicherung

## Struktur

```
src/
  App.jsx        – Hauptkomponente (6-Step-Wizard)
  App.css        – BEM-ähnliches CSS mit su- Prefix
  i18n.js        – DE/EN Übersetzungen
  main.jsx       – React Entry Point
server.js        – Express Backend (API + Admin + Static)
Dockerfile       – Multi-Stage Build (node:22-alpine)
```

## DSGVO

Datenspeicherung ausschließlich auf eigenem Server. Keine externen Formulardienste.
Datenschutzerklärung über Footer-Link erreichbar.

---

skillingup.de · von Carolin & Flavius Kehr
