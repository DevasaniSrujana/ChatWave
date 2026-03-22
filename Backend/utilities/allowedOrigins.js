/** Normalize browser Origin / env URL for comparison (no trailing slash). */
export function normalizeOrigin(url) {
  if (!url || typeof url !== "string") return "";
  return url.trim().replace(/\/+$/, "");
}

/**
 * Allowed frontend origins from env. Use comma-separated CLIENT_URL for multiple
 * (e.g. https://app.vercel.app,https://www.app.vercel.app).
 */
export function getAllowedOriginsSet() {
  const raw = [
    process.env.CLIENT_URL,
    process.env.CLIENT_URL_EXTRA,
    "http://localhost:5173",
    "http://127.0.0.1:5173",
  ].filter(Boolean);

  const set = new Set();
  for (const entry of raw) {
    for (const part of entry.split(",")) {
      const n = normalizeOrigin(part);
      if (n) set.add(n);
    }
  }
  return set;
}

export function isAllowedOrigin(origin, allowedSet) {
  if (!origin) return true;
  return allowedSet.has(normalizeOrigin(origin));
}
