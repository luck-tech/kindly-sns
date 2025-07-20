import React from "react";
import "../globals.css";
import { Button } from "@/components/ui/button";

export default function Signup() {
  return (
    <div className="w-full flex justify-center items-center px-[120px] py-20 font-hachimarupop">
      <div className="p-6 mx-auto flex flex-col gap-4 max-w-[960px] h-[695px]">
        <p className="pt-20 pb-12 px-16 text-[28px]">おかえりなさい</p>
        <input
          type="email"
          name=""
          id=""
          placeholder="メールアドレス"
          className="text-[16px]"
        />
        <input
          type="password"
          name=""
          id=""
          placeholder="パスワード"
          className="text-[16px]"
        />
        <Button variant="default">登録</Button>
        <a href="/login" className="text-[14px]">
          既にアカウントをお持ちですか？ ログイン
        </a>
      </div>
    </div>
  );
}
