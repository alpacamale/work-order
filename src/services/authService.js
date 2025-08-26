import User from "../models/User";
import bcrypt from "bcrypt"; // 비밀번호 해시용
import jwt from "jsonwebtoken";
import AppError from "../utils/AppError.js";

export const login = async ({ username, password }) => {
  const user = await User.findOne({ username });
  if (!user) throw new AppError("Username not exiest", 400);

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new AppError("Password is not valid", 401);

  if (!process.env.JWT_SECRET)
    throw new AppError("환경변수가 설정되지 않았습니다", 503);

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  return { user, token };
};
