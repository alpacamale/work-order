import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import User from "../models/User.js";

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
  await User.deleteMany();
});

describe("User Model Test", () => {
  it("✅ 새로운 User 생성", async () => {
    const user = new User({
      name: "김차장", // ✅ 추가됨
      position: "시설물관리팀 차장",
      username: "testuser",
      password: "hashedpassword123",
    });

    const savedUser = await user.save();

    expect(savedUser._id).toBeDefined();
    expect(savedUser.name).toBe("김차장"); // ✅ 필드 검증
    expect(savedUser.securityLevel).toBe(1); // default 값 검증
    expect(savedUser.position).toBe("시설물관리팀 차장"); // 입력값 그대로 확인
  });

  it("❌ 필수 필드 누락 시 에러", async () => {
    const user = new User({});
    let err;

    try {
      await user.save();
    } catch (error) {
      err = error;
    }

    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.name).toBeDefined(); // ✅ name 필수 확인
    expect(err.errors.username).toBeDefined();
    expect(err.errors.password).toBeDefined();
    expect(err.errors.position).toBeDefined();
  });

  it("✅ username이 unique인지 확인", async () => {
    const user1 = new User({
      name: "홍길동", // ✅ name 필드 추가
      position: "개발자",
      username: "dupuser",
      password: "pass1",
    });
    await user1.save();

    const user2 = new User({
      name: "김철수", // ✅ name 필드 추가
      position: "개발자",
      username: "dupuser", // 동일 username
      password: "pass2",
    });

    let err;
    try {
      await user2.save();
    } catch (error) {
      err = error;
    }

    expect(err).toBeDefined();
    expect(err.code).toBe(11000); // MongoDB duplicate key error code
  });
});
