import * as chatRoomService from "../services/chatRoomService.js";

// ✅ Create
export const createRoom = async (req, res) => {
  const room = await chatRoomService.createRoom({
    id: req.user.id,
    name: req.body.name,
    participants: req.body.participants,
  });
  res.status(201).json(room);
};

// ✅ Read (목록)
export const getRooms = async (req, res) => {
  const rooms = await chatRoomService.getRooms(req.user);
  res.json(rooms);
};

// ✅ Read (상세)
export const getRoom = async (req, res) => {
  const room = await chatRoomService.getRoom(req.params);
  res.json(room);
};

// ✅ Update
export const updateRoom = async (req, res) => {
  const room = await chatRoomService.updateRoom({
    roomId: req.params.id,
    userId: req.user.id,
    data: req.body,
  });
  res.json(room);
};

// ✅ Delete
export const deleteRoom = async (req, res) => {
  const result = await chatRoomService.deleteRoom({
    roomId: req.params.id,
    userId: req.user.id,
  });
  res.json(result);
};
