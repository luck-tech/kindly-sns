import AuthForm from "@/components/authForm";

export default function SignupPage() {
  return (
    <div className="w-full flex px-[160px] py-20">
      <div className="w-full flex flex-col h-[695px] justify-center items-center">
        <p className="text-[28px] mb-6 text-center">アカウントを作成</p>
        <AuthForm type="signup" />
        <a href="/login" className="text-[#827066] mt-4">
          既にアカウントをお持ちですか？ ログイン
        </a>
      </div>
    </div>
  );
}
