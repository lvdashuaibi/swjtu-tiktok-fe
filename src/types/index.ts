export interface User {
  id: number;
  name: string;
  avatar: string;
  background_image: string;
  signature: string;
  follow_count?: number;
  follower_count?: number;
  favorite_count?: number;
  total_favorited?: number;
  is_follow?: boolean;
}

export interface Video {
  id: number;
  author: User;
  play_url: string;
  cover_url: string;
  favorite_count: number;
  comment_count: number;
  is_favorite: boolean;
  title: string;
}

export interface Comment {
  id: number;
  user: User;
  content: string;
  create_date: string;
}

export interface FeedResponse {
  status_code: number;
  status_msg: string;
  video_list: Video[];
  next_time: number;
}

export interface UserResponse {
  status_code: number;
  status_msg: string;
  user: User;
}

export interface LoginResponse {
  user_id: number;
  token: string;
}

export interface VideoListResponse {
  status_code: number;
  status_msg: string;
  video_list: Video[];
}

export interface CommentResponse {
  status_code: number;
  status_msg: string;
  comment: Comment;
}

export interface CommentListResponse {
  status_code: number;
  status_msg: string;
  comment_list: Comment[];
}

export interface FollowListResponse {
  status_code: number;
  status_msg: string;
  user_list: User[];
}

export interface ActionResponse {
  status_code: number;
  status_msg: string;
} 