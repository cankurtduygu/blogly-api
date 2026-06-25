"use strict";
import mongoose from "mongoose";
import type { IComment } from "../types/comment.types.js";

const commentSchema = new mongoose.Schema<IComment>(
  {
    blogId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
      required: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    comment: {
      type: String,
      trim: true,
      required: true,
      maxlength: 1000,
    },
  },
  { collection: "comments", timestamps: true },
);

export const Comment = mongoose.model<IComment>("Comment", commentSchema);