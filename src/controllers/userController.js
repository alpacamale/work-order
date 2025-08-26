import * as userService from "../services/userService.js";

// 유저 생성
export const createUser = async (req, res) => {
  const user = await userService.createUser(req.body);
  res.status(201).json(user);
};

// 모든 유저 조회
export const getUsers = async (req, res) => {
  const users = userService.getUsers();
  res.json(users);
};

// 특정 유저 조회
export const getUser = async (req, res) => {
  const user = userService.getUser(req.params);
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json(user);
};

// 유저 수정
export const updateUser = async (req, res) => {
  const updatedUser = userService.updateUser(req.params.id, req.body);
  res.json(updatedUser);
};

// 유저 삭제
export const deleteUser = async (req, res) => {
  const result = await userService.deleteUser({
    paramId: req.params.id,
    userId: req.user.id,
  });
  res.json(result);
};
