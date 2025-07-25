import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const PUBLIC_PATHS = ["/login", "/signup", "/api"];

export function middleware(request: NextRequest) {
  //   const { pathname } = request.nextUrl;
  //   // パブリックパスはスキップ
  //   if (PUBLIC_PATHS.some((path) => pathname.startsWith(path))) {
  //     return NextResponse.next();
  //   }
  //   // クッキーからトークン取得
  //   const token = request.cookies.get("auth-token")?.value;
  //   // トークンがなければログインへ
  //   if (!token) {
  //     const loginUrl = new URL("/login", request.url);
  //     return NextResponse.redirect(loginUrl);
  //   }
  //   // トークン検証（無効ならログインへ）
  //   try {
  //     jwt.verify(token, process.env.JWT_SECRET || "fallback-secret");
  //     return NextResponse.next();
  //   } catch {
  //     const loginUrl = new URL("/login", request.url);
  //     return NextResponse.redirect(loginUrl);
  //   }
}

// 適用範囲を指定（appディレクトリ配下全体）
export const config = {
  matcher: ["/((?!api|_next|favicon.ico|login|signup|public).*)"],
};
