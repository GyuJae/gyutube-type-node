import "./db";
import "./models/Video";
import express from "express";
import morgan from "morgan";

import rootRouter from "./routers/root.router";
import userRouter from "./routers/user.router";
import videoRouter from "./routers/video.router";

const app: express.Application = express();

// Middlewares
const logger = morgan("dev");

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");
app.use(logger);
app.use(express.urlencoded({ extended: true }));
app.use("/", rootRouter);
app.use("/users", userRouter);
app.use("/videos", videoRouter);

export default app;
