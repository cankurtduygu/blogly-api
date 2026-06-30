"use strict";

import { Router } from "express";
import { createUser, deleteUser, listUser, readUser, updateUser } from "../controllers/user.controller.js";
import { validate } from "../middlewares/validate.js";
import { registerSchema } from "../validations/auth.validation.js";
import { isLogin, isOwnerOrAdmin } from "../middlewares/permissions.js";

const router = Router();

// URL: /users
router.route('/')
        .get(isLogin ,listUser)
        .post(validate(registerSchema), createUser);

router.route('/:id')
      .get(readUser)
      .put(isLogin, isOwnerOrAdmin ,updateUser)
      .delete(isLogin, isOwnerOrAdmin, deleteUser)


export default router;