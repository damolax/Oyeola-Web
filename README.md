# Oyeola Studio Static Website

This is a simple static website for Oyeola Studio.

## Brand

Brand name: Oyeola Studio  
Email: oyeolawebmaster@gmail.com

## Pages included

- Home: `index.html`
- Services: `services.html`
- Portfolio: `portfolio.html`
- Process: `process.html`
- About: `about.html`
- Contact: `contact.html`
- Brand/logo preview: `brand.html`

## Logos included

- `assets/logos/logo-horizontal-dark.svg`
- `assets/logos/logo-horizontal-light.svg`
- `assets/logos/logo-stacked-dark.svg`
- `assets/logos/logo-badge.svg`
- `assets/logos/logo-wordmark.svg`
- `assets/logos/logo-mark.svg`
- `assets/logos/favicon.svg`
- `assets/logos/favicon.ico`

## Deployment notes for Vercel

This site has no npm, no Next.js, no Supabase and no Prisma.

Vercel settings:

- Framework Preset: Other
- Install Command: leave empty or use `echo No install needed`
- Build Command: leave empty or use `echo Static site ready`
- Output Directory: `.`

If Vercel still runs `npm install`, remove the old Install Command override from the Vercel project settings.

## How to add a new portfolio item

1. Add the screenshot/image to `assets/images/portfolio/`.
2. Open `portfolio.html`.
3. Copy one existing `<article class="portfolio-card">...</article>` block.
4. Change the title, category, problem, fix and image.
5. Commit and push to GitHub.

## Long-term Airtable idea

The best future version is to manage portfolio items and enquiries in Airtable. For now, the site uses simple email buttons so deployment stays easy.
