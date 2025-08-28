import express from "express";
import {
  upload,
  uploadProfileImage,
  uploadDocuments,
} from "../../controllers/uploadController.js";

const router = express.Router();

router.post("/profile", upload.single("profile"), uploadProfileImage);
router.post("/documents", upload.array("documents", 5), uploadDocuments);

export default router;
