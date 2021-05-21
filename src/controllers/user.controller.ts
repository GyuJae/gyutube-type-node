import { Request, Response } from "express";
import User, { IUser } from "../models/User";
import bcrypt from "bcrypt";
import Video from "../models/Video";

export const getJoin = (req: Request, res: Response) => {
  return res.render("join", { pageTitle: "Join" });
};

export const postJoin = async (req: Request, res: Response) => {
  try {
    const { name, username, email, password, password2, location } = req.body;
    const pageTitle = "Join";
    if (password != password2) {
      return res.status(400).render("join", {
        pageTitle,
        errorMessage: "Password confirmation does not match",
      });
    }
    const exists = await User.exists({ $or: [{ username }, { email }] });
    if (exists) {
      return res.status(400).render("join", {
        pageTitle,
        errorMessage: "This username/email is already taken",
      });
    }
    const user = await User.create({
      name,
      username,
      email,
      password,
      location,
    });
    return res.redirect("/login");
  } catch (error) {}
};

export const remove = (req: Request, res: Response) => res.send("remove");

export const getLogin = (req: Request, res: Response) => {
  try {
    const pageTitle = "Login";
    return res.render("login", { pageTitle });
  } catch (error) {}
};

export const postLogin = async (req: Request, res: Response) => {
  try {
    const pageTitle = "Login";
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).render("login", {
        pageTitle,
        errorMessage: "An account with this username does not exists.",
      });
    }
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(400).render("login", {
        pageTitle,
        errorMessage: "Wrong Password",
      });
    }
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/");
  } catch (error) {}
};

export const logout = (req: Request, res: Response) => {
  try {
    req.session.destroy((err) => console.log(err));
    return res.redirect("/");
  } catch (error) {}
};

export const see = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).populate("videos");
    if (!user) {
      return res.status(404).render("404", { pageTitle: "User not Found" });
    }

    const videos = await Video.find({ owner: user._id });

    return res.render("users/profile", {
      pageTitle: user.name,
      user,
      videos,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getEdit = (req: Request, res: Response) => {
  return res.render("edit-profile", { pageTitle: "Edit Profile" });
};

export const postEdit = async (req: Request, res: Response) => {
  try {
    const {
      session: { user },
      body: { name, email, username, location },
      file,
    } = req;
    const updatedUser = await User.findByIdAndUpdate(
      user?.id,
      {
        avatarUrl: file ? file.path : user?.avatarUrl,
        name,
        email,
        username,
        location,
      },
      {
        new: true,
      }
    );
    req.session.user = updatedUser as IUser;
    return res.redirect("/users/edit");
  } catch (error) {}
};

export const getChangePassword = (req: Request, res: Response) => {
  const pageTitle = "Change Password";
  return res.render("users/change-password", { pageTitle });
};

export const postChangePassword = async (req: Request, res: Response) => {
  const pageTitle = "Change Password";
  let ok = false;
  const {
    session: { user },
    body: { oldPassword, newPassword, newPasswordConfirmation },
  } = req;
  if (user?.password) {
    if (user.password === oldPassword) {
      ok = true;
    }
  }
  if (!ok) {
    return res.status(400).render("users/change-password", {
      pageTitle,
      errorMessage: "The current password is incorrect",
    });
  }
  if (newPassword !== newPasswordConfirmation) {
    return res.status(400).render("users/change-password", {
      pageTitle: "Change Password",
      errorMessage: "The password does not match the confirmation",
    });
  }
  const changeUser = (await User.findById(user?.id)) as IUser;

  changeUser.password = newPassword;
  await changeUser.save();
  return res.redirect("/");
};
