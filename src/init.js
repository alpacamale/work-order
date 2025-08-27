import "dotenv/config";
import AppError from "../utils/AppError.js";
if (!process.env.DB_URL)
  throw new AppError("DB_URL 환경변수가 설정되지 않았습니다", 500);
if (!process.env.JWT_SECRET)
  throw new AppError("JWT_SECRET 환경변수가 설정되지 않았습니다", 500);
if (!process.env.PORT)
  throw new AppError("PORT 환경변수가 설정되지 않았습니다", 500);

import "./db";
import "./models/Comment";
import "./models/Post";
import "./models/User";
import app from "./server";

const handleListening = () =>
  console.log(`Server listening on http://localhost:${process.env.PORT}`);

app.listen(process.env.PORT, handleListening);
