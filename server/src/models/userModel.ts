"use strict";
import mongoose from "mongoose";
import type { IUser } from "../types/user.types.js";

const userSchema = new mongoose.Schema<IUser>(
  {
    username: {
      type: String,
      trim: true,
      unique: true,
      required: true,
      minlength: 3,
      maxlength: 15,
    },

    password: {
      type: String,
      trim: true,
      required: true,
      select: false,
    },

    email: {
      type: String,
      trim: true,
      required: true,
      lowercase: true,
      unique: true,
      validate: [
        (email: string) => {
          return email.includes("@") && email.includes(".");
        },
        "Please enter a valid email address.",
      ],
    },

    firstName: {
      type: String,
      trim: true,
      required: true,
      minlength: 2,
      maxlength: 50,
    },

    lastName: {
      type: String,
      trim: true,
      required: true,
      minlength: 2,
      maxlength: 50,
    },

    image: String,

    city: {
      type: String,
      trim: true,
    },

    bio: {
      type: String,
      maxlength: 2000,
      trim: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    isAdmin: {
      type: Boolean,
      default: false,
    },

    isStaff: {
      type: Boolean,
      default: false,
    }
  },
  { collection: "users", timestamps: true },
);

userSchema.set("toJSON", {
  transform: (_doc, ret) => {
    const { password, ...rest } = ret;
    return rest;
  },

});



export const User = mongoose.model<IUser>("User", userSchema);
