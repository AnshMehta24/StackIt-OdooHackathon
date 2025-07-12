import { z } from "zod";

export const questionSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  tags: z.array(z.string().min(1)).nonempty("At least one tag is required"),
});

export type QuestionInput = z.infer<typeof questionSchema>;
