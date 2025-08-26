import * as userService from "../services/userService.js";
import AppError from "../utils/AppError.js";

// 유저 생성
export const createUser = async (req, res) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json(user);
  } catch (err) {
    if (err instanceof AppError) {
      return res.status(err.statusCode).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
};

// 모든 유저 조회
export const getUsers = async (req, res) => {
  try {
    const users = userService.getUsers();
    res.json(users);
  } catch (err) {
    if (err instanceof AppError) {
      return res.status(err.statusCode).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
};

// 특정 유저 조회
export const getUser = async (req, res) => {
  try {
    const user = userService.getUser(req.params);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    if (err instanceof AppError) {
      return res.status(err.statusCode).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
};

// 유저 수정
export const updateUser = async (req, res) => {
  try {
    const updatedUser = userService.updateUser(req.params.id, req.body);
    res.json(updatedUser);
  } catch (err) {
    if (err instanceof AppError) {
      return res.status(err.statusCode).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
};

// 유저 삭제
export const deleteUser = async (req, res) => {
  try {
    const result = await userService.deleteUser({
      paramId: req.params.id,
      userId: req.user.id,
    });
    res.json(result);
  } catch (err) {
    if (err instanceof AppError) {
      return res.status(err.statusCode).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
};
