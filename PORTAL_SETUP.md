# Oyeola Online · Editorial Portal (draft, not deployed to production)

This work adds a real multi-user publishing workflow under `/portal/` without exposing the private journal database to the browser.

## Phase 1 implemented in this branch

- Private sign-in sessions with `HttpOnly`, `Secure`, `SameSite=Lax` cookies and session token hashes stored in Neon.
- Contributor applications default to **pending**. An administrator or owner must approve each applicant and assign a role.
- Role permissions: `owner`, `admin`, `editor`, `author`, and `contributor`. Server-side authorization protects every endpoint.
- Existing owner can initialize a portal owner account by signing in with the **already configured** `/admin` owner email/password, provided the legacy owner account exists and no portal owner has been initialized.
- Branded responsive editorial workspace with article library, draft builder (headings, paragraphs, quotes, lists, images, dividers), excerpts, categories, tags, cover metadata and SEO descriptions.
- Draft → submitted for review → approved / changes requested / rejected → published.
- Reviewer messages, per-save revision snapshots, contributor approval controls, and activity events.
- Approved articles publish into the **existing** `cms_items` blog source used by `/blog`. Existing content isn't overwritten when slugs collide.
- Basic database-backed login and registration rate limiting.

## Before this works

1. Configure the website's **correct** Neon PostgreSQL project as `DATABASE_URL` in Vercel Production and Preview. The current production deployment has no `DATABASE_URL` or `NEON_DATABASE_URL`. Do not use an unrelated Neon project or overwrite secrets to make it appear connected.
2. Apply `database/portal-schema.sql` to **the Oyeola website database**, after confirming a backup and schema compatibility. The migration adds isolated portal tables without modifying existing CMS tables. Do not run against an unrelated project.
3. Confirm that the legacy owner config `cms_admin_config` and public blog `cms_items` exist in that database, and owner credentials have been set up.
4. Test on a Vercel preview deployment using an isolated or safe database branch. Test signup, pending access, owner bootstrap, approval, writing, submitting, reviewer decisions, publishing, cross-account authorization, and public blog rendering.
5. Review DNS, sessions, CORS, Cloudflare controls, service errors, and privacy notice, then explicitly approve a production release.
6. Do not merge this pull request or announce the portal as live before steps 1–5 are complete.

## API routes

| Path | Method | Operations |
|---|---|---|
| `/api/portal-auth?action=status` | GET | Current session |
| `/api/portal-auth?action=register` | POST | Apply for contributor account |
| `/api/portal-auth?action=login` | POST | Log in / one-time owner bootstrap |
| `/api/portal-auth?action=logout` | POST | Revoke current session |
| `/api/portal-posts?action=list` | GET | Accessible posts |
| `/api/portal-posts?action=save` | POST | Create or update draft |
| `/api/portal-posts?action=submit` | POST | Submit for review |
| `/api/portal-posts?action=review` | POST | Approve, request revision, reject |
| `/api/portal-posts?action=publish` | POST | Publish approved post |
| `/api/portal-posts?action=revisions&id=...` | GET | Revision history (metadata) |
| `/api/portal-users` | GET/POST | Manage contributor applications and roles |

## Pending phases before WordPress-level feature parity

- Dedicated object-storage-backed Media Library and upload processing. Phase 1 supports HTTPS image URLs only.
- Scheduling and unpublishing, revisions diff and rollback, collaborator comments, drag-and-drop content blocks, reusable block templates, taxonomy management screens, custom profiles, invitations, email verification, password reset, notification emails and granular editorial notifications.
- Advanced SEO controls, post redirects, multilingual author bios, canonical URL controls and analytics reporting.
- Merge and reconcile the separate **draft** analytics PR #28 (`feature/portal-gsc-ga4-integration-20261018`) to include Search Console / GA4 reporting. GA4 itself is not configured yet.
- Decide whether to migrate the existing `/admin/blog.html` owner-only blog editor to the portal or keep both during transition.

## Security considerations

All data-changing endpoints check the caller's server-side role; content is validated before storage. Login sessions are opaque random tokens, with only SHA-256 hashes stored in the database. This is **prototype code requiring integration and adversarial testing** before production. Additional defense-in-depth (password recovery, verified email identity, stronger automated abuse protection, request size limits, account lockout evaluation and session lifecycle controls) should be completed prior to public contributor onboarding.

Existing Vercel production environment variables should not be modified casually; restore correct values from the owner of the Oyeola website database.
