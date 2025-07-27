import ProfileOthersGeneral from "@/components/profile-fetch-others";


export default async function Profile(props: { params: Promise<{ id: string }> }
) {
  const { id } = await props.params;
  const numericId = Number(id);

  return (
    <div className="flex flex-col items-center mt-[36px]">
      <ProfileOthersGeneral id={numericId} />
    </div>
  );
}