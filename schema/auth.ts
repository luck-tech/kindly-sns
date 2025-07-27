import { z } from "zod";

export const authSchema = z.object({
  email: z
    .string()
    .email({ message: "メールアドレスの形式が正しくありません" }),
  password: z.string().min(6, { message: "パスワードは6文字以上必要です" }),
  username: z.string().optional(),
});

export const JWTPayloadSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  username: z.string(),
  userId: z.string(),
  iat: z.number().int().optional(),
  exp: z.number().int().optional(),
});
export type JWTPayload = z.infer<typeof JWTPayloadSchema>;
