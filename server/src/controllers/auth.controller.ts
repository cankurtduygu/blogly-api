"use strict";

import { User } from "../models/userModel.js";
import { Token } from "../models/tokenModel.js";
import { CustomError } from "../utils/customError.js";
import { hashPassword, comparePassword } from "../utils/bcrypt.js";
import { generateToken } from "../utils/token.js";
import type { Request, Response } from "express";

export const login = async (req: Request, res: Response) => {
 
};

// export const login = async (req: Request, res: Response ) => {

// }
