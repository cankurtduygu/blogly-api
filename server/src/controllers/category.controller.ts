"use strict";

import { Category } from "../models/categoryModel.js";
import { CustomError } from "../utils/customError.js";
import type { Request, Response } from "express";

export const listCategory = async (req: Request, res: Response) => {
  const categories = await res.getModelList(Category);
  const details = await res.getModelListDetails(Category);

  res.status(200).send({
    error: false,
    details,
    data: categories,
  });
};

export const createCategory = async (req: Request, res: Response) => {
  const { name } = req.body;

  const existingCategory = await Category.findOne({
    name,
  });

  if (existingCategory) {
    throw new CustomError("Category name already exists", 409);
  }

  const category = await Category.create({ name });

  res.status(201).send({
    error: false,
    message: "Category registered successfully.",
    data: category,
  });
};

export const readCategory = async (req: Request, res: Response) => {
  const data = await Category.findById(req.params.id);
  if (!data) throw new CustomError("Category not found.", 404);
  res.status(200).send({
    error: false,
    data,
  });
};

export const updateCategory = async (req: Request, res: Response) => {
  const updatedCategory = await Category.findByIdAndUpdate(
    { _id: req.params.id },
    req.body,
    {
      runValidators: true,
      returnDocument: "after", // { new: true } yerine
    },
  );
  res.status(200).send({
    error: false,
    new: updatedCategory,
  });
};

export const deleteCategory = async (req: Request, res: Response) => {
  const result = await Category.deleteOne({ _id: req.params.id });
  if (!result.deletedCount) {
    throw new CustomError("Data is not found or already deleted.", 404);
  }
  res.status(204).send();
};
