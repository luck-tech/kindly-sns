import React from "react";
import "../../globals.css";
import { Button } from "@/components/ui/button";

export default function Signup() {
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
          autoComplete="new-password"
          className="w-[448px] bg-[#F5F2F2] mx-[12px] my-[16px] p-[16px] rounded-[12px] placeholder:text-[16px] placeholder:text-[#827066]"
        />
        <Button variant="loginSignup">登録</Button>
        <a
          href="/login"
          className="cursor-pointer pt-[4px] pb-[12px] px-[16px] text-[14px] text-[#827066]"
        >
          既にアカウントをお持ちですか？ ログイン
        </a>
      </div>
    </div>
  );
}
