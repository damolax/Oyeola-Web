# Oyeola Online

Founder-led digital studio for three connected problems:

- Websites — customer clarity and action
- Operations systems — business visibility and flow
- Premium hyperlinked digital planners — product usability and differentiation

The site is deployed on Vercel. Static HTML/CSS/JS pages are combined with one Vercel Function for lead capture.

## Lead capture

`/api/lead` receives project enquiries, Website Check follow-up, Operations Check follow-up, Start Here enquiries and planner-resource requests.

Primary database capture uses Supabase when these production environment variables are configured:

- `SUPABASE_URL` — currently expected to be `https://pnuyufllwzultgrgpotz.supabase.co`
- `SUPABASE_PUBLISHABLE_KEY` — the public/publishable key for that Supabase project

If database capture is unavailable or fails, `/api/lead` falls back to delivering the enquiry to `oyeolawebmaster@gmail.com` through FormSubmit so the public form does not dead-end.

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


## Admin CMS

The private content portal is available at `/admin/`. It is intentionally not linked from the public navigation or footer.

The CMS manages reusable site content:

- portfolio projects and project stories
- reviews/testimonials
- services
- tools and tool logos
- skills
- credentials/certificates
- demos
- animated homepage statistics
- global settings

Project records support service/industry/platform/year, live site URL, thumbnail, hero image, full-page screenshot, video URL, tools, skills, project story, branding contribution, related demo and testimonial links. The public `project.html?slug=...` template renders the project gallery, video preview, story, full-page viewer, tools and skills.

Required production environment variables:

- `SUPABASE_URL`
- `SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `OYEOLA_ADMIN_EMAIL`

Run `supabase/cms-schema.sql` in the intended Supabase project before using the CMS. Create the authorized admin user in Supabase Auth with the email configured in `OYEOLA_ADMIN_EMAIL`.

Media uploads use the public `oyeola-media` Supabase Storage bucket created by the CMS schema. Direct admin uploads are intended for screenshots, thumbnails, logos and smaller PDFs. Large project walkthrough videos should use an external video host/CDN and be saved as a video URL in the project record.

The public site gracefully falls back to its existing hard-coded content when the CMS is not configured or has no published records.
