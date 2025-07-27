"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { UserProfile } from "@/types/user";

const Header = () => {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);

  // ユーザー情報取得
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/me");
        if (res.ok) {
          const data = await res.json();
          setUser({
            user_id: data.user_id,
            icon_url: data.icon_url,
            username: data.username,
          });
        }
      } catch (e) {
        // エラー時は何もしない
      }
    };
    fetchUser();
  }, []);

  // ログアウト処理を行う関数
  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (response.ok) {
        router.push("/login");
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("An error occurred during logout:", error);
    }
  };

  return (
    <header className="fixed w-full h-16 px-6 py-2 bg-white flex justify-between border-b border-gray-200 z-50">
      <Link href="/">
        <Image
          src="/logo.png"
          alt="Logo"
          width={500}
          height={500}
          className="h-full w-auto aspect-square"
        />
      </Link>
      <Popover>
        <PopoverTrigger>
          <Avatar>
            <AvatarImage
              src={user?.icon_url || ""}
              alt="プロフィール画像"
              className="h-full w-auto aspect-square cursor-pointer"
            />
            <AvatarFallback>
              {user?.username ? user.username.charAt(0) : "?"}
            </AvatarFallback>
          </Avatar>
        </PopoverTrigger>
        <PopoverContent className="mr-4">
          <div className="flex flex-col space-y-2">
            <Link
              href={`/profile/${user?.user_id ?? ""}`}
              className="p-2 text-sm hover:bg-gray-100 rounded-md"
            >
              プロフィール
            </Link>
            <button
              className="p-2 text-sm text-red-500 cursor-pointer text-left hover:bg-gray-100 rounded-md"
              type="button"
              aria-label="Logout"
              onClick={handleLogout}
            >
              ログアウト
            </button>
          </div>
        </PopoverContent>
      </Popover>
    </header>
  );
};

export default Header;
