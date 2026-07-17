import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Prisma } from "@prisma/client";

import { prisma } from "../config/prisma";
import { env } from "../config/env";
import type { SignupInput, LoginInput } from "../types/auth.types";

// ---- POST /api/auth/signup ----
export async function signup(req: Request, res: Response) {
  try {
    const { name, email, password } = req.body as SignupInput;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "name, email and password are required" });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    // Hash the password before storing it — 10 "salt rounds" is a
    // reasonable default (higher = slower but more secure).
    // Fiber/Go equivalent: bcrypt.GenerateFromPassword([]byte(password), 10)
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    // Never send the password hash back, even hashed — strip it out
    // before responding.
    const { password: _, ...userWithoutPassword } = user;

    res.status(201).json(userWithoutPassword);
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      return res.status(409).json({ message: "An account with this email already exists" });
    }
    console.error(err);
    res.status(500).json({ message: "Failed to sign up" });
  }
}

// ---- POST /api/auth/login ----
export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body as LoginInput;

    if (!email || !password) {
      return res.status(400).json({ message: "email and password are required" });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    // Deliberately vague error message — don't reveal whether the
    // email exists or the password was wrong. This is a security
    // best practice (avoids leaking which emails are registered).
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Sign a JWT containing the user's id — this is what the frontend
    // will store and send back on every future request to prove
    // "I'm logged in as this user".
    // Fiber/Go equivalent: jwt.NewWithClaims(...).SignedString(secret)
    const token = jwt.sign({ userId: user.id }, env.JWT_SECRET, {
      expiresIn: "7d",
    });

    const { password: _, ...userWithoutPassword } = user;

    res.json({ token, user: userWithoutPassword });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to log in" });
  }
}