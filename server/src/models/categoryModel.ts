"use strict";
import mongoose from "mongoose";
import type { ICategory } from "../types/category.types.js";

const categorySchema = new mongoose.Schema<ICategory>(
  {
    name: {
      type: String,
      trim: true,
      unique: true,
      required: true,
      minlength: 3,
      maxlength: 100,
    }
  },
  { collection: "categories", timestamps: true },
);

export const Category = mongoose.model<ICategory>("Category", categorySchema);
