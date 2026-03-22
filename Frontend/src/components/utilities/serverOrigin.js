/**
 * Backend origin for REST API and Socket.IO (scheme + host + port, no path).
 * Prefer VITE_API_URL; fall back to names used elsewhere in this project.
 */
export function getServerOrigin() {
  const raw =
    import.meta.env.VITE_API_URL ||
    import.meta.env.VITE_DB_ORIGIN ||
    import.meta.env.VITE_DB_URL ||
    "";
  const s = String(raw).trim();
  if (!s) return "";
  return s.replace(/^["']|["']$/g, "");
}
