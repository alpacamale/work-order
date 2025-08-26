import User from "../models/User";
import bcrypt from "bcrypt"; // 비밀번호 해시용
import jwt from "jsonwebtoken";

// 로그인
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user)
      return res.status(400).json({ message: "아이디가 존재하지 않습니다." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "비밀번호가 일치하지 않습니다." });

    // JWT 발급
    if (!process.env.JWT_SECRET)
      return res
        .status(503)
        .json({ message: "환경변수가 설정되지 않았습니다." });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.cookie("token", token, { httpOnly: true }); // 쿠키에 토큰 저장
    res.json({ message: "로그인 성공", token });
  } catch (err) {
    res.status(500).json({ message: "로그인 실패", error: err.message });
  }
};

// 로그아웃
export const logout = (req, res) => {
  res.clearCookie("token");
  res.json({ message: "로그아웃 성공" });
};
