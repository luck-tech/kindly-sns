import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();
console.log("DATABASE_URL:", process.env.DATABASE_URL ? "OK" : "NOT SET");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function testConnection() {
  try {
    const client = await pool.connect();
    const result = await client.query("SELECT NOW()");
    console.log("接続成功:", result.rows[0]);
    client.release();
  } catch (error) {
    console.error("接続エラー:", error);
  } finally {
    await pool.end();
  }
}

testConnection();
