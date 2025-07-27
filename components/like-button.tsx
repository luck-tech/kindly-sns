"use client";

import { useState } from "react";
import { ThumbsUp } from "lucide-react";

type LikeButtonProps = {
  postId: number;
  liked: boolean;
  likeCount: number;
};

export default function LikeButton({ postId, liked, likeCount }: LikeButtonProps) {
  const [isLiked, setIsLiked] = useState(liked);
  const [count, setCount] = useState(likeCount);
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (loading) return;
    setLoading(true);
    const method = isLiked ? "DELETE" : "POST";
    const res = await fetch(`/api/posts/${postId}/likes`, { method });
    if (res.ok) {
      setIsLiked(!isLiked);
      setCount((prev) => prev + (isLiked ? -1 : 1));
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center gap-[8px]">
      <button type="button" aria-label="いいね" onClick={handleClick} disabled={loading}>
        <ThumbsUp
          className="w-[20px] h-[20px] cursor-pointer"
          color={isLiked ? "#f87171" : "#827066"}
          fill={isLiked ? "#f87171" : "none"}
        />
      </button>
      <p className="text-[14px] text-[#827066]">{count}</p>
    </div>
  );
}