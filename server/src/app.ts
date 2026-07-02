"use strict";

import express from "express";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import blogRoutes from "./routes/blog.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { authentication } from "./middlewares/authentication.js";
import { queryHandler } from "./middlewares/queryHandler.js";
import commentRoutes from "./routes/comment.routes.js";


const app = express();

app.use(express.json());

// home path
app.get("/", (req, res) => {
  res.send({
    message: "WELCOME TO BLOG API",
  });
});

// Query Handler
app.use(queryHandler);

// Authentication
app.use(authentication)

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/categories", categoryRoutes);
app.use("/blogs", blogRoutes);
app.use("/comments", commentRoutes);


// Error handler
app.use(errorHandler);

export default app;