"use client";
import React, { useState,useTransition } from "react";
import { useRouter } from 'next/navigation';
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { postSchema } from "@/schema/post"

export const PostSubmit = () => {
  const [isPending, startTransition] = useTransition();
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ content?: string }>({});
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting || isPending) return;

    const result = postSchema.safeParse({ content });

    if (!result.success) {
      const contentError = result.error.issues.find(
        (issue) => issue.path[0] === "content"
      );
      if (contentError) {
        setErrors({ content: contentError.message });
      }
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
        if (res.status === 401) {
          throw new Error("投稿するにはログインが必要です。");
        }
        const errData = await res.json();
        throw new Error(errData.error || "投稿に失敗しました。");
      }

      toast.success("投稿が完了しました！");
      startTransition(() => {
        router.refresh();
      });
      setContent("");
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };


  const charCount = content.length;
  const isOverLimit = charCount > 140;
  const isInvalid = isSubmitting || content.trim() === "" || isOverLimit || isPending;

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="px-[20px] py-[10px] flex flex-col border-[1px] rounded-[20px]"
    >
      <div className="flex w-full">
        <textarea
          name="new_post"
          id="new_post"
          placeholder="いまどうしてる"
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
            if (errors.content) setErrors({});
          }}
          className={`h-[127px] w-full resize-none focus:outline-none ${
            errors.content || isOverLimit ? "ring-2 ring-red-500 rounded-[8px]" : ""
          }`}
          aria-invalid={!!errors.content || isOverLimit}
          aria-describedby="content-error"
        />
        <div className="flex flex-col justify-end ml-4">
          <Button
            type="submit"
            disabled={isInvalid}
            className={`homePost px-4 py-1 rounded text-white whitespace-nowrap transition-colors ${
              isInvalid
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {isSubmitting ? "投稿中..." : "投稿"}
          </Button>
        </div>
      </div>

      <div className="flex justify-end items-center mt-2 w-full space-x-4">
        {errors.content && (
          <p id="content-error" className="text-red-500 text-sm mr-auto">
            {errors.content}
          </p>
        )}
        <p className={`text-sm font-medium ${isOverLimit ? 'text-red-500' : 'text-gray-500'}`}>
          {charCount} / 140
        </p>
      </div>
    </form>
  );
};
