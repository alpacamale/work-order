import ChatRoom from "../models/ChatRoom";

// ✅ Create
export const createRoom = async (req, res) => {
  try {
    const participants = new Set([
      req.user.id,
      ...(req.body.participants || []),
    ]);

    const room = new ChatRoom({
      name: req.body.name,
      participants: [...participants],
    });

    const saved = await room.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ✅ Read (목록)
export const getRooms = async (req, res) => {
  const rooms = await ChatRoom.find({ participants: req.user.id });
  console.log("All rooms: ", rooms);
  res.json(rooms);
};

// ✅ Read (상세)
export const getRoom = async (req, res) => {
  const room = await ChatRoom.findById(req.params.id).populate(
    "participants",
    "username"
  );
  if (!room) return res.status(404).json({ error: "Room not found" });
  res.json(room);
};

// ✅ Update
export const updateRoom = async (req, res) => {
  try {
    const { id } = req.params;

    // 방 찾기
    const room = await ChatRoom.findById(id);
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    // 권한 확인: 참가자인지 체크
    if (!room.participants.includes(req.user.id)) {
      return res.status(403).json({ error: "Permission denied" });
    }

    // 수정
    Object.assign(room, req.body); // 필요한 필드만 병합하는 게 안전
    await room.save();

    res.json(room);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Delete
export const deleteRoom = async (req, res) => {
  try {
    const { id } = req.params;

    // 방 찾기
    const room = await ChatRoom.findById(id);
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    // 참가자인지 확인
    if (!room.participants.includes(req.user.id)) {
      return res
        .status(403)
        .json({ error: "Only participants can delete this room" });
    }

    // 삭제
    await room.deleteOne();

    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
