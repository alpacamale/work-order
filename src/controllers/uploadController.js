import * as uploadService from "../services/uploadService.js";

// uploadController.js
import multer from "multer";

// multer: 로컬 메모리에서 파일 받기
const storage = multer.memoryStorage();
export const upload = multer({ storage });

export const uploadProfileImage = async (req, res) => {
  const fileUrl = await uploadService.uploadProfileImage({ file: req.file });
  res.json({ url: fileUrl });
};

export const uploadDocuments = async (req, res) => {
  const urls = await uploadService.uploadDocuments({ files: req.files });
  res.json({ urls });
};
