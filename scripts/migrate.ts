import { query, closePool } from "@/lib/db";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

async function migrate() {
  try {
    const schemaSQL = fs.readFileSync(
      path.join(process.cwd(), "database/schema.sql"),
      "utf8",
    );

    await query(schemaSQL);
    console.log("✅ テーブル作成完了");

    // 初期データがある場合
    const seedSQL = fs.readFileSync(
      path.join(process.cwd(), "database/seed.sql"),
      "utf8",
    );

    await query(seedSQL);
    console.log("✅ 初期データ投入完了");
  } catch (error) {
    console.error("❌ マイグレーションエラー:", error);
  } finally {
    await closePool();
  }
}

migrate();
