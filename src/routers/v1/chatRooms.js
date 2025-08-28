import express from "express";
import {
  createRoom,
  getRooms,
  getRoom,
  updateRoom,
  deleteRoom,
} from "../../controllers/chatRoomController.js";
import {
  getMessages,
  createMessage,
} from "../../controllers/messageController.js";
import mongoose from "mongoose";

const router = express.Router();

router.param("id", (req, res, next, id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid ObjectId" });
  }
  next();
});

// ChatRoom 라우트
router.route("/").get(getRooms).post(createRoom);
router.route("/:id").get(getRoom).put(updateRoom).delete(deleteRoom);

// Message 라우트
router.route("/:id/messages").get(getMessages).post(createMessage);

export default router;
