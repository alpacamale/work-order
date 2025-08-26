import * as commentService from "../services/commentService.js";

// 댓글 생성
export const createComment = async (req, res) => {
  const comment = await commentService.createComment({
    content: req.body.content,
    postId: req.params.id,
    userId: req.user.id,
  });
  console.log("saved comment:", comment);
  res.status(201).json(comment);
};

// 특정 게시글의 댓글 조회
export const getComments = async (req, res) => {
  const comments = await commentService.getComments(req.params);
  res.json(comments);
};

// 댓글 수정
export const updateComment = async (req, res) => {
  const comment = await commentService.updateComment({
    commentId: req.params.id,
    userId: req.user.id,
    content: req.body.content,
  });
  res.json(comment);
};

// 댓글 삭제
export const deleteComment = async (req, res) => {
  const result = commentService.deleteComment({
    commentId: req.params.id,
    userId: req.user.id,
  });
  res.json(result);
};
