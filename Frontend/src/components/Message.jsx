import { useSelector } from "react-redux";

const Message = ({ messageDetails }) => {
  const { userProfile, selectedUser } = useSelector((state) => state.user);
  if (!messageDetails) return null;
  const formatTime = (time) =>
    new Date(time).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div
      className={`chat ${userProfile?._id === messageDetails?.senderId ? "chat-end" : "chat-start"}`}
    >
      <div className="chat-image avatar">
        <div className="w-10 rounded-full">
          <img
            alt="Tailwind CSS chat bubble component"
            src={
              userProfile?._id === messageDetails?.senderId
                ? userProfile?.avatar
                : selectedUser?.avatar
            }
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
