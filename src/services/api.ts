import axios from './axios';
import { config } from '../config';
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

// 视频流
export const getFeed = async (latest_time: number, token?: string): Promise<FeedResponse> => {
  const response = await axios.get(`${config.api.feed}?latest_time=${latest_time}${token ? `&token=${token}` : ''}`);
  return response.data;
};

// 用户注册
export const register = async (username: string, password: string): Promise<LoginResponse> => {
  const response = await axios.post(config.api.register, { username, password });
  return response.data;
};

// 用户登录
export const login = async (username: string, password: string): Promise<LoginResponse> => {
  const response = await axios.post(config.api.login, { username, password });
  return response.data;
};

// 获取用户信息
export const getUserInfo = async (userId: string, token: string): Promise<UserResponse> => {
  const response = await axios.get(`${config.api.userInfo}?user_id=${userId}&token=${token}`);
  return response.data;
};

// 投稿视频
export const publishVideo = async (data: FormData): Promise<ActionResponse> => {
  const response = await axios.post(config.api.publish, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// 获取用户发布的视频列表
export const getPublishList = async (userId: string, token: string): Promise<VideoListResponse> => {
  const response = await axios.get(`${config.api.publishList}?user_id=${userId}&token=${token}`);
  return response.data;
};

// 点赞操作
export const favoriteAction = async (token: string, video_id: string, action_type: string): Promise<ActionResponse> => {
  const response = await axios.post(config.api.favorite, {
    token,
    video_id,
    action_type,
  });
  return response.data;
};

// 获取用户点赞的视频列表
export const getFavoriteList = async (userId: string, token: string): Promise<VideoListResponse> => {
  const response = await axios.get(`${config.api.favoriteList}?user_id=${userId}&token=${token}`);
  return response.data;
};

// 发布评论
export const commentAction = async (
  token: string, 
  video_id: string, 
  action_type: string, 
  comment_text?: string, 
  comment_id?: string
): Promise<CommentResponse> => {
  const response = await axios.post(config.api.comment, {
    token,
    video_id,
    action_type,
    comment_text,
    comment_id,
  });
  return response.data;
};

// 获取视频评论列表
export const getCommentList = async (token: string, video_id: string): Promise<CommentListResponse> => {
  const response = await axios.get(`${config.api.commentList}?token=${token}&video_id=${video_id}`);
  return response.data;
};

// 关注操作
export const followAction = async (token: string, toUserId: string, actionType: string): Promise<ActionResponse> => {
  const response = await axios.post('/relation/action/', {
    token,
    to_user_id: toUserId,
    action_type: actionType
  });
  return response.data;
};

// 获取关注列表
export const getFollowList = async (userId: string, token: string): Promise<FollowListResponse> => {
  const response = await axios.get('/relation/follow/list/', {
    params: { user_id: userId, token }
  });
  return response.data;
};

// 获取粉丝列表
export const getFollowerList = async (userId: string, token: string): Promise<FollowListResponse> => {
  const response = await axios.get('/relation/follower/list/', {
    params: { user_id: userId, token }
  });
  return response.data;
}; 