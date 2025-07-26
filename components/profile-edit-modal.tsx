"use client";

import React, { useState, useRef, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Camera, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ProfileType } from "@/components/profile-main";
import { profileSchema } from "@/schema/profile"

interface ProfileEditModalProps {
  children: React.ReactNode;
  profile: ProfileType; // 親コンポーネントから現在のプロフィール情報を受け取る
}

/*
// ★ 画像アップロードのダミー関数です。
// 実際にはここでサーバーにファイルをアップロードし、そのURLを返します。
async function uploadImage(file: File): Promise<string> {
  console.log("Uploading file:", file.name);
  // ここに実際のアップロードロジックを実装します (例: S3, Cloudinaryへのアップロード)
  await new Promise((resolve) => setTimeout(resolve, 1000)); // 1秒待機をシミュレート
  const dummyUrl = URL.createObjectURL(file); // デモ用にプレビューURLを返す
  console.log("File uploaded, URL:", dummyUrl);
  return dummyUrl;
}
*/

export default function ProfileEditModal({
  children,
  profile,
}: ProfileEditModalProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // --- State Management ---
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ username?: string; user_id?: string }>({});

  // Form fields
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState<string | undefined>("")

  // Image-related state
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // モーダルが開かれた時に、propsで受け取った現在のプロフィール情報でフォームを初期化
  useEffect(() => {
    if (open && profile) {
      setUsername(profile.username);
      setUserId(profile.user_id);
      // setImagePreview(profile.icon_url);
      setErrors({});
      setSelectedFile(null);
    }
  }, [open, profile]);

  // --- Handlers ---
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting || isPending) return;

    const validationResult = profileSchema.safeParse({ username, user_id: userId });
    if (!validationResult.success) {
      const formattedErrors = validationResult.error.format();
      setErrors({
        username: formattedErrors.username?._errors[0],
      });
      return;
    }
    setErrors({});
    setIsSubmitting(true);

    try {
      //let iconUrlToUpdate = profile.icon_url;

      /*
      // 2. 新しい画像が選択されていればアップロード処理を呼び出す（現在はコメントアウト）
      if (selectedFile) {
        iconUrlToUpdate = await uploadImage(selectedFile);
      }
      */

      // 3. APIへPUTリクエストを送信
      const res = await fetch("/api/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          username: validationResult.data.username,
          user_id: validationResult.data.user_id,
          // icon_url: iconUrlToUpdate, // 画像更新も行う場合はこの行を有効化
        }),
      });

      const resData = await res.json();
      if (!res.ok) {
        throw new Error(resData.error || "プロフィールの更新に失敗しました。");
      }

      toast.success("プロフィールを更新しました！");

      // 4. 画面を更新
      startTransition(() => {
        router.refresh();
      });

      setOpen(false);
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageClick = () => fileInputRef.current?.click();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      if (imagePreview && imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
      setImagePreview(URL.createObjectURL(file));
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>プロフィールを編集</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="mt-4 flex flex-col items-center gap-6">
          <div
            onClick={handleImageClick}
            className="relative w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center cursor-pointer hover:bg-gray-300"
          >
            {imagePreview ? (
              <img src={imagePreview} alt="Profile Preview" className="w-full h-full rounded-full object-cover" />
            ) : (
              <Camera className="w-6 h-6 text-gray-500" />
            )}
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
          </div>

          <div className="w-[80%] flex flex-col gap-4">
            {/* Username Input */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">名前</label>
              <input
                id="username"
                type="text"
                placeholder="名前を入力"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (errors.username) setErrors(prev => ({ ...prev, username: undefined }));
                }}
                className={`border px-2 py-1 rounded w-full ${errors.username ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
            </div>

            {/* User ID Input */}
            <div>
              <label htmlFor="user_id" className="block text-sm font-medium text-gray-700 mb-1">ユーザーID</label>
              <input
                id="user_id"
                type="text"
                placeholder="ユーザーIDを入力"
                value={userId}
                onChange={(e) => {
                  setUserId(e.target.value);
                  if (errors.user_id) setErrors(prev => ({ ...prev, user_id: undefined }));
                }}
                className={`border px-2 py-1 rounded w-full ${errors.user_id ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.user_id && <p className="text-red-500 text-sm mt-1">{errors.user_id}</p>}
            </div>
          </div>

          <div className="flex justify-end w-[80%]">
            <button
              type="submit" // typeをsubmitに変更
              disabled={isSubmitting || isPending}
              className="bg-[#EBC2AD] rounded-lg px-3 py-2 flex items-center justify-center w-20 h-10 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? <Loader2 className="animate-spin" /> : "保存"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}