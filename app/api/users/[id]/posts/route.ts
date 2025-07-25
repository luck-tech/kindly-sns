import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const { id: userId } = await props.params;

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
    GROUP BY p.id, u.id, u.username, u.user_id, u.icon_url
    ORDER BY p.created_at DESC
    LIMIT 50
    `,
    [userId]
  );

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
  }));

  return NextResponse.json(
    {
      posts,
      count: posts.length,
    },
    { status: 200 }
  );
}
