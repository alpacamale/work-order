import express from "express";
import mongoose from "mongoose";
import {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} from "../../controllers/v1/userController";
import { authMiddleware } from "../../middleware/authMiddleware";

// mapping route to function
const router = express.Router();

router.param("id", (req, res, next, id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid ObjectId" });
  }
  next();
});

// 공개
router.post("/", createUser);

// 인증 미들웨어
router.use(authMiddleware);

router.get("/", getUsers);
router.route("/:id").get(getUser).put(updateUser).delete(deleteUser);

// export file for import in other files
export default router;
