import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import Post from "../models/Post.js";
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
  await User.deleteMany({});
  await Post.deleteMany({});
});

describe("Post Model", () => {
  it("should create a post with an author", async () => {
    const user = new User({
      name: "홍길동",
      position: "개발자",
      username: "hong",
      password: "1234",
    });
    await user.save();

    const post = new Post({
      title: "테스트 공지",
      category: "공지사항",
      author: user._id,
      content: "이건 테스트용 게시글입니다.",
    });

    await post.save();

    const savedPost = await Post.findOne({ title: "테스트 공지" }).populate(
      "author"
    );
    expect(savedPost.author.username).toBe("hong");
    expect(savedPost.category).toBe("공지사항");
  });

  it("should fail if category is invalid", async () => {
    const user = new User({
      name: "이몽룡",
      position: "팀장",
      username: "lee",
      password: "abcd",
    });
    await user.save();

    const post = new Post({
      title: "잘못된 카테고리",
      category: "엉뚱한값", // ❌ 스키마에 없는 값
      author: user._id,
      content: "카테고리 테스트",
    });

    let error;
    try {
      await post.save();
    } catch (err) {
      error = err;
    }

    expect(error).toBeDefined();
    expect(error.name).toBe("ValidationError");
  });
});
