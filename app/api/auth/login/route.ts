import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // バリデーション
    if (!email || !password) {
      return NextResponse.json(
        { error: "メールアドレスとパスワードは必須です" },
        { status: 400 }
      );
    }

    // ユーザーを検索
    const result = await query(
      "SELECT id, email, password_hash, username, user_id FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "メールアドレスまたはパスワードが正しくありません" },
        { status: 401 }
      );
    }

    const user = result.rows[0];

    // パスワード検証
    const isValidPassword = await bcryptjs.compare(
      password,
      user.password_hash
    );
    if (!isValidPassword) {
      return NextResponse.json(
        { error: "メールアドレスまたはパスワードが正しくありません" },
        { status: 401 }
      );
    }

    // JWTトークン生成
    const token = jwt.sign(
      {
        userId: Number(user.id),
        email: user.email,
        username: user.username,
        userIdString: user.user_id,
      },
      process.env.JWT_SECRET || "fallback-secret",
      { expiresIn: "7d" }
    );

    // レスポンス作成
    const response = NextResponse.json(
      {
        message: "ログイン成功",
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          userId: user.user_id,
        },
      },
      { status: 200 }
    );

    // HTTPOnlyクッキーにトークンを設定
    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7日間
    });

    return response;
  } catch (error) {
    console.error("ログインエラー:", error);
    return NextResponse.json(
      { error: "サーバーエラーが発生しました" },
      { status: 500 }
    );
  }
}
