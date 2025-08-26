import AppError from "../utils/AppError.js";
import Message from "../models/Message.js";
import ChatRoom from "../models/ChatRoom.js";
import User from "../models/User.js";

export const createMessage = async ({ text, roomId, userId }) => {
  const room = await ChatRoom.findById(roomId);
  if (!room) throw new AppError("Room not found", 404);

  // 멘션된 유저 처리
  const mentionRegex = /@([a-zA-Z0-9_.-]+)/g;
  const usernames = [];
  let match;
  while ((match = mentionRegex.exec(text)) !== null) {
    usernames.push(match[1]);
  }
  const users = await User.find({ username: { $in: usernames } });

  const message = new Message({
    roomId,
    sender: userId,
    text,
    mentions: users.map((u) => u._id),
  });

  // ✅ 방에 없는 유저 멘션 → 자동 초대
  const newUserIds = users
    .map((u) => u._id.toString())
    .filter((uid) => !room.participants.map((p) => p.toString()).includes(uid));
  if (newUserIds.length > 0) {
    room.participants.push(...newUserIds);
    await room.save();
  }
  return await message.save();
};

export const getMessages = async ({ roomId }) => {
  return await Message.find({ roomId })
    .sort({ createdAt: 1 })
    .populate("sender", "username")
    .populate("mentions", "username");
};

export const updateMessage = async ({ mid, userId, text }) => {
  const message = await Message.findById(mid);
  if (!message) throw new AppError("Message not found", 404);

  // 권한 확인
  if (message.sender.toString() !== userId)
    throw new AppError("수정 권한 없음", 403);

  message.text = text;
  return await message.save();
};

export const deleteMessage = async ({ mid, userId }) => {
  const message = await Message.findById(mid);
  if (!message) throw new AppError("Message not found", 404);

  // 권한 확인
  if (message.sender.toString() !== userId)
    throw new AppError("삭제 권한 없음", 403);

  await message.deleteOne();
  return { success: true, message: "Message deleted" };
};
