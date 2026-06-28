"use strict";

import express from "express";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();

app.use(express.json());

// home path
app.get("/", (req, res) => {
  res.send({
    message: "WELCOME TO BLOG API",
  });
});

app.use("/auth", authRoutes);
app.use("/users", userRoutes);


// Error handler
app.use(errorHandler);

export default app;