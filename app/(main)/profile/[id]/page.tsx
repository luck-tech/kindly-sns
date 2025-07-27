import ProfileOthersGeneral from "@/components/profile-fetch-others";


export default async function Profile({ params }: { params: { id: string } }) {
  const id = params.id;

  const numericId = Number(id);

  return (
    <div className="flex flex-col items-center mt-[36px]">
      <ProfileOthersGeneral id={numericId} />
    </div>
  );
}