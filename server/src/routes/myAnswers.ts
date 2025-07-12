// src/routes/userAnsweredQuestions.route.ts
import { Router, Request, Response, NextFunction } from "express";
import { db } from "@/db";
import { questions, answers } from "@/db/schema/schema";
import { desc, eq } from "drizzle-orm";

const router = Router();


router.get(
  "/:userId/answered-questions",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.params;

      const sub = db
        .select({
          questionId: answers.questionId,
          firstAnsweredAt: answers.createdAt.min().as("firstAnsweredAt"),
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

      res.json(result);
    } catch (err) {
      next(err);
    }
  },
);

export default router;
