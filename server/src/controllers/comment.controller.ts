"use strict";

import { Blog } from "../models/blogModel.js";
import { Comment } from "../models/commentModel.js";
import { CustomError } from "../utils/customError.js";
import type { Request, Response } from "express";

export const listComment = async (req: Request, res: Response) => {
  const comments = await res.getModelList(Comment, [
    { path: "userId", select: "username firstName lastName" },
  ]);
  const details = await res.getModelListDetails(Comment);

  res.status(200).send({
    error: false,
    details,
    data: comments,
  });
};

export const createComment = async (req: Request, res: Response) => {
  const { blogId, comment } = req.body;

  const newComment = await Comment.create({
    userId: req.user!._id,
    blogId,
    comment,
  });

  await Blog.findByIdAndUpdate(blogId, {
    $push: { comments: newComment._id },
  });

  res.status(201).send({
    error: false,
    message: "Comment registered successfully.",
    data: newComment,
  });
};

export const readComment = async (req: Request, res: Response) => {
  const data = await Comment.findById(req.params.id).populate(
    "userId",
    "username firstName lastName",
  );

  if (!data) throw new CustomError("Comment not found.", 404);
  res.status(200).send({
    error: false,
    data,
  });
};

export const updateComment = async (req: Request, res: Response) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) throw new CustomError("Comment not found.", 404);

  if (
    comment.userId.toString() !== req.user!._id.toString() &&
    !req.user!.isAdmin
  ) {
    throw new CustomError(
      "You are not authorized to update this comment.",
      403,
    );
  }

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
  
  const comment = await Comment.findById(req.params.id);
  if (!comment) throw new CustomError("Comment not found.", 404);

  const result = await Comment.deleteOne({ _id: req.params.id });
  if (!result.deletedCount) {
    throw new CustomError("Data is not found or already deleted.", 404);
  }
  await Blog.findByIdAndUpdate(comment.blogId, {
    $pull: { comments: comment._id },
  });
  res.status(204).send();
};
