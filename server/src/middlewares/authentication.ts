"use strict"

import { Token } from "../models/tokenModel.js";

import type { Request, Response, NextFunction } from "express";
import type { IUser } from "../types/user.types.js";
import { Types } from "mongoose";

// console.log("AUTH FILE LOADED");

export const authentication = async (req: Request, res: Response, next: NextFunction )=>{
    // console.log(req.method, req.originalUrl);
    // console.log("AUTH MIDDLEWARE HIT2");

    req.user = null;
    // console.log("AUTH MIDDLEWARE HIT2");

    const auth = req.headers.authorization || null;
    // Token ...TokenKey... | Bearer ...accessKey...

    const tokenArr = auth ? auth.split(' '): [];
    // ['Token', '...tokenKey...'] | ['Bearer', '...accessKey...']

    if(tokenArr.length === 2 && tokenArr[0] === 'Token'){
        // simple token
        const tokenDoc = await Token.findOne({ token: tokenArr[1]}).populate<{ userId: IUser & { _id: Types.ObjectId } }>('userId');
         if (tokenDoc  && tokenDoc .userId && tokenDoc .userId.isActive) {
            req.user = tokenDoc .userId;
            // req.tokenKey = tokenArr[1]; // logout'ta tekrar parse etmeye gerek kalmasın
            req.tokenKey = tokenDoc ;
    }
        }

         next();
    }
