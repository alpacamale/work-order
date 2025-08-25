import express from "express";
import {
  register,
  login,
  logout,
  deleteAccount,
} from "../../controllers/v1/authController.js";
import { authMiddleware } from "../../middleware/authMiddleware.js";

const router = express.Router();

// POST/v1 /auth/register
router.post("/register", register);

// POST /v1/auth/login
router.post("/login", login);

// POST /v1/auth/logout
router.post("/logout", logout);

// DELETE /v1/auth/delete
router.delete("/delete", authMiddleware, deleteAccount);

export default router;
