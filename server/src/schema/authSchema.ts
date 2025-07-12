import { z } from "zod";

export const signupSchema = z.object({
  name: z.string({
    message: "Name is required.",
  }),
  username: z
    .string({
      message: "Username is required.",
    })
    .min(3, "Username must be at least 3 characters."),
  email: z.string().email("Enter a valid email."),
  password: z
    .string({
      message: "Password is required.",
    })
    .min(6, "Password must be at least 6 characters."),
});

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});
