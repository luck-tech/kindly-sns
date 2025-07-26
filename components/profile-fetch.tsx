import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PostList } from "@/components/post";
import ProfileEditModal from "@/components/profile-edit-modal";
import { ProfileMain, ProfileType } from "@/components/profile-main";
import { cookies } from "next/headers";

async function fetchMyProfile(): Promise<ProfileType | null> {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
      },
    });


  if (!res.ok) {
    console.error("プロフィールの取得に失敗しました。Status:", res.status);
    return null;
  }

  const data: ProfileType = await res.json();
  return data;

 } catch (err) {
  console.error("通信エラーが発生しました。", err);
  return null;
 }
}


export default async function ProfileGeneral() {
  const myProfile = await fetchMyProfile();
  // const othersProfile = await fetchOthersProfile(id):
  return (
    <div className="p-0 m-0">
      <ProfileMain profile={myProfile} mode="self" />
      {myProfile && (
        <div className="flex justify-center mt-4">
            <ProfileEditModal profile={myProfile}l>
              <button
                type="button"
                className="w-[240px] h-[40px] bg-[#f5f2f2] font-normal text-[14px] leading-[21px] tracking-normal text-center rounded-[20px] hover:bg-gray-200 cursor-pointer"
              >
                プロフィールを編集
              </button>
            </ProfileEditModal>
        </div>
      )}

      <Tabs defaultValue="self" className="w-[960px] mx-auto mt-[16px]">
        <TabsList>
          <TabsTrigger value="self">投稿</TabsTrigger>
          <TabsTrigger value="like">いいね</TabsTrigger>
        </TabsList>
        <TabsContent value="self">
          <PostList mode="self" />
        </TabsContent>
        <TabsContent value="like">
          <PostList mode="like" />
        </TabsContent>
      </Tabs>
    </div>
  );
}