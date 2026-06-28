"use strict";

import { Router } from "express";
import { createUser } from "../controllers/user.controller.js";
import { validate } from "../middlewares/validate.js";
import { registerSchema } from "../validations/auth.validation.js";

const router = Router();

// URL: /users
router.route('/')
        .post(validate(registerSchema), createUser);

export default router;