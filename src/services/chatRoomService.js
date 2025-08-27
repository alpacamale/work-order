import AppError from "../utils/AppError.js";
import ChatRoom from "../models/ChatRoom";
import mongoose from "mongoose";

export const createRoom = async ({ id, name, participants }) => {
  // id: 현재 로그인한 유저의 ObjectId string
  const all = [id, ...(participants || [])];

  // 1) 문자열 기준 중복 제거
  const unique = [...new Set(all.map(String))];

  // 2) 유효성 검사 + 변환
  const objectIds = unique.map((id) => {
    if (!mongoose.isValidObjectId(id)) {
      throw new AppError(`Invalid participant id: ${id}`, 400);
    }
    return new mongoose.Types.ObjectId(id);
  });

  // 3) 생성
  const room = new ChatRoom({
    name,
    participants: objectIds,
  });

  return await room.save();
};

export const getRooms = async ({ id }) => {
  return await ChatRoom.find({ participants: id }).populate(
    "participants",
    "username name"
  );
};

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
