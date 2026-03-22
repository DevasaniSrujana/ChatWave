/**
 * Backend origin for REST API and Socket.IO (scheme + host + port, no path).
 * Prefer VITE_API_URL; fall back to VITE_DB_ORIGIN / VITE_DB_URL.
 *
 * In production builds, localhost URLs are ignored — the browser on Vercel
 * cannot reach your machine; set VITE_API_URL to your Render HTTPS URL.
 *
 * If the build has no valid URL (or only localhost), production falls back to
 * the deployed Render service below.
 */
const PRODUCTION_RENDER_ORIGIN = "https://chatwave-1-riu4.onrender.com";

function normalize(raw) {
  if (raw == null) return "";
  const s = String(raw).trim().replace(/^["']|["']$/g, "");
  return s;
}

function isLocalhostOrigin(url) {
  if (!url) return false;
  try {
    const u = new URL(url);
    return u.hostname === "localhost" || u.hostname === "127.0.0.1";
  } catch {
    return /localhost|127\.0\.0\.1/i.test(url);
  }
}

export function getServerOrigin() {
  const candidates = [
    import.meta.env.VITE_API_URL,
    import.meta.env.VITE_DB_ORIGIN,
    import.meta.env.VITE_DB_URL,
  ]
    .map(normalize)
    .filter(Boolean);

  for (const url of candidates) {
    if (import.meta.env.PROD && isLocalhostOrigin(url)) {
      console.error(
        "[ChatWave] Production build cannot use a localhost API URL. On Vercel → Settings → Environment Variables, set VITE_API_URL to your Render backend (e.g. https://your-app.onrender.com) with no trailing path, then redeploy.",
      );
      continue;
    }
    return url;
  }
  if (import.meta.env.PROD) {
    console.warn(
      "[ChatWave] No valid VITE_API_URL in this build; using Render origin:",
      PRODUCTION_RENDER_ORIGIN,
    );
    return PRODUCTION_RENDER_ORIGIN;
  }
  return "";
}
