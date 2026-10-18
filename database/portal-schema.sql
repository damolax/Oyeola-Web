-- Oyeola Online Editorial Portal, initial additive schema.
-- Review and apply to the Oyeola website database before enabling /portal.
-- Does not modify existing cms_items or owner credentials.
CREATE TABLE IF NOT EXISTS portal_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  display_name text NOT NULL,
  password_hash text NOT NULL,
  role text NOT NULL DEFAULT 'contributor'
    CHECK (role IN ('owner','admin','editor','author','contributor')),
  account_status text NOT NULL DEFAULT 'pending'
    CHECK (account_status IN ('pending','active','suspended','rejected')),
  bio text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS portal_users_status_idx ON portal_users(account_status,created_at);

CREATE TABLE IF NOT EXISTS portal_sessions (
  token_hash text PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES portal_users(id) ON DELETE CASCADE,
  expires_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS portal_sessions_user_idx ON portal_sessions(user_id);
CREATE INDEX IF NOT EXISTS portal_sessions_expires_idx ON portal_sessions(expires_at);

CREATE TABLE IF NOT EXISTS portal_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id uuid NOT NULL REFERENCES portal_users(id),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  excerpt text NOT NULL DEFAULT '',
  content jsonb NOT NULL DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'draft'
    CHECK(status IN ('draft','in_review','revision_requested','approved','rejected','published')),
  cms_item_id text UNIQUE,
  reviewer_id uuid REFERENCES portal_users(id),
  review_message text NOT NULL DEFAULT '',
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS portal_posts_author_idx ON portal_posts(author_id,updated_at DESC);
CREATE INDEX IF NOT EXISTS portal_posts_status_idx ON portal_posts(status,updated_at DESC);

CREATE TABLE IF NOT EXISTS portal_post_revisions (
  id bigserial PRIMARY KEY,
  post_id uuid NOT NULL REFERENCES portal_posts(id) ON DELETE CASCADE,
  editor_id uuid NOT NULL REFERENCES portal_users(id),
  title text NOT NULL,
  excerpt text NOT NULL,
  content jsonb NOT NULL,
  saved_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS portal_activity (
  id bigserial PRIMARY KEY,
  actor_id uuid REFERENCES portal_users(id),
  event_type text NOT NULL,
  subject_type text NOT NULL,
  subject_id text NOT NULL,
  details jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS portal_activity_created_idx ON portal_activity(created_at DESC);

CREATE TABLE IF NOT EXISTS portal_rate_limits (
  key_hash text PRIMARY KEY,
  hits integer NOT NULL DEFAULT 1,
  window_ends_at timestamptz NOT NULL
);

-- Media library, scheduling, threaded reviews and revision rollback are
-- intentionally deferred until object storage and production DB are connected.
