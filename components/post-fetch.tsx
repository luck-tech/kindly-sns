import { PostList, PostType,ViewMode } from "@/components/post";

async function PostFetch(): Promise<PostType[]> {
  try {

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/posts`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      console.error("投稿の取得に失敗しました。");
      return [];
    }

    const data = await res.json();
    if (data && Array.isArray(data.posts)) {
      return data.posts;
    }


    if(Array.isArray(data)) {
        return data;
    }

    console.error("API did not return an array:", data);
    return [];


  } catch (err) {
    console.error("通信エラーが発生しました。", err);
    return [];
  }
}


export default async function AllPosts({ mode }: { mode: ViewMode }) {

  const posts = await PostFetch();
  const sortedPosts = [...posts].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
  return (
    <div className = "p-0 m-0">
      <PostList allPosts={sortedPosts} mode={mode}/>
    </div>
  );
}