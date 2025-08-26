import * as postService from "../services/postService.js";

// 글 생성
export const createPost = async (req, res) => {
  const { title, content, category } = req.body;
  const post = await postService.createPost({
    title,
    content,
    category,
    authorId: req.user.id,
  });
  res.status(201).json(post);
};

// 모든 글 조회
export const getPosts = async (req, res) => {
  const posts = await postService.getPosts();
  res.json(posts);
};

// 특정 글 조회
export const getPost = async (req, res) => {
  const post = await postService.getPost(req.params);
  res.json(post);
};

// 글 수정
export const updatePost = async (req, res) => {
  const updated = await postService.updatePost({
    postId: req.params.id,
    userId: req.user.id,
    data: req.body,
  });
  res.json(updated);
};

// 글 삭제
export const deletePost = async (req, res) => {
  const result = await postService.deletePost({
    postId: req.params.id,
    userId: req.user.id,
  }); // ✅ 권한 확인 후 삭제
  res.json(result);
};

// 카테고리 업데이트
export const updatePostCategory = async (req, res) => {
  const updated = await postService.updatePostCategory({
    postId: req.params.id,
    userId: req.user.id,
    category: req.body.category,
  });
  res.json({ category: updated.category });
};
