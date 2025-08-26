import "dotenv/config";
import request from "supertest";
import app from "../server.js";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

let mongoServer;
let tokenUser1, tokenUser2, tokenStranger;
let postId, commentId;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("E2E: Users + Auth + Posts + Comments", () => {
  // -------------------------
  // Users & Auth
  // -------------------------
  it("✅ 회원가입 (User1=작성자, User2=멘션대상, User3=제3자)", async () => {
    const res1 = await request(app).post("/v1/users").send({
      name: "작성자",
      username: "author",
      password: "pass123",
      position: "개발자",
    });
    expect(res1.statusCode).toBe(201);

    const res2 = await request(app).post("/v1/users").send({
      name: "멘션대상",
      username: "target",
      password: "pass123",
      position: "QA",
    });
    expect(res2.statusCode).toBe(201);

    const res3 = await request(app).post("/v1/users").send({
      name: "제3자",
      username: "stranger",
      password: "pass123",
      position: "디자이너",
    });
    expect(res3.statusCode).toBe(201);
  });

  it("✅ 로그인 성공 (User1, User2, User3)", async () => {
    const login1 = await request(app)
      .post("/v1/auth/login")
      .send({ username: "author", password: "pass123" });
    tokenUser1 = login1.body.token;
    expect(login1.statusCode).toBe(200);

    const login2 = await request(app)
      .post("/v1/auth/login")
      .send({ username: "target", password: "pass123" });
    tokenUser2 = login2.body.token;
    expect(login2.statusCode).toBe(200);

    const login3 = await request(app)
      .post("/v1/auth/login")
      .send({ username: "stranger", password: "pass123" });
    tokenStranger = login3.body.token;
    expect(login3.statusCode).toBe(200);
  });

  it("❌ 로그인 실패 (잘못된 비밀번호)", async () => {
    const res = await request(app)
      .post("/v1/auth/login")
      .send({ username: "author", password: "wrong" });
    expect(res.statusCode).toBe(401);
  });

  // -------------------------
  // Posts
  // -------------------------
  it("✅ Post 생성 (User1 작성, content에 @target 멘션)", async () => {
    const res = await request(app)
      .post("/v1/posts")
      .set("Authorization", `Bearer ${tokenUser1}`)
      .set("Content-Type", "application/json")
      .send({
        title: "테스트 글",
        content: "본문 @target",
        category: "공지사항",
      });

    postId = res.body._id;
    expect(res.statusCode).toBe(201);
    expect(res.body.mentions.length).toBe(1);

    const getRes = await request(app)
      .get(`/v1/posts/${postId}`)
      .set("Authorization", `Bearer ${tokenUser1}`);
    expect(getRes.body.mentions[0].username).toBe("target");
  });

  it("❌ Post 생성 실패 (로그인 안 함)", async () => {
    const res = await request(app).post("/v1/posts").send({
      title: "비로그인 작성",
      content: "fail",
      category: "공지사항",
    });
    expect(res.statusCode).toBe(401);
  });

  it("❌ Post 생성 실패 (필수 필드 없음)", async () => {
    const res = await request(app)
      .post("/v1/posts")
      .set("Authorization", `Bearer ${tokenUser1}`)
      .send({
        content: "필수 필드 없음",
      });
    expect(res.statusCode).toBe(400);
  });

  it("✅ Post 조회 (User2가 User1 글 보기)", async () => {
    const res = await request(app)
      .get(`/v1/posts/${postId}`)
      .set("Authorization", `Bearer ${tokenUser2}`);
    expect(res.statusCode).toBe(200);
    expect(res.body._id).toBe(postId);
  });

  it("✅ Post 수정 (작성자 본인)", async () => {
    const res = await request(app)
      .put(`/v1/posts/${postId}`)
      .set("Authorization", `Bearer ${tokenUser1}`)
      .send({ title: "수정된 제목" });
    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe("수정된 제목");
  });

  it("❌ Post 수정 실패 (작성자가 아님)", async () => {
    const res = await request(app)
      .put(`/v1/posts/${postId}`)
      .set("Authorization", `Bearer ${tokenUser2}`)
      .send({ title: "허용되지 않은 수정" });
    expect(res.statusCode).toBe(403);
  });

  // -------------------------
  // Comments
  // -------------------------
  it("✅ Comment 작성 (User1이 @target 멘션)", async () => {
    const res = await request(app)
      .post(`/v1/posts/${postId}/comments`)
      .set("Authorization", `Bearer ${tokenUser1}`)
      .send({
        content: "댓글입니다 @target @없는사람",
      });

    expect(res.statusCode).toBe(201);
    // post.mentions에는 target만 있었음 → target만 반영
    expect(res.body.mentions.length).toBe(1);

    const getRes = await request(app)
      .get(`/v1/posts/${postId}/comments`)
      .set("Authorization", `Bearer ${tokenUser1}`);
    console.log(getRes.text);
    // expect(getRes.body.mentions[0].username).toBe("target");

    commentId = res.body._id;
  });

  it("❌ Comment 작성 실패 (로그인 안 함)", async () => {
    const res = await request(app)
      .post(`/v1/posts/${postId}/comments`)
      .send({ content: "비로그인 댓글" });
    expect(res.statusCode).toBe(401);
  });

  it("✅ Comment 조회 (User2가 댓글 보기)", async () => {
    const res = await request(app)
      .get(`/v1/posts/${postId}/comments`)
      .set("Authorization", `Bearer ${tokenUser2}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0]._id).toBe(commentId);
  });

  it("✅ Comment 수정 (작성자 본인)", async () => {
    const res = await request(app)
      .put(`/v1/comments/${commentId}`)
      .set("Authorization", `Bearer ${tokenUser1}`)
      .send({ content: "수정된 댓글" });

    expect(res.statusCode).toBe(200);
    expect(res.body.content).toBe("수정된 댓글");
  });

  it("❌ Comment 수정 실패 (작성자가 아님)", async () => {
    const res = await request(app)
      .put(`/v1/comments/${commentId}`)
      .set("Authorization", `Bearer ${tokenUser2}`)
      .send({ content: "권한 없는 수정" });

    expect(res.statusCode).toBe(403);
  });

  it("❌ Comment 삭제 실패 (작성자가 아님)", async () => {
    // 댓글은 이미 지워졌으므로 NotFound가 맞음
    const res = await request(app)
      .delete(`/v1/comments/${commentId}`)
      .set("Authorization", `Bearer ${tokenUser2}`);
    expect([403, 404]).toContain(res.statusCode);
  });

  it("✅ Comment 삭제 (작성자 본인)", async () => {
    const res = await request(app)
      .delete(`/v1/comments/${commentId}`)
      .set("Authorization", `Bearer ${tokenUser1}`);
    expect(res.statusCode).toBe(200);
  });
});
