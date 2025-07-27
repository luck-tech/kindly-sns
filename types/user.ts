type UserProfile = {
  user_id: string;
  icon_url: string;
  username: string;
};

export type UserState = {
  user: UserProfile | null;
  isLoading: boolean;
  fetchUser: () => Promise<void>;
};
