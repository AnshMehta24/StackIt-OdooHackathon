import express from "express";
import { db } from "@/db";
import { questions, answers, users, votes } from "@/db/schema/schema";
import { count, eq, inArray, sql } from "drizzle-orm";
import { AuthenticatedRequest, authMiddleware } from "@/middleware";
import { questionSchema } from "@/schema/questionSchema";
import { errorResponse, successResponse } from "@/common";

const questionRouteHandler = express.Router();

questionRouteHandler.post(
  "/",
  authMiddleware,
  async (req: AuthenticatedRequest, res) => {
    const userId = req.user?.userId;

    const validation = questionSchema.safeParse(req.body);

    if (!validation.success) {
      console.error(validation.error.flatten().fieldErrors);
      return res.status(400).json(
        errorResponse({
          message: "Validation failed",
        })
      );
    }

    // If valid, insert into DB
    const { title, content, tags } = validation.data;

    if (!title || !content || !Array.isArray(tags)) {
      return res
        .status(400)
        .json(errorResponse({ message: "Missing required fields" }));
    }

    try {
      await db.insert(questions).values({
        title,
        description: content,
        userId,
        tags,
      });
      res.status(201).json(successResponse({ message: "Question created" }));
    } catch (err) {
      console.error("Insert Error:", err);
      res
        .status(500)
        .json(errorResponse({ message: "Failed to insert question" }));
    }
  }
);

//Fetch all the question uploaded by all user
questionRouteHandler.get("/", async (req, res) => {
  try {
    const tagFilter = req.query.tag as string;

    const result = tagFilter
      ? await db
          .select({
            question: questions,
            author: {
              name: users.name,
              email: users.email,
            },
          })
          .from(questions)
          .innerJoin(users, eq(questions.userId, users.id))
          .where(sql`${tagFilter} = ANY(${questions.tags})`)
      : await db
          .select({
            question: questions,
            author: {
              name: users.name,
              email: users.email,
            },
          })
          .from(questions)
          .innerJoin(users, eq(questions.userId, users.id));

    res.status(200).json(successResponse({ data: result }));
  } catch (err) {
    console.error("Fetch Error:", err);
    res
      .status(500)
      .json(errorResponse({ message: "Failed to fetch questions" }));
  }
});

questionRouteHandler.get("/:id", async (req, res) => {
  const questionId = req.params.id;

  try {
    const questionWithAuthor = await db
      .select({
        question: questions,
        author: {
          name: users.name,
          email: users.email,
        },
      })
      .from(questions)
      .innerJoin(users, eq(questions.userId, users.id))
      .where(eq(questions.id, questionId));

    if (!questionWithAuthor.length) {
      return res
        .status(404)
        .json(errorResponse({ message: "Question not found" }));
    }

    const answersWithUser = await db
      .select({
        answer: answers,
        author: {
          name: users.name,
          email: users.email,
        },
      })
      .from(answers)
      .innerJoin(users, eq(answers.userId, users.id))
      .where(eq(answers.questionId, questionId));

    const answerIds = answersWithUser.map((a) => a.answer.id);

    let upvotes = 0;
    let downvotes = 0;

    if (answerIds.length > 0) {
      const voteCounts = await db
        .select({
          voteType: votes.voteType,
          count: count(),
        })
        .from(votes)
        .where(inArray(votes.answerId, answerIds))
        .groupBy(votes.voteType);

      for (const row of voteCounts) {
        if (row.voteType === "UPVOTE") upvotes = Number(row.count);
        if (row.voteType === "DOWNVOTE") downvotes = Number(row.count);
      }
    }

    res.status(200).json(
      successResponse({
        data: {
          question: questionWithAuthor[0].question,
          author: questionWithAuthor[0].author,
          answers: answersWithUser,
          voteStats: {
            upvotes,
            downvotes,
          },
        },
      })
    );
  } catch (err) {
    console.error("Fetch Single Error:", err);
    res
      .status(500)
      .json(errorResponse({ message: "Failed to fetch question" }));
  }
});

questionRouteHandler.put("/:id", async (req, res) => {
  const { title, description, tags } = req.body;
  const questionId = req.params.id;

  try {
    await db
      .update(questions)
      .set({
        title,
        description,
        tags,
      })
      .where(eq(questions.id, questionId));

    res.status(200).json(successResponse({ message: "Question updated" }));
  } catch (err) {
    console.error("Update Error:", err);
    res
      .status(500)
      .json(errorResponse({ message: "Failed to update question" }));
  }
});

questionRouteHandler.delete(
  "/:id",
  authMiddleware,
  async (req: AuthenticatedRequest, res) => {
    const questionId = req.params.id;

    try {
      const question = await db
        .select()
        .from(questions)
        .where(eq(questions.id, questionId));

      if (!question.length) {
        return res
          .status(404)
          .json(errorResponse({ message: "Question not found" }));
      }

      const isOwner = question[0].userId === req.user?.userId;

      if (!isOwner) {
        return res.status(403).json(
          errorResponse({
            message: "Forbidden: You can only delete your own question",
          })
        );
      }

      await db.delete(questions).where(eq(questions.id, questionId));

      res.status(200).json(successResponse({ message: "Question deleted" }));
    } catch (err) {
      console.error("Delete Error:", err);
      res
        .status(500)
        .json(errorResponse({ message: "Failed to delete question" }));
    }
  }
);

export default questionRouteHandler;
