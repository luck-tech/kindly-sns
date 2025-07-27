import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";
import { z } from "zod";

const JWTPayloadSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  username: z.string(),
  userId: z.string(),
  iat: z.number().int().optional(),
  exp: z.number().int().optional(),
});
export type JWTPayload = z.infer<typeof JWTPayloadSchema>;

export function getAuthUser(request: NextRequest): JWTPayload | null {
  const token = request.cookies.get("auth-token")?.value;
  if (!token) return null;

  try {
    const rawPayload = jwt.verify(
      token,
      process.env.JWT_SECRET ?? "fallback-secret"
    );
    console.log(rawPayload);
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
