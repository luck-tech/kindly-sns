"use client";

import React, { useState } from "react";
import "../../globals.css";
import { Button } from "@/components/ui/button";
import { loginSchema } from "@/lib/validation/loginSchema";
import { toast } from "react-toastify";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // ログイン用のスキーマでバリデーション
    const result = loginSchema.safeParse({ email, password });

    // バリデーションに失敗した場合の処理
    if (!result.success) {
      const newErrors: { email?: string; password?: string } = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0] === "email") {
          newErrors.email = issue.message;
        }
        if (issue.path[0] === "password") {
          newErrors.password = issue.message;
        }
      });
      setErrors(newErrors);
      return;
    }

    // バリデーションに成功した場合、エラー表示をクリアする
    setErrors({});

    // fetchを使って、/api/auth/login へPOSTリクエストを送信する
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(result.data),
      });

      // APIからのレスポンスに応じた処理
      if (res.ok) {
        toast.success("ログインしました！");
        // ここにログイン成功後のページ遷移処理などを追加
      } else {
        const data = await res.json();
        toast.error(data.error || "ログインに失敗しました。");
      }
    } catch (error) {
      // サーバーとの通信自体に失敗した場合
      toast.error("通信エラーが発生しました。");
      console.error(error);
    }
  };

  return (
    <div className="w-full flex px-[160px] py-20">
      <div className="m-0 w-full flex flex-col h-[695px] justify-center items-center">
        <p className="pt-[20px] pb-[12px] px-[16px] text-[28px] text-center ">
          おかえりなさい
        </p>
        <form
          action=""
          className="flex flex-col"
          onSubmit={handleSubmit}
          noValidate
        >
          <input
            type="email"
            name="email"
            id="email"
            value={email}
            placeholder="メールアドレス"
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) {
                setErrors((prev) => ({ ...prev, email: undefined }));
              }
            }}
            className={`w-[448px] bg-[#F5F2F2] mx-[12px] my-[16px] p-[16px] rounded-[12px] placeholder:text-[16px] placeholder:text-[#827066] ${errors.email ? "ring-2 ring-red-500" : "focus:ring-2 focus:ring-indigo-400"}`}
          />
          {errors.email && (
            <p className="text-red-500 text-sm -mt-2 w-[448px] px-4">
              {errors.email}
            </p>
          )}
          <input
            type="password"
            name="password"
            id="password"
            value={password}
            placeholder="パスワード"
            onChange={(e) => {
              setPassword(e.target.value);
              if (errors.password) {
                setErrors((prev) => ({ ...prev, password: undefined }));
              }
            }}
            autoComplete="current-password"
            className={`w-[448px] bg-[#F5F2F2] mx-[12px] my-[16px] p-[16px] rounded-[12px] placeholder:text-[16px] placeholder:text-[#827066] ${errors.password ? "ring-2 ring-red-500" : "focus:ring-2 focus:ring-indigo-400"}`}
          />
          {errors.password && (
            <p className="text-red-500 text-sm -mt-2 w-[448px] px-4">
              {errors.password}
            </p>
          )}
          <Button variant="loginSignup">ログイン</Button>
        </form>
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
