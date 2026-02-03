import { useDispatch, useSelector } from "react-redux";
import UserChat from "./UserChat";
import {
  getOtherUsersThunk,
  logoutThunk,
} from "../redux/features/user/user.thunk.js";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { disconnectSocket as disconnectSocketAction } from "../redux/features/socket/socket.slice.js";
import { disconnectSocket as disconnectSocketClient } from "../socket/socket.js";
import { getAvatarUrl } from "./utilities/avatarUrl.js";

const SidebarChat = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userProfile, otherUsers } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(getOtherUsersThunk());
  }, [dispatch]);

  const handleLogout = async () => {
    let result = await dispatch(logoutThunk());
    // ensure the real socket.io-client connection is closed, then clear Redux socket state
    disconnectSocketClient();
    dispatch(disconnectSocketAction());
    if (logoutThunk.fulfilled.match(result)) {
      toast.success("Successfully Logged Out!");
      navigate("/");
    }
  };
  if (!userProfile) return null;
  return (
    <div className="w-full md:max-w-[20em] md:w-full h-full md:h-screen border-b md:border-b-0 md:border-r border-base-200 flex flex-col pl-3 gap-2">
      <div className="flex items-center gap-2 justify-self-start pt-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="34"
          height="34"
          viewBox="0 0 24 24"
          fill="white"
          stroke="#009435"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-message-circle"
        >
          <path d="M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719" />
        </svg>
        <div className="text-3xl font-bold">ChatWave</div>
      </div>
      <div className="h-16 pr-1 mt-2 md:mt-0">
        <label className="input rounded-2xl">
          <svg
            className="h-[1em] opacity-50"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <g
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeWidth="2.5"
              fill="none"
              stroke="currentColor"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.3-4.3"></path>
            </g>
          </svg>
          <input type="search" required placeholder="Search" />
        </label>
      </div>

      <div className="overflow-y-auto flex flex-col flex-1">
        {otherUsers?.map((user) => {
          return <UserChat key={user?._id} userDetails={user} />;
        })}
      </div>
      <div className="flex items-center justify-around h-16 p-4 bg-base-200 hover:bg-base-300 cursor-pointer transition mt-auto">
        <div className="avatar">
          <div className="mask mask-squircle w-12 h-12">
            <img src={getAvatarUrl(userProfile.avatar)} alt="user" />
          </div>
        </div>

        <div className="text-base font-semibold">{userProfile.fullname}</div>
        <button onClick={handleLogout} className="btn btn-success">
          Logout
        </button>
      </div>
    </div>
  );
};

export default SidebarChat;
