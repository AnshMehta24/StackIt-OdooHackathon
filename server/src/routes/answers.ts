import express from "express";
import { db } from "@/db";
import { answers, notifications, questions } from "@/db/schema/schema";
import { eq } from "drizzle-orm";
import { AuthenticatedRequest, authMiddleware } from "@/middleware";
import { answerSchema, updateAnswerSchema } from "@/schema/answerSchema";
import { successResponse } from "@/common";

const answerRouter = express.Router();

answerRouter.post(
  "/",
  authMiddleware,
  async (req: AuthenticatedRequest, res) => {
    const parsed = answerSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        error: "Validation failed",
        details: parsed.error.flatten().fieldErrors,
      });
    }

    const { questionId, content } = parsed.data;
    const userId = req.user?.userId;

    try {
      const result = await db.insert(answers).values({
        questionId,
        content,
        userId,
      });

      const question = await db
        .select()
        .from(questions)
        .where(eq(questions.id, questionId));

      const questionOwnerId = question[0]?.userId;

      if (questionOwnerId && questionOwnerId !== userId) {
        const io = req.app.get("io");

        io.to(questionOwnerId).emit("new-answer", {
          questionId,
          message: `${req.user?.username} answered your question.`,
        });

        await db.insert(notifications).values({
          type: "ANSWER_ON_QUESTION",
          recipientId: questionOwnerId,
          triggeredById: userId!,
          content: `${req.user?.username} answered your question.`,
        });
      }

      return res
        .status(201)
        .json(successResponse({ message: "Answer created" }));
    } catch (err) {
      console.error("Insert Error:", err);
      return res.status(500).json({ error: "Failed to create answer" });
    }
  }
);

answerRouter.delete(
  "/:id",
  authMiddleware,
  async (req: AuthenticatedRequest, res) => {
    const answerId = req.params.id;

    try {
      const answer = await db
        .select()
        .from(answers)
        .where(eq(answers.id, answerId));

      if (!answer.length) {
        return res.status(404).json({ error: "Answer not found" });
      }

      if (answer[0].userId !== req.user?.userId) {
        return res
          .status(403)
          .json({ error: "You can only delete your own answer" });
      }

      await db.delete(answers).where(eq(answers.id, answerId));

      return res.status(200).json({ message: "Answer deleted" });
    } catch (err) {
      console.error("Delete Error:", err);
      return res.status(500).json({ error: "Failed to delete answer" });
    }
  }
);

answerRouter.put(
  "/:id",
  authMiddleware,
  async (req: AuthenticatedRequest, res) => {
    const answerId = req.params.id;

    const parsed = updateAnswerSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        error: "Validation failed",
        details: parsed.error.flatten().fieldErrors,
      });
    }

    const { content } = parsed.data;

    try {
      const existing = await db
        .select()
        .from(answers)
        .where(eq(answers.id, answerId));

      if (!existing.length) {
        return res.status(404).json({ error: "Answer not found" });
      }

      if (existing[0].userId !== req.user?.userId) {
        return res
          .status(403)
          .json({ error: "You can only edit your own answer" });
      }

      await db.update(answers).set({ content }).where(eq(answers.id, answerId));

      return res.status(200).json({ message: "Answer updated" });
    } catch (err) {
      console.error("Update Error:", err);
      return res.status(500).json({ error: "Failed to update answer" });
    }
  }
);

export default answerRouter;
