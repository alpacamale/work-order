import * as chatRoomService from "../services/chatRoomService.js";
import AppError from "../utils/AppError.js";

// ✅ Create
export const createRoom = async (req, res) => {
  try {
    const room = await chatRoomService.createRoom({
      id: req.user.id,
      name: req.body.name,
      participants: req.body.participants,
    });
    res.status(201).json(room);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Read (목록)
export const getRooms = async (req, res) => {
  try {
    const rooms = await chatRoomService.getRooms(req.user);
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Read (상세)
export const getRoom = async (req, res) => {
  try {
    const room = await chatRoomService.getRoom(req.params);
    res.json(room);
  } catch (err) {
    if (err instanceof AppError) {
      return res.status(err.statusCode).json({ error: err.message });
    }
    console.log("getRoom error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// ✅ Update
export const updateRoom = async (req, res) => {
  try {
    const room = await chatRoomService.updateRoom({
      roomId: req.params.id,
      userId: req.user.id,
      data: req.body,
    });
    res.json(room);
  } catch (err) {
    if (err instanceof AppError) {
      return res.status(err.statusCode).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
};

// ✅ Delete
export const deleteRoom = async (req, res) => {
  try {
    const result = await chatRoomService.deleteRoom({
      roomId: req.params.id,
      userId: req.user.id,
    });
    res.json(result);
  } catch (err) {
    if (err instanceof AppError) {
      return res.status(err.statusCode).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
};
