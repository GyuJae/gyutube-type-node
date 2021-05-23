import { Request, Response, NextFunction } from "express";
import User from "../models/User";
import Video from "../models/Video";
import formatHashtags from "../utils/formatHashtags";

export const home = async (req: Request, res: Response) => {
  const videos = await Video.find({})
    .sort({ createdAt: "desc" })
    .populate("owner");
  return res.render("home", { pageTitle: "Home", videos });
};

export const watch = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const video = await Video.findById(id).populate("owner");
    if (!video) {
      return res.render("404", { pageTitle: "Video not found" });
    }
    return res.render("watch", { pageTitle: `Watching`, video });
  } catch (error) {}
};

export const getEdit = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { user } = req.session;
  const video = await Video.findById(id);
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found" });
  }
  if (String(video.owner) !== String(user?._id)) {
    return res.status(403).redirect("/");
  }
  return res.render("edit", { pageTitle: "Editing", video });
};

export const postEdit = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { user } = req.session;
  const { title, description, hashtags } = req.body;
  const video = await Video.findById(id);
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found" });
  }
  if (String(video.owner) !== String(user?._id)) {
    return res.status(403).redirect("/");
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
    const { path: fileUrl } = req.file;
    const { title, description, hashtags } = req.body;
    const {
      session: { user },
    } = req;
    const newVideo = await Video.create({
      title,
      fileUrl,
      owner: user?._id,
      description,
      createdAt: Date.now(),
      hashtags: formatHashtags(hashtags),
      meta: {
        views: 0,
        rating: 0,
      },
    });
    const saveUser = await User.findById(user?._id);
    saveUser?.videos.push(newVideo._id);
    await saveUser?.save();
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

  return res.render("search", { pageTitle: "Search", videos });
};

export const deleteVideo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { user } = req.session;
    const video = await Video.findById(id);
    if (!video) {
      return res.status(404).render("404", { pageTitle: "Video not found" });
    }
    if (String(video.owner) !== String(user?._id)) {
      return res.status(403).redirect("/");
    }
    await Video.findByIdAndRemove(video?._id);
    return res.redirect("/");
  } catch (error) {
    console.log(error);
  }
};
