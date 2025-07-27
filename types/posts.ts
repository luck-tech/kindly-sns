export interface Post {
  id: number;
  content: string;
  created_at: string;
  user: {
    username: string;
    user_id: string;
    icon_url?: string;
  };
  like_count: number;
  liked: boolean;
}

export interface PostsResponse {
  posts: Post[];
  count: number;
}

export interface ApiError {
  error: string;
  details?: string;
}
