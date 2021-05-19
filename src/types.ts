import { Request, Response, NextFunction } from "express";

export interface ExpressInput {
  req: Request;
  res: Response;
  next: NextFunction;
}
