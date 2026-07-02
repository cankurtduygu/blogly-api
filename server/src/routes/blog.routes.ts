"use strict";

import { Router } from "express";
import { createBlog, deleteBlog, listBlog, readBlog, toggleLikeBlog, updateBlog } from "../controllers/blog.controller.js";
import { isLogin } from "../middlewares/permissions.js";

const router = Router();

// URL: /blogs
router.route('/')
        .get(listBlog)
        .post(isLogin, createBlog);

router.route('/:id')
      .get(readBlog)
      .put(isLogin,  updateBlog)
      .delete(isLogin, deleteBlog)

router.post('/:id/postLike', isLogin, toggleLikeBlog)


export default router;