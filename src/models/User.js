import mongoose from "mongoose";
import bcrypt from "bcrypt";
const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    position: { type: String, required: true }, // 직급
    profileImage: { type: String }, // 프로필 사진 URL (S3 등)
    securityLevel: { type: Number, default: 1 }, // 보안 등급
    username: { type: String, required: true, unique: true }, // 아이디
    password: { type: String, required: true }, // 비밀번호 (해시 저장)
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 5);
  }
  next();
});

const User = model("User", userSchema);
export default User;
