import User from "../../models/User.js";
import Post from "../../models/Post.js";

// 모든 유저 조회
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").populate("posts");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 특정 유저 조회
export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password")
      .populate("posts");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 유저 생성
export const createUser = async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// 유저 수정
export const updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// 유저 삭제
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    // 유저 삭제 시 해당 유저가 작성한 Post도 삭제
    await Post.deleteMany({ author: user._id });

    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
