/** Backend sends user ids as strings; API may use string or ObjectId-shaped values. */
export function isUserOnline(onlineUsers, userId) {
  if (userId == null || !Array.isArray(onlineUsers)) return false;
  const needle = String(userId);
  return onlineUsers.some((id) => String(id) === needle);
}
