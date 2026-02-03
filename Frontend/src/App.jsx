import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";
import Login from "./pages/Authentication/Login";
import Signup from "./pages/Authentication/Signup";
import Chat from "./pages/Home/Chat";
import { Toaster } from "react-hot-toast";
import ProtectedRoutes from "./components/ProtectedRoutes";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getProfileThunk } from "./redux/features/user/user.thunk";

const App = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getProfileThunk());
  }, [dispatch]);

  return (
    <div className="w-screen h-screen bg-[#EBF9F0]">
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/chat"
          element={
            <ProtectedRoutes>
              <Chat />
            </ProtectedRoutes>
          }
        />
      </Routes>
    </div>
  );
};

export default App;
