import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import User from "../models/User.js";
import bcrypt from "bcrypt";

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await User.deleteMany({});
});

describe("User Model", () => {
  it("should hash password before saving", async () => {
    const user = new User({
      name: "홍길동",
      position: "개발자",
      username: "hong",
      password: "1234",
    });
    await user.save();

    const savedUser = await User.findOne({ username: "hong" });
    expect(savedUser.password).not.toBe("1234"); // 비밀번호가 해시되었는지 확인
    expect(await bcrypt.compare("1234", savedUser.password)).toBe(true);
  });

  it("should not re-hash password if not modified", async () => {
    const user = new User({
      name: "이몽룡",
      position: "팀장",
      username: "lee",
      password: "abcd",
    });
    await user.save();

    const originalPasswordHash = user.password;

    user.name = "성춘향"; // 비번 말고 다른 필드 수정
    await user.save();

    expect(user.password).toBe(originalPasswordHash); // 비밀번호는 안 바뀜
  });
});
