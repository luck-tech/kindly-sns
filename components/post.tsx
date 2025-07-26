import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ThumbsUp } from "lucide-react";


export type PostType = {
  id: number;
  content: string;
  // 変更: date -> created_at
  created_at: string;
  // 変更: author -> user
  user: {
    // 変更: name -> username
    username: string;
    user_id: string;
    // 変更: avatarUrl -> icon_url
    icon_url: string;
  };
  // 変更: likes -> like_count
  like_count: number;
};

//表示モード
export type ViewMode = "self" | "like" | "latest";



export const PostList = ({
  mode,
  allPosts = [],
}: {
  mode: ViewMode;
  allPosts?: PostType[];
}) => {


  // モードに応じて表示する投稿を決定
  let posts: PostType[];
  if (mode === "self") {
    posts = allPosts;
  } else if (mode === "like") {
    posts = allPosts;
  } else {
    // "latest": 全投稿をまとめる
    posts = allPosts;
  }


  return (
    <div>
      {posts.map((post) => {
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
            <Avatar className="cursor-pointer">
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
