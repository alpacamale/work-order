import * as authService from "../services/authService.js";
import AppError from "../utils/AppError.js";

// 로그인
export const login = async (req, res) => {
  try {
    const { user, token } = await authService.login(req.body);
    res.json({
      user: { id: user._id, username: user.username },
      token,
    });
  } catch (err) {
    if (err instanceof AppError) {
      return res.status(err.statusCode).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
};

// 로그아웃
export const logout = (req, res) => {
  res.clearCookie("token");
  res.json({ message: "로그아웃 성공" });
};
