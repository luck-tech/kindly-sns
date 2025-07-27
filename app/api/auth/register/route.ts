import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(request: NextRequest) {
  try {
    const { email, password, username } = await request.json();

    // バリデーション
    if (!email || !password) {
      return NextResponse.json(
        { error: "メールアドレスとパスワードは必須です" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "パスワードは6文字以上で入力してください" },
        { status: 400 }
      );
    }

    // メールアドレスの重複チェック
    const existingUser = await query("SELECT id FROM users WHERE email = $1", [
      email,
    ]);

    if (existingUser.rows.length > 0) {
      return NextResponse.json(
        { error: "このメールアドレスは既に使用されています" },
        { status: 409 }
      );
    }

    // パスワードをハッシュ化
    const saltRounds = 10;
    const passwordHash = await bcryptjs.hash(password, saltRounds);

    // ユーザーIDを生成（メールアドレスから）
    const userId = email.split("@")[0] + "_" + Date.now().toString(36);

    // ユーザーを作成
    const result = await query(
      `INSERT INTO users (email, password_hash, username, user_id) 
       VALUES ($1, $2, $3, $4) 
       RETURNING id, email, username, user_id`,
      [email, passwordHash, username || "ユーザー", userId]
    );

    const newUser = result.rows[0];

    // JWTトークン生成
    const token = jwt.sign(
      {
        id: newUser.id.toString(),
        email: newUser.email,
        username: newUser.username,
        userId: newUser.user_id,
      },
      process.env.JWT_SECRET || "fallback-secret",
      { expiresIn: "7d" }
    );

    // レスポンス作成
    const response = NextResponse.json(
      {
        message: "アカウント作成成功",
        user: {
          id: newUser.id.toString(),
          email: newUser.email,
          username: newUser.username,
          userId: newUser.user_id,
        },
      },
      { status: 201 }
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
    console.error("ユーザー登録エラー:", error);
    return NextResponse.json(
      { error: "サーバーエラーが発生しました" },
      { status: 500 }
    );
  }
}
