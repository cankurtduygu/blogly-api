"use strict";

import { Comment } from "../models/commentModel.js";
import { CustomError } from "../utils/customError.js";
import type { Request, Response } from "express";

export const listComment = async (req: Request, res: Response) => {
  const categories = await res.getModelList(Comment);
  const details = await res.getModelListDetails(Comment);

  res.status(200).send({
    error: false,
    details,
    data: categories,
  });
};

export const createComment = async (req: Request, res: Response) => {
  const { name } = req.body;

  const existingComment = await Comment.findOne({
    name,
  });

  if (existingComment) {
    throw new CustomError("Comment name already exists", 409);
  }

  const comment = await Comment.create({ name });

  res.status(201).send({
    error: false,
    message: "Comment registered successfully.",
    data: comment,
  });
};

export const readComment = async (req: Request, res: Response) => {
  const data = await Comment.findById(req.params.id);
  if (!data) throw new CustomError("Comment not found.", 404);
  res.status(200).send({
    error: false,
    data,
  });
};

export const updateComment = async (req: Request, res: Response) => {
  const updatedComment = await Comment.findByIdAndUpdate(
    { _id: req.params.id },
    req.body,
    {
      runValidators: true,
      returnDocument: "after", // { new: true } yerine
    },
  );
  res.status(200).send({
    error: false,
    new: updatedComment,
  });
};

export const deleteComment = async (req: Request, res: Response) => {
  const result = await Comment.deleteOne({ _id: req.params.id });
  if (!result.deletedCount) {
    throw new CustomError("Data is not found or already deleted.", 404);
  }
  res.status(204).send();
};
