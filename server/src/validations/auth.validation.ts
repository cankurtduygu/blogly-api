import { z } from "zod";

export const registerSchema = z.object({
  body: z.object({
    username: z.string().trim().min(3).max(15),
    password: z.string().min(6).max(50),
    email: z.string().trim().email().toLowerCase(),
    firstName: z.string().trim().min(2).max(50),
    lastName: z.string().trim().min(2).max(50),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    username: z.string().trim().min(1),
    password: z.string().min(1),
  }),
});