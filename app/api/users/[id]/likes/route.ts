import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getAuthUser } from "@/lib/auth"; // 認証用の関数をインポート

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    // 1. プロフィールページのユーザーIDを取得
    const { id: profileUserId } = await props.params;

    // 2. 現在ログインしているユーザーの情報を取得（未ログインならnull）
    const loggedInUser = getAuthUser(request);

    // 3. プロフィールユーザーがいいねした投稿一覧を取得するクエリ（変更なし）
    const result = await query(
      `
      SELECT
        p.id,
        p.content,
        p.created_at,
        u.username,
        u.user_id,
        u.icon_url,
        COUNT(l2.id) as like_count
      FROM likes l
      JOIN posts p ON l.post_id = p.id
      JOIN users u ON p.user_id = u.id
      LEFT JOIN likes l2 ON p.id = l2.post_id
      WHERE l.user_id = (SELECT id FROM users WHERE user_id = $1)
      GROUP BY p.id, u.id
      ORDER BY p.created_at DESC
      LIMIT 50
      `,
      [profileUserId]
    );

    // 4. 取得した投稿のID一覧を作成
    const postIds = result.rows.map((row) => Number(row.id));

    // 5. ログインユーザーがいいねした投稿を特定するための準備
    let likedMap: Record<number, boolean> = {};
    if (loggedInUser && postIds.length > 0) {
      const likesResult = await query(
        // ログインユーザーID と 取得した投稿IDリスト で絞り込み
        `SELECT post_id FROM likes WHERE user_id = $1 AND post_id = ANY($2::bigint[])`,
        [loggedInUser.id, postIds] // loggedInUser.id はDBのusersテーブルの主キー
      );
      // { "投稿ID": true } のような形式のオブジェクトに変換
      likedMap = Object.fromEntries(
        likesResult.rows.map((r) => [Number(r.post_id), true])
      );
    }

    // 6. 最終的なレスポンスデータを作成
    const posts = result.rows.map((row) => ({
      id: row.id,
      content: row.content,
      created_at: row.created_at,
      user: {
        username: row.username,
        user_id: row.user_id,
        icon_url: row.icon_url,
      },
      like_count: parseInt(row.like_count) || 0,
      // likedMapに存在すればtrue、しなければfalse
      liked: !!likedMap[row.id],
    }));

    return NextResponse.json(
      {
        posts,
        count: posts.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("いいねした投稿の取得エラー:", error);
    return NextResponse.json(
      { error: "投稿の取得に失敗しました" },
      { status: 500 }
    );
  }
}
