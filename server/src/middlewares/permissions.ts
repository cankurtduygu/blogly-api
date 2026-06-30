"use strict";

import { User } from "../models/userModel.js";
import { CustomError } from "../utils/customError.js";
import type { Request, Response, NextFunction } from "express";

const isAuthenticated = (req: Request) => !!(req.user && req.user.isActive); //Burdaki !! func dönüs degerini booleana zorlamak icin.
const deny = (message: string, statusCode = 401) => {
  throw new CustomError(`NoPermission: ${message} `, statusCode);
};

export const isLogin = (req: Request, res: Response, next: NextFunction) => {
  if (!isAuthenticated(req)) deny("You must login.");
  console.log("hits islogin permission");
  next();
};

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user?.isAdmin) deny("You must be admin.", 403);
  next();
};

export const isOwnerOrAdmin = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const isOwner = req.params.id === req.user!._id.toString();
  const isAdmin = req.user!.isAdmin;

  if (!isOwner && !isAdmin) {
    throw new CustomError("You can only update your own profile.", 403);
  }

  next();
};
