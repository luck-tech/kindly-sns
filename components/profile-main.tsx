'use client'

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export type ProfileType = {
  id:number;
  email: string;
  username:string;
  user_id: string;
  icon_url:string;
};

export type ProfilePerson = "self" | "others";

type ProfileMainProps = {
  mode?: ProfilePerson;
  profile?: ProfileType | null;
};

export const ProfileMain = ({ mode , profile }: ProfileMainProps) => {
  if (!profile) {
    return <div>プロフィール情報がありません。</div>;
  }

  return (
    <div className="flex flex-col items-center p-0 m-0">
      <Avatar className="flex justify-center w-[128px] h-[128px]">
        <AvatarImage
          src={profile.icon_url || "https://github.com/shadcn.png"}
          alt="プロフィール画像"
          className="h-full w-auto aspect-square cursor-pointer"
        />
        <AvatarFallback>{profile.username?.slice(0, 2).toUpperCase() || 'P'}</AvatarFallback>
      </Avatar>
      <div className="mt-[16px] flex flex-col items-center">
        <p className="text-[22px] text-[#171412]">{profile.username}</p>
        <p className="text-[16px] text-[#827066]">@{profile.user_id?.split('@')[0]}</p>
      </div>
    </div>
  );
};