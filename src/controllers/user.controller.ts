import { Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcrypt";

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
    console.log(user);
    return res.redirect("/login");
  } catch (error) {}
};

export const edit = (req: Request, res: Response) => res.send("edit");

export const remove = (req: Request, res: Response) => res.send("remove");

export const getLogin = (req: Request, res: Response) => {
  const pageTitle = "Login";
  return res.render("login", { pageTitle });
};

export const postLogin = async (req: Request, res: Response) => {
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
  return res.redirect("/");
};

export const logout = (req: Request, res: Response) => res.send("logout");

export const see = (req: Request, res: Response) => res.send("see");
