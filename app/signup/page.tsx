import React from "react";
import "../globals.css";
import { Button } from "@/components/ui/button";

export default function Signup() {
  return (
    <div className="w-full flex justify-center items-center px-[120px] py-20">
      <div className="p-6 mx-auto flex flex-col gap-4 max-w-[960px] h-[695px]">
        <p className="pt-20 pb-12 px-16 ">おかえりなさい</p>
        <input
          type="email"
          name=""
          id=""
          placeholder="メールアドレス"
          className=""
        />
        <input
          type="password"
          name=""
          id=""
          placeholder="パスワード"
          className=""
        />
        <Button variant="default">登録</Button>
        <a href="/login" className="">
          既にアカウントをお持ちですか？ ログイン
        </a>
      </div>
    </div>
  );
}
