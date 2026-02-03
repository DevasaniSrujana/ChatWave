import { useDispatch, useSelector } from "react-redux";
import Message from "./Message.jsx";
import { useEffect, useRef } from "react";
import { getMessageThunk } from "../redux/features/message/message.thunk.js";
import SendMessage from "./SendMessage.jsx";
import { setSelectedUser } from "../redux/features/user/user.slice.js";
import { getAvatarUrl } from "./utilities/avatarUrl.js";

const ChatWindow = () => {
  const dispatch = useDispatch();
  const { selectedUser } = useSelector((state) => state.user);

  const { messages } = useSelector((state) => state.message);
  const { onlineUsers } = useSelector((state) => state.socket);
  const isUserOnline = onlineUsers?.includes(selectedUser?._id);
  const messagesEndRef = useRef(null);

  const formatDate = (dateString) => {
    const d = new Date(dateString);
    return d.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleBack = () => {
    dispatch(setSelectedUser(null));
  };

  useEffect(() => {
    if (selectedUser?._id) {
      dispatch(getMessageThunk({ receiverId: selectedUser?._id }));
    }
  }, [selectedUser?._id, dispatch]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [messages]);

  const renderedMessages = [];
  let lastDate = null;

  messages
    ?.filter((msg) => msg && typeof msg === "object")
    .forEach((message, index) => {
      const msgDate = message.createdAt ? formatDate(message.createdAt) : null;
      if (msgDate && msgDate !== lastDate) {
        lastDate = msgDate;
        renderedMessages.push(
          <div
            key={`date-${msgDate}-${index}`}
            className="self-center my-2 px-3 py-1 rounded-full bg-base-200 text-xs text-base-content/70"
          >
            {msgDate}
          </div>,
        );
      }

      renderedMessages.push(
        <Message
          key={message._id || `${message.senderId}-${index}`}
          messageDetails={message}
        />,
      );
    });
  return (
    <div className="h-full md:h-screen w-full flex flex-col">
      <div className="flex items-center gap-2 h-16 p-4 bg-base-50 hover:bg-base-100 border-b border-b-base-200 transition">
        {/* Back button on small screens */}
        <button
          type="button"
          onClick={handleBack}
          className="btn btn-ghost btn-sm md:hidden mr-1"
        >
          ←
        </button>
        <div className="avatar">
          <div className="mask mask-squircle w-12 h-12">
            <img src={getAvatarUrl(selectedUser.avatar)} alt="user" />
          </div>
        </div>
        <div className="text-base font-semibold flex flex-col">
          <span className="text-base font-semibold">
            {selectedUser.fullname}
          </span>
          {isUserOnline && (
            <span className="text-sm text-[#009435]">Online</span>
          )}
        </div>
      </div>
      <div className="overflow-y-auto flex flex-col h-full p-4">
        {renderedMessages}
        <div ref={messagesEndRef} />
      </div>
      <SendMessage />
    </div>
  );
};

export default ChatWindow;
