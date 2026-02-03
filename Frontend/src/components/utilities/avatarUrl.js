export const getAvatarUrl = (avatar) => {
  if (!avatar) return "";
  if (avatar.startsWith("http://") || avatar.startsWith("https://")) {
    return avatar;
  }
  if (avatar.startsWith("/uploads")) {
    const origin = import.meta.env.VITE_DB_ORIGIN || "";
    return `${origin}${avatar}`;
  }
  return avatar;
};

