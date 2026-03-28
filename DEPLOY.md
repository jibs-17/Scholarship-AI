# Production deployment (do it all)

This guide walks through deploying ScholarShip AI so a **public link works end-to-end**: Next.js on Vercel (or similar), Convex production backend, and API keys in the right places.

---

## 1. Convex (backend)

1. Install the CLI if needed: `npm install` (project already includes `convex`).

2. Log in and deploy:

   ```bash
   npx convex login
   npx convex deploy
   ```

3. Note the **production deployment URL** shown after deploy (or open [Convex Dashboard](https://dashboard.convex.dev) → your project → **Settings**). You need the HTTP URL used by the client, e.g. `https://happy-animal-123.convex.cloud`.

4. **Server environment variables** (Convex runs your actions — keys go here, not only in Vercel):

   In the dashboard: **Settings → Environment Variables** (production deployment):

   | Name             | Required | Purpose                                      |
   | ---------------- | -------- | -------------------------------------------- |
   | `OPENAI_API_KEY` | Yes*     | Personalized scholarship matches             |
   | `EXA_API_KEY`    | No       | Extra web context for search (optional)      |

   \*Without `OPENAI_API_KEY`, the app still returns demo scholarships but not AI-personalized rows.

5. Redeploy after changing env vars if the dashboard prompts you, or run `npx convex deploy` again.

---

## 2. Vercel (frontend)

1. Push this repo to GitHub (or GitLab / Bitbucket).

2. Import the repo in [Vercel](https://vercel.com) → **Add New Project** → select the repo.

3. **Framework**: Next.js (auto-detected). **Build command**: `npm run build` (default). **Output**: default.

4. **Environment variables** (Vercel → Project → **Settings → Environment Variables**), for **Production** (and Preview if you want):

   | Name                     | Value                                                                 |
   | ------------------------ | --------------------------------------------------------------------- |
   | `NEXT_PUBLIC_CONVEX_URL` | Same production Convex URL as in step 1 (e.g. `https://….convex.cloud`) |
   | `NEXT_PUBLIC_SITE_URL`   | Optional: `https://your-project.vercel.app` or your custom domain     |

   On Vercel, `VERCEL_URL` is set automatically; the app uses `https://$VERCEL_URL` for metadata if `NEXT_PUBLIC_SITE_URL` is omitted.

5. Deploy. After the first deploy, open the **Vercel URL** and test search.

---

## 3. Verify

- [ ] Home page loads without “Backend not connected”.
- [ ] Search returns three cards (demo or AI, depending on keys).
- [ ] “Copy link to share” copies your public URL.
- [ ] `/apply?title=…&url=…` opens the apply form.

---

## 4. Custom domain (optional)

In Vercel → **Domains**, add your domain. Then set:

`NEXT_PUBLIC_SITE_URL=https://yourdomain.com`

Redeploy so Open Graph / canonical URLs match.

---

## 5. Troubleshooting

| Symptom | What to check |
| ------- | ------------- |
| “Backend not connected” | `NEXT_PUBLIC_CONVEX_URL` missing or wrong in **Vercel** env; redeploy after saving. |
| Search errors / no AI rows | `OPENAI_API_KEY` in **Convex** dashboard (production), not only `.env.local`. |
| Stale functions | Run `npx convex deploy` after changing `convex/`. |
| Build fails on CI | Ensure CI sets `NEXT_PUBLIC_CONVEX_URL` (see `.github/workflows/ci.yml`). |

---

## 6. One-command reminders

```bash
# Deploy Convex backend
npm run convex:deploy

# Production build locally (needs env like production)
npm run build && npm run start
```

Vercel runs `npm run build` on each git push to the connected branch.
