import Comment from "../models/Comment.js";
import AppError from "../utils/AppError.js";

export const createComment = async ({ content, postId, userId }) => {
  const comment = new Comment({
    content,
    post: postId,
    author: userId,
  });
  console.log("comment: ", comment);

  return await comment.save();
};

export const getComments = async ({ id }) =>
  await Comment.find({ post: id }).populate("author mentions");

export const updateComment = async ({ commentId, userId, content }) => {
  const comment = await Comment.findById(commentId);
  if (!comment) throw new AppError("Comment not found", 404);

  // 권한 확인
  if (comment.author.toString() !== userId)
    throw new AppError("수정 권한 없음", 403);

  // 수정 가능 필드만 반영
  if (content) comment.content = content;

  return await comment.save();
};

export const deleteComment = async ({ commentId, userId }) => {
  const comment = await Comment.findById(commentId);
  if (!comment) throw new AppError("Comment not found");

  // 권한 확인
  if (comment.author.toString() !== userId)
    throw new AppError("삭제 권한 없음", 403);

  await comment.deleteOne();
  return { success: true, message: "Comment deleted" };
};
