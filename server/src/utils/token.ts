import { randomBytes } from "node:crypto";

export const generateToken = (): string => {
  return randomBytes(32).toString("hex");
};