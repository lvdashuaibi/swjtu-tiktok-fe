import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { LoadingOutlined } from '@ant-design/icons';
import VideoCard from '../components/VideoCard';
import CommentDrawer from '../components/CommentDrawer';
import { Video } from '../types';
import { getFeed } from '../services/api';
import { useAuth } from '../utils/AuthContext';

const Container = styled.div`
  height: 100vh;
  overflow: hidden;
  background-color: #000;
`;

const FeedContainer = styled.div`
  height: 100%;
  overflow-y: scroll;
  scroll-snap-type: y mandatory;
  padding-bottom: 50px; /* 为底部导航留出空间 */
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
  color: white;
  font-size: 24px;
`;

const HomePage: React.FC = () => {
  const { token } = useAuth();
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);
  const [nextTime, setNextTime] = useState<number>(0);
  const [selectedVideoId, setSelectedVideoId] = useState<number | null>(null);
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const feedContainerRef = useRef<HTMLDivElement>(null);
  const [hasMore, setHasMore] = useState(true);

  // 初始加载视频
  useEffect(() => {
    fetchVideos();
  }, [token]);

  // 滚动监听，用于无限滚动
  useEffect(() => {
    const container = feedContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      // 检查是否已滚动到底部附近
      const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 200;
      
      if (isNearBottom && !loading && hasMore) {
        fetchMoreVideos();
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [loading, nextTime, hasMore]);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const response = await getFeed(0, token || '');
      
      if (response.status_code === 0) {
        setVideos(response.video_list);
        setNextTime(response.next_time);
        setHasMore(response.video_list.length > 0);
      }
    } catch (error) {
      console.error('获取视频流失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMoreVideos = async () => {
    if (loading || !hasMore) return;

    try {
      setLoading(true);
      const response = await getFeed(nextTime, token || '');
      
      if (response.status_code === 0) {
        if (response.video_list.length === 0) {
          setHasMore(false);
        } else {
          setVideos(prevVideos => [...prevVideos, ...response.video_list]);
          setNextTime(response.next_time);
        }
      }
    } catch (error) {
      console.error('获取更多视频失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = () => {
    // 视频被点赞后的处理，这里可以刷新数据等
  };

  const handleCommentClick = (videoId: number) => {
    setSelectedVideoId(videoId);
    setIsCommentOpen(true);
  };

  const handleCloseComment = () => {
    setIsCommentOpen(false);
  };

  return (
    <Container>
      <FeedContainer ref={feedContainerRef}>
        {videos.map(video => (
          <VideoCard
            key={video.id}
            video={video}
            onLike={handleLike}
            onCommentClick={() => handleCommentClick(video.id)}
          />
        ))}
        
        {loading && (
          <LoadingContainer>
            <LoadingOutlined />
          </LoadingContainer>
        )}
        
        {!hasMore && videos.length > 0 && (
          <div style={{ textAlign: 'center', padding: '20px', color: 'white' }}>
            没有更多视频了
          </div>
        )}
      </FeedContainer>
      
      {selectedVideoId && (
        <CommentDrawer
          videoId={selectedVideoId}
          isOpen={isCommentOpen}
          onClose={handleCloseComment}
        />
      )}
    </Container>
  );
};

export default HomePage; 