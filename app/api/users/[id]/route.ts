import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const { id: userId } = await props.params;

  const result = await query(
    `SELECT username, user_id, icon_url FROM users WHERE id = $1`,
    [userId]
  );
  const profile = result.rows[0];

  if (!profile) {
    return NextResponse.json(
      { error: "ユーザーが見つかりません" },
      { status: 404 }
    );
  }

  return NextResponse.json(
    {
      username: profile.username,
      user_id: profile.user_id,
      icon_url: profile.icon_url,
    },
    { status: 200 }
  );
}
