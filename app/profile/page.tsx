'use client';

import React, { useState, useRef } from 'react';
import { Camera, Loader2, CheckCircle2 } from 'lucide-react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { hachiMaruPop } from '@/app/fonts';

const SUBMIT_DELAY_MS = 2000;
const RESET_DELAY_MS = 300;

export default function Profile() {
  const [name, setName] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleRegister = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, SUBMIT_DELAY_MS));
    setIsSaving(false);
    setShowSuccess(true);
    console.log('登録する名前:', name);
  };

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => {
      setName('');
      setImagePreview(null);
      setShowSuccess(false);
    }, RESET_DELAY_MS);
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const renderForm = () => (
    <>
      <DialogHeader>
        <DialogTitle className={hachiMaruPop.className}>プロフィールを編集</DialogTitle>
      </DialogHeader>
      <div className="mt-4 flex flex-col items-center gap-5">
        <div className="flex flex-col items-center gap-5 w-full">
          <div onClick={handleImageClick} className="relative w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center cursor-pointer hover:bg-gray-300">
            {imagePreview ? (<img src={imagePreview} alt="Profile Preview" className="w-full h-full rounded-full object-cover" />) : (<Camera className="w-6 h-6 text-gray-500" />)}
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
          </div>
          <input type="text" placeholder="名前を入力" value={name} onChange={(e) => setName(e.target.value)} className={`border px-2 py-1 rounded w-[80%] ${hachiMaruPop.className}`} />
        </div>
        <div className="flex justify-end w-[80%]">
          <button type="button" onClick={handleRegister} disabled={isSaving} className={`bg-[#EBC2AD] rounded-lg px-3 py-2 flex items-center justify-center w-20 h-10 ${hachiMaruPop.className} disabled:opacity-50`}>
            {isSaving ? (<Loader2 className="animate-spin" />) : ('登録')}
          </button>
        </div>
      </div>
    </>
  );

  const renderSuccess = () => (
    <div className="flex flex-col items-center justify-center gap-4 py-10">
      <CheckCircle2 className="w-16 h-16 text-[#EBC2AD]" />
      <p className={`text-xl font-bold ${hachiMaruPop.className}`}>登録完了</p>
      <button type="button" onClick={handleClose} className="mt-4 bg-gray-200 rounded-lg px-4 py-2">
        閉じる
      </button>
    </div>
  );

  return (
    <div className="flex justify-center mt-10">
      <Dialog open={open} onOpenChange={isOpen => isOpen ? setOpen(true) : handleClose()}>
        <DialogTrigger asChild>
          <button type="button" className="text-lg px-4 py-2 bg-blue-600 text-white rounded">
            プロフィールを編集
          </button>
        </DialogTrigger>
        <DialogContent onEscapeKeyDown={handleClose} onPointerDownOutside={handleClose}>
          {showSuccess ? renderSuccess() : renderForm()}
        </DialogContent>
      </Dialog>
    </div>
  );
}