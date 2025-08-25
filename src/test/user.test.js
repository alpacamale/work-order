import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import User from "../models/User";

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

describe("User Model (no password hashing)", () => {
  it("should save password as plain text", async () => {
    const user = new User({
      name: "홍길동",
      position: "개발자",
      username: "hong",
      password: "1234",
    });
    await user.save();

    const savedUser = await User.findOne({ username: "hong" });
    expect(savedUser.password).toBe("1234"); // 비밀번호 그대로 저장
  });

  it("should keep password unchanged if another field is modified", async () => {
    const user = new User({
      name: "이몽룡",
      position: "팀장",
      username: "lee",
      password: "abcd",
    });
    await user.save();

    const originalPassword = user.password;

    user.name = "성춘향"; // 비밀번호 말고 다른 필드 수정
    await user.save();

    expect(user.password).toBe(originalPassword); // 비밀번호는 그대로 유지
  });
});
