import { Request, Response, NextFunction } from "express";
import Video from "../models/Video";
import formatHashtags from "../utils/formatHashtags";

export const home = async (req: Request, res: Response) => {
  const videos = await Video.find({}).sort({ createdAt: "desc" });
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
    return res.status(404).render("404", { pageTitle: "Video not found" });
  }
  return res.render("edit", { pageTitle: "Editing", video });
};

export const postEdit = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, description, hashtags } = req.body;
  const video = await Video.findById(id);
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found" });
  }
  video.title = title;
  video.description = description;
  video.hashtags = formatHashtags(hashtags.join(","));
  await video.save();
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
      hashtags: formatHashtags(hashtags),
      meta: {
        views: 0,
        rating: 0,
      },
    });
    return res.redirect("/");
  } catch (error) {
    console.log(error);
    return res.status(404).render("upload", {
      pageTitle: "Upload Video",
      errorMessage: error._message,
    });
  }
};

export const search = async (req: Request, res: Response) => {
  const { keyword } = req.query;
  let videos: any[] = [];
  console.log(keyword);

  return res.render("search", { pageTitle: "Search", videos });
};

export const upload = (req: Request, res: Response) => res.send("upload");

export const deleteVideo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const video = await Video.findById(id);
    await Video.findOneAndDelete(video?.id);
    return res.redirect("/");
  } catch (error) {
    console.log(error);
  }
};
