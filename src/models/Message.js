import mongoose from "mongoose";
import ChatRoom from "../models/ChatRoom.js";
import User from "../models/User.js";
const { Schema, model } = mongoose;

const messageSchema = new Schema({
  roomId: { type: Schema.Types.ObjectId, ref: "ChatRoom", required: true },
  sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
  text: { type: String, required: true },
  mentions: [{ type: Schema.Types.ObjectId, ref: "User" }], // 멘션된 유저들
  // Work Order 특성에 맞게 파일/작업 링크도 지원 가능
  attachments: [{ url: String, type: String }],
  createdAt: { type: Date, default: Date.now },
});

messageSchema.pre("save", async function (next) {
  try {
    if (!this.text) {
      this.mentions = [];
      return next();
    }

    // 방 정보 가져오기
    const room = await ChatRoom.findById(this.roomId);
    if (!room) return next(new Error("ChatRoom not found"));

    // 멘션된 username 파싱
    const mentionRegex = /@([a-zA-Z0-9_.-]+)/g;
    const usernames = [];
    let match;
    while ((match = mentionRegex.exec(this.text)) !== null) {
      usernames.push(match[1]);
    }

    if (usernames.length === 0) {
      this.mentions = [];
      return next();
    }

    // 유저 조회
    const users = await User.find({ username: { $in: usernames } });

    this.mentions = users.map((u) => u._id);

    // ✅ 멘션된 유저 중 아직 방에 없는 사람 → participants에 추가
    const newUserIds = users
      .map((u) => u._id.toString())
      .filter(
        (uid) => !room.participants.map((p) => p.toString()).includes(uid)
      );

    if (newUserIds.length > 0) {
      room.participants.push(...newUserIds);
      await room.save();
    }

    next();
  } catch (err) {
    next(err);
  }
});

const Message = model("Message", chatRoomSchema);
export default Message;
