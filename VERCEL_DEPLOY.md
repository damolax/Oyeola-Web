# Vercel deployment for Oyeola

This copy is prepared for Vercel + hosted PostgreSQL.

## 1. Create a hosted PostgreSQL database
Use Neon, Supabase, Railway, or another hosted PostgreSQL provider. Copy the database connection string.

## 2. Set environment variables locally
Create `.env` from `.env.example` and fill in:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE?sslmode=require"
ADMIN_PASSWORD="your-strong-admin-password"
ADMIN_SESSION_SECRET="a-long-random-secret-at-least-32-characters"
NEXT_PUBLIC_SITE_URL="https://your-domain.com"
SMTP_HOST=""
SMTP_PORT="587"
SMTP_USER=""
SMTP_PASS=""
SMTP_FROM="Oyeola <hello@your-domain.com>"
```

## 3. Create tables and seed content
Run this one time before the first deploy:

```bash
npm install
npm run deploy:init
```

This creates the database tables and inserts the default Oyeola content. Do not run the seed command repeatedly unless you intentionally want to re-seed sample content.

## 4. Push to GitHub

```bash
git init
git add .
git commit -m "Initial Oyeola website"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/oyeola-website.git
git push -u origin main
```

## 5. Import into Vercel
In Vercel, import the GitHub repository. Add the same environment variables in Project Settings > Environment Variables.

Build command:

```bash
npm run build
```

Install command:

```bash
npm install
```

Output directory: leave default.

## 6. After deploy
Open:

- Public site: `https://your-vercel-url.vercel.app`
- Admin: `https://your-vercel-url.vercel.app/admin`

Login with the `ADMIN_PASSWORD` value you set.

## 7. Email sending
The contact form stores leads even if SMTP is blank. To also receive email alerts, fill in `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, and `SMTP_FROM`.
