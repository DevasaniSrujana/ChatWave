import jwt from "jsonwebtoken";
export const sendToken = (user, statusCode, res) => {
  const tokenData = {
    _id: user?._id,
  };
  const token = jwt.sign(tokenData, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXP,
  });
  res
    .status(statusCode)
    .cookie("token", token, {
      expires: new Date(
        Date.now() + process.env.COOKIE_EXP * 24 * 60 * 60 * 1000,
      ),
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      secure: true,
    })
    .json({
      success: true,
      responseData: { user, token },
    });
};
