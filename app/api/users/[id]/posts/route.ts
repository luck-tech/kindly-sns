import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const { id: profileUserId } = await props.params;
    const loggedInUser = getAuthUser(request);

    const result = await query(
      `
      SELECT
        p.id,
        p.content,
        p.created_at,
        u.username,
        u.user_id,
        u.icon_url,
        COUNT(l.id) as like_count
      FROM posts p
      JOIN users u ON p.user_id = u.id
      LEFT JOIN likes l ON p.id = l.post_id
      WHERE u.user_id = $1
      GROUP BY p.id, u.id
      ORDER BY p.created_at DESC
      LIMIT 50
      `,
      [profileUserId]
    );

    const postIds = result.rows.map((row) => Number(row.id));

    let likedMap: Record<number, boolean> = {};
    if (loggedInUser && postIds.length > 0) {
      const likesResult = await query(
        `SELECT post_id FROM likes WHERE user_id = $1 AND post_id = ANY($2::bigint[])`,
        [loggedInUser.id, postIds]
      );
      likedMap = Object.fromEntries(
        likesResult.rows.map((r) => [Number(r.post_id), true])
      );
    }

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
    console.error("ユーザーの投稿取得エラー:", error);
    return NextResponse.json(
      { error: "投稿の取得に失敗しました" },
      { status: 500 }
    );
  }
}
