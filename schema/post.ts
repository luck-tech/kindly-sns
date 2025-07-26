import { z } from "zod";

export const postSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, { message: "投稿内容を入力してください。" })
    .max(140, { message: "投稿は140文字以内で入力してください。" }),
});