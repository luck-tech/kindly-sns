import React from "react";
import "../globals.css";
import { Button } from "@/components/ui/button";

export default function Signup() {
  return (
    <div className="w-full flex px-[160px] py-20 font-hachimarupop">
      <div className="m-0 w-full flex flex-col h-[695px] justify-center items-center">
        <p className="pt-[20px] pb-[12px] px-[16px] text-[28px] text-center ">
          おかえりなさい
        </p>
        <input
          type="email"
          name=""
          id=""
          placeholder="メールアドレス"
          className="w-[448px] bg-[#F5F2F2] mx-[12px] my-[16px] p-[16px] rounded-[12px] placeholder:text-[16px] placeholder:text-[#827066]"
        />
        <input
          type="password"
          name=""
          id=""
          placeholder="パスワード"
          className="w-[448px] bg-[#F5F2F2] mx-[12px] my-[16px] p-[16px] rounded-[12px] placeholder:text-[16px] placeholder:text-[#827066]"
        />
        <Button variant="login_signup">ログイン</Button>
        <a
          href="/signup"
          className="pt-[4px] pb-[12px] px-[16px] text-[14px] text-[#827066]"
        >
          既にアカウントをお持ちですか？ 登録
        </a>
      </div>
    </div>
  );
}
