# CLAUDE.md — NM&P landing

Guidance for any Claude Code session working on this repo. Read this and the
relevant task section of [`TASKS.md`](./TASKS.md) before starting. Work stays
within the assigned task — do not redesign or "improve" neighbouring sections.

## What this is

Marketing landing for the law bureau **Nataliia Mykhalchuk & Partners (NM&P)**,
lawyer Михальчук Наталія, Kyiv, consultations online across Ukraine. One landing
page plus service pages (privacy policy, 404, thank-you). The full 12-task plan
lives in `TASKS.md`.

## Fixed decisions (do not reopen)

- **Client / offer**: law bureau NM&P. First online consultation is free; full
  consultation and case handling are paid. **Prices are never shown.**
- **City**: Київ. **Office address is never published.** Consultations online.
- **Language**: UI is Ukrainian only, with i18n scaffolding from day one so a
  second locale is added without rework. **Chat with the client is in Russian;
  code comments and commits are in English; all UI text is Ukrainian.**
- **Practice areas**: військові, кримінальні, сімейні, цивільні, земельні.
  **Військові** is the hero focus, toggled by a single flag (`militaryFocus`).
- **Cases & reviews**: none at launch. Sections are designed but hidden behind
  flags (`showCases`, `showReviews`).
- **Lawyer photo**: placeholder (`showPhoto=false`); swap the file and flip the
  flag when a real photo arrives.
- **Design**: strict, dark with gold accent (ref: advokat-uzhgorod.com.ua).
  Palette via CSS variables so a rebrand is a one-place edit. Logo is text "NM&P"
  for now.
- **Ethics**: no promises of outcome ("гарантуємо виграш" and similar are
  forbidden) anywhere in copy.

## Stack

- **Astro** (static output) + **Tailwind CSS v4** (via `@tailwindcss/vite`) +
  **TypeScript** (strict).
- **@astrojs/cloudflare** adapter, **@astrojs/sitemap**. Hosting: Cloudflare
  Workers. One server endpoint `/api/lead` (added in task 8) opts out of
  prerendering; everything else is statically generated.
- Fonts self-hosted via `@fontsource-variable/*` (added in task 4).
- Package manager: **npm** (Node 24). **No CMS, no Railway, no Postgres** — a
  glob content loader is used; Payload is a separate phase only if ever needed.

## Commands

```bash
npm install        # install dependencies
npm run dev        # dev server on http://localhost:4321
npm run build      # production build into ./dist
npm run preview    # preview the production build
npm run check      # astro check (types + template diagnostics)
npm run deploy     # astro build && wrangler deploy (see docs/deploy.md — task 3)
```

Verify pages in the browser preview at **375 px** (mobile) and **1440 px**
(desktop) before handing a task back.

> npm note: this machine has a legacy root-owned `~/.npm` cache. If `npm install`
> fails with `EACCES`, either run `sudo chown -R $(id -u):$(id -g) ~/.npm` once,
> or pass `--cache <writable-dir>` to the install command.

## Folder structure

```
src/
  components/   # UI components (sections, primitives)
  layouts/      # Layout.astro — page shell (<head>, slots)
  pages/        # routes; index.astro is the landing; api/ holds endpoints
  i18n/         # ui.ts — string dictionary + locale helpers (task 2)
  config/       # site.ts — single source of truth for contacts & flags (task 2)
  content/      # services/ and faq/ content collections (task 2 schema)
  styles/       # global.css — Tailwind entry + design tokens (task 4)
  lib/          # helpers (contacts, tracking, etc.)
public/         # static assets served as-is (favicons, og image)
```

Key config files at the repo root: `astro.config.mjs`, `wrangler.jsonc`,
`tsconfig.json`, `.env.example`, `.dev.vars.example`.

## Where things live (once built out)

- **Contacts, section flags, brand strings**: `src/config/site.ts` (task 2).
- **All UI strings**: `src/i18n/ui.ts` — components must not hardcode Ukrainian
  text; every string goes through the dictionary.
- **Practice-area & FAQ content**: `src/content/<collection>/<locale>/*.md`.
- **Secrets**: never in git. `.env.example` and `.dev.vars.example` list the
  variable names; real values go in `.env`/`.dev.vars` locally and via
  `wrangler secret put` in production.

## Placeholder rule

Everything the client will replace later — phone, email, working hours,
messenger links, analytics IDs, certificate number, trust numbers, domain — is a
placeholder marked `// TODO(client)` and centralised in `src/config/site.ts` or
`.env`. Never invent facts (dates, case numbers, win rates). Trust numbers are
honest placeholders (e.g. "10+"), not fabricated percentages.

## Adding a second locale (i18n)

The site ships Ukrainian-only but is built to extend. To add e.g. `en`:

1. Add `'en'` to `locales` in `astro.config.mjs`.
2. Add an `en` key to the dictionary in `src/i18n/ui.ts`.
3. Add content folders `src/content/<collection>/en/`.

`prefixDefaultLocale: false` keeps Ukrainian at the root; the new locale is
served under its own prefix. Components read strings through the dictionary, so
no component changes are needed.

## Workflow rules (per `TASKS.md` §0.1)

1. Read `TASKS.md` and this file first; stay within the task's scope.
2. No new dependencies beyond those a task lists without justifying it in the
   report.
3. All interface strings go through i18n; no hardcoded Ukrainian in components.
4. Client-replaceable data lives in `src/config/site.ts` / `.env` as
   `// TODO(client)`.
5. Before handoff: `npm run check` and `npm run build` pass; page checked at
   375 px and 1440 px; report in chat what was done, what is needed from the
   client, and what was skipped and why.
6. Never deploy or publish without the client's explicit request.
