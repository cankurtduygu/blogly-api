"use strict";

import { User } from "../models/userModel.js";
import { Token } from "../models/tokenModel.js";
import { CustomError } from "../utils/customError.js";
import { hashPassword } from "../utils/bcrypt.js";
import { generateToken } from "../utils/token.js";
import type { Request, Response } from "express";

export const listUser = async (req: Request, res: Response) => {
  const currentUser = await User.findById(req.user?._id);
  res.status(200).send({
    error: false,
    data: currentUser,
  });
};

export const createUser = async (req: Request, res: Response) => {
  const { username, firstName, lastName, email, password } = req.body;

  const existingUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existingUser) {
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

export const readUser = async (req: Request, res: Response) => {
  const data = await User.findById(req.params.id);

  if (!data) throw new CustomError("User not found.", 404);

  res.status(200).send({
    error: false,
    data,
  });
};

export const updateUser = async (req: Request, res: Response) => {

  if (req.body.password) {
    req.body.password = await hashPassword(req.body.password);
  }

  if (!req.user!.isAdmin) {
    delete req.body.isAdmin;
    delete req.body.isStaff;
    delete req.body.isActive;
  }

  const updatedUser = await User.findByIdAndUpdate(
    { _id: req.params.id },
    req.body,
    {
      runValidators: true, // run validation method}
      returnDocument: "after", // { new: true } yerine
    },
  );

  res.status(200).send({
    error: false,
    new: updatedUser,
  });
};

export const deleteUser = async (req: Request, res: Response) => {
  const result = await User.deleteOne({ _id: req.params.id });

  if (!result.deletedCount) {
    throw new CustomError("Data is not found or already deleted.", 404);
  }

  await Token.deleteMany({ userId: req.params.id });

  res.status(204).send();
};