import { useDispatch, useSelector } from "react-redux";
import { setSelectedUser } from "../redux/features/user/user.slice";
import { getAvatarUrl } from "./utilities/avatarUrl.js";

const UserChat = ({ userDetails }) => {
  const dispatch = useDispatch();
  const { selectedUser } = useSelector((state) => state.user);
  const { onlineUsers } = useSelector((state) => state.socket);
  const isUserOnline = onlineUsers?.includes(userDetails?._id);

  const handleClick = () => {
    dispatch(setSelectedUser(userDetails));
  };
  return (
    <div
      onClick={handleClick}
      className={`flex items-center gap-3 h-18 p-2 border-b  border-b-base-300 bg-base-50 hover:bg-base-300 cursor-pointer transition ${userDetails?._id === selectedUser?._id && "bg-base-300"}`}
    >
      <div className={`avatar ${isUserOnline && "avatar-online"}`}>
        <div className="mask mask-squircle w-12 h-12">
          <img src={getAvatarUrl(userDetails?.avatar)} alt="user" />
        </div>
      </div>
      <div className="flex flex-col overflow-hidden">
        <span className="text-base font-semibold">{userDetails?.fullname}</span>
        <span className="text-sm text-base-content/70 overflow-hidden whitespace-nowrap text-ellipsis max-w-50">
          {userDetails?.username}
        </span>
      </div>
    </div>
  );
};

export default UserChat;
