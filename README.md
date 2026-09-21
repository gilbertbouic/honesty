# Honesty League

**Season 1** · a [Mkweli](https://mkweli.tech) product

**Play now:** [honesty.mkweli.tech](https://honesty.mkweli.tech) — testers can play now. **Month 1** scoring starts **1 October 2026, 09:00 Mauritius**, and runs to **31 October**. Then a new question each month.

Citizens, government workers, elected people, and UN staff answer the same monthly question **in public**. They get Honesty Points. If you say nothing, your chair stays empty. The three highest scores get a QR code that says *I scored as HONEST with Mkweli*.

| | |
|--|--|
| **Repository** | [github.com/gilbertbouic/honesty](https://github.com/gilbertbouic/honesty) |
| **Live site** | [honesty.mkweli.tech](https://honesty.mkweli.tech) |
| **Intended domain** | [honesty.mkweli.tech](https://honesty.mkweli.tech) |
| **Studio** | [mkweli.tech](https://mkweli.tech) |
| **License** | Not chosen yet. All rights reserved until a license is added. |

This is not the government. This is not the UN. Points show what you said. They are not a court case.

## Public ledger

Inspectable facts live in [`ledger/`](./ledger): seats, circuits, scoring, the live dilemma, and seeded glass houses. The GitHub Pages site in [`docs/`](./docs) reads those files.

## Run locally

```bash
npm install
npm run dev
```

The app listens on port 8080. The Pages site can also be opened as static files from `docs/`.

## Season 1 rules

- Testers can play now. **Month 1** scoring opens **1 October 2026, 9:00 in Mauritius**, and closes **31 October, 16:00**. A new question each month.
- Government and UN players pick the job they do (buying, permits, local partners, and the rest).
- Every answer is public.
- Points: a choice, a written why, a public multiply, extra if you are a supervisor or director.
- Honest mark: the three highest scores who sat down. Empty chairs get no QR.
