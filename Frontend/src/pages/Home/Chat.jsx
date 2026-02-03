import { useState } from "react";
import SidebarChat from "../../components/SidebarChat.jsx";
import MessageContainer from "../../components/MessageContainer.jsx";
import ThemeToggle from "../../components/ThemeToggle.jsx";
import ChatWindow from "../../components/ChatWindow.jsx";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { initializeSocket } from "../../socket/socket.js";
import { checkOnlineUsers } from "../../redux/features/socket/socket.slice.js";
import { addIncomingMessage } from "../../redux/features/message/message.slice.js";

const Chat = () => {
  const [chatTheme, setChatTheme] = useState("corporate");
  const { selectedUser, isAuthenticated, userProfile } = useSelector(
    (state) => state.user,
  );

  const dispatch = useDispatch();
  useEffect(() => {
    if (!isAuthenticated || !userProfile?._id) return;

    const socket = initializeSocket(userProfile._id);

    socket.on("onlineUsers", (users) => {
      dispatch(checkOnlineUsers(users));
    });

    socket.on("newMessage", (message) => {
      const selectedId = selectedUser?._id ? String(selectedUser._id) : null;
      const senderId = message?.senderId ? String(message.senderId) : null;
      const receiverId = message?.receiverId
        ? String(message.receiverId)
        : null;

      if (!selectedId) return;
      if (senderId === selectedId || receiverId === selectedId) {
        dispatch(addIncomingMessage(message));
      }
    });

    return () => {
      socket.off("onlineUsers");
      socket.off("newMessage");
    };
  }, [isAuthenticated, userProfile?._id, selectedUser?._id, dispatch]);

  return (
    <div
      data-theme={chatTheme}
      className="flex h-screen w-full flex-col md:flex-row overflow-hidden"
    >
      {/* Sidebar: full width on mobile, fixed column on md+ */}
      <div
        className={`w-full md:w-auto md:flex-shrink-0 ${
          selectedUser ? "hidden md:block" : "block"
        }`}
      >
        <SidebarChat />
      </div>

      {/* Main chat area */}
      {selectedUser ? (
        <div className="flex-1 min-w-0 block">
          <ChatWindow />
        </div>
      ) : (
        <div className="flex-1 min-w-0 hidden md:block">
          <MessageContainer />
        </div>
      )}

      <ThemeToggle theme={chatTheme} setTheme={setChatTheme} />
    </div>
  );
};

export default Chat;
