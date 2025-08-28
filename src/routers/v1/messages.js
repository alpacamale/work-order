import express from "express";
import mongoose from "mongoose";
import {
  updateMessage,
  deleteMessage,
} from "../../controllers/messageController";

// mapping route to function
const router = express.Router();

router.param("id", (req, res, next, id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid ObjectId" });
  }
  next();
});

router.route("/:id").put(updateMessage).delete(deleteMessage);

// export file for import in other files
export default router;
