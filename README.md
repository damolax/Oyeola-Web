# Oyeola Website

A full-stack editable ecommerce conversion website for **Oyeola**. The site includes a premium public frontend, a password-protected admin area, database-backed editable content, portfolio categories/items, testimonials, resources, legal pages, lead storage, and contact email notification support.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Framer Motion
- Prisma ORM
- SQLite for local development
- Zod validation
- Nodemailer SMTP support
- Custom cookie-based admin session

## What is included

### Public frontend

- Homepage
- Ecommerce Revenue Leak Review landing page
- Services listing
- Dynamic service detail pages
- Portfolio listing with category filters
- Dynamic portfolio detail pages
- About page
- Resources/blog listing
- Dynamic resource detail pages
- Contact page
- Thank-you page
- Privacy Policy and Terms pages

### Admin backend

Private admin lives at:

```txt
/admin
```

Admin includes:

- Dashboard with counts
- Brand settings editor
- Homepage section editor
- Services manager
- Portfolio category manager
- Portfolio item manager
- Testimonials manager
- Resources manager
- Contact/email settings
- Leads inbox
- CSV lead export
- Legal page editor

## Local setup

1. Install dependencies:

```bash
npm install
```

2. Copy the environment file:

```bash
cp .env.example .env
```

3. Edit `.env`:

```env
DATABASE_URL="file:./dev.db"
ADMIN_PASSWORD="change-this-password"
ADMIN_SESSION_SECRET="replace-with-a-long-random-secret"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

4. Create the database tables:

```bash
npm run db:push
```

5. Seed the Oyeola content:

```bash
npm run db:seed
```

6. Run locally:

```bash
npm run dev
```

Open:

```txt
http://localhost:3000
```

Admin:

```txt
http://localhost:3000/admin
```

Use the password from `ADMIN_PASSWORD`.

## Email setup

Contact submissions are always stored in the database. Email notifications are sent only when SMTP is configured.

Add these values to `.env`:

```env
SMTP_HOST="smtp.example.com"
SMTP_PORT="587"
SMTP_USER="your-smtp-user"
SMTP_PASS="your-smtp-password"
SMTP_FROM="Oyeola <hello@oyeola.com>"
```

The notification recipient email can be edited inside the admin under **Contact** or **Brand settings**. Provider secrets stay inside environment variables.

## Database models

The project includes models for:

- SiteSettings
- NavigationItem
- Page
- Section
- Service
- PortfolioCategory
- PortfolioItem
- Testimonial
- ResourcePost
- Lead
- FAQ
- MediaAsset
- AdminUser

SQLite is used for local development. For production scale, switch Prisma datasource to PostgreSQL and update `DATABASE_URL`.

## How to edit content

Go to `/admin` and use:

- **Brand**: logo URL, favicon URL, founder name, colors, fonts, footer, SEO, social links.
- **Homepage**: edit hero, problem section, review section, framework, founder section, process, FAQ, and CTA.
- **Services**: add, edit, publish/hide, reorder service pages.
- **Portfolio**: create unlimited categories and portfolio items; mark homepage featured items.
- **Testimonials**: add/edit/hide/reorder testimonials and choose homepage visibility.
- **Resources**: add/edit/publish/draft blog posts.
- **Contact**: set lead notification recipient, subject format, success message, thank-you message.
- **Leads**: review submissions, change status, add internal notes, export CSV.
- **Legal**: edit privacy and terms pages.

## Deployment notes

### Vercel

1. Push this project to GitHub.
2. Import the repository into Vercel.
3. Add environment variables in Vercel project settings.
4. For production, use PostgreSQL instead of SQLite. Options include Supabase, Neon, Railway, or Vercel Postgres.
5. Update `prisma/schema.prisma` datasource provider from `sqlite` to `postgresql`, then run migrations.

### Production security checklist

- Change `ADMIN_PASSWORD`.
- Use a long random `ADMIN_SESSION_SECRET`.
- Use a real SMTP provider or Resend integration.
- Move to PostgreSQL for production.
- Keep environment variables out of Git.
- Do not enable unrestricted uploads without validation.
- Keep Prisma Studio disabled from public hosting.

## Notes

The default portfolio items and testimonials are intentionally labelled as samples. Replace them with real client proof when available. The site avoids fake revenue claims and keeps the message focused on diagnosis, prioritization, and practical buyer-journey improvement.


## Fast Vercel deployment

Use `VERCEL_DEPLOY.md` for the production path. This copy is prepared for hosted PostgreSQL instead of local SQLite. Run `npm run deploy:init` one time after setting `DATABASE_URL`, then push to GitHub and import the repo into Vercel.
