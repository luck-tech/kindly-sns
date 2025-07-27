import { PostList, PostType,ViewMode } from "@/components/post";

async function OthersPostFetch(id?: number): Promise<PostType[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/${id}/posts`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    // 1. HTTPステータスが200番台でない場合（404等）はここで処理を終える
    if (!res.ok) {
      console.error("投稿の取得に失敗しました。ステータス:", res.status);
      return [];
    }

    // 2. Content-Typeヘッダーをチェックし、JSONでなければ処理を終える
    const contentType = res.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      console.warn("APIのレスポンスがJSON形式ではありませんでした。");
      return [];
    }

    // 3. 安全にJSONとして解析する
    const data = await res.json();
    if (data && Array.isArray(data.posts)) {
      return data.posts;
    }

    if (Array.isArray(data)) {
      return data;
    }

    console.error("APIのレスポンス形式が予期したものではありません:", data);
    return [];

  } catch (err) {
    // ネットワークエラーなどをここで捕捉
    console.error("通信エラーが発生しました。", err);
    return [];
  }
}

export default async function OthersPosts({
  mode,
  id,
}: {
  mode: ViewMode;
  id?: number;
}) {
  const posts = await OthersPostFetch(id);
  const sortedPosts = [...posts].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
  return (
    <div className = "p-0 m-0">
      <PostList allPosts={sortedPosts} mode={mode}></PostList>
    </div>
  );
}
