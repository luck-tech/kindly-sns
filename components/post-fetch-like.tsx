import { PostList, PostType,ViewMode } from "@/components/post";

async function LikedPostFetch(id?: number): Promise<PostType[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/${id}/likes`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      console.error("投稿の取得に失敗しました。ステータス:", res.status);
      return [];
    }

    const contentType = res.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      console.warn("APIのレスポンスがJSON形式ではありませんでした。");
      return [];
    }

    const data = await res.json();
    if (data && Array.isArray(data.posts)) {
      return data.posts;
    }

    if(Array.isArray(data)) {
      return data;
    }

    console.error("APIのレスポンス形式が予期したものではありません:", data);
    return [];

  } catch (err) {
    console.error("通信エラーが発生しました。", err);
    return [];
  }
}

export default async function LikedPosts({
  mode,
  id,
}: {
  mode: ViewMode;
  id?: number;
}) {
  const posts = await LikedPostFetch(id);
  const sortedPosts = [...posts].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
  return (
    <div className = "p-0 m-0">
      <PostList allPosts={sortedPosts} mode={mode}></PostList>
    </div>
  );
}