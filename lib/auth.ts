import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";
import { z } from "zod";

const JWTPayloadSchema = z.object({
  userId: z.number(),
  email: z.string().email(),
  username: z.string(),
  userIdString: z.string(),
  iat: z.number().int().optional(),
  exp: z.number().int().optional(),
});
export type JWTPayload = z.infer<typeof JWTPayloadSchema>;

export function getAuthUser(request: NextRequest): JWTPayload | null {
  // 開発環境のときだけ、強制的にログイン状態にする
  if (process.env.NODE_ENV === "development") {
    console.log("💡 [開発モード] 認証をスキップし、テストユーザーを返します。");

    // データベースに存在するユーザーのテストデータを返す
    return {
      userId: 1, // データベースに存在するID (例: 1)
      email: "real-user-1@example.com",
      username: "実在テストユーザー1",
      userIdString: "user_string_1",
    };
  }

  const token = request.cookies.get("auth-token")?.value;
  if (!token) return null;

  try {
    const rawPayload = jwt.verify(
      token,
      process.env.JWT_SECRET ?? "fallback-secret"
    );

    if (typeof rawPayload === "object" && rawPayload !== null) {
      const parsed = JWTPayloadSchema.safeParse(rawPayload);
      if (parsed.success) {
        return parsed.data;
      }
    }
    return null;
  } catch {
    return null;
  }
}
