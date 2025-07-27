import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

export async function POST(request: Request): Promise<NextResponse> {
  try {
    // requestからFormDataをパースする
    const formData = await request.formData();
    // 'file'というキーで送信されたファイルを取得する
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "ファイルが送信されていません" },
        { status: 400 },
      );
    }

    // Vercel Blobにファイルをアップロード (ファイル名もfileオブジェクトから取得)
    const blob = await put(file.name, file, {
      access: "public",
    });

    // アップロード結果を返す
    return NextResponse.json(blob);
  } catch (error) {
    console.error("Upload Error:", error);
    return NextResponse.json(
      { error: "アップロード中にエラーが発生しました" },
      { status: 500 },
    );
  }
}
