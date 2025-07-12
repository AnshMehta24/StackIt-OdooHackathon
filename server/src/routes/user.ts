import { errorResponse, successResponse } from "@/common";
import { db } from "@/db";
import { answers, questions } from "@/db/schema/schema";
import { AuthenticatedRequest, authMiddleware } from "@/middleware";
import { desc, eq } from "drizzle-orm";
import express, { Response } from "express";

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

  return res.status(201).json(
    successResponse({
      data: {
        ...user,
      },
    })
  );
});

router.get(
  "/questions",
  authMiddleware,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const user = req.user;
      if (!user) {
        return res.status(401).json(
          errorResponse({
            message: "User not found",
          })
        );
      }
      const { userId } = user;
      const result = await db
        .select()
        .from(questions)
        .where(eq(questions.userId, userId))
        .orderBy(desc(questions.createdAt));

      res.status(201).json(successResponse({ data: result }));
    } catch (err) {
      return res.status(500).json(
        errorResponse({
          message: "Internal Server Errorf",
        })
      );
    }
  }
);

router.get(
  "answered-questions",
  authMiddleware,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const user = req.user;
      if (!user) {
        return res.status(401).json(
          errorResponse({
            message: "User not found",
          })
        );
      }
      const { userId } = user;

      const sub = db
        .select({
          questionId: answers.questionId,
          firstAnsweredAt: answers.createdAt,
        })
        .from(answers)
        .where(eq(answers.userId, userId))
        .groupBy(answers.questionId)
        .as("ua");

      const result = await db
        .select({
          id: questions.id,
          title: questions.title,
          description: questions.description,
          tags: questions.tags,
          answeredAt: sub.firstAnsweredAt,
        })
        .from(questions)
        .innerJoin(sub, eq(questions.id, sub.questionId))
        .orderBy(desc(sub.firstAnsweredAt));

      return res.status(201).json(successResponse({ data: result }));
    } catch (err) {
      return res.status(500).json(
        errorResponse({
          message: "Internal Server Errorf",
        })
      );
    }
  }
);

export default router;
