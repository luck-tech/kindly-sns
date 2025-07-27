import React from "react";
import { PostForm } from "@/components/post-form";
import PostList from "@/components/post-list";

export default function Home() {
  return (
    <div className="w-full flex px-[160px] py-[50px]">
      <div className="m-0 w-full flex flex-col h-[695px] items-left gap-[10px]">
        <p className="text-[28px]">ホーム</p>
        <PostForm />
        <p className="pt-[16px] pb-[8px] px-[16px] text-[18px]">最新</p>
        <PostList />
      </div>
    </div>
  );
}
