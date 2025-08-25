import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import User from "../models/User.js";
import Post from "../models/Post.js";

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
});

describe("Post Model Test", () => {
  it("✅ 새로운 Post 생성", async () => {
    const user = new User({
      name: "홍길동",
      position: "개발자",
      username: "testuser",
      password: "pass123",
    });
    const savedUser = await user.save();

    const post = new Post({
      title: "작업 공지",
      category: "공지사항",
      author: savedUser._id,
      content: "새로운 작업 지시 사항입니다.",
    });

    const savedPost = await post.save();

    expect(savedPost._id).toBeDefined();
    expect(savedPost.importance).toBe("Priority"); // default 값 확인
    expect(savedPost.category).toBe("공지사항");
    expect(savedPost.author.toString()).toBe(savedUser._id.toString());
  });

  it("❌ 필수 필드 누락 시 에러", async () => {
    const post = new Post({});
    let err;

    try {
      await post.save();
    } catch (error) {
      err = error;
    }

    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.title).toBeDefined();
    expect(err.errors.category).toBeDefined();
    expect(err.errors.author).toBeDefined();
  });

  it("✅ mentionsWorkers와 mentionsRelated 배열에 여러 User 저장", async () => {
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

    const author = await new User({
      name: "관리자",
      position: "팀장",
      username: "admin",
      password: "pass3",
    }).save();

    const post = new Post({
      title: "작업 배정",
      category: "새로운 작업",
      author: author._id,
      mentionsWorkers: [user1._id, user2._id],
      mentionsRelated: [author._id],
    });

    const savedPost = await post.save();
    expect(savedPost.mentionsWorkers.length).toBe(2);
    expect(savedPost.mentionsRelated.length).toBe(1);
  });
});
