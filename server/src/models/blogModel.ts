"use strict";
import mongoose from "mongoose";
import type { IBlog } from "../types/blog.types.js";

const blogSchema = new mongoose.Schema<IBlog>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    title: {
      type: String,
      trim: true,
      required: true,
    },

    content: {
      type: String,
      trim: true,
      required: true,
    },

    image: {
      type: String,
      trim: true,
      required: true,
    },

    isPublish: {
      type: Boolean,
      default: true,
    },

    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],

    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    countOfVisitors: {
      type: Number,
      default: 0,
    },
  },
  { collection: "blogs", timestamps: true },
);

export const Blog = mongoose.model<IBlog>("Blog", blogSchema);
