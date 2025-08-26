import express from "express";
import mongoose from "mongoose";
import {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
} from "../../controllers/v1/postController";
import {
  getComments,
  createComment,
} from "../../controllers/v1/commentController";

// mapping route to function
const router = express.Router();

router.route("/").get(getPosts).post(createPost);

router.param("id", (req, res, next, id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid ObjectId" });
  }
  next();
});

router.route("/:id/comments").get(getComments).post(createComment);
router.route("/:id").get(getPost).put(updatePost).delete(deletePost);

// export file for import in other files
export default router;
