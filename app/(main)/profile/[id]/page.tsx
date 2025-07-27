import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ProfileEditModal from "@/components/profile-edit-modal";
import PostList from "@/components/post-list";

export default async function Profile(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/api/users/${id}`,
  );
  const data = await res.json();

  return (
    <div className="flex flex-col items-center mt-[36px]">
      <Avatar className="flex justify-center w-[128px] h-[128px]">
        <AvatarImage
          src={data.icon_url || ""}
          alt="プロフィール画像"
          className="h-full w-auto aspect-square cursor-pointer"
        />
        <AvatarFallback>
          {data.username ? data.username.charAt(0) : "?"}
        </AvatarFallback>
      </Avatar>
      <div className="mt-[16px] flex flex-col items-center">
        <p className="text-[22px] text-[#171412]">{data.username}</p>
        <p className="text-[16px] text-[#827066]">@{data.user_id}</p>
      </div>
      <ProfileEditModal>
        <button
          type="button"
          className="mt-[16px] w-[240px] h-[40px] bg-[#f5f2f2] font-normal text-[14px] leading-[21px] tracking-normal text-center rounded-[20px] hover:bg-gray-200 cursor-pointer"
        >
          プロフィールを編集
        </button>
      </ProfileEditModal>
      <Tabs defaultValue="self" className="w-[960px] mt-[16px]">
        <TabsList>
          <TabsTrigger value="self">投稿</TabsTrigger>
          <TabsTrigger value="like">いいね</TabsTrigger>
        </TabsList>
        <TabsContent value="self">
          <PostList endpoint={`/api/users/${id}/posts`} />
        </TabsContent>
        <TabsContent value="like">
          <PostList endpoint={`/api/users/${id}/likes`} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
