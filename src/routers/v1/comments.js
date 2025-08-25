import express from "express";
import {
  getComments,
  createComment,
  updateComment,
  deleteComment,
} from "../../controllers/v1/commentController";

// mapping route to function
const router = express.Router();

router.param("id", (req, res, next, id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid ObjectId" });
  }
});

router.route("/").get(getComments).post(createComment);
router.route("/:id").put(updateComment).delete(deleteComment);

// export file for import in other files
export default router;
