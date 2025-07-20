import React from "react";
import "../globals.css";
import { Button } from "@/components/ui/button";

export default function Login() {
  return (
    <div>
      <p>おかえりなさい</p>
      <input type="email" name="" id="" placeholder="メールアドレス" />
      <input type="password" name="" id="" placeholder="パスワード" />
      <button>ログイン</button>
      <a href="/signup">アカウントをお持ちでないですか？ 登録</a>
    </div>
  );
}
