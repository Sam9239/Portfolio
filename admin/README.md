# Admin / Content Manager

This folder powers the `/admin` panel ([Decap CMS](https://decapcms.org)) so you
can edit your portfolio's details and projects in a friendly UI. Edits are
committed straight to this repo, and the live site rebuilds automatically.

**Admin URL:** https://sam9239.github.io/Portfolio/admin/

## What you can edit
- **Site Details** — name, role, hero text, email, phone, location, social links
  (saved to `content/site.json`, read live by every page).
- **About Page** — bio paragraphs and trait tags (`content/about.json`).
- **Projects** — title, description, image, tags, links (`content/projects/`).

## One-time login setup (required)

GitHub Pages is static, so logging in with GitHub needs a tiny free "broker".
Use the included Cloudflare Worker:

1. **GitHub OAuth App** — GitHub → Settings → Developer settings → OAuth Apps →
   *New OAuth App*:
   - Homepage URL: `https://sam9239.github.io/Portfolio/`
   - Callback URL: `https://YOUR-WORKER.workers.dev/callback`
   - Register, then **Generate a client secret**. Copy the Client ID + Secret.

2. **Cloudflare Worker** — [dash.cloudflare.com](https://dash.cloudflare.com) →
   Workers & Pages → Create → Worker. Paste
   [`cloudflare-oauth-worker.js`](cloudflare-oauth-worker.js) and deploy. Note the
   worker URL.

3. **Worker secrets** — Worker → Settings → Variables and Secrets, add two
   *secrets*: `OAUTH_CLIENT_ID` and `OAUTH_CLIENT_SECRET`.

4. **Point the CMS at the worker** — in [`config.yml`](config.yml) set
   `base_url` to your worker URL (replace `https://YOUR-WORKER.workers.dev`).

5. Visit `/admin/`, click **Login with GitHub**, and you're in.

> Full details are in the comments at the top of `cloudflare-oauth-worker.js`.

## Editing without the CMS
You can always edit `content/site.json` (and the HTML) directly and push —
the CMS is just a convenience layer on top of the same files.
