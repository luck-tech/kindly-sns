import { JWTPayloadSchema, JWTPayload } from "@/schema/auth";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function getAuthUser(): Promise<JWTPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;
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
