import User from "../../models/User";
import bcrypt from "bcrypt"; // 비밀번호 해시용
import jwt from "jsonwebtoken";

// 회원가입
export const register = async (req, res) => {
  try {
    const { name, position, username, password } = req.body;

    // 중복 체크
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "이미 존재하는 아이디입니다." });
    }

    // 비밀번호 해시
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      position,
      username,
      password: hashedPassword,
    });
    await user.save();

    res.status(201).json({
      message: "회원가입 성공",
      user: { id: user._id, username: user.username },
    });
  } catch (err) {
    res.status(500).json({ message: "회원가입 실패", error: err.message });
  }
};

// 로그인
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user)
      return res.status(400).json({ message: "아이디가 존재하지 않습니다." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "비밀번호가 일치하지 않습니다." });

    // JWT 발급
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

// 회원탈퇴
export const deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id; // 미들웨어에서 JWT 검증 후 넣어줌
    await User.findByIdAndDelete(userId);
    res.json({ message: "회원탈퇴 성공" });
  } catch (err) {
    res.status(500).json({ message: "회원탈퇴 실패", error: err.message });
  }
};
