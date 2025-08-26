import Post from "../models/Post.js";
import AppError from "../utils/AppError.js";

export const createPost = async ({ title, content, category, authorId }) => {
  const post = new Post({ title, content, category, author: authorId });
  return await post.save();
};

export const getPosts = async () => {
  return await Post.find().populate("author mentions");
};

export const getPost = async ({ id }) => {
  const post = await Post.findById(id).populate("author mentions");
  if (!post) throw new AppError("Post not found", 404);
  return post;
};

export const updatePost = async ({ paramId, userId, data }) => {
  const post = await Post.findById(paramId);
  if (!post) throw new AppError("Post not found", 404);

  // 권한 확인
  if (post.author.toString() !== userId)
    throw new AppError("수정 권한 없음", 403);

  post.title = data.title || post.title;
  post.content = data.content || post.content;
  post.category = data.category || post.category;

  return await post.save();
};

export const deletePost = async ({ paramId, userId }) => {
  const post = await Post.findById(paramId);
  if (!post) throw new AppError("Post not found", 404);

  // 권한 확인
  if (post.author.toString() !== userId)
    throw new AppError("삭제 권한 없음", 403);
  await post.deleteOne();
  return { success: true, message: "Post deleted" };
};

export const updatePostCategory = async ({ paramId, userId, category }) => {
  const post = await Post.findById(paramId);
  if (!post) throw new AppError("Post not found", 404);

  // 권한 확인
  const isAuthor = post.author.toString() === userId;
  const isMentioned = post.mentions.some((m) => m.toString() === userId);
  if (!isAuthor && !isMentioned) throw new AppError("수정 권한 없음", 403);

  // 유효성 검사
  const allowed = ["공지사항", "새로운 작업", "진행중", "완료"];
  if (!allowed.includes(category))
    throw new AppError("유효하지 않은 카테고리", 422);

  post.category = category;
  return await post.save();
};
