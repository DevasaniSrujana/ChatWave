import { getServerOrigin } from "./serverOrigin.js";

function rewriteLocalhostAssetUrl(avatar) {
  if (!avatar || import.meta.env.DEV) return avatar;
  try {
    const u = new URL(avatar);
    if (u.hostname !== "localhost" && u.hostname !== "127.0.0.1") {
      return avatar;
    }
    const origin = getServerOrigin();
    if (!origin) return avatar;
    return `${origin}${u.pathname}${u.search}`;
  } catch {
    return avatar;
  }
}

/** Same origin as API (Render); do not use VITE_DB_URL alone — it is often still localhost on Vercel. */
export const getAvatarUrl = (avatar) => {
  if (!avatar) return "";
  if (avatar.startsWith("http://") || avatar.startsWith("https://")) {
    return rewriteLocalhostAssetUrl(avatar);
  }
  if (avatar.startsWith("/uploads")) {
    const origin = getServerOrigin();
    return origin ? `${origin}${avatar}` : avatar;
  }
  return avatar;
};
