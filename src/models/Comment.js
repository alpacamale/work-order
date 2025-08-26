import mongoose from "mongoose";
import User from "../models/User.js";
import Post from "../models/Post.js";
const { Schema, model } = mongoose;

const commentSchema = new Schema(
  {
    post: { type: Schema.Types.ObjectId, ref: "Post", required: true }, // 글 ID
    author: { type: Schema.Types.ObjectId, ref: "User", required: true }, // 댓글 작성자
    content: { type: String, required: true }, // 댓글 내용
    mentions: [{ type: Schema.Types.ObjectId, ref: "User" }], // 댓글 멘션
  },
  { timestamps: true }
);

// @를 이용한 멘션

commentSchema.pre("save", async function (next) {
  try {
    // 1. 댓글이 달린 게시글 가져오기
    const post = await Post.findById(this.post).select("mentions").lean();
    if (!post) {
      return next(new Error("Invalid post reference"));
    }

    // 2. 댓글 내용에서 @username 패턴 추출
    const mentionRegex = /@([a-zA-Z0-9_.-]+)/g;
    const usernames = [];
    let match;

    while ((match = mentionRegex.exec(this.content)) !== null) {
      usernames.push(match[1]);
    }

    if (usernames.length === 0) {
      this.mentions = [];
      return next();
    }

    // 3. 해당 username 가진 유저들 찾기
    const users = await User.find({ username: { $in: usernames } });

    // 4. 글 mentions 배열에 포함된 유저만 필터링
    const allowedUserIds = post.mentions.map((id) => id.toString());
    this.mentions = users
      .filter((u) => allowedUserIds.includes(u._id.toString()))
      .map((u) => u._id);

    next();
  } catch (err) {
    next(err);
  }
});

const Comment = model("Comment", commentSchema);
export default Comment;
