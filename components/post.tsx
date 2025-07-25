import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ThumbsUp } from "lucide-react";

type PostType = {
  id: number;
  author: {
    name: string;
    username: string;
    avatarUrl: string;
  };
  content: string;
  likes: number;
  date: Date;
};
//表示モード
export type ViewMode = "self" | "like" | "latest";

const initialDate: Date = new Date("2025-07-20");
const secondDate: Date = new Date("2025-07-22");
// 自分の投稿のモックデータ
const mockSelfPosts: PostType[] = [
  {
    id: 1,
    author: {
      name: "田中 太郎",
      username: "tanaka_taro",
      avatarUrl: "https://github.com/shadcn.png",
    },
    content: "今日のランチはラーメンでした！とても美味しかったです。 #ラーメン",
    likes: 15,
    date: initialDate,
  },
  {
    id: 2,
    author: {
      name: "田中 太郎",
      username: "tanaka_taro",
      avatarUrl: "https://github.com/shadcn.png",
    },
    content:
      "今日いただいたわりに心から感謝しています。これは、たとえ小さな情のある行為でも大きな違いを生むことができることを思い出させます。もっと優しさを広げましょう！",
    likes: 32,
    date: secondDate,
  },
];

// いいねした投稿のモックデータ
const mockLikedPosts: PostType[] = [
  {
    id: 3,
    author: {
      name: "鈴木 一郎",
      username: "suzuki_ichiro",
      avatarUrl: "https://github.com/vercel.png",
    },
    content:
      "今日いただいたわりに心から感謝しています。これは、たとえ小さな情のある行為でも大きな違いを生むことができることを思い出させます。もっと優しさを広げましょう！",
    likes: 128,
    date: initialDate,
  },
];

export const PostList = ({ mode }: { mode: ViewMode }) => {
  // モードに応じて表示する投稿を決定
  let posts: PostType[];
  if (mode === "self") {
    posts = mockSelfPosts;
  } else if (mode === "like") {
    posts = mockLikedPosts;
  } else {
    // "latest": 全投稿をまとめる
    posts = [...mockSelfPosts, ...mockLikedPosts];
  }

  // 日付の降順（最新から）にソート
  const sortedPosts = [...posts].sort(
    (a, b) => b.date.getTime() - a.date.getTime()
  );

  // 今日の00:00を基準に「何日前」を計算
  const today = new Date();
  const startOfToday = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  return (
    <div>
      {sortedPosts.map((post) => {
        const startOfTarget = new Date(
          post.date.getFullYear(),
          post.date.getMonth(),
          post.date.getDate()
        );
        const diffInMs = startOfToday.getTime() - startOfTarget.getTime();
        const daysAgo = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

        return (
          <div key={post.id} className="flex px-[16px] py-[12px]">
            <Avatar className="cursor-pointer">
              <AvatarImage src={post.author.avatarUrl} />
              <AvatarFallback>{post.author.name.slice(0, 2)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col w-full ml-[16px]">
              <div className="flex items-center gap-[12px]">
                <p className="text-[14px] text-[#171412]">{post.author.name}</p>
                <p className="text-sm text-gray-500">{daysAgo}日前</p>
              </div>
              <p className="text-gray-800">{post.content}</p>
              <div className="flex items-center mt-[8px] text-gray-500 gap-[8px]">
                <ThumbsUp className="w-[20px] h-[20px] text-[14px] text-[#827066] cursor-pointer" />
                <p className="text-[14px] text-[#827066]">{post.likes}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
