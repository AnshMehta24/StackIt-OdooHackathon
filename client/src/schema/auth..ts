import { z } from "zod";

export const authSchema = z
  .object({
    auth: z.enum(["signIn", "signUp", "forgot-password"]),
    name: z.string().trim().optional(),
    username: z.string().trim().optional(),
    email: z.string().trim().email("Enter a valid email."),
    password: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    // Password validation (skip for forgot-password)
    if (data.auth !== "forgot-password") {
      if (!data.password || data.password.length < 6) {
        ctx.addIssue({
          code: "custom",
          path: ["password"],
          message: "Password must be at least 6 characters.",
        });
      }
    }

    // Username required for signUp
    if (data.auth === "signUp" && !data.username) {
      ctx.addIssue({
        code: "custom",
        path: ["username"],
        message: "Username is required for signup.",
      });
    }

    // Name required for signUp
    if (data.auth === "signUp" && !data.name) {
      ctx.addIssue({
        code: "custom",
        path: ["name"],
        message: "Name is required for signup.",
      });
    }
  });

export type AuthFormData = z.infer<typeof authSchema>;
