import { Router, Request, Response, NextFunction } from "express";
import { db } from "@/db";
import { questions } from "@/db/schema/schema";
import { desc, eq } from "drizzle-orm";

const router = Router();


router.get(
  "/:userId/questions",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await db
        .select() 
        .from(questions)
        .where(eq(questions.userId, req.params.userId))
        .orderBy(desc(questions.createdAt)); 

      res.json(result);
    } catch (err) {
      next(err);
    }
  },
);

export default router;
