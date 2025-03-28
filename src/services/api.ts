import axios from 'axios';
import { 
  FeedResponse, 
  LoginResponse, 
  UserResponse, 
  VideoListResponse, 
  CommentResponse, 
  CommentListResponse,
  FollowListResponse,
  ActionResponse
} from '../types';

const API_BASE_URL = 'http://localhost:8005/douyin';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// 视频流
export const getFeed = async (lastTime: number, token: string): Promise<FeedResponse> => {
  const response = await api.get('/feed', {
    params: { last_time: lastTime, token }
  });
  return response.data;
};

// 用户注册
export const register = async (username: string, password: string): Promise<LoginResponse> => {
  const response = await api.post('/user/register/', null, {
    params: { username, password }
  });
  return response.data;
};

// 用户登录
export const login = async (username: string, password: string): Promise<LoginResponse> => {
  const response = await api.post('/user/login/', null, {
    params: { username, password }
  });
  return response.data;
};

// 获取用户信息
export const getUserInfo = async (userId: string, token: string): Promise<UserResponse> => {
  const response = await api.get('/user/', {
    params: { user_id: userId, token }
  });
  return response.data;
};

// 投稿视频
export const publishVideo = async (data: FormData): Promise<ActionResponse> => {
  const response = await api.post('/publish/action/', data);
  return response.data;
};

// 获取用户发布的视频列表
export const getUserVideos = async (userId: string, token: string): Promise<VideoListResponse> => {
  const response = await api.get('/publish/list/', {
    params: { user_id: userId, token }
  });
  return response.data;
};

// 点赞操作
export const favoriteAction = async (token: string, videoId: string, actionType: string): Promise<ActionResponse> => {
  const response = await api.post('/favorite/action/', null, {
    params: { token, video_id: videoId, action_type: actionType }
  });
  return response.data;
};

// 获取用户点赞的视频列表
export const getFavoriteList = async (userId: string, token: string): Promise<VideoListResponse> => {
  const response = await api.get('/favorite/list/', {
    params: { user_id: userId, token }
  });
  return response.data;
};

// 发布评论
export const commentAction = async (
  token: string, 
  videoId: string, 
  actionType: string, 
  commentText?: string, 
  commentId?: string
): Promise<CommentResponse> => {
  const response = await api.post('/comment/action/', null, {
    params: { 
      token, 
      video_id: videoId, 
      action_type: actionType,
      comment_text: commentText,
      comment_id: commentId
    }
  });
  return response.data;
};

// 获取视频评论列表
export const getCommentList = async (token: string, videoId: string): Promise<CommentListResponse> => {
  const response = await api.get('/comment/list/', {
    params: { token, video_id: videoId }
  });
  return response.data;
};

// 关注操作
export const followAction = async (token: string, toUserId: string, actionType: string): Promise<ActionResponse> => {
  const response = await api.post('/relation/action/', null, {
    params: { token, to_user_id: toUserId, action_type: actionType }
  });
  return response.data;
};

// 获取关注列表
export const getFollowList = async (userId: string, token: string): Promise<FollowListResponse> => {
  const response = await api.get('/relation/follow/list/', {
    params: { user_id: userId, token }
  });
  return response.data;
};

// 获取粉丝列表
export const getFollowerList = async (userId: string, token: string): Promise<FollowListResponse> => {
  const response = await api.get('/relation/follower/list/', {
    params: { user_id: userId, token }
  });
  return response.data;
}; 