"use strict";

import { Router } from "express";
import { createCategory, deleteCategory, listCategory, readCategory, updateCategory } from "../controllers/category.controller.js";
import { validate } from "../middlewares/validate.js";
import { registerSchema } from "../validations/auth.validation.js";
import { isLogin, isOwnerOrAdmin } from "../middlewares/permissions.js";

const router = Router();

// URL: /categories
router.route('/')
        .get(listCategory)
        .post(isLogin, createCategory);

router.route('/:id')
      .get(readCategory)
      .put(isLogin, updateCategory)
      .delete(isLogin, deleteCategory)


export default router;