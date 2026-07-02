"use strict";

import { Blog } from "../models/blogModel.js";
import { CustomError } from "../utils/customError.js";
import type { Request, Response } from "express";

export const listBlog = async (req: Request, res: Response) => {
  const blogs = await res.getModelList(Blog, [
    { path: "userId", select: "username firstName lastName image" },
    { path: "categoryId", select: "name" },
  ]);
  const details = await res.getModelListDetails(Blog);

  res.status(200).send({
    error: false,
    details,
    data: blogs,
  });
};

export const createBlog = async (req: Request, res: Response) => {
  const { categoryId, title, content, image, isPublish } = req.body;

  const createdBlog = await Blog.create({
    userId: req.user!._id,
    categoryId,
    title,
    content,
    image,
    isPublish,
  });

  res.status(201).send({
    error: false,
    message: "Blog registered successfully.",
    data: createdBlog,
  });
};

export const readBlog = async (req: Request, res: Response) => {
  const data = await Blog.findByIdAndUpdate(
    req.params.id,
    { $inc: { countOfVisitors: 1 } },
    { returnDocument: "after" }
  )
    .populate("userId", "username firstName lastName image")
    .populate("categoryId", "name");

  if (!data) throw new CustomError("Blog not found.", 404);

  res.status(200).send({
    error: false,
    data,
  });
};

export const updateBlog = async (req: Request, res: Response) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) throw new CustomError("Blog not found.", 404);

  if (
    blog.userId.toString() !== req.user!._id.toString() &&
    !req.user!.isAdmin
  ) {
    throw new CustomError("You are not authorized to update this blog.", 403);
  }

  const updatedBlog = await Blog.findByIdAndUpdate(
    { _id: req.params.id },
    req.body,
    {
      runValidators: true,
      returnDocument: "after", // { new: true } yerine
    },
  );
  res.status(200).send({
    error: false,
    new: updatedBlog,
  });
};

export const deleteBlog = async (req: Request, res: Response) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) throw new CustomError("Blog not found.", 404);

  if (
    blog.userId.toString() !== req.user!._id.toString() &&
    !req.user!.isAdmin
  ) {
    throw new CustomError("You are not authorized to delete this blog.", 403);
  }
  const result = await Blog.deleteOne({ _id: req.params.id });
  if (!result.deletedCount) {
    throw new CustomError("Data is not found or already deleted.", 404);
  }
  res.status(204).send();
};

export const toggleLikeBlog = async (req: Request, res: Response) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) throw new CustomError("Blog not found.", 404);

  const alreadyLiked = blog.likes.some(
    (id) => id.toString() === req.user!._id.toString()
  );

  const updatedBlog = await Blog.findByIdAndUpdate(
    req.params.id,
    alreadyLiked
      ? { $pull: { likes: req.user!._id } }
      : { $addToSet: { likes: req.user!._id } },
    { returnDocument: "after" }
  );

  res.status(200).send({
    error: false,
    didUserLike: !alreadyLiked,
    countOfLikes: updatedBlog!.likes.length,
  });
};