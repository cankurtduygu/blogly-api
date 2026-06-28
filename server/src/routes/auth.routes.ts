"use strict";

import { Router } from "express";
import { login } from "../controllers/auth.controller.js";
import { validate } from "../middlewares/validate.js";
import { loginSchema } from "../validations/auth.validation.js";

const router = Router();

// URL: /auth
router.post("/login", validate(loginSchema), login);

export default router;