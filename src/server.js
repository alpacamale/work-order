import express from "express";
import morgan from "morgan";
import v1UserRouter from "./routers/v1/users";
import v1PostRouter from "./routers/v1/posts";
import v1CommentRouter from "./routers/v1/comments";
import v1AuthRouter from "./routes/v1/auth";

const app = express();

// middleware
app.use(morgan("dev")); // logger

// router
app.use("/v1/auth", v1AuthRouter);
app.use("/v1/users", v1UserRouter);
app.use("/v1/posts", v1PostRouter);
app.use("/v1/comments", v1CommentRouter);

export default app;
