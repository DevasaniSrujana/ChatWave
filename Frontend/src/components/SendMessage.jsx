import { Send } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sendMessageThunk } from "../redux/features/message/message.thunk";

const SendMessage = () => {
  const [message, setMesssage] = useState("");
  const dispatch = useDispatch();
  const { selectedUser } = useSelector((state) => state.user);
  const handleSend = () => {
    if (!message.trim() || !selectedUser?._id) return;
    dispatch(sendMessageThunk({ receiverId: selectedUser?._id, message }));
    setMesssage("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };
  return (
    <div className="flex items-center justify-between gap-5 h-16 p-4 bg-base-100 border-t border-t-base-300 cursor-pointer transition">
      <input
        type="text"
        placeholder="Type here"
        className="input input-ghost  p-4 w-full border border-base-300 text-black"
        value={message}
        onChange={(e) => setMesssage(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <Send onClick={handleSend} />
    </div>
  );
};

export default SendMessage;
