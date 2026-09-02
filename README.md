# Oyeola Online

Founder-led digital studio for three connected problems:

- Websites — customer clarity and action
- Operations systems — business visibility and flow
- Premium hyperlinked digital planners — product usability and differentiation

The site is deployed on Vercel. Static HTML/CSS/JS pages are combined with one Vercel Function for lead capture.

## Lead capture

`/api/lead` receives project enquiries, Website Check follow-up, Operations Check follow-up, Start Here enquiries and planner-resource requests.

Required production environment variables:

- `SUPABASE_URL` — currently expected to be `https://pnuyufllwzultgrgpotz.supabase.co`
- `SUPABASE_PUBLISHABLE_KEY` — the public/publishable key for that Supabase project

Automatic confirmation/resource email is enabled when both of these are configured:

- `RESEND_API_KEY`
- `OYEOLA_FROM_EMAIL` — a verified sender address/domain in Resend

Run `supabase/leads-schema.sql` in the intended Supabase project before enabling production form capture. The `leads` table uses RLS and exposes public INSERT only; public roles cannot read, update or delete lead rows.

## Diagnostics

- `website-check.html` combines Google PageSpeed Insights / Lighthouse signals with guided business questions. If Google's public API is unavailable, technical categories remain unscored rather than guessed.
- `operations-check.html` uses a transparent rule-based score across visibility, handoffs, reporting, capacity and reliability.
- Both result pages can create a client-side PDF brief through jsPDF, with browser print as fallback.
- Both checks now offer a structured follow-up form so the result can become a project lead instead of relying on email links.

## Planner funnel

The current planner path is sample → email capture → unlock the actual full-size sample → custom-planner enquiry. Additional PDF/PPTX resources should only be added after the real planner files are placed in the repository.

## Analytics readiness

No third-party analytics account is connected yet. `assets/js/site.js` emits `oyeola:track` browser events for important conversion interactions so a future analytics provider can be connected without rebuilding the customer journeys.

## Production

- `privacy.html` explains form-data handling.
- `404.html` is the custom not-found page.
- Legacy `/workflow-check` URLs permanently redirect to `/operations-check` through `vercel.json`.
- `sitemap.xml` includes core pages, specialist service pages and case studies.
