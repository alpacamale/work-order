import User from "../models/User.js";
import Post from "../models/Post.js";
import AppError from "../utils/AppError.js";

export const createUser = async ({ username, password, name, position }) => {
  const user = new User({ username, password, name, position });
  return user.save();
};

export const getUsers = async () => {
  return await User.find().select("-password");
};

export const getUser = async ({ id }) => {
  return await User.findById(id).select("-password");
};

export const updateUser = async ({ id, data }) => {
  const user = await User.findById(id);
  if (!user) throw new AppError("User not found", 404);

  // 권한 확인
  if (id !== user._id.toString()) throw new AppError("수정 권한 없음", 403);
  // 허용할 필드만 수정 (화이트리스트 방식)
  const allowed = ["name", "position", "profileImage"];
  for (const field of allowed) {
    if (data[field] !== undefined) {
      user[field] = data[field];
    }
  }

  await user.save();
};

export const deleteUser = async ({ paramId, userId }) => {
  const user = await User.findById(paramId);
  if (!user) throw new AppError("User not found", 404);

  //권한 확인
  if (paramId !== userId.toString()) throw new AppError("삭제 권한 없음", 403);
  // 해당 유저가 삭제한 Post 삭제
  await Post.deleteMany({ author: user._id });

  // 유저 삭제
  await user.deleteOne();

  return { success: true, message: "User deleted" };
};
