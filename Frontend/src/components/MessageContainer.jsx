const MessageContainer = () => {
  return (
    <div className="h-full md:h-screen w-full flex flex-col items-center justify-center px-4">
      <div className="bg-[#009435] p-3 rounded-xl mt-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="white"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719" />
        </svg>
      </div>
      <h1 className="text-3xl font-bold mt-3">Welcome to ChatWave</h1>
      <p className="text-gray-500 text-center font-semibold w-full md:w-[30vw]">
        Select a conversation from the sidebar to start messaging, or create a
        new chat to connect with friends.
      </p>
    </div>
  );
};

export default MessageContainer;
