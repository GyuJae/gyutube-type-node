import { Request, Response, NextFunction } from "express";
import Video, { IVideo } from "../models/Video";

export const home = async (req: Request, res: Response) => {
  const videos = await Video.find({});
  return res.render("home", { pageTitle: "Home", videos });
};

export const watch = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const video = await Video.findById(id);
    if (!video) {
      return res.render("404", { pageTitle: "Video not found" });
    }
    return res.render("watch", { pageTitle: `Watching`, video });
  } catch (error) {}
};

export const getEdit = async (req: Request, res: Response) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  if (!video) {
    return res.render("404", { pageTitle: "Video not found" });
  }
  return res.render("edit", { pageTitle: "Editing", video });
};

export const postEdit = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, description, hashtags } = req.body;
  const video = await Video.exists({ _id: id });
  if (!video) {
    return res.render("404", { pageTitle: "Video not found" });
  }
  await Video.findByIdAndUpdate(id, {
    title,
    description,
    hashtags: Video.formatHashtags(hashtags),
  });
  return res.redirect(`/videos/${id}`);
};

export const getUpload = (req: Request, res: Response) => {
  return res.render("upload", { pageTitle: "Upload Video" });
};

export const postUpload = async (req: Request, res: Response) => {
  try {
    const { title, description, hashtags } = req.body;
    await Video.create({
      title,
      description,
      createdAt: Date.now(),
      hashtags: Video.formatHashtags(hashtags),
      meta: {
        views: 0,
        rating: 0,
      },
    });
    return res.redirect("/");
  } catch (error) {
    console.log(error);
    return res.render("upload", {
      pageTitle: "Upload Video",
      errorMessage: error._message,
    });
  }
};

export const search = (req: Request, res: Response) => res.send("search");

export const upload = (req: Request, res: Response) => res.send("upload");

export const deleteVideo = (req: Request, res: Response) =>
  res.send("deleteVideo");
