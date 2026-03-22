/**
 * Fail Vercel Production builds if API env points at localhost or is missing.
 * Prevents shipping a bundle that calls http://localhost:5000 from https://*.vercel.app
 */
const isVercelProd =
  process.env.VERCEL === "1" && process.env.VERCEL_ENV === "production";

if (!isVercelProd) {
  process.exit(0);
}

const raw =
  process.env.VITE_API_URL ||
  process.env.VITE_DB_ORIGIN ||
  process.env.VITE_DB_URL ||
  "";

const url = String(raw).trim().replace(/^["']|["']$/g, "");

if (!url) {
  console.warn(`
[ChatWave] Vercel Production: VITE_API_URL / VITE_DB_URL not set at build time.
The app will use the bundled Render origin. For clarity, set in Vercel → Environment Variables:

  VITE_API_URL = https://chatwave-1-riu4.onrender.com
`);
  process.exit(0);
}

if (/localhost|127\.0\.0\.1/i.test(url)) {
  console.error(`
[ChatWave] Vercel Production build blocked: API URL must not be localhost.

Current value resolves to: ${url}

Set VITE_API_URL to your Render URL (https://....onrender.com).
Remove or fix VITE_DB_ORIGIN / VITE_DB_URL if they still use localhost.
`);
  process.exit(1);
}

if (!/^https:\/\//i.test(url)) {
  console.warn(
    `[ChatWave] Warning: VITE_API_URL should use https in production (got: ${url})`,
  );
}

console.log("[ChatWave] Production API origin check OK:", url);
process.exit(0);
