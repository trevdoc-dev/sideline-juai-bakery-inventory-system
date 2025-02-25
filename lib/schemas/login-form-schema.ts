import { z } from "zod";

export const LoginFormSchema = z.object({
  username: z.string().min(10).max(50).email("Please provide a valid email."),
  password: z
    .string()
    .min(8, "The password must be at least 8 characters long")
    .max(32, "The password must be a maximun 32 characters"),
});
