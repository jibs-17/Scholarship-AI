# ScholarShip AI

Friendly scholarship finder for students: search by location and course, get matched ideas, and apply on a dedicated form page. Built with **Next.js**, **Convex**, and **OpenAI** (optional **Exa** for web context).

## Quick start (local)

1. **Install**

   ```bash
   npm install
   ```

2. **Convex** — in one terminal:

   ```bash
   npx convex dev
   ```

   This creates/links a dev deployment and prints `NEXT_PUBLIC_CONVEX_URL`.

3. **Environment** — copy the example file and fill in values:

   ```bash
   copy .env.local.example .env.local
   ```

   Paste `NEXT_PUBLIC_CONVEX_URL` from the Convex CLI output. Add `OPENAI_API_KEY` (and optionally `EXA_API_KEY`) in the [Convex dashboard](https://dashboard.convex.dev) under **Settings → Environment Variables** (server-side secrets, not only `.env.local`).

4. **Next.js** — in another terminal:

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Script            | Description                                      |
| ----------------- | ------------------------------------------------ |
| `npm run dev`     | Next.js dev server                               |
| `npm run build`   | Production build                                 |
| `npm run start`   | Run production build locally                     |
| `npm run lint`    | ESLint                                           |
| `npm run convex:dev`  | Convex dev (backend + codegen)               |
| `npm run convex:deploy` | Deploy Convex functions to production    |

## Public URL & sharing

- Use **Copy link to share** on the home page after deploy.
- Set `NEXT_PUBLIC_SITE_URL` to your production URL for best Open Graph previews (optional on Vercel if you rely on `VERCEL_URL`).

## Deploy to production

See **[DEPLOY.md](./DEPLOY.md)** for Vercel, Convex production env vars, and verification steps.

## License

Private project — adjust as needed.
