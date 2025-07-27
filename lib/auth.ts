import { JWTPayloadSchema, JWTPayload } from "@/schema/auth";
import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

export function getAuthUser(request: NextRequest): JWTPayload | null {
  const token = request.cookies.get("auth-token")?.value;
  if (!token) return null;

  try {
    const rawPayload = jwt.verify(
      token,
      process.env.JWT_SECRET ?? "fallback-secret",
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
