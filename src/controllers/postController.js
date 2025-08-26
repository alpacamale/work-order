import * as postService from "../services/postService.js";
import AppError from "../utils/AppError.js";

// 글 생성
export const createPost = async (req, res) => {
  try {
    const { title, content, category } = req.body;
    const post = await postService.createPost({
      title,
      content,
      category,
      authorId: req.user.id,
    });
    res.status(201).json(post);
  } catch (err) {
    if (err instanceof AppError) {
      return res.status(err.statusCode).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
};

// 모든 글 조회
export const getPosts = async (req, res) => {
  try {
    const posts = await postService.getPosts();
    res.json(posts);
  } catch (err) {
    if (err instanceof AppError) {
      return res.status(err.statusCode).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
};

// 특정 글 조회
export const getPost = async (req, res) => {
  try {
    const post = await postService.getPost(req.params);
    res.json(post);
  } catch (err) {
    if (err instanceof AppError) {
      return res.status(err.statusCode).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
};

// 글 수정
export const updatePost = async (req, res) => {
  try {
    const updated = await postService.updatePost({
      paramId: req.params.id,
      userId: req.user.id,
      data: req.body,
    });
    res.json(updated);
  } catch (err) {
    if (err instanceof AppError) {
      return res.status(err.statusCode).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
};

// 글 삭제
export const deletePost = async (req, res) => {
  try {
    const result = await postService.deletePost({
      paramId: req.params.id,
      userId: req.user.id,
    }); // ✅ 권한 확인 후 삭제
    res.json(result);
  } catch (err) {
    if (err instanceof AppError) {
      return res.status(err.statusCode).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
};

export const updatePostCategory = async (req, res) => {
  try {
    const updated = await postService.updatePostCategory({
      paramId: req.params.id,
      userId: req.user.id,
      category: req.body.category,
    });
    res.json({ category: updated.category });
  } catch (err) {
    if (err instanceof AppError) {
      return res.status(err.statusCode).json({ error: err.message });
    }
    console.error("updatePostCategory error:", err);
    res.status(500).json({ error: err.message });
  }
};
