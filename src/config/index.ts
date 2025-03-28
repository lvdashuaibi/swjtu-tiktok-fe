// API配置
const API_CONFIG = {
  // 开发环境API地址
  development: {
    baseURL: 'http://localhost:8005',  // 本地开发环境
  },
  // 测试环境API地址
  test: {
    baseURL: 'http://120.55.1.43:8005',  // 测试环境
  },
  // 生产环境API地址
  production: {
    baseURL: 'https://api.example.com',  // 生产环境
  }
};

// 获取当前环境
const ENV = process.env.REACT_APP_ENV || 'development';

// 导出配置
export const config = {
  // API基础URL
  baseURL: API_CONFIG[ENV as keyof typeof API_CONFIG].baseURL,
  
  // API接口路径
  api: {
    // 用户相关
    login: '/douyin/user/login/',
    register: '/douyin/user/register/',
    userInfo: '/douyin/user/',
    
    // 视频相关
    feed: '/douyin/feed/',
    publish: '/douyin/publish/action/',
    publishList: '/douyin/publish/list/',
    
    // 互动相关
    favorite: '/douyin/favorite/action/',
    favoriteList: '/douyin/favorite/list/',
    comment: '/douyin/comment/action/',
    commentList: '/douyin/comment/list/',
  },
  
  // 上传配置
  upload: {
    maxSize: 100 * 1024 * 1024, // 最大文件大小（100MB）
    acceptedFormats: ['video/mp4', 'video/quicktime'],
  },
  
  // 其他全局配置
  defaultPageSize: 10,
  maxCommentLength: 150,
};

// 导出类型
export type Config = typeof config; 