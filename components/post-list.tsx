import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ThumbsUp } from "lucide-react";

type PostType = {
  id: number;
  content: string;
  created_at: string;
  user: {
    username: string;
    user_id: string;
    icon_url: string;
  };
  like_count: number;
};

type PostListProps = {
  endpoint?: string;
};

export default async function PostList({
  endpoint = "/api/posts",
}: PostListProps) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL ?? ""}${endpoint}`,
    {
      cache: "no-store", // SSRで毎回最新を取得
    }
  );
  const data = await res.json();
  const posts: PostType[] = Array.isArray(data.posts) ? data.posts : data;

  return (
    <>
      {[...posts]
        .sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
        .map((post) => {
          const postDate = new Date(post.created_at);
          let dateDisplayText: string;
          if (isNaN(postDate.getTime())) {
            dateDisplayText = "不明";
          } else {
            const now = new Date();
            const diffInMs = now.getTime() - postDate.getTime();
            const minutesAgo = Math.floor(diffInMs / (1000 * 60));
            const hoursAgo = Math.floor(diffInMs / (1000 * 60 * 60));
            const daysAgo = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

            if (minutesAgo < 1) {
              dateDisplayText = "たった今";
            } else if (minutesAgo < 60) {
              dateDisplayText = `${minutesAgo}分前`;
            } else if (hoursAgo < 24) {
              dateDisplayText = `${hoursAgo}時間前`;
            } else {
              dateDisplayText = `${daysAgo}日前`;
            }
          }
          return (
            <div key={post.id} className="flex px-[16px] py-[12px]">
              <Avatar className="cursor-pointer">
                <AvatarImage src={post.user.icon_url} />
                <AvatarFallback>
                  {post.user.username.slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col w-full ml-[16px]">
                <div className="flex items-center gap-[12px]">
                  <p className="text-[14px] text-[#171412]">
                    {post.user.username}
                  </p>
                  <p className="text-sm text-gray-500">{dateDisplayText}</p>
                </div>
                <p className="text-gray-800">{post.content}</p>
                <div className="flex items-center mt-[8px] text-gray-500 gap-[8px]">
                  <ThumbsUp className="w-[20px] h-[20px] text-[14px] text-[#827066] cursor-pointer" />
                  <p className="text-[14px] text-[#827066]">
                    {post.like_count}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
    </>
  );
}
