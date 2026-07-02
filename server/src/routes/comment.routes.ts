"use strict";

import { Router } from "express";
import { createComment, deleteComment, listComment, readComment, updateComment } from "../controllers/comment.controller.js";
import { isLogin } from "../middlewares/permissions.js";

const router = Router();

// URL: /comments
router.route('/')
  .get(isLogin, listComment)
  .post(isLogin, createComment);

router.route('/:id')
  .get(isLogin, readComment)
  .put(isLogin, updateComment)
  .delete(isLogin, deleteComment);

export default router;