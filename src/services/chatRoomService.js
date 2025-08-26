import AppError from "../utils/AppError.js";
import ChatRoom from "../models/ChatRoom";

export const createRoom = async ({ id, name, participants }) => {
  const _participants = new Set([id, ...(participants || [])]);

  const room = new ChatRoom({
    name,
    participants: [..._participants],
  });

  return await room.save();
};

export const getRooms = async ({ id }) => await ChatRoom.find({ id });

export const getRoom = async ({ id }) => {
  const room = await ChatRoom.findById(id).populate("participants", "username");
  if (!room) throw new AppError("Room not found", 404);
  return room;
};

export const updateRoom = async ({ roomId, userId, data }) => {
  const room = await ChatRoom.findById(roomId);
  if (!room) throw new AppError("Room not found", 404);

  // 권한 확인
  if (!room.participants.includes(userId))
    throw new AppError("수정 권한 없음", 403);

  Object.assign(room, data);
  return await room.save();
};

export const deleteRoom = async ({ roomId, userId }) => {
  const room = await ChatRoom.findById(roomId);
  if (!room) throw new AppError("Room not found");

  // 권한 확인
  if (!room.participants.includes(userId))
    throw new AppError("삭제 권한 없음", 403);

  await room.deleteOne();
  return { success: true, message: "Room deleted" };
};
