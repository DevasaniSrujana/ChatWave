import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { motion as Motion } from "motion/react";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { loginThunk } from "../../redux/features/user/user.thunk";
import { useEffect } from "react";

const item = {
  hidden: { x: -100, opacity: 0 },
  show: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.25,
    },
  },
};

const schema = z.object({
  username: z
    .string()
    .min(1, "Username is required")
    .max(30, "Name must be less than 30 characters"),
  password: z.string(),
});

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.user);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
  });
  const handleFormSubmit = async (data) => {
    const result = await dispatch(loginThunk(data));

    if (loginThunk.fulfilled.match(result)) {
      toast.success("Successfully Logged In!");
      navigate("/chat");
    }
  };
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/chat");
    }
  }, [isAuthenticated, navigate]);

  return (
    <Motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="min-h-screen flex items-center justify-center bg-[#EEF2F1]"
    >
      <div className="md:w-[35vw] w-[90%] bg-white rounded-3xl shadow-lg p-8">
        <Motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 1,
            ease: "easeOut",
          }}
          className="flex flex-col items-center gap-2"
        >
          <Link to="/">
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
          </Link>

          <h1 className="text-3xl font-bold mt-3">Welcome</h1>
          <p className="text-gray-500 text-center">
            Sign in to continue to{" "}
            <span className="font-semibold">ChatWave</span>
          </p>
        </Motion.div>

        {isSubmitting && (
          <span className="text-sm text-gray-500">Signing in...</span>
        )}

        <Motion.form
          variants={container}
          initial="hidden"
          animate="show"
          className="mt-8 flex flex-col gap-5"
          onSubmit={handleSubmit(handleFormSubmit)}
        >
          <Motion.div variants={item} className="flex flex-col gap-1">
            <label className="text-sm font-medium">Username</label>
            <input
              className="bg-[#F6F8F8] px-4 py-3 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#009435]"
              {...register("username")}
              placeholder="Enter your username"
            />
            {errors.username && (
              <span className="text-red-500 text-xs">
                {errors.username.message}
              </span>
            )}
          </Motion.div>
          <Motion.div variants={item} className="flex flex-col gap-1">
            <label className="text-sm font-medium">Password</label>
            <input
              type="password"
              className="bg-[#F6F8F8] px-4 py-3 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#009435]"
              {...register("password")}
              placeholder="Enter your password"
            />
            {errors.password && (
              <span className="text-red-500 text-xs">
                {errors.password.message}
              </span>
            )}
          </Motion.div>
          <Motion.button
            variants={item}
            type="submit"
            disabled={isSubmitting}
            className="btn btn-success text-lg font-semibold"
          >
            Sign In
          </Motion.button>
          <Motion.p variants={item} className="mt-6 text-center text-gray-500">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-[#009435] font-semibold hover:underline"
            >
              Sign up
            </Link>
          </Motion.p>
        </Motion.form>
      </div>
    </Motion.div>
  );
};

export default Login;
