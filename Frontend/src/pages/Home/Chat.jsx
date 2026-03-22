import { useState, useEffect, useRef } from "react";
import SidebarChat from "../../components/SidebarChat.jsx";
import MessageContainer from "../../components/MessageContainer.jsx";
import ThemeToggle from "../../components/ThemeToggle.jsx";
import ChatWindow from "../../components/ChatWindow.jsx";
import { useDispatch, useSelector } from "react-redux";
import { initializeSocket } from "../../socket/socket.js";
import { checkOnlineUsers } from "../../redux/features/socket/socket.slice.js";
import { addIncomingMessage } from "../../redux/features/message/message.slice.js";
import { getOtherUsersThunk } from "../../redux/features/user/user.thunk.js";
import { getMessageThunk } from "../../redux/features/message/message.thunk.js";
import { store } from "../../redux/store.js";

const Chat = () => {
  const [chatTheme, setChatTheme] = useState("corporate");
  const { selectedUser, isAuthenticated, userProfile } = useSelector(
    (state) => state.user,
  );

  const selectedUserRef = useRef(selectedUser);
  const userProfileRef = useRef(userProfile);

  useEffect(() => {
    selectedUserRef.current = selectedUser;
    userProfileRef.current = userProfile;
  }, [selectedUser, userProfile]);

  const dispatch = useDispatch();
  useEffect(() => {
    if (!isAuthenticated || !userProfile?._id) return;

    const socket = initializeSocket(userProfile._id);
    if (!socket) return;

    const onOnlineUsers = (users) => {
      dispatch(checkOnlineUsers(users));
    };

    const onNewMessage = (message) => {
      const peerId = selectedUserRef.current?._id
        ? String(selectedUserRef.current._id)
        : null;
      const myId = userProfileRef.current?._id
        ? String(userProfileRef.current._id)
        : null;
      if (!peerId || !myId) return;

      const senderId =
        message?.senderId != null ? String(message.senderId) : null;
      const receiverId =
        message?.receiverId != null ? String(message.receiverId) : null;
      if (!senderId || !receiverId) return;

      const involvesPeer = senderId === peerId || receiverId === peerId;
      const involvesMe = senderId === myId || receiverId === myId;
      if (!involvesPeer || !involvesMe) return;

      dispatch(addIncomingMessage(message));
    };

    const pullLatestFromApi = () => {
      dispatch(getOtherUsersThunk());
      const peerId = store.getState().user.selectedUser?._id;
      if (peerId) {
        dispatch(getMessageThunk({ receiverId: peerId }));
      }
    };

    const onConnectError = (err) => {
      if (import.meta.env.DEV) console.warn("Socket connect_error:", err?.message);
    };

    socket.on("onlineUsers", onOnlineUsers);
    socket.on("newMessage", onNewMessage);
    socket.on("connect", pullLatestFromApi);
    socket.on("reconnect", pullLatestFromApi);
    socket.on("connect_error", onConnectError);

    return () => {
      socket.off("onlineUsers", onOnlineUsers);
      socket.off("newMessage", onNewMessage);
      socket.off("connect", pullLatestFromApi);
      socket.off("reconnect", pullLatestFromApi);
      socket.off("connect_error", onConnectError);
    };
  }, [isAuthenticated, userProfile?._id, dispatch]);

  return (
    <div
      data-theme={chatTheme}
      className="flex h-screen w-full flex-col md:flex-row overflow-hidden"
    >
      {/* Sidebar: full width on mobile, fixed column on md+ */}
      <div
        className={`w-full md:w-auto md:shrink-0 ${
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
