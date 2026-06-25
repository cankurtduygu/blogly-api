"use strict";

import mongoose from "mongoose";

export const dbConnection = () => {
  return mongoose
    .connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/blogly-api")
    .then(() => {
      console.log("* DB Connected *");
    })
    .catch((error) => {
      console.error("! DB Connection Failed !", error);
      process.exit(1);
    });
};
