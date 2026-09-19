# Deploy — Cloudflare Workers

How the NM&P landing gets from git to a live URL, how to set up continuous
deploys, how to attach a domain later, and how to roll back.

> **Scope note.** Right now the site is a **static** build (`output: 'static'`),
> so it ships as an **assets-only Worker** — no server code. The lead endpoint
> (`/api/lead`, task 8) turns it into a script Worker later; the config changes
> that requires are flagged as `TODO(task 8)` in
> [`wrangler.jsonc`](../wrangler.jsonc). Application secrets (Telegram,
> Turnstile) belong to tasks 8–9 and are covered in `docs/telegram.md` /
> `docs/leads.md`, not here.

Worker name: **`nmp-landing`**. Production URL after the first deploy:
`https://nmp-landing.<your-subdomain>.workers.dev`.

---

## 0. Prerequisites (client, one-time)

1. Create a free **Cloudflare account**: https://dash.cloudflare.com/sign-up
2. Note your **Account ID**: Dashboard → Workers & Pages → the account ID is in
   the right-hand sidebar (also visible in the URL).
3. Authenticate `wrangler` locally, one of:
   - `npx wrangler login` (opens a browser, easiest for a manual deploy), or
   - create a scoped **API token** (needed for CI — see §3).

> Never paste tokens or passwords into the chat. Enter them yourself in the
> terminal or the Cloudflare / GitHub dashboards.

---

## 1. First deploy (manual, from your machine)

```bash
npm install
npx wrangler login   # once, if you haven't already
npm run deploy       # = astro build && wrangler deploy
```

`wrangler` reads [`wrangler.jsonc`](../wrangler.jsonc), uploads the contents of
`dist/client`, and prints the live `*.workers.dev` URL. Open it to confirm.

A dry run that validates the config and bundles nothing to the network:

```bash
npx wrangler deploy --dry-run
```

---

## 2. Continuous deploys

Pick **one** of the two options below. Do not enable both — they would each
deploy on every push and clobber one another.

### Option A — Cloudflare Workers Builds (recommended)

Git integration managed entirely in the Cloudflare dashboard; no secrets stored
in GitHub.

1. Dashboard → **Workers & Pages** → **Create** → **Workers** →
   **Connect to Git** (or, on an existing Worker: **Settings → Builds → Connect**).
2. Authorize GitHub and pick this repository.
3. Build settings:
   - **Build command:** `npm run build`
   - **Deploy command:** `npx wrangler deploy`
   - **Root directory:** `/`
   - **Production branch:** `main`
4. Enable **Preview URLs / non-production branch builds** so every branch and
   pull request gets its own preview deployment.
5. Save. From now on: merge to `main` → production deploy; push any other branch
   or open a PR → preview deploy with its own URL (posted back on the PR).

To disable the GitHub Actions fallback while using this option, keep the
`CLOUDFLARE_API_TOKEN` secret **unset** in GitHub — the workflow then no-ops.

### Option B — GitHub Actions (fallback)

Use this if the dashboard Git integration is unavailable. The workflow lives at
[`.github/workflows/deploy.yml`](../.github/workflows/deploy.yml): it deploys
production on pushes to `main` and uploads a **preview version** (its own
preview URL) for every other branch / PR. It stays inert until both secrets
below exist.

1. Create a scoped API token (§3).
2. GitHub → repo **Settings → Secrets and variables → Actions → New repository
   secret**, add:
   - `CLOUDFLARE_API_TOKEN` — the token from §3
   - `CLOUDFLARE_ACCOUNT_ID` — your account ID (§0)
3. Push a commit. The **Deploy to Cloudflare Workers** workflow runs.
4. For branch/PR preview URLs, enable **Preview URLs** on the Worker:
   dashboard → the Worker → **Settings → Domains & Routes / Preview URLs**.

---

## 3. Creating a scoped API token (for CI)

Dashboard → **My Profile → API Tokens → Create Token → Create Custom Token**:

- **Permissions:**
  - `Account` → `Workers Scripts` → **Edit**
  - `Account` → `Workers KV Storage` → **Edit** (needed once the script Worker
    lands in task 8)
  - `Account` → `Account Settings` → **Read**
- **Account Resources:** include → your account
- **TTL:** leave default or set an expiry

Create it, copy the value **once**, and store it as the `CLOUDFLARE_API_TOKEN`
GitHub secret. If it leaks, roll it from the same screen.

---

## 4. Local secrets vs. production secrets

- **Local dev:** copy `.dev.vars.example` → `.dev.vars` and fill values. This
  file is git-ignored; `wrangler dev` exposes it via `Astro.locals.runtime.env`.
- **Production:** application secrets are set per-Worker with
  `npx wrangler secret put <NAME>` (or dashboard → Worker → **Settings →
  Variables and Secrets**). The Telegram / Turnstile secrets themselves are set
  up in tasks 8–9 (`docs/telegram.md`); this doc only covers the deploy
  credentials.

`CLOUDFLARE_API_TOKEN` / `CLOUDFLARE_ACCOUNT_ID` are **CI** credentials — they
live in GitHub secrets (Option B) and are never needed by the Worker at
runtime.

---

## 5. Connecting a custom domain (later)

Do this once the client has chosen and added the domain to Cloudflare.

1. Add the domain as a zone in Cloudflare (Dashboard → **Add a site**) and point
   its nameservers as instructed.
2. Dashboard → the `nmp-landing` Worker → **Settings → Domains & Routes → Add →
   Custom Domain** → enter e.g. `nmp.example.com`. Cloudflare provisions the TLS
   certificate automatically.
3. Update `site` in [`astro.config.mjs`](../astro.config.mjs) (currently the
   `https://example.com` placeholder) to the real domain so canonical URLs and
   the sitemap are correct, then redeploy.

No `wrangler.jsonc` route entry is required when using the Custom Domain UI.

---

## 6. Rolling back a deploy

Every deploy creates a version. To roll back:

**Dashboard:** the Worker → **Deployments** → pick a previous version →
**Rollback**.

**CLI:**

```bash
npx wrangler deployments list          # find the target version id
npx wrangler rollback [<version-id>]   # omit id to roll back to the previous one
```

Rollback is instant and does not require a rebuild.

---

## 7. Troubleshooting

- **`Cannot use assets with a binding in an assets-only Worker`** — expected
  until task 8 adds a `main` script; the current `assets` block intentionally
  has no `binding`.
- **`assets.directory ... does not exist`** — run `npm run build` first;
  `dist/client` is generated by the build.
- **CI deploy skipped with a notice** — `CLOUDFLARE_API_TOKEN` is not set in
  GitHub secrets (see §2 Option B).
