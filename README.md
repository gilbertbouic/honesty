# Honesty League

**Season 1** · a [Mkweli](https://mkweli.tech) product

**Play now:** [honesty.mkweli.tech](https://honesty.mkweli.tech) (rehearsal until **Friday 25 September 2026, 09:00 Mauritius**)

Citizens, civil servants, elected officials, and UN-system staff answer the same weekly dilemma **in public** and score Honesty Points. Silence is an Empty Chair. The top three sitting houses receive a public QR that reads *I scored as HONEST with Mkweli*.

| | |
|--|--|
| **Repository** | [github.com/gilbertbouic/honesty](https://github.com/gilbertbouic/honesty) |
| **Live site** | [honesty.mkweli.tech](https://honesty.mkweli.tech) |
| **Intended domain** | [honesty.mkweli.tech](https://honesty.mkweli.tech) |
| **Studio** | [mkweli.tech](https://mkweli.tech) |
| **License** | Not chosen yet. All rights reserved until a license is added. |

Not an official government or United Nations service. Honesty Points are declared principle, not a finding of misconduct.

## Public ledger

Inspectable facts live in [`ledger/`](./ledger): seats, circuits, scoring, the live dilemma, and seeded glass houses. The GitHub Pages site in [`docs/`](./docs) reads those files.

## Run locally

```bash
npm install
npm run dev
```

The app listens on port 8080. The Pages site can also be opened as static files from `docs/`.

## Season 1 rules

- Public desk **opens Friday 25 September 2026, 09:00 Mauritius**. Week 1 closes Friday 2 October, 16:00 Mauritius.
- Service and Mandate pick a circuit (procurement, licences, implementing partners, and the rest).
- Every published rule is public. There is no private booth.
- Honesty Points: declared rule, written reason, public-desk multiplier, band modifier.
- Honest mark: top three sitting houses. Empty Chairs do not receive a QR.
