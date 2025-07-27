import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { query } from "@/lib/db";

export async function GET(request: NextRequest) {
  const user = getAuthUser(request);
  if (!user) {
    return NextResponse.json({ error: "認証エラー" }, { status: 401 });
  }

  const result = await query(
    `SELECT id, username, user_id, icon_url FROM users WHERE id = $1`,
    [user.userId]
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
      id:profile.id,
      username: profile.username,
      user_id: profile.user_id,
      icon_url: profile.icon_url,
    },
    { status: 200 }
  );
}

export async function PUT(request: NextRequest) {
  const user = getAuthUser(request);
  if (!user) {
    return NextResponse.json({ error: "認証エラー" }, { status: 401 });
  }

  const { username, icon_url, user_id } = await request.json();

  // バリデーション
  if (username && (typeof username !== "string" || username.length > 50)) {
    return NextResponse.json(
      { error: "ユーザーネームは50文字以内で入力してください" },
      { status: 400 }
    );
  }
  if (icon_url && typeof icon_url !== "string") {
    return NextResponse.json(
      { error: "アイコンURLが不正です" },
      { status: 400 }
    );
  }
  if (user_id && (typeof user_id !== "string" || user_id.length > 20)) {
    return NextResponse.json(
      { error: "ユーザーIDは20文字以内で入力してください" },
      { status: 400 }
    );
  }

  // user_id重複チェック
  if (user_id) {
    const check = await query(
      `SELECT id FROM users WHERE user_id = $1 AND id != $2`,
      [user_id, user.userId]
    );
    if (check.rows.length > 0) {
      return NextResponse.json(
        { error: "そのユーザーIDは既に登録されています" },
        { status: 409 }
      );
    }
  }

  await query(
    `UPDATE users SET
      username = COALESCE($1, username),
      icon_url = COALESCE($2, icon_url),
      user_id = COALESCE($3, user_id)
      WHERE id = $4`,
    [username, icon_url, user_id, user.userId]
  );

  const result = await query(
    `SELECT username, user_id, icon_url FROM users WHERE id = $1`,
    [user.userId]
  );
  const profile = result.rows[0];

  return NextResponse.json(
    {
      message: "プロフィールを更新しました",
      username: profile.username,
      user_id: profile.user_id,
      icon_url: profile.icon_url,
    },
    { status: 200 }
  );
}
