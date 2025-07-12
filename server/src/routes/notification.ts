import express, { Response } from "express";
import { authMiddleware, AuthenticatedRequest } from "@/middleware";
import { db } from "@/db";
import { notifications, users } from "@/db/schema/schema";
import { eq, desc } from "drizzle-orm";

const router = express.Router();

router.get(
  "/",
  authMiddleware,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
          data: null,
        });
      }

      const userNotifications = await db
        .select({
          id: notifications.id,
          type: notifications.type,
          content: notifications.content,
          isRead: notifications.isRead,
          createdAt: notifications.createdAt,
          triggeredBy: {
            id: users.id,
            name: users.name,
            username: users.username,
          },
        })
        .from(notifications)
        .leftJoin(users, eq(users.id, notifications.triggeredById))
        .where(eq(notifications.recipientId, userId))
        .orderBy(desc(notifications.createdAt));

      return res.status(200).json({
        success: true,
        message: "Notifications fetched successfully",
        data: userNotifications,
      });
    } catch (err) {
      console.error("❌ Error fetching notifications:", err);
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
        data: null,
      });
    }
  }
);

export default router;
