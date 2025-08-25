import mongoose from "mongoose";
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
    mentionsWorkers: [{ type: Schema.Types.ObjectId, ref: "User" }], // 작업자 멘션
    mentionsRelated: [{ type: Schema.Types.ObjectId, ref: "User" }], // 관계자 멘션
  },
  { timestamps: true }
);

const Post = model("Post", postSchema);
export default Post;
