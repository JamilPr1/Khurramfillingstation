# Khurram Filling Station

Loyalty points, cashier QR, and visit feedback.

```bash
cd khurram-demo
npm install
cp .env.example .env.local
# Set ADMIN_PASSWORD and STAFF_PIN in .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

| Role | Sign in |
|------|---------|
| Customer | Name, mobile number, 4–6 digit PIN you choose |
| Staff | Station PIN (set by admin) |
| Admin | `khurramfillingstationpso@gmail.com` and `ADMIN_PASSWORD` |

The public site is [http://localhost:3000](http://localhost:3000). Install the PWA from there; the app opens at `/login`.

## Go live on Hostinger

This repo is the Next.js app root. In hPanel:

1. **Websites → Add Website → Node.js Apps** (or Import Git Repository).
2. Select **JamilPr1/Khurramfillingstation**, branch `main`.
3. Confirm auto-detected settings:
   - Application type: **next**
   - Node.js: **20** or newer
   - Install: `npm ci`
   - Build: `npm run build`
   - Output directory: `.next`
   - Start (if asked): `npm run start -- -p $PORT`
4. Environment variables:
   - `NEXT_PUBLIC_SITE_URL` = `https://your-domain.com` (no trailing slash)
   - `ADMIN_PASSWORD` = a strong password for `khurramfillingstationpso@gmail.com`
   - `STAFF_PIN` = 4 to 6 digits for cashiers
5. Point the domain at this Node.js app. Hostinger generates the `public_html` `.htaccess`. Do not hand-edit it.

After the first start, change the admin password and staff PIN in **Login → Admin → Settings**. Loyalty data is stored in `data/store.json` on the server.
