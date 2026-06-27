import type { Types } from "mongoose";

export interface IToken {
  userId: Types.ObjectId;
  token: string;
}