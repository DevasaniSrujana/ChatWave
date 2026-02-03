import { Link } from "react-router-dom";
import { motion as Motion, AnimatePresence } from "motion/react";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const [menu, setMenu] = useState(false);

  return (
    <Motion.nav
      className="w-full bg-transparent p-5 relative"
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: "easeOut" }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="34"
            height="38"
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
        <div className="hidden md:flex items-center gap-6">
          <Link to="/login">
            <Motion.button
              className="btn btn-soft btn-success"
              whileTap={{ scale: 1.1 }}
            >
              Sign-in
            </Motion.button>
          </Link>
          <Link to="/signup">
            <Motion.button
              whileTap={{ scale: 1.1 }}
              className="btn btn-success"
            >
              Get Started
            </Motion.button>
          </Link>
        </div>
        <button className="md:hidden z-50" onClick={() => setMenu(!menu)}>
          {menu ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>
      <AnimatePresence>
        {menu && (
          <Motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="absolute top-full left-0 w-full md:hidden bg-base-100 p-6 shadow-xl rounded-b-2xl"
          >
            <div className="flex flex-col gap-4">
              <Link to="/login" onClick={() => setMenu(false)}>
                <button className="btn btn-soft btn-success w-full">
                  Sign-in
                </button>
              </Link>

              <Link to="/signup" onClick={() => setMenu(false)}>
                <button className="btn btn-success w-full">Get Started</button>
              </Link>
            </div>
          </Motion.div>
        )}
      </AnimatePresence>
    </Motion.nav>
  );
};

export default Navbar;
