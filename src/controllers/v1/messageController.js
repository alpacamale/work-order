import Message from "../../models/Message.js";
import ChatRoom from "../../models/ChatRoom.js";
import User from "../../models/User.js";

// ✅ Create
export const createMessage = async (req, res) => {
  try {
    const { text } = req.body;
    const roomId = req.params.id;

    const room = await ChatRoom.findById(roomId);
    if (!room) return res.status(404).json({ error: "Room not found" });

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
      sender: req.user.id,
      text,
      mentions: users.map((u) => u._id),
    });
    await message.save();

    // ✅ 방에 없는 유저 멘션 → 자동 초대
    const newUserIds = users
      .map((u) => u._id.toString())
      .filter(
        (uid) => !room.participants.map((p) => p.toString()).includes(uid)
      );
    if (newUserIds.length > 0) {
      room.participants.push(...newUserIds);
      await room.save();
    }

    res.status(201).json(message);
  } catch (err) {
    console.error("400 error: ", err.message);
    res.status(400).json({ error: err.message });
  }
};

// ✅ Read (해당 방 메시지 목록)
export const getMessages = async (req, res) => {
  const messages = await Message.find({ roomId: req.params.id })
    .sort({ createdAt: 1 })
    .populate("sender", "username")
    .populate("mentions", "username");
  res.json(messages);
};

// ✅ Update
export const updateMessage = async (req, res) => {
  const msg = await Message.findById(req.params.id);

  if (!msg) return res.status(404).json({ error: "Message not found" });

  if (msg.sender.toString() !== req.user.id)
    return res.status(403).json({ message: "수정 권한 없음" });

  msg.text = req.body.text;
  await msg.save();
  res.json(msg);
};

// ✅ Delete
export const deleteMessage = async (req, res) => {
  const msg = await Message.findById(req.params.id);

  if (!msg) return res.status(404).json({ error: "Message not found" });

  if (msg.sender.toString() !== req.user.id)
    return res.status(403).json({ message: "삭제 권한 없음" });

  await msg.deleteOne();
  res.status(200).json({ message: "Message deleted" });
};
