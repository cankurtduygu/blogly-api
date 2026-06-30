"use strict";

import { CustomError } from "../utils/customError.js";
import type { Request, Response, NextFunction } from "express";

const isAuthenticated = (req: Request) => !!(req.user && req.user.isActive);//Burdaki !! func dönüs degerini booleana zorlamak icin.
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
