"use strict";

import { Router } from "express";
import { login, logout } from "../controllers/auth.controller.js";
import { validate } from "../middlewares/validate.js";
import { loginSchema } from "../validations/auth.validation.js";
import { isLogin } from "../middlewares/permissions.js";

const router = Router();

// URL: /auth
router.post("/login", validate(loginSchema), login);
router.get("/logout", isLogin, logout);

export default router;