import ProfileEditModal from "@/components/profile-edit-modal";

export default function Profile() {
  return (
    <div>
      <ProfileEditModal>
        <button
          type="button"
          className="text-lg px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          プロフィールを編集
        </button>
      </ProfileEditModal>
    </div>
  );
}
