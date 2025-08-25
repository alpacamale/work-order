import Comment from "../../models/Comment.js";
import Post from "../../models/Post.js";

// 특정 게시글의 댓글 조회
export const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId })
      .populate("author")
      .populate("mentions");
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 댓글 생성
export const createComment = async (req, res) => {
  try {
    const comment = new Comment({ ...req.body, post: req.params.postId });
    await comment.save();

    // Post에 댓글 연결 (필요하다면 Post 모델에 comments 필드 추가)
    await Post.findByIdAndUpdate(req.params.postId, {
      $push: { comments: comment._id },
    });

    res.status(201).json(comment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// 댓글 수정
export const updateComment = async (req, res) => {
  try {
    const comment = await Comment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!comment) return res.status(404).json({ error: "Comment not found" });
    res.json(comment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// 댓글 삭제
export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findByIdAndDelete(req.params.id);
    if (!comment) return res.status(404).json({ error: "Comment not found" });
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
