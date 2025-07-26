import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

// ログイン状態でアクセスさせないパス
const AUTH_PATHS = ["/login", "/signup"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("auth-token")?.value;

  // --- ログイン済みユーザー向けの処理 ---
  const isAuthPath = AUTH_PATHS.some((path) => pathname.startsWith(path));

  if (isAuthPath) {
    if (token) {
      try {
        // トークンが有効かチェック
        const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
        await jwtVerify(token, secret);
        // 有効ならホームページにリダイレクト
        return NextResponse.redirect(new URL("/", request.url));
      } catch (error) {
        // トークンが無効なら何もしない（ログインページへ進ませる）
      }
    }
    // トークンがない場合も何もしない（ログインページへ進ませる）
    return NextResponse.next();
  }

  // --- 未ログインユーザー向けの処理 ---
  // 保護されたルートにトークンなしでアクセスした場合、ログインページへ
  if (!token) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // トークンを検証
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    await jwtVerify(token, secret);
    // 検証成功
    return NextResponse.next();
  } catch (err) {
    // 検証失敗
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }
}

// middlewareを適用する範囲
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
