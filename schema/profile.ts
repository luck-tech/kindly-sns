import { z } from "zod";

export const profileSchema = z.object({
  username: z
    .string()
    .min(1, { message: "名前を入力してください" })
    .max(50, { message: "名前は50文字以内で入力してください" }),
  user_id: z.string().min(1).max(20),
});