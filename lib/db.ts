import { Pool } from "pg";

let pool: Pool | null = null;

export function getPool(): Pool {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
  }
  return pool;
}

// クエリ関数
export async function query(
  text: string,
  params?: (string | number | boolean | null)[]
) {
  const pool = getPool();
  return pool.query(text, params);
}

// 接続を切る関数
export async function closePool(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
  }
}
