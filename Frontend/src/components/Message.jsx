import { useSelector } from "react-redux";
import { isUserOnline } from "./utilities/onlineStatus.js";
import { getAvatarUrl } from "./utilities/avatarUrl.js";

const Message = ({ messageDetails }) => {
  const { userProfile, selectedUser } = useSelector((state) => state.user);
  const { onlineUsers } = useSelector((state) => state.socket);
  if (!messageDetails) return null;

  const fromMe =
    String(userProfile?._id ?? "") === String(messageDetails?.senderId ?? "");
  const avatarUserId = fromMe ? userProfile?._id : selectedUser?._id;
  const avatarOnline = isUserOnline(onlineUsers, avatarUserId);
  const formatTime = (time) =>
    new Date(time).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className={`chat ${fromMe ? "chat-end" : "chat-start"}`}>
      <div className={`chat-image avatar ${avatarOnline ? "online" : ""}`}>
        <div className="w-10 rounded-full">
          <img
            alt="Tailwind CSS chat bubble component"
            src={getAvatarUrl(
              fromMe ? userProfile?.avatar : selectedUser?.avatar,
            )}
          />
        </div>
      </div>
      <div className="chat-header">
        <time className="text-xs opacity-50">
          {messageDetails?.createdAt
            ? formatTime(messageDetails.createdAt)
            : ""}
        </time>
      </div>
      <div className="chat-bubble ">{messageDetails.message}</div>
    </div>
  );
};

export default Message;
