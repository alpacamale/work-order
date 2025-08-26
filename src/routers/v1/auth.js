import express from "express";
import { login, logout } from "../../controllers/authController.js";

const router = express.Router();

// POST /v1/auth/login
router.post("/login", login);

// POST /v1/auth/logout
router.post("/logout", logout);

export default router;
