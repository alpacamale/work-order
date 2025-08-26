import mongoose from "mongoose";
import User from "../models/User.js";
const { Schema, model } = mongoose;

const chatRoomSchema = new Schema(
  {
    name: { type: String }, // 예: "프로젝트 A 작업방"
    participants: [{ type: Schema.Types.ObjectId, ref: "User" }], // 참여자들
  },
  { timestamps: true }
);

const ChatRoom = model("ChatRoom", chatRoomSchema);
export default ChatRoom;
