import { NextResponse } from "next/server";

export async function POST() {
  try {
    const response = NextResponse.json(
      { message: "ログアウトに成功しました", success: true },
      { status: 200 },
    );

    // 'auth-token'クッキーを削除
    response.cookies.delete("auth-token");

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: "サーバーエラーが発生しました" },
      { status: 500 },
    );
  }
}
