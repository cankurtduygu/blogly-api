import type { Types } from "mongoose";

export interface IComment {
  blogId: Types.ObjectId;
  userId: Types.ObjectId;
  comment: Types.ObjectId[];
}