# Honesty League

**Season 1** · a [Mkweli](https://mkweli.tech) product

Citizens, civil servants, elected officials, and UN-system staff answer the same weekly dilemma **in public** and score Honesty Points. Silence is an Empty Chair. The top three sitting houses receive a public QR that reads *I scored as HONEST with Mkweli*.

| | |
|--|--|
| **Repository** | Private until the product is complete |
| **Intended public site** | [honesty.mkweli.tech](https://honesty.mkweli.tech) |
| **Studio** | [mkweli.tech](https://mkweli.tech) |
| **License** | Not chosen yet. All rights reserved while private. |

Not an official government or United Nations service. Honesty Points are declared principle, not a finding of misconduct.

## Public ledger

Inspectable facts live in [`ledger/`](./ledger): seats, circuits, scoring, the live dilemma, and seeded glass houses.

## Run

```bash
npm install
npm run dev
```

The app listens on port 8080.

## Season 1 rules

- Four seats: Gallery, Service, Chamber, Mandate.
- Service and Mandate pick a circuit (procurement, licences, implementing partners, and the rest).
- Every published rule is public. There is no private booth.
- Honesty Points: declared rule, written reason, public-desk multiplier, band modifier.
- Honest mark: top three sitting houses. Empty Chairs do not receive a QR.
