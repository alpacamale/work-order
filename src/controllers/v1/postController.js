import Post from "../../models/Post.js";
import User from "../../models/User.js";

// 모든 글 조회
export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate("author").populate("mentions");
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 특정 글 조회
export const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("author")
      .populate("mentions");
    if (!post) return res.status(404).json({ error: "Post not found" });
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 글 생성
export const createPost = async (req, res) => {
  try {
    const post = new Post(req.body);
    await post.save();

    // 작성자(User)에도 post 연결
    await User.findByIdAndUpdate(post.author, { $push: { posts: post._id } });

    res.status(201).json(post);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// 글 수정
export const updatePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!post) return res.status(404).json({ error: "Post not found" });
    res.json(post);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// 글 삭제
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
