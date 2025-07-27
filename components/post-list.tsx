"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ThumbsUp } from "lucide-react";
import { postSchema } from "@/schema/post";

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

export default function PostList() {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ content?: string }>({});

  // 投稿一覧取得
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("/api/posts");
        const data = await res.json();
        setPosts(Array.isArray(data.posts) ? data.posts : data);
      } catch {
        toast.error("投稿の取得に失敗しました。");
      }
    };
    fetchPosts();
  }, []);

  // 投稿送信
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;
    const result = postSchema.safeParse({ content });
    if (!result.success) {
      const contentError = result.error.issues.find(
        (issue) => issue.path[0] === "content"
      );
      if (contentError) setErrors({ content: contentError.message });
      return;
    }
    setErrors({});
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: result.data.content }),
        credentials: "include",
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "投稿に失敗しました。");
      }
      toast.success("投稿が完了しました！");
      setContent("");
      // 投稿後に再取得
      const updated = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/posts`
      );
      const updatedData = await updated.json();
      setPosts(
        Array.isArray(updatedData.posts) ? updatedData.posts : updatedData
      );
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
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
    </div>
  );
}
