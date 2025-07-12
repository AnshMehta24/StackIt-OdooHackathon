import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email: string;
    name: string;
    username: string;
  };
}

export const authMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies?.auth_token;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: Token not found" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      email: string;
      name: string;
      username: string;
      exp: number;
    };

    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      name: decoded.name,
      username: decoded.username,
    };

    next();
  } catch (err) {
    console.error("Auth Middleware Error:", err);
    return res
      .status(401)
      .json({ message: "Unauthorized: Invalid or expired token" });
  }
};
