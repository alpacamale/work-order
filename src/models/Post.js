import mongoose from "mongoose";
import User from "./User.js";
const { Schema, model } = mongoose;

const postSchema = new Schema(
  {
    title: { type: String, required: true }, // 제목
    category: {
      // 분류
      type: String,
      enum: ["공지사항", "새로운 작업", "진행중", "완료"],
      required: true,
    },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true }, // 작업 지시자
    importance: {
      type: String,
      enum: ["Urgent", "Priority", "Trivial", "Optional"],
      default: "Priority",
    },
    content: { type: String }, // 내용
    date: { type: Date, default: Date.now }, // 날짜
    mentions: [{ type: Schema.Types.ObjectId, ref: "User" }], // 관계자 멘션
  },
  { timestamps: true }
);

// pre-save 훅: content 안의 멘션 자동 추출
postSchema.pre("save", async function (next) {
  try {
    if (!this.content) {
      this.mentions = [];
      return next();
    }

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

    const users = await User.find({ username: { $in: usernames } });
    this.mentions = users.map((u) => u._id);

    next();
  } catch (err) {
    next(err);
  }
});

const Post = model("Post", postSchema);
export default Post;
