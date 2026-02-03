import { asyncHandler } from "../utilities/asyncHandler.utility.js";
import { errorHandler } from "../utilities/errorHandler.utility.js";
import { User } from "../models/user.models.js";
import bcrypt from "bcryptjs";
import { sendToken } from "../utilities/sendToken.utility.js";

export const register = asyncHandler(async (req, res, next) => {
  const { fullname, username, password, gender } = req.body;
  if (!fullname || !username || !password || !gender) {
    return next(new errorHandler("All fields are required", 400));
  }

  const user = await User.findOne({ username });
  if (user) {
    return next(new errorHandler("User Already Exists", 400));
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  let avatar;
  if (req.file) {
    avatar = `/uploads/${req.file.filename}`;
  } else {
    avatar = `https://api.dicebear.com/9.x/adventurer/svg?seed=${gender}-${username}`;
  }
  const newUser = await User.create({
    fullname,
    username,
    password: hashedPassword,
    gender,
    avatar,
  });

  // const tokenData = {
  //   _id: newUser?._id,
  // };
  // const token = jwt.sign(tokenData, process.env.JWT_SECRET, {
  //   expiresIn: process.env.JWT_EXP,
  // });

  // res
  //   .status(200)
  //   .cookie("token", token, {
  //     expires: new Date(
  //       Date.now() + process.env.COOKIE_EXP * 24 * 60 * 60 * 1000,
  //     ),
  //     httpOnly: true,
  //     secure: process.env.NODE_ENV === "production",
  //     sameSite: "None",
  //   })
  //   .json({
  //     success: true,
  //     responseData: { newUser, token },
  //   });
  sendToken(newUser, 200, res);
});

export const login = asyncHandler(async (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return next(
      new errorHandler("please enter a valid username or password", 400),
    );
  }

  const user = await User.findOne({ username });
  if (!user) {
    return next(
      new errorHandler("please enter a valid username or password", 400),
    );
  }

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    return next(
      new errorHandler("please enter a valid username or password", 400),
    );
  }

  sendToken(user, 200, res);
});

export const getProfile = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const profile = await User.findById(userId).select("-password");
  res.status(200).json({
    success: true,
    responseData: profile,
  });
});

export const logout = asyncHandler(async (req, res, next) => {
  res
    .status(200)
    .cookie("token", "", {
      expires: new Date(Date.now()),
      httpOnly: true,
    })
    .json({
      success: true,
      message: "logout successful",
    });
});

export const getOtherUsers = asyncHandler(async (req, res, next) => {
  const otherUsers = await User.find({ _id: { $ne: req.user._id } });
  res.status(200).json({
    success: true,
    responseData: otherUsers,
  });
});
