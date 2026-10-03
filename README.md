# Oyeola Online

Founder-led digital studio for websites, operations systems and premium digital products.

The public site is deployed on Vercel. The application backend now uses **Neon only** for CMS data, admin sessions, leads and media storage. Supabase is not part of the Oyeola architecture.

## Neon production backend

Project: `author-scout-team-bot`  
Project ID: `divine-silence-16162248`  
Production branch: `oyeola-web-production`  
Branch ID: `br-super-moon-b5rfh8yp`  
Database: `oyeola_web`  
Database role: `oyeola_web_owner`

The Neon Data API is active for the `oyeola_web` database and the branch also has a public-read Object Storage bucket named `oyeola-media`.

### Required Vercel environment

- `NEON_DATABASE_URL` or `DATABASE_URL` — connection string for `oyeola_web`
- `NEON_DATA_API_URL` — optional; the code defaults to the production Oyeola Data API URL
- `NEON_STORAGE_ENDPOINT` — optional; defaults to the Oyeola production storage endpoint
- `NEON_STORAGE_BUCKET` — optional; defaults to `oyeola-media`
- `NEON_STORAGE_REGION` — optional; defaults to `us-east-2`
- `NEON_STORAGE_ACCESS_KEY_ID` — required only for direct admin uploads
- `NEON_STORAGE_SECRET_ACCESS_KEY` — required only for direct admin uploads

Optional email settings:

- `RESEND_API_KEY`
- `OYEOLA_FROM_EMAIL`

## CMS

Private admin portal: `/admin/`

The admin link is intentionally excluded from public navigation.

The CMS controls:

- portfolio projects and project stories
- reviews and testimonials
- services
- tools
- skills
- credentials and certificates
- demos
- homepage statistics
- global settings
- captured leads

Published records are stored in `public.cms_items`. Public pages read only published records through the Neon Data API view `public.cms_public_items`.

Admin authentication is also stored in Neon:

- `cms_admin_config`
- `cms_admin_sessions`

The first visit to the private admin portal uses a one-time setup key to create the admin email and password. After setup, sessions are stored as hashed tokens in Neon.

## Portfolio media

Neon Object Storage bucket: `oyeola-media`

Projects support:

- thumbnail
- hero image
- full-page screenshot
- multiple gallery images
- walkthrough video URL
- tools and skills
- branding contribution
- project story
- related demo
- related review

Large walkthrough videos should use a video host/CDN and be linked by URL. Smaller screenshots, logos and PDFs can be uploaded from Admin when the Neon Storage credentials are configured on Vercel.

## Lead capture

`/api/lead` stores enquiries in Neon as private `lead` CMS records. If Neon database capture is unavailable, the form falls back to FormSubmit so the public enquiry does not dead-end.

The Admin portal includes a Leads section.

## Diagnostics

- `website-check.html` evaluates clarity, trust and conversion.
- `operations-check.html` evaluates visibility, handoffs, reporting, capacity and reliability.
- Both can feed project enquiries into the Neon lead store.

## Theme system

The public site supports dark and light themes. The preference persists between pages and switches the Oyeola header logo automatically.

## Public CMS behavior

The website keeps hard-coded fallback content so the public site remains usable if the Neon content endpoint is temporarily unavailable.

## Database schema

The live Neon schema is documented in `neon/schema.sql`.
