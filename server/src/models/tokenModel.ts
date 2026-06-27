"use strict";
import mongoose from "mongoose";
import type { IToken } from "../types/token.types.js";

const tokenSchema = new mongoose.Schema<IToken>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
      unique: true, 
    },

    token: {
      type: String,
      trim: true,
      required: true,
      index: true,
      unique: true,
    },
  },
  { collection: "tokens", timestamps: true },
);

tokenSchema.index(
  { createdAt: 1 },//TTL bu alani takip edecek diyoruz
  { expireAfterSeconds: Number(process.env.TOKEN_TTL || 604800) },
);

export const Token = mongoose.model<IToken>("Token", tokenSchema);