import express from "express";
import mongoose from "mongoose";
import {
  updateComment,
  deleteComment,
} from "../../controllers/commentController";

// mapping route to function
const router = express.Router();

router.param("id", (req, res, next, id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid ObjectId" });
  }
  next();
});

router.route("/:id").put(updateComment).delete(deleteComment);

// export file for import in other files
export default router;
