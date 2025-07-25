import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .email({ message: "メールアドレスの形式が正しくありません" }),
  password: z.string().min(6, { message: "パスワードは6文字以上必要です" }),
  username: z.string().optional(),
});
