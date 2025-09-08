import AuthForm from "@/components/auth-form";

export default function SignupPage() {
  return (
    <div className="w-full flex px-[160px] ">
      <div className="w-full flex flex-col h-[695px] justify-center items-center">
        <p className="text-[28px] mb-6 text-center">おかえりなさい</p>
        <AuthForm type="signup" />
        <a href="/login" className="text-[#827066] mt-4">
          既にアカウントをお持ちですか？ ログイン
        </a>
      </div>
    </div>
  );
}
