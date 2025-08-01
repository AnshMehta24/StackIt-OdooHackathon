import { pgTable, varchar, text, pgEnum, boolean } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";
import { sql } from "drizzle-orm";
import { timeStampColumns } from "@/common/column";

export const voteTypeEnum = pgEnum("vote_type_t", ["UPVOTE", "DOWNVOTE"]);
export const notificationTypeEnum = pgEnum("notification_type_t", [
  "ANSWER_ON_QUESTION",
  "COMMENT_ON_ANSWER",
  "MENTION",
]);

export const users = pgTable("users", {
  id: varchar("id", { length: 128 })
    .primaryKey()
    .$defaultFn(() => createId()),
  name: varchar("name", { length: 50 }).notNull(),
  username: varchar("username", { length: 50 }).notNull().unique(),
  email: varchar("email", { length: 100 }).notNull().unique(),
  password: varchar("password", { length: 200 }).notNull(),
  ...timeStampColumns,
});

export const questions = pgTable("questions", {
  id: varchar("id", { length: 128 })
    .primaryKey()
    .$defaultFn(() => createId()),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  userId: varchar("user_id", { length: 128 }).references(() => users.id),
  tags: text("tags")
    .array()
    .notNull()
    .default(sql`ARRAY[]::text[]`),
  ...timeStampColumns,
});

export const answers = pgTable("answers", {
  id: varchar("id", { length: 128 })
    .primaryKey()
    .$defaultFn(() => createId()),
  content: text("content").notNull(),
  questionId: varchar("question_id", { length: 128 }).references(
    () => questions.id
  ),
  userId: varchar("user_id", { length: 128 }).references(() => users.id),
  ...timeStampColumns,
});

export const votes = pgTable("votes", {
  id: varchar("id", { length: 128 })
    .primaryKey()
    .$defaultFn(() => createId()),
  userId: varchar("user_id", { length: 128 }).references(() => users.id),
  answerId: varchar("answer_id", { length: 128 }).references(() => answers.id),
  voteType: voteTypeEnum("vote_type").notNull(),
  ...timeStampColumns,
});

export const notifications = pgTable("notifications", {
  id: varchar("id", { length: 128 })
    .primaryKey()
    .$defaultFn(() => createId()),
  type: notificationTypeEnum("type").notNull(),
  recipientId: varchar("recipient_id", { length: 128 }).references(
    () => users.id
  ),
  triggeredById: varchar("triggered_by_id", { length: 128 }).references(
    () => users.id
  ),
  content: text("content").notNull(),
  isRead: boolean("is_read").default(false),
  ...timeStampColumns,
});
