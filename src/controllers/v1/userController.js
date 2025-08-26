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
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // 권한 체크: 본인만 수정 가능 (관리자 권한 로직 추가도 가능)
    if (req.user.id !== user._id.toString()) {
      return res.status(403).json({ message: "수정 권한 없음" });
    }

    // 허용할 필드만 수정 (화이트리스트 방식)
    const allowed = ["name", "position", "profileImage"];
    for (const field of allowed) {
      if (req.body[field] !== undefined) {
        user[field] = req.body[field];
      }
    }

    await user.save();
    res.json(user);
  } catch (err) {
    console.error("updateUser error:", err);
    res.status(400).json({ error: err.message });
  }
};

// 유저 삭제
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // 권한 체크 (본인만 삭제 가능, 관리자 권한 로직 추가 가능)
    if (req.user.id !== user._id.toString()) {
      return res.status(403).json({ message: "삭제 권한 없음" });
    }

    // 해당 유저가 작성한 Post 삭제
    await Post.deleteMany({ author: user._id });

    // 유저 삭제
    await user.deleteOne();

    res.status(204).end();
  } catch (err) {
    console.error("deleteUser error:", err);
    res.status(500).json({ error: err.message });
  }
};
