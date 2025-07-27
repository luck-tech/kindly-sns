import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import OthersPosts from "@/components/post-fetch-others";
import LikedPosts from "@/components/post-fetch-like";
import ProfileEditModal from "@/components/profile-edit-modal";
import { ProfileMain, ProfileType } from "@/components/profile-main";
import { cookies } from "next/headers";

async function fetchOthersProfile(id:number): Promise<ProfileType | null> {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/${id}`, {
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


export default async function ProfileOthersGeneral({ id }: { id: number }) {
  const othersProfile = await fetchOthersProfile(id)
  return (
    <div className="p-0 m-0">
      <ProfileMain profile={othersProfile} mode="self" />
      <Tabs defaultValue="self" className="w-[960px] mx-auto mt-[16px]">
        <TabsList>
          <TabsTrigger value="self">投稿</TabsTrigger>
          <TabsTrigger value="like">いいね</TabsTrigger>
        </TabsList>
        <TabsContent value="self">
          <OthersPosts mode="self" id={id}/>
        </TabsContent>
        <TabsContent value="like">
          <LikedPosts mode="like" id={id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}