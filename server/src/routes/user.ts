import { errorResponse, successResponse } from "@/common";
import { AuthenticatedRequest, authMiddleware } from "@/middleware";
import express from "express";

const router = express.Router();

router.get("/", authMiddleware, async (req: AuthenticatedRequest, res) => {
  const user = req.user;
  if (!user) {
    return res
      .status(401)
      .json(
        errorResponse({ message: "Unauthorized: Invalid or expired token" })
      );
  }

  return res.json(
    successResponse({
      data: {
        ...user,
      },
    })
  );
});

export default router;
