# NM&P — landing

Marketing landing for the law bureau **Nataliia Mykhalchuk & Partners (NM&P)**,
Kyiv — online legal help across Ukraine. Built with Astro + Tailwind CSS v4 on
Cloudflare Workers. UI is Ukrainian only, with i18n scaffolding for a future
second language.

## Requirements

- Node 24 and npm.

## Getting started

```bash
npm install
npm run dev      # http://localhost:4321
```

## Scripts

| Command           | What it does                                  |
| ----------------- | --------------------------------------------- |
| `npm run dev`     | Dev server on port 4321                       |
| `npm run build`   | Production build into `./dist`                |
| `npm run preview` | Preview the production build                  |
| `npm run check`   | `astro check` — types and template diagnostics |
| `npm run deploy`  | Build and deploy to Cloudflare (see task 3)    |

Environment variables are documented in `.env.example`; local Worker secrets in
`.dev.vars.example`. Copy each without the `.example` suffix and fill in values.

## Docs

- [`TASKS.md`](./TASKS.md) — the full task-by-task build plan.
- [`CLAUDE.md`](./CLAUDE.md) — project conventions, stack, folder map, and rules
  for contributors (human or AI).
