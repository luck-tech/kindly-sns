"use client";

import React, { useState, useRef, useEffect } from "react";
import { Camera, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ProfileEditModalProps {
  children: React.ReactNode;
}

export default function ProfileEditModal({ children }: ProfileEditModalProps) {
  const [name, setName] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [open, setOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleRegister = async () => {
    setIsSaving(true);
    console.log(selectedFile);
    /** TODO: ここでAPIリクエストの実装 */
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const renderProfileImage = () => {
    if (imagePreview) {
      return (
        <img
          src={imagePreview}
          alt="Profile Preview"
          className="w-full h-full rounded-full object-cover"
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
              disabled={isSaving}
              className="bg-[#EBC2AD] rounded-lg px-3 py-2 flex items-center justify-center w-20 h-10 cursor-pointer disabled:opacity-50"
            >
              {isSaving ? <Loader2 className="animate-spin" /> : "登録"}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
