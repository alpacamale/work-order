import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import User from "../models/User.js";
import Post from "../models/Post.js";
import Comment from "../models/Comment.js";

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
  await Post.deleteMany();
  await Comment.deleteMany();
});

describe("Comment Model Test", () => {
  it("✅ 새로운 Comment 생성", async () => {
    const user = await new User({
      name: "홍길동",
      position: "개발자",
      username: "testuser",
      password: "pass123",
    }).save();

    const post = await new Post({
      title: "테스트 글",
      category: "공지사항",
      author: user._id,
    }).save();

    const comment = new Comment({
      post: post._id,
      author: user._id,
      content: "좋은 글입니다!",
    });

    const savedComment = await comment.save();

    expect(savedComment._id).toBeDefined();
    expect(savedComment.post.toString()).toBe(post._id.toString());
    expect(savedComment.author.toString()).toBe(user._id.toString());
  });

  it("❌ 필수 필드 누락 시 에러", async () => {
    const comment = new Comment({});
    let err;

    try {
      await comment.save();
    } catch (error) {
      err = error;
    }

    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.post).toBeDefined();
    expect(err.errors.author).toBeDefined();
    expect(err.errors.content).toBeDefined();
  });

  it("✅ mentions 배열에 여러 User 저장", async () => {
    const author = await new User({
      name: "관리자",
      position: "팀장",
      username: "admin",
      password: "pass123",
    }).save();

    const user1 = await new User({
      name: "유저1",
      position: "팀원",
      username: "user1",
      password: "pass1",
    }).save();

    const user2 = await new User({
      name: "유저2",
      position: "팀원",
      username: "user2",
      password: "pass2",
    }).save();

    const post = await new Post({
      title: "작업 공지",
      category: "새로운 작업",
      author: author._id,
    }).save();

    const comment = new Comment({
      post: post._id,
      author: author._id,
      content: "작업 확인 부탁드립니다.",
      mentions: [user1._id, user2._id],
    });

    const savedComment = await comment.save();
    expect(savedComment.mentions.length).toBe(2);
  });
});
