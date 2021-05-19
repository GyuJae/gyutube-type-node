import express from "express";
import { join, login } from "../controllers/user.controller";
import { search, home } from "../controllers/video.controller";

const globalRouter = express.Router();

globalRouter.get("/", home);

globalRouter.get("/join", join);
globalRouter.get("/login", login);

export default globalRouter;