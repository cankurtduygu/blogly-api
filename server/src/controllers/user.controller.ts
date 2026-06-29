"use strict";

import { User } from "../models/userModel.js";
import { Token } from "../models/tokenModel.js";
import { CustomError } from "../utils/customError.js";
import { hashPassword } from "../utils/bcrypt.js";
import { generateToken } from "../utils/token.js";
import type { Request, Response } from "express";

export const createUser = async (req: Request, res: Response) => {
  const { username, firstName, lastName, email, password } = req.body;

  const existingUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!existingUser) {
    throw new CustomError("Username or email already exists", 409);
  }

  const hashedPassword = await hashPassword(password);

  const user = await User.create({
    username,
    firstName,
    lastName,
    email,
    password: hashedPassword,
  });

  const token = generateToken();

  await Token.create({
    userId: user._id,
    token,
  });

  res.status(201).send({
    error: false,
    message: "User registered successfully.",
    token,
    user,
  });
};
