/**
 * In-memory IP rate limiter.
 *
 * Uses a module-level Map (singleton for the lifetime of the Node.js process).
 * Resets on server restart — acceptable for a catering site's review form.
 *
 * Limits:
 *   submit  — 2 submissions per IP per 24 hours
 *   edit    — 10 edits per IP per hour
 *   delete  — 5 deletes per IP per hour
 */

type Action = "submit" | "edit" | "delete";

interface Limit {
  max: number;
  windowMs: number;
}

const LIMITS: Record<Action, Limit> = {
  submit: { max: 2,  windowMs: 24 * 60 * 60 * 1000 },
  edit:   { max: 10, windowMs: 60 * 60 * 1000 },
  delete: { max: 5,  windowMs: 60 * 60 * 1000 },
};

/** key → array of hit timestamps */
const store = new Map<string, number[]>();

/** Evict stale entries periodically to prevent memory bloat */
let lastEvict = Date.now();
function maybeEvict() {
  const now = Date.now();
  if (now - lastEvict < 10 * 60 * 1000) return; // evict at most every 10 min
  lastEvict = now;
  const maxWindow = Math.max(...Object.values(LIMITS).map((l) => l.windowMs));
  for (const [key, ts] of store) {
    const fresh = ts.filter((t) => now - t < maxWindow);
    if (fresh.length === 0) store.delete(key);
    else store.set(key, fresh);
  }
}

/**
 * Returns true if the request is allowed, false if rate-limited.
 * Side effect: records the hit when allowed.
 */
export function checkRateLimit(ip: string, action: Action): boolean {
  maybeEvict();

  const key = `${ip}:${action}`;
  const { max, windowMs } = LIMITS[action];
  const now = Date.now();

  const timestamps = store.get(key) ?? [];
  const active = timestamps.filter((t) => now - t < windowMs);

  if (active.length >= max) return false;

  active.push(now);
  store.set(key, active);
  return true;
}

/** Human-readable time-to-reset string */
export function retryAfterSeconds(ip: string, action: Action): number {
  const key = `${ip}:${action}`;
  const { windowMs } = LIMITS[action];
  const now = Date.now();
  const oldest = Math.min(...(store.get(key) ?? [now]));
  return Math.ceil((oldest + windowMs - now) / 1000);
}
