import Comment from "../models/Comment.js";

// 특정 게시글의 댓글 조회
export const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.id })
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
    const { content } = req.body;
    const { id } = req.params;

    const comment = new Comment({
      content,
      post: id,
      author: req.user.id, // 로그인된 유저 ID
    });

    await comment.save();
    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ message: "댓글 작성 실패", error: err.message });
  }
};

// 댓글 수정
export const updateComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    if (comment.author.toString() !== req.user.id) {
      return res.status(403).json({ message: "수정 권한 없음" });
    }

    // 수정 가능 필드만 반영 (보안상 전체 req.body 적용은 위험)
    if (req.body.content) {
      comment.content = req.body.content;
    }

    await comment.save();
    res.json(comment);
  } catch (err) {
    console.error("updateComment error:", err);
    res.status(400).json({ error: err.message });
  }
};

// 댓글 삭제
export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    if (comment.author.toString() !== req.user.id) {
      return res.status(403).json({ message: "삭제 권한 없음" });
    }

    await comment.deleteOne(); // ✅ 권한 확인 후 삭제
    res.status(200).json({ message: "댓글 삭제 성공" });
  } catch (err) {
    console.error("deleteComment error:", err);
    res.status(500).json({ error: err.message });
  }
};
