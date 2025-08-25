import mongoose from "mongoose";
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

const Comment = model("Comment", commentSchema);
export default Comment;
