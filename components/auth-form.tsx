"use client";

import React, { useState } from "react";
import { authSchema } from "@/schema/auth";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { AuthFormProps } from "@/types/auth";

export default function AuthForm({ type }: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );
  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const result = authSchema.safeParse({ email, password });
    if (!result.success) {
      const newErrors: typeof errors = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0] === "email") newErrors.email = issue.message;
        if (issue.path[0] === "password") newErrors.password = issue.message;
      });
      setErrors(newErrors);
      return;
    }
    setErrors({});

    try {
      const endpoint =
        type === "signup" ? "/api/auth/register" : "/api/auth/login";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.data),
      });

      const data = await res.json();
      if (res.ok) {
        if (type === "signup") {
          const userId = data.user.userId;
          router.push(`/profile/${userId}`);
        } else {
          router.push("/");
        }
      } else {
        toast.error(data.error || "処理に失敗しました。");
      }
    } catch (err) {
      toast.error("通信エラーが発生しました。");
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col">
      <input
        type="email"
        name="email"
        placeholder="メールアドレス"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          if (errors.email)
            setErrors((prev) => ({ ...prev, email: undefined }));
        }}
        autoComplete="email"
        className={`w-[448px] bg-[#F5F2F2] p-[16px] rounded-[12px] mx-[12px] my-[16px] placeholder:text-[#827066] ${
          errors.email
            ? "ring-2 ring-red-500"
            : "focus:ring-2 focus:ring-indigo-400"
        }`}
      />
      {errors.email && (
        <p className="text-red-500 text-sm -mt-2 w-[448px] px-4">
          {errors.email}
        </p>
      )}

      <input
        type="password"
        name="password"
        placeholder="パスワード"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
          if (errors.password)
            setErrors((prev) => ({ ...prev, password: undefined }));
        }}
        autoComplete={type === "signup" ? "new-password" : "current-password"}
        className={`w-[448px] bg-[#F5F2F2] p-[16px] rounded-[12px] mx-[12px] my-[16px] placeholder:text-[#827066] ${
          errors.password
            ? "ring-2 ring-red-500"
            : "focus:ring-2 focus:ring-indigo-400"
        }`}
      />
      {errors.password && (
        <p className="text-red-500 text-sm -mt-2 w-[448px] px-4">
          {errors.password}
        </p>
      )}

      <Button variant="loginSignup">
        {type === "signup" ? "登録" : "ログイン"}
      </Button>
    </form>
  );
}
