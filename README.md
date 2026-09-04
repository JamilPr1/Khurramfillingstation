# Khurram Filling Station

Loyalty points, cashier QR, and visit feedback.

```bash
cd khurram-demo
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — the app opens on the sign-in screen.

| Role | Sign in |
|------|---------|
| Customer | `03001234567` · OTP `1234` |
| Staff | PIN `1234` |

Toggle Customer / Staff on the login screen, then sign in.

The public site is [http://localhost:3000](http://localhost:3000). Install the PWA from there; the app opens at `/login`.

## Go live on Vercel

This repo is the Next.js app root (no extra folder). Import it in Vercel:

1. Open [vercel.com/new](https://vercel.com/new) and sign in with GitHub.
2. Import **JamilPr1/Khurramfillingstation**.
3. Leave **Framework Preset** as Next.js and **Root Directory** empty.
4. Deploy. You get a `*.vercel.app` URL.
5. In the project: **Settings → Environment Variables**, add:

   `NEXT_PUBLIC_SITE_URL` = `https://your-project.vercel.app`

   (Use your real Vercel URL, no trailing slash.) Redeploy once so sitemap and Open Graph use that URL.

6. Optional: **Settings → Domains** to attach a custom domain, then update `NEXT_PUBLIC_SITE_URL` to match.

Loyalty points and contact-form messages are stored on disk. On Vercel that storage is temporary (serverless), so treat the live loyalty app as a demo. The public station site, fuel prices, and PWA work on Vercel.
