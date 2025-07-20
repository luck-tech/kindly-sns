import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { hachiMaruPop } from "@/app/fonts";

const Header = () => {
  return (
    <header className="fixed w-full h-16 px-6 py-2 bg-white flex justify-between border-b border-gray-200">
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
              src="https://github.com/shadcn.png"
              alt="プロフィール画像"
              className="h-full w-auto aspect-square cursor-pointer"
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </PopoverTrigger>
        <PopoverContent className={hachiMaruPop.className}>
          <button
            className="text-red-500 cursor-pointer"
            type="button"
            aria-label="Logout"
          >
            ログアウト
          </button>
        </PopoverContent>
      </Popover>
    </header>
  );
};

export default Header;
