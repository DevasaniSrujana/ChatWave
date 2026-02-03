import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { useWatch } from "react-hook-form";
import { motion as Motion } from "motion/react";
import { useDispatch, useSelector } from "react-redux";
import { registerThunk } from "../../redux/features/user/user.thunk";
import toast from "react-hot-toast";
import { useEffect } from "react";

const item = {
  hidden: { x: -100, opacity: 0 },
  show: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.25 },
  },
};

const schema = z
  .object({
    photo: z
      .instanceof(File)
      .optional()
      .refine((file) => !file || file.size <= 2 * 1024 * 1024, {
        message: "Image must be less than 2MB",
      })
      .refine(
        (file) =>
          !file || ["image/jpeg", "image/png", "image/jpg"].includes(file.type),
        {
          message: "Only JPG or PNG images are allowed",
        },
      ),

    fullname: z
      .string()
      .min(1, "Full name is required")
      .max(30, "Name must be less than 30 characters"),

    username: z
      .string()
      .min(1, "Username is required")
      .max(30, "Name must be less than 30 characters"),

    password: z
      .string()
      .min(8, "At least 8 characters")
      .regex(/[A-Z]/, "One uppercase letter required")
      .regex(/[a-z]/, "One lowercase letter required")
      .regex(/[0-9]/, "One number required"),

    confirmPassword: z.string(),
    gender: z.enum(["male", "female", "others"], {
      errorMap: () => ({ message: "Please select a valid gender" }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password does not match",
    path: ["confirmPassword"],
  });

const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.user);
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const photo = useWatch({
    control,
    name: "photo",
  });

  const handleFormSubmit = async (data) => {
    const result = await dispatch(registerThunk(data));

    if (registerThunk.fulfilled.match(result)) {
      toast.success("Account Created Successfully!");
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
      className="min-h-screen flex justify-center bg-[#EEF2F1] pt-12"
    >
      <div className="md:w-[35vw] w-[90%] bg-white rounded-3xl shadow-lg p-8">
        <Motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
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

          <h1 className="text-3xl font-bold mt-3">Create account</h1>
          <p className="text-gray-500 text-center font-semibold">
            Join ChatWave and start messaging
          </p>
        </Motion.div>
        {isSubmitting && (
          <span className="text-sm text-gray-500">Signing up...</span>
        )}
        <Motion.form
          variants={container}
          initial="hidden"
          animate="show"
          className="mt-8 flex flex-col gap-5"
          onSubmit={handleSubmit(handleFormSubmit)}
        >
          <Motion.div
            variants={item}
            className="flex flex-col items-center gap-2"
          >
            <label className="relative cursor-pointer overflow-hidden">
              <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden shadow">
                {photo ? (
                  <img
                    src={URL.createObjectURL(photo)}
                    alt="preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="gray"
                    strokeWidth="2"
                  >
                    <path d="M3 7h3l2-3h8l2 3h3v13H3z" />
                    <circle cx="12" cy="13" r="3" />
                  </svg>
                )}
              </div>
              <div className="absolute -bottom-1 -right-3 p-2 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="30"
                  height="30"
                  viewBox="0 0 24 24"
                  fill="#009435"
                  stroke="#fff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M13.997 4a2 2 0 0 1 1.76 1.05l.486.9A2 2 0 0 0 18.003 7H20a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1.997a2 2 0 0 0 1.759-1.048l.489-.904A2 2 0 0 1 10.004 4z" />
                  <circle cx="12" cy="13" r="3" />
                </svg>
              </div>
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={(e) =>
                  setValue("photo", e.target.files[0], {
                    shouldValidate: true,
                  })
                }
              />
            </label>

            {errors.photo && (
              <span className="text-red-500 text-xs">
                {errors.photo.message}
              </span>
            )}
          </Motion.div>

          <Motion.div variants={item} className="flex flex-col gap-1">
            <label className="text-sm font-medium">Full Name</label>
            <input
              className="bg-[#F6F8F8] px-4 py-3 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#009435]"
              {...register("fullname")}
              placeholder="Enter your fullname"
            />
            {errors.fullname && (
              <span className="text-red-500 text-xs">
                {errors.fullname.message}
              </span>
            )}
          </Motion.div>
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
          <Motion.div variants={item} className="flex flex-col gap-1">
            <label className="text-sm font-medium">Confirm Password</label>
            <input
              type="password"
              className="bg-[#F6F8F8] px-4 py-3 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#009435]"
              {...register("confirmPassword")}
              placeholder="Confirm Password"
            />
            {errors.confirmPassword && (
              <span className="text-red-500 text-xs">
                {errors.confirmPassword.message}
              </span>
            )}
          </Motion.div>
          <Motion.div variants={item} className="flex flex-col gap-1">
            <fieldset className="fieldset">
              <legend className="fieldset-legend text-sm font-medium">
                Gender
              </legend>
              <select
                className="select w-full"
                {...register("gender")}
                defaultValue=""
              >
                <option value="" disabled>
                  Select gender
                </option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="others">Others</option>
              </select>
            </fieldset>
            {errors.gender && (
              <span className="text-red-500 text-xs">
                {errors.gender.message}
              </span>
            )}
          </Motion.div>
          <Motion.button
            variants={item}
            type="submit"
            disabled={isSubmitting}
            className="btn btn-success text-lg font-semibold"
          >
            Create Account
          </Motion.button>
          <Motion.p variants={item} className="mt-6 text-center text-gray-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-[#009435] font-semibold hover:underline"
            >
              Sign in
            </Link>
          </Motion.p>
        </Motion.form>
      </div>
    </Motion.div>
  );
};

export default Signup;
