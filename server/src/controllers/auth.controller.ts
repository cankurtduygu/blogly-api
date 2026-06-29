"use strict";

import { User } from "../models/userModel.js";
import { Token } from "../models/tokenModel.js";
import { CustomError } from "../utils/customError.js";
import { comparePassword } from "../utils/bcrypt.js";
import { generateToken } from "../utils/token.js";
import type { Request, Response } from "express";

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  const user = await User.findOne({
    $or: [{ username }, { email: username }],
  }).select("+password");

  if (!user) throw new CustomError("Invalid username/email or password", 401);

  const isPasswordValid = await comparePassword(password, user.password);

  if (!isPasswordValid) {
    throw new CustomError("Invalid username/email or password", 401);
  }

  if(!user.isActive) throw new CustomError("Your account is inactive.", 403)

  const token = generateToken();

  await Token.create({ userId: user._id, token });

  return res.status(200).json({
    error: false,
    message: "Login successful.",
    token,
    user,
  });
};
