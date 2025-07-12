import express from "express";
import { eq, and, sql } from "drizzle-orm";
import { db } from "../db";
import { votes } from "../db/schema/schema";

const router = express.Router();

const getVoteCounts = async (answerId: string) => {
  const result = await db
    .select({
      upvotes:
        sql<number>`SUM(CASE WHEN vote_type = 'UPVOTE' THEN 1 ELSE 0 END)`.as(
          "upvotes"
        ),
      downvotes:
        sql<number>`SUM(CASE WHEN vote_type = 'DOWNVOTE' THEN 1 ELSE 0 END)`.as(
          "downvotes"
        ),
    })
    .from(votes)
    .where(eq(votes.answerId, answerId));

  return result[0] || { upvotes: 0, downvotes: 0 };
};

router.get("/answer/:id", async (req, res) => {
  const answerId = req.params.id;
  const { userId } = req.query;

  try {
    const { upvotes, downvotes } = await getVoteCounts(answerId);

    let currentUserVote = null;
    if (userId) {
      const existing = await db
        .select({ voteType: votes.voteType })
        .from(votes)
        .where(
          and(eq(votes.answerId, answerId), eq(votes.userId, String(userId)))
        );

      currentUserVote = existing[0]?.voteType ?? null;
    }

    res.json({
      upvotes,
      downvotes,
      currentUserVote,
      voteCount: upvotes - downvotes,
    });
  } catch (error) {
    console.error("GET votes error:", error);
    res.status(500).json({ error: "Failed to fetch votes" });
  }
});

router.post("/answer/:id", async (req, res) => {
  const answerId = req.params.id;
  const { userId, voteType } = req.body;

  if (!userId || !voteType) {
    return res.status(400).json({ error: "User ID and vote type required" });
  }

  const normalizedVote = voteType.toUpperCase();
  if (!["UPVOTE", "DOWNVOTE"].includes(normalizedVote)) {
    return res.status(400).json({ error: "Invalid vote type" });
  }

  try {
    const existing = await db
      .select()
      .from(votes)
      .where(and(eq(votes.answerId, answerId), eq(votes.userId, userId)));

    if (existing.length > 0) {
      if (existing[0].voteType === normalizedVote) {
        await db
          .delete(votes)
          .where(and(eq(votes.answerId, answerId), eq(votes.userId, userId)));
      } else {
        await db
          .update(votes)
          .set({ voteType: normalizedVote, updatedAt: new Date() })
          .where(and(eq(votes.answerId, answerId), eq(votes.userId, userId)));
      }
    } else {
      await db.insert(votes).values({
        userId,
        answerId,
        voteType: normalizedVote,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    const { upvotes, downvotes } = await getVoteCounts(answerId);
    const userVote = await db
      .select({ voteType: votes.voteType })
      .from(votes)
      .where(and(eq(votes.answerId, answerId), eq(votes.userId, userId)));

    res.json({
      upvotes,
      downvotes,
      currentUserVote: userVote[0]?.voteType ?? null,
      voteCount: upvotes - downvotes,
    });
  } catch (error) {
    console.error("POST votes error:", error);
    res.status(500).json({ error: "Failed to cast vote" });
  }
});

// DELETE /votes/answer/:id - Remove vote
router.delete("/answer/:id", async (req, res) => {
  const answerId = req.params.id;
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    await db
      .delete(votes)
      .where(and(eq(votes.answerId, answerId), eq(votes.userId, userId)));

    const { upvotes, downvotes } = await getVoteCounts(answerId);

    res.json({
      upvotes,
      downvotes,
      currentUserVote: null,
      voteCount: upvotes - downvotes,
      message: "Vote removed",
    });
  } catch (error) {
    console.error("DELETE votes error:", error);
    res.status(500).json({ error: "Failed to remove vote" });
  }
});

export default router;
