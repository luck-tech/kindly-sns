import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { query } from "@/lib/db";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } } // paramsでpostIdを取得
) {
  try {
    const user = getAuthUser(request); // ログイン中のユーザーを取得
    if (!user) {
      // ログイン中のユーザーではなかったらエラーを返す。
      return NextResponse.json({ message: "認証エラー" }, { status: 401 });
    }
    const sql = "INSERT INTO likes (user_id, post_id) VALUES ($1, $2)";
    const userId = user.userId;
    const postId = parseInt(params.id, 10);

    await query(sql, [userId, postId]);

    return NextResponse.json(
      { message: "いいねを追加しました" },
      { status: 201 }
    );
  } catch (error) {
    console.error("いいね追加APIでエラー:", error);
    return NextResponse.json(
      { message: "サーバー内部でエラーが発生しました" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } } // paramsでpostIdを取得
) {
  try {
    const user = getAuthUser(request); // ログイン中のユーザーを取得
    if (!user) {
      // ログイン中のユーザーではなかったらエラーを返す。
      return NextResponse.json(
        { message: "認証エラー" },
        { status: 401 } // 401は「認証されていない」という意味のステータスコード
      );
    }

    const sql = "DELETE FROM likes WHERE user_id = $1 AND post_id = $2";
    const userId = user.userId;
    const postId = params.id;

    await query(sql, [userId, postId]);

    return NextResponse.json(
      { message: "いいねを削除しました" },
      { status: 200 }
    );
  } catch (error) {
    console.error("いいね削除APIでエラー:", error);
    return NextResponse.json(
      { message: "サーバー内部でエラーが発生しました" },
      { status: 500 }
    );
  }
}
