import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { ArrowLeftOutlined, HeartOutlined, LoadingOutlined } from '@ant-design/icons';
import { useAuth } from '../utils/AuthContext';
import { getFavoriteList } from '../services/api';
import { Video } from '../types';

const Container = styled.div`
  min-height: 100vh;
  background-color: #fff;
  padding-bottom: 60px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #f1f1f1;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Title = styled.h1`
  flex: 1;
  text-align: center;
  font-size: 18px;
  font-weight: 600;
  margin: 0;
`;

const VideoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 8px;
  padding: 8px;
`;

const VideoItem = styled.div`
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const VideoThumbnail = styled.img`
  width: 100%;
  aspect-ratio: 9/16;
  object-fit: cover;
`;

const VideoInfo = styled.div`
  padding: 8px;
`;

const VideoTitle = styled.h3`
  margin: 0;
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const VideoAuthor = styled.p`
  margin: 4px 0 0;
  font-size: 12px;
  color: #666;
`;

const VideoStats = styled.div`
  display: flex;
  align-items: center;
  margin-top: 4px;
  font-size: 12px;
  color: #666;
`;

const LikeCount = styled.span`
  margin-left: 4px;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  font-size: 24px;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
  color: #999;
`;

const EmptyIcon = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
`;

const FavoritePage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, userId, token } = useAuth();
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    fetchFavoriteVideos();
  }, [isAuthenticated, userId, token]);

  const fetchFavoriteVideos = async () => {
    if (!userId || !token) return;

    try {
      setLoading(true);
      const response = await getFavoriteList(userId, token);
      
      if (response.status_code === 0) {
        setVideos(response.video_list || []);
      }
    } catch (error) {
      console.error('获取喜欢视频列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleVideoClick = (videoId: number) => {
    navigate(`/video/${videoId}`);
  };

  return (
    <Container>
      <Header>
        <BackButton onClick={handleBack}>
          <ArrowLeftOutlined />
        </BackButton>
        <Title>我喜欢的视频</Title>
        <div style={{ width: '24px' }}></div> {/* 占位元素，保持标题居中 */}
      </Header>
      
      {loading ? (
        <LoadingContainer>
          <LoadingOutlined />
        </LoadingContainer>
      ) : videos.length > 0 ? (
        <VideoGrid>
          {videos.map(video => (
            <VideoItem key={video.id} onClick={() => handleVideoClick(video.id)}>
              <VideoThumbnail src={video.cover_url} alt={video.title} />
              <VideoInfo>
                <VideoTitle>{video.title}</VideoTitle>
                <VideoAuthor>@{video.author.name}</VideoAuthor>
                <VideoStats>
                  <HeartOutlined style={{ color: '#fe2c55' }} />
                  <LikeCount>{video.favorite_count}</LikeCount>
                </VideoStats>
              </VideoInfo>
            </VideoItem>
          ))}
        </VideoGrid>
      ) : (
        <EmptyState>
          <EmptyIcon>
            <HeartOutlined />
          </EmptyIcon>
          <p>你还没有喜欢的视频</p>
          <p>去首页发现更多精彩内容吧！</p>
        </EmptyState>
      )}
    </Container>
  );
};

export default FavoritePage; 