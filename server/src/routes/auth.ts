import "dotenv/config";
import { db } from "@/db";
import { users } from "@/db/schema/schema";
import { loginSchema, signupSchema } from "@/schema/authSchema";
import { eq, or } from "drizzle-orm";
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { setTokenExpiry } from "@/common/helper";
import { errorResponse, successResponse } from "@/common";
import { authMiddleware } from "@/middleware";
import multer from "multer";

const router = express.Router();
const upload = multer();

router.use(upload.none());

router.post("/signup", async (req, res) => {
  try {
    // Validate input using Zod
    const result = signupSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json(errorResponse({ message: "Invalid data" }));
    }

    const { email, name, password, username } = result.data;

    // Check if user exists
    const existingUser = await db
      .select()
      .from(users)
      .where(or(eq(users.email, email), eq(users.username, username)));

    console.log(existingUser);

    if (existingUser.length > 0) {
      return res.status(409).json(
        errorResponse({
          message: "User already exists with this email or username",
        })
      );
    }

    const hashedPassword = bcrypt.hashSync(password);

    const [user] = await db
      .insert(users)
      .values({
        username,
        email,
        name,
        password: hashedPassword,
      })
      .returning();

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        name: user.name,
        username: user.username,
        exp: Math.floor(setTokenExpiry(7).getTime() / 1000),
      },
      process.env.JWT_SECRET!
    );

    res.cookie("auth_token", token, {
      httpOnly: true,
      expires: setTokenExpiry(7),
    });

    return res
      .status(201)
      .json(successResponse({ message: "User created successfully" }));
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json(errorResponse({ message: "Internal Server Error" }));
  }
});

router.post("/login", async (req, res) => {
  try {
    console.log("BODY:", req.body);
    const result = loginSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json(
        errorResponse({
          message: "User already exists with this email or username",
        })
      );
    }

    const { email, password } = result.data;

    // Find user
    const [user] = await db.select().from(users).where(eq(users.email, email));

    if (!user) {
      return res
        .status(401)
        .json(errorResponse({ message: "Invalid email or password" }));
    }

    // Validate password
    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json(errorResponse({ message: "Invalid email or password" }));
    }

    // Create JWT
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        name: user.name,
        username: user.username,
        exp: Math.floor(setTokenExpiry(7).getTime() / 1000),
      },
      process.env.JWT_SECRET!
    );

    // Set cookie
    res.cookie("auth_token", token, {
      httpOnly: true,
      expires: setTokenExpiry(7),
    });

    return res
      .status(200)
      .json(successResponse({ message: "Login successful" }));
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json(errorResponse({ message: "Internal Server Error" }));
  }
});

router.post("/logout", authMiddleware, async (_, res) => {
  res.clearCookie("auth_token", {
    httpOnly: true,
  });

  return res.json(successResponse({ message: "User logged out successfully" }));
});

export default router;
