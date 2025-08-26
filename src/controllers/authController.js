import * as authService from "../services/authService.js";

// 로그인
export const login = async (req, res) => {
  const { user, token } = await authService.login(req.body);
  res.json({
    user: { id: user._id, username: user.username },
    token,
  });
};

// 로그아웃
export const logout = (req, res) => {
  res.clearCookie("token");
  res.json({ message: "로그아웃 성공" });
};
