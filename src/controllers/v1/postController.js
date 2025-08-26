import Post from "../../models/Post.js";

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
    const { title, content, category } = req.body;

    console.log("req.user:", req.user);

    const post = new Post({ title, content, category, author: req.user?.id });
    const saved = await post.save();

    console.log("saved post:", saved);

    res.status(201).json(saved);
  } catch (err) {
    console.error("post save error:", err);
    res.status(400).json({ error: err.message });
  }
};

// 글 수정
export const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ message: "수정 권한 없음" });
    }

    post.title = req.body.title || posttitle;
    post.content = req.body.content || post.content;
    post.category = req.body.category || post.category;

    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: "게시글 수정 실패", error: err.message });
  }
};

// 글 삭제
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ message: "삭제 권한 없음" });
    }

    await post.deleteOne(); // ✅ 권한 확인 후 삭제
    res.status(204).end();
  } catch (err) {
    console.error("deletePost error:", err);
    res.status(500).json({ error: err.message });
  }
};
