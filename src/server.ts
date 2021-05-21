import "./db";
import "./models/Video";
import express from "express";
import morgan from "morgan";

import rootRouter from "./routers/root.router";
import userRouter from "./routers/user.router";
import videoRouter from "./routers/video.router";
import session from "express-session";
import MongoStore from "connect-mongo";
import { localsMiddleware } from "./middlewares";
import { IUser } from "./models/User";

const app: express.Application = express();

// Middlewares
const logger = morgan("dev");

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");
app.use(logger);
app.use(express.urlencoded({ extended: true }));

declare module "express-session" {
  export interface SessionData {
    user: IUser;
    loggedIn: boolean;
  }
}

app.use(
  session({
    secret: process.env.COOKIE_SECRET || "",
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: process.env.DB_URL }),
  })
);

app.use(localsMiddleware);
app.use("/uploads", express.static("uploads"));
app.use("/", rootRouter);
app.use("/users", userRouter);
app.use("/videos", videoRouter);

export default app;
