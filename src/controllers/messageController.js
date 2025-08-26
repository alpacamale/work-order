import * as messageService from "../services/messageService.js";

// ✅ Create
export const createMessage = async (req, res) => {
  const message = await messageService.createMessage({
    text: req.body.text,
    roomId: req.params.id,
    userId: req.user.id,
  });
  res.status(201).json(message);
};

// ✅ Read (해당 방 메시지 목록)
export const getMessages = async (req, res) => {
  const messages = await messageService.getMessages({
    roomId: req.params.id,
  });
  res.json(messages);
};

// ✅ Update
export const updateMessage = async (req, res) => {
  const message = await messageService.updateMessage({
    mid: req.params.id,
    userId: req.user.id,
    text: req.body.text,
  });
  res.json(message);
};

// ✅ Delete
export const deleteMessage = async (req, res) => {
  const result = await messageService.deleteMessage({
    mid: req.params.id,
    userId: req.user.id,
  });
  res.json(result);
};
