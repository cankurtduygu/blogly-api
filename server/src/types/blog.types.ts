import type { Types } from "mongoose";

export interface IBlog {
  userId: Types.ObjectId;
  categoryId: Types.ObjectId;
  title: string;
  content: string;
  image: string;
  isPublish: boolean;
  comments: Types.ObjectId[];
  likes: Types.ObjectId[];
  countOfVisitors: number;
}
