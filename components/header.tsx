import React from "react";
import Image from "next/image";

import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const Header = () => {
  return (
    <header className="fixed w-full h-16 px-6 py-2 bg-white flex justify-between border-b border-gray-200">
      <Image
        src="/logo.png"
        alt=""
        width={500}
        height={500}
        className="h-full w-auto aspect-square"
      />
      <Popover>
        <PopoverTrigger>
          {" "}
          <Avatar>
            <AvatarImage
              src="https://github.com/shadcn.png"
              alt="プロフィール画像"
              className="h-full w-auto aspect-square rounded-full"
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </PopoverTrigger>
        <PopoverContent>
          <button className="text-red-500">ログアウト</button>
        </PopoverContent>
      </Popover>
    </header>
  );
};

export default Header;
