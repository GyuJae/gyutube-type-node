import { NextFunction, Request, Response } from "express";
import multer from "multer";

export const localsMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.siteName = "Gyutube";
  res.locals.loggedInUser = req.session.user || {};
  next();
};

export const protectorMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.session.loggedIn) {
    return next();
  } else {
    return res.redirect("/login");
  }
};

export const publicOnlyMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.session.loggedIn) {
    return next();
  } else {
    return res.redirect("/");
  }
};

export const avatarUpload = multer({
  dest: "uploads/avatars/",
  limits: {
    fileSize: 3000000,
  },
});

export const videoUpload = multer({
  dest: "uploads/videos/",
  limits: {
    fileSize: 10000000,
  },
});
