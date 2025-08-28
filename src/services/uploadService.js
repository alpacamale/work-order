import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import path from "path";
import AppError from "../utils/AppError.js";

const s3 = new S3Client({
  region: process.env.AWS_REGION || "ap-northeast-2",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export const uploadProfileImage = async ({ file }) => {
  if (!file) throw new AppError("파일이 없습니다", 400);

  const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
  ];
  if (!allowedMimeTypes.includes(file.mimetype)) {
    throw new AppError("이미지 파일만 업로드할 수 있습니다", 400);
  }

  if (file.size > 5 * 1024 * 1024) {
    throw new AppError("파일 크기는 최대 5MB까지 허용됩니다", 400);
  }

  const fileExt = path.extname(file.originalname).toLowerCase();
  const allowedExt = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
  if (!allowedExt.includes(fileExt)) {
    throw new AppError("지원하지 않는 확장자입니다", 400);
  }

  const fileKey = `profiles/${Date.now()}-${file.originalname}`;

  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET,
    Key: fileKey,
    Body: file.buffer,
    ContentType: file.mimetype,
  });

  await s3.send(command);

  const fileUrl = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;

  return fileUrl;
};

export const uploadDocuments = async ({ files }) => {
  if (!files || files.length === 0) {
    throw new AppError("파일이 없습니다", 400);
  }

  const urls = [];

  for (const file of files) {
    const allowedMimeTypes = [
      // Images
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",

      // Audio
      "audio/mpeg",
      "audio/wav",
      "audio/ogg",
      "audio/webm",

      // Video
      "video/mp4",
      "video/webm",
      "video/ogg",
      "video/x-msvideo",

      // Documents
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new AppError("문서 파일만 업로드할 수 있습니다", 400);
    }

    if (file.size > 20 * 1024 * 1024) {
      throw new AppError("파일 크기는 최대 20MB까지 허용됩니다", 400);
    }

    const fileExt = path.extname(file.originalname).toLowerCase();
    const allowedExt = [
      // Images
      ".jpg",
      ".jpeg",
      ".png",
      ".gif",
      ".webp",

      // Audio
      ".mp3",
      ".wav",
      ".ogg",
      ".webm",

      // Video
      ".mp4",
      ".webm",
      ".ogv",
      ".avi",

      // Documents
      ".pdf",
      ".doc",
      ".docx",
      ".xls",
      ".xlsx",
    ];
    if (!allowedExt.includes(fileExt)) {
      throw new AppError("지원하지 않는 확장자입니다", 400);
    }

    let folder = "others";
    if (file.mimetype.startsWith("image/")) folder = "images";
    else if (file.mimetype.startsWith("audio/")) folder = "audios";
    else if (file.mimetype.startsWith("video/")) folder = "videos";
    else folder = "documents";

    const fileKey = `${folder}/${Date.now()}-${file.originalname}`;

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET,
      Key: fileKey,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    await s3.send(command);
    urls.push(
      `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`
    );
  }

  return urls;
};
