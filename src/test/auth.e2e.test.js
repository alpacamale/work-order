import "dotenv/config";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import request from "supertest";
import app from "../server.js"; // express app

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
  await mongoose.connection.db.dropDatabase(); // 테스트 간 데이터 초기화
});

describe("Auth E2E Test", () => {
  it("회원가입 성공", async () => {
    const res = await request(app).post("/v1/auth/register").send({
      name: "홍길동",
      position: "개발자",
      username: "hong",
      password: "1234",
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe("회원가입 성공");
    expect(res.body.user.username).toBe("hong");
  });

  it("로그인 성공 후 쿠키 발급", async () => {
    // 회원가입 먼저
    await request(app).post("/v1/auth/register").send({
      name: "홍길동",
      position: "개발자",
      username: "hong",
      password: "1234",
    });

    // 로그인
    const res = await request(app)
      .post("/v1/auth/login")
      .send({ username: "hong", password: "1234" });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("로그인 성공");
    expect(res.headers["set-cookie"]).toBeDefined(); // 쿠키 확인
  });

  it("로그아웃 성공 (쿠키 삭제)", async () => {
    const res = await request(app).post("/v1/auth/logout");
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("로그아웃 성공");
  });

  it("회원탈퇴 성공", async () => {
    // 회원가입 & 로그인
    await request(app).post("/v1/auth/register").send({
      name: "홍길동",
      position: "개발자",
      username: "hong",
      password: "1234",
    });

    const loginRes = await request(app)
      .post("/v1/auth/login")
      .send({ username: "hong", password: "1234" });

    const cookie = loginRes.headers["set-cookie"];

    // 회원탈퇴
    const deleteRes = await request(app)
      .delete("/v1/auth/delete")
      .set("Cookie", cookie);

    expect(deleteRes.statusCode).toBe(200);
    expect(deleteRes.body.message).toBe("회원탈퇴 성공");
  });
});
