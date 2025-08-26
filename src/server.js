import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import v1UserRouter from "./routers/v1/users";
import v1PostRouter from "./routers/v1/posts";
import v1CommentRouter from "./routers/v1/comments";
import v1AuthRouter from "./routers/v1/auth";
import { authMiddleware } from "./middleware/authMiddleware";

const app = express();

// middleware
app.use(morgan("dev")); // logger
app.use(express.json()); // req.body
app.use(cookieParser()); // req.cookies

// router
app.use("/v1/auth", v1AuthRouter);
app.use("/v1/users", v1UserRouter);

// login required
app.use(authMiddleware);
app.use("/v1/posts", v1PostRouter);
app.use("/v1/comments", v1CommentRouter);

export default app;
