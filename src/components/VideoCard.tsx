import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { HeartOutlined, HeartFilled, MessageOutlined, ShareAltOutlined, UserOutlined } from '@ant-design/icons';
import { Video } from '../types';
import { useAuth } from '../utils/AuthContext';
import { favoriteAction } from '../services/api';
import { Link } from 'react-router-dom';

interface VideoCardProps {
  video: Video;
  onLike: () => void;
  onCommentClick: () => void;
}

const VideoContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;
  background-color: #000;
  overflow: hidden;
  scroll-snap-align: start;
`;

const VideoPlayer = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const VideoOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20px;
  display: flex;
  flex-direction: column;
  color: white;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
`;

const VideoInfo = styled.div`
  margin-bottom: 60px;
`;

const VideoTitle = styled.h3`
  margin: 0;
  font-size: 16px;
  margin-bottom: 8px;
`;

const VideoAuthor = styled(Link)`
  display: flex;
  align-items: center;
  color: white;
  text-decoration: none;
  margin-bottom: 10px;

  &:hover {
    color: #fe2c55;
  }
`;

const Avatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
  object-fit: cover;
`;

const DefaultAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #333;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 10px;
`;

const ActionsContainer = styled.div`
  position: absolute;
  right: 10px;
  bottom: 90px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ActionButton = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 15px;
  cursor: pointer;
`;

const ActionIcon = styled.div`
  font-size: 28px;
  margin-bottom: 5px;
`;

const ActionCount = styled.span`
  font-size: 12px;
  color: white;
`;

const VideoCard: React.FC<VideoCardProps> = ({ video, onLike, onCommentClick }) => {
  const { isAuthenticated, token } = useAuth();
  const [isLiked, setIsLiked] = useState(video.is_favorite);
  const [likeCount, setLikeCount] = useState(video.favorite_count);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleVideoClick = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleLike = async () => {
    if (!isAuthenticated) {
      // 提示用户登录
      alert('请先登录');
      return;
    }

    try {
      // 调用点赞/取消点赞API
      const actionType = isLiked ? '2' : '1';
      await favoriteAction(token!, video.id.toString(), actionType);
      
      // 更新状态
      setIsLiked(!isLiked);
      setLikeCount(prevCount => isLiked ? prevCount - 1 : prevCount + 1);
      
      // 通知父组件
      onLike();
    } catch (error) {
      console.error('点赞操作失败:', error);
    }
  };

  return (
    <VideoContainer>
      <VideoPlayer
        ref={videoRef}
        src={video.play_url}
        poster={video.cover_url}
        loop
        playsInline
        onClick={handleVideoClick}
      />
      
      <VideoOverlay>
        <VideoInfo>
          <VideoAuthor to={`/user/${video.author.id}`}>
            {video.author.avatar ? (
              <Avatar src={video.author.avatar} alt={video.author.name} />
            ) : (
              <DefaultAvatar>
                <UserOutlined style={{ color: 'white', fontSize: '20px' }} />
              </DefaultAvatar>
            )}
            <span>@{video.author.name}</span>
          </VideoAuthor>
          <VideoTitle>{video.title}</VideoTitle>
        </VideoInfo>
      </VideoOverlay>
      
      <ActionsContainer>
        <ActionButton onClick={handleLike}>
          <ActionIcon>
            {isLiked ? (
              <HeartFilled style={{ color: '#fe2c55' }} />
            ) : (
              <HeartOutlined style={{ color: 'white' }} />
            )}
          </ActionIcon>
          <ActionCount>{likeCount}</ActionCount>
        </ActionButton>
        
        <ActionButton onClick={onCommentClick}>
          <ActionIcon>
            <MessageOutlined style={{ color: 'white' }} />
          </ActionIcon>
          <ActionCount>{video.comment_count}</ActionCount>
        </ActionButton>
        
        <ActionButton>
          <ActionIcon>
            <ShareAltOutlined style={{ color: 'white' }} />
          </ActionIcon>
          <ActionCount>分享</ActionCount>
        </ActionButton>
      </ActionsContainer>
    </VideoContainer>
  );
};

export default VideoCard; 