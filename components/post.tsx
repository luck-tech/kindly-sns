"use client";

import { useRouter } from 'next/navigation';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ThumbsUp } from "lucide-react";

export type PostType = {
  id: number;
  content: string;
  created_at: string;
  user: {
    id:number;
    username: string;
    user_id: string;
    icon_url: string;
  };
  like_count: number;
};

//表示モード
export type ViewMode = "self" | "like" | "latest";



export const PostList = ({
  mode,
  allPosts,
}: {
  mode: ViewMode;
  allPosts?: PostType[];
}) => {

  const router = useRouter();
  const goToProfile = (userId: number) => {
    router.push(`/profile/${userId}`);
  };

  return (
    <div>
      {allPosts?.map((post) => {
        const id = post.user.id
        const postDate = new Date(post.created_at);
        let dateDisplayText: string;
        if (isNaN(postDate.getTime())) {
          dateDisplayText = "不明";
        } else {
          const today = new Date();
          const startOfToday = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate()
          );
          const startOfTarget = new Date(
            postDate.getFullYear(),
            postDate.getMonth(),
            postDate.getDate()
          );
          const diffInMs = startOfToday.getTime() - startOfTarget.getTime();
          const daysAgo = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

          dateDisplayText = `${daysAgo}日前`;
        }

        return (
          <div key={post.id} className="flex px-[16px] py-[12px]">
            <Avatar className="cursor-pointer" onClick={() => goToProfile(post.user.id)}>
              <AvatarImage src={post.user.icon_url} />
              <AvatarFallback>{post.user.username.slice(0, 2)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col w-full ml-[16px]">
              <div className="flex items-center gap-[12px]">
                <p className="text-[14px] text-[#171412]">{post.user.username}</p>
                <p className="text-sm text-gray-500">{dateDisplayText}</p>
              </div>
              <p className="text-gray-800">{post.content}</p>
              <div className="flex items-center mt-[8px] text-gray-500 gap-[8px]">
                <ThumbsUp className="w-[20px] h-[20px] text-[14px] text-[#827066] cursor-pointer" />
                <p className="text-[14px] text-[#827066]">{post.like_count}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
