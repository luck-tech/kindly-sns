import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";
import OpenAI from "openai";

// OpenRouter経由でDeepSeek R1を使用
const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

// 改良されたプロンプト
const KINDNESS_PROMPT = `
You are a content transformer for a "Kind SNS" platform. Transform user posts into gentle, warm expressions following these rules:

RULES:
1. Replace harsh/aggressive words with gentle alternatives
2. Convert negative emotions into constructive, positive expressions  
3. Use casual, friendly tone (no formal language)
4. Add appropriate emojis and softening characters like "〜" and "♪"
5. Maintain original intent while making readers feel warm
6. Keep length within ±50 characters of original

EXAMPLES:
Input: "マジでムカつく！上司が最悪すぎる"
Output: "今日はちょっとモヤモヤしちゃった〜。上司とのコミュニケーションがうまくいかなくて困ってるの💦"

Input: "死ね"  
Output: "今日は疲れちゃった〜。少し休憩が必要かも🌸"

IMPORTANT:
- Output ONLY the transformed text
- NO explanations or meta-commentary
- NO analysis of the transformation process
- If input is already kind, add more warmth

Transform this text:
`;

export async function GET(request: NextRequest) {
  try {
    // ホーム画面用の投稿一覧取得クエリ
    const result = await query(`
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
      GROUP BY p.id, u.id, u.username, u.user_id, u.icon_url
      ORDER BY p.created_at DESC
      LIMIT 50
    `);

    // データの型変換
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
  } catch (error) {
    console.error("投稿取得エラー:", error);
    return NextResponse.json(
      { error: "投稿の取得に失敗しました" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // ユーザー情報取得
    const user = getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: "認証エラー" }, { status: 401 });
    }

    const { content } = await request.json();

    // バリデーション
    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { error: "投稿内容を入力してください" },
        { status: 400 }
      );
    }

    if (content.length > 500) {
      return NextResponse.json(
        { error: "投稿は500文字以内で入力してください" },
        { status: 400 }
      );
    }

    // DeepSeek R1変換
    let transformedContent: string;

    console.log("=== 変換処理開始 ===");
    console.log("元の投稿:", content);

    try {
      const completion = await openai.chat.completions.create(
        {
          model: "deepseek/deepseek-r1:free",
          messages: [
            {
              role: "user",
              content: KINDNESS_PROMPT + "\n\n" + content,
            },
          ],
          max_tokens: 800,
          temperature: 0.7,
          top_p: 0.9,
          frequency_penalty: 0.1,
          presence_penalty: 0.1,
        },
        {
          timeout: 60000, // 60秒
        }
      );

      const apiResponse = completion.choices[0]?.message?.content?.trim();
      const finishReason = completion.choices[0]?.finish_reason;

      console.log("📝 生のレスポンス:", apiResponse);
      console.log("📏 レスポンス長:", apiResponse?.length);
      console.log("🏁 終了理由:", finishReason);

      transformedContent = apiResponse || content;
      console.log("✅ 変換結果:", transformedContent);
    } catch (deepseekError) {
      console.error("DeepSeek R1 API エラー:", deepseekError);
      // DeepSeek R1 APIが失敗した場合は元の内容をそのまま使用
      transformedContent = content;
    }

    console.log("📤 最終的な投稿内容:", transformedContent);
    console.log("=== 変換処理終了 ===");

    // データベースに投稿を保存
    const result = await query(
      `INSERT INTO posts (user_id, content) 
       VALUES ($1, $2) 
       RETURNING id, content, created_at`,
      [user.userId, transformedContent]
    );

    const newPost = result.rows[0];

    // ユーザー情報を取得
    const userResult = await query(
      `SELECT username, user_id, icon_url FROM users WHERE id = $1`,
      [user.userId]
    );

    const userInfo = userResult.rows[0];

    const postResponse = {
      id: newPost.id,
      content: newPost.content,
      created_at: newPost.created_at,
      user: {
        username: userInfo.username,
        user_id: userInfo.user_id,
        icon_url: userInfo.icon_url,
      },
      like_count: 0,
    };

    return NextResponse.json(
      {
        message: "投稿が作成されました",
        post: postResponse,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "サーバーエラーが発生しました" },
      { status: 500 }
    );
  }
}
