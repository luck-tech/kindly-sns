"use client";

import React, { useState, useRef, useEffect, useTransition } from "react";
import { Camera, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useUserStore } from "@/stores/user-stores";
import Image from "next/image";

interface ProfileEditModalProps {
  children: React.ReactNode;
}

export default function ProfileEditModal({ children }: ProfileEditModalProps) {
  const [name, setName] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [open, setOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false); // api/uploadの処理中を管理
  const [isPending, startTransition] = useTransition(); // router.refresh()のためにuseTransitionを使用
  const { user, fetchUser } = useUserStore();

  useEffect(() => {
    if (open) {
      // ストアにユーザー情報があれば、それを初期値としてセット
      if (user) {
        setName(user.username);
        setImagePreview(user.icon_url || null);
      }
      // モーダルを開くたびに、選択されたファイルはリセットする
      setSelectedFile(null);
    }
  }, [open, user]);

  // 登録ボタンの処理
  const handleRegister = async () => {
    setIsSubmitting(true);
    let iconUrl: string | undefined = undefined;

    try {
      // 新しい画像が選択されていれば、アップロードしてURLを取得
      if (selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        if (!uploadRes.ok) throw new Error("画像のアップロードに失敗しました");
        const uploadData = await uploadRes.json();
        iconUrl = uploadData.url;
      }

      // プロフィール情報を更新
      const profileRes = await fetch("/api/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: name,
          icon_url: iconUrl, // 新しいURLがあればそれを使う
        }),
      });

      if (!profileRes.ok) {
        const errorData = await profileRes.json();
        throw new Error(errorData.error || "プロフィールの更新に失敗しました");
      }

      startTransition(() => {
        router.refresh();
        fetchUser();
        setOpen(false);
        setIsSubmitting(false);
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("不明なエラーが発生しました");
      }
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // 古いプレビュー用のURLを解放
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
      console.log(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const renderProfileImage = () => {
    if (imagePreview) {
      return (
        <Image
          src={imagePreview}
          alt="Profile Preview"
          className="w-full h-full rounded-full object-cover"
          width={96}
          height={96}
        />
      );
    }
    return <Camera className="w-6 h-6 text-gray-500" />;
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => (isOpen ? setOpen(true) : setOpen(false))}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        onEscapeKeyDown={() => setOpen(false)}
        onPointerDownOutside={() => setOpen(false)}
      >
        <DialogHeader>
          <DialogTitle>プロフィールを編集</DialogTitle>
        </DialogHeader>
        <div className="mt-4 flex flex-col items-center gap-5">
          <div className="flex flex-col items-center gap-5 w-full">
            <div
              onClick={handleImageClick}
              className="relative w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center cursor-pointer hover:bg-gray-300"
            >
              {renderProfileImage()}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
              />
            </div>
            <input
              type="text"
              placeholder="名前を入力"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border px-2 py-1 rounded w-[80%]"
            />
          </div>
          <div className="flex justify-end w-[80%]">
            <button
              type="button"
              onClick={handleRegister}
              disabled={isSubmitting || isPending}
              className="bg-[#EBC2AD] rounded-lg px-3 py-2 flex items-center justify-center w-20 h-10 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting || isPending ? (
                <Loader2 className="animate-spin" />
              ) : (
                "登録"
              )}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
