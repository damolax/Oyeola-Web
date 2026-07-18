type Entry = { count: number; expiresAt: number };
const buckets = new Map<string, Entry>();

export function isRateLimited(key: string, limit = 5, windowMs = 60_000) {
  const now = Date.now();
  const current = buckets.get(key);
  if (!current || current.expiresAt < now) {
    buckets.set(key, { count: 1, expiresAt: now + windowMs });
    return false;
  }
  current.count += 1;
  buckets.set(key, current);
  return current.count > limit;
}
