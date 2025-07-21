import React from "react";
import "../globals.css";
import { Button } from "@/components/ui/button";

export default function Login() {
  return (
    <div className="w-full flex px-[160px] py-20">
      <div className="m-0 w-full flex flex-col h-[695px] justify-center items-center">
        <p className="pt-[20px] pb-[12px] px-[16px] text-[28px] text-center ">
          おかえりなさい
        </p>
        <input
          type="email"
          name="email"
          id="email"
          placeholder="メールアドレス"
          className="w-[448px] bg-[#F5F2F2] mx-[12px] my-[16px] p-[16px] rounded-[12px] placeholder:text-[16px] placeholder:text-[#827066]"
        />
        <input
          type="password"
          name="password"
          id="password"
          placeholder="パスワード"
          autoComplete="current-password"
          className="w-[448px] bg-[#F5F2F2] mx-[12px] my-[16px] p-[16px] rounded-[12px] placeholder:text-[16px] placeholder:text-[#827066]"
        />
        <Button variant="loginSignup">ログイン</Button>
        <a
          href="/signup"
          className="cursor-pointer pt-[4px] pb-[12px] px-[16px] text-[14px] text-[#827066]"
        >
          アカウントをお持ちでないですか？ 登録
        </a>
      </div>
    </div>
  );
}
