import AuthForm from "@/components/authForm";

export default function LoginPage() {
  return (
    <div className="w-full flex px-[160px] py-20">
      <div className="w-full flex flex-col h-[695px] justify-center items-center">
        <p className="text-[28px] mb-6 text-center">おかえりなさい</p>
        <AuthForm type="login" />
        <a href="/signup" className="text-[#827066] mt-4">
          アカウントをお持ちでないですか？ 登録
        </a>
      </div>
    </div>
  );
}
