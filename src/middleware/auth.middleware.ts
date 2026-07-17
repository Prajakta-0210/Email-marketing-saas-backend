import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import { env } from "../config/env";

// Extends Express's Request type so req.userId is recognized by TypeScript
// after this middleware runs.
export interface AuthRequest extends Request {
  userId?: string;
}

// Fiber/Go comparison: this is the same idea as a Fiber middleware
// function — func(c *fiber.Ctx) error { ...check header, call c.Next()... }
export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization; // expects "Bearer <token>"

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as { userId: string };
    req.userId = decoded.userId;
    next(); // pass control to the next handler — like calling c.Next() in Fiber
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}