import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import LikeButton from "@/components/like-button";
import { headers } from "next/headers";
import { Post } from "@/types/posts";
import { PostListProps } from "@/types/post-list";

export default async function PostList({
  endpoint = "/api/posts",
}: PostListProps) {
  const requestHeaders = new Headers(await headers());
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL ?? ""}${endpoint}`,
    {
      cache: "no-store", // SSRで毎回最新を取得
      headers: requestHeaders, // クッキーを含めるためにヘッダーを渡す
    },
  );
  const data = await res.json();
  const posts: Post[] = Array.isArray(data.posts) ? data.posts : data;

  return (
    <>
      {[...posts]
        .sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
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
                <AvatarFallback>{post.user.username.charAt(0)}</AvatarFallback>
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
                  <LikeButton
                    postId={post.id}
                    liked={post.liked}
                    likeCount={post.like_count}
                  />
                </div>
              </div>
            </div>
          );
        })}
    </>
  );
}
