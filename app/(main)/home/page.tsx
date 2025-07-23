import React from "react";
import "../../globals.css";
import { Button } from "@/components/ui/button";
import { PostList } from "@/components/post";

export default function home() {
  return (
    <div className="w-full flex px-[160px] py-[50px]">
      <div className="m-0 w-full flex flex-col h-[695px] items-left gap-[10px]">
        <p className="text-[28px]">ホーム</p>
        <form
          action=""
          className="px-[20px] py-[10px] flex border border-[1px] rounded-[20px]"
        >
          <textarea
            name="new_post"
            id="new_post"
            placeholder="いまどうしてる"
            className="h-[127px] w-[100%] resize-none focus:outline-none focus:border-none"
          ></textarea>
          <div className="flex flex-col justify-end">
            <Button variant="homePost">投稿</Button>
          </div>
        </form>
        <p className="pt-[16px] pb-[8px] px-[16px] text-[18px]">最新</p>
        <PostList mode="latest" />
      </div>
    </div>
  );
}
