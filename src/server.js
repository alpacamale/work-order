import express from "express";
import morgan from "morgan";

const app = express();

// middleware
app.use(morgan("dev")); // logger

export default app;
