import * as messageService from "../services/messageService.js";
import AppError from "../utils/AppError.js";

// ✅ Create
export const createMessage = async (req, res) => {
  try {
    const message = await messageService.createMessage({
      text: req.body.text,
      roomId: req.params.id,
      userId: req.user.id,
    });
    res.status(201).json(message);
  } catch (err) {
    console.log("500 error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// ✅ Read (해당 방 메시지 목록)
export const getMessages = async (req, res) => {
  try {
    const messages = await messageService.getMessages({
      roomId: req.params.id,
    });
    res.json(messages);
  } catch {
    console.log("errrror:", err.message);
    res.status(500).json({ error: err.messgae });
  }
};

// ✅ Update
export const updateMessage = async (req, res) => {
  try {
    const message = await messageService.updateMessage({
      mid: req.params.id,
      userId: req.user.id,
      text: req.body.text,
    });
    res.json(message);
  } catch (err) {
    if (err instanceof AppError) {
      return res.status(err.statusCode).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
};

// ✅ Delete
export const deleteMessage = async (req, res) => {
  try {
    const result = await messageService.deleteMessage({
      mid: req.params.id,
      userId: req.user.id,
    });
    res.json(result);
  } catch (err) {
    if (err instanceof AppError) {
      return res.status(err.statusCode).json({ error: err.message });
    }
    console.log("errrror:", err.message);
    res.status(500).json({ error: err.message });
  }
};
