import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { ArrowLeftOutlined, UserOutlined, VideoCameraOutlined, HeartOutlined } from '@ant-design/icons';
import { useAuth } from '../utils/AuthContext';
import { getUserInfo, getUserVideos, getFollowList, getFollowerList, followAction } from '../services/api';
import { User, Video } from '../types';

const Container = styled.div`
  background-color: #fff;
  min-height: 100vh;
  padding-bottom: 60px;
`;

const Header = styled.div`
  position: relative;
  padding: 40px 20px 20px;
`;

const BackButton = styled.button`
  position: absolute;
  top: 10px;
  left: 10px;
  background: none;
  border: none;
  font-size: 24px;
  color: white;
  z-index: 10;
  cursor: pointer;
`;

const CoverImage = styled.div<{ backgroundImage: string }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 200px;
  background-image: url(${props => props.backgroundImage || 'https://via.placeholder.com/500x200'});
  background-size: cover;
  background-position: center;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0));
  }
`;

const ProfileInfo = styled.div`
  position: relative;
  margin-top: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 1;
`;

const Avatar = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 4px solid white;
  object-fit: cover;
  background-color: #f1f1f1;
`;

const DefaultAvatar = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 4px solid white;
  background-color: #f1f1f1;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 40px;
  color: #999;
`;

const Username = styled.h1`
  margin: 10px 0 5px;
  font-size: 20px;
  font-weight: 600;
`;

const Signature = styled.p`
  margin: 0 0 15px;
  font-size: 14px;
  color: #666;
  text-align: center;
`;

const Stats = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 15px;
`;

const StatCount = styled.span`
  font-size: 18px;
  font-weight: 600;
`;

const StatLabel = styled.span`
  font-size: 12px;
  color: #666;
`;

const FollowButton = styled.button<{ isFollowing: boolean }>`
  padding: 8px 20px;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  background-color: ${props => props.isFollowing ? 'white' : '#fe2c55'};
  color: ${props => props.isFollowing ? '#333' : 'white'};
  border: ${props => props.isFollowing ? '1px solid #ddd' : 'none'};
`;

const Tabs = styled.div`
  display: flex;
  border-bottom: 1px solid #f1f1f1;
  margin-bottom: 20px;
`;

const Tab = styled.button<{ active: boolean }>`
  flex: 1;
  padding: 15px;
  background: none;
  border: none;
  border-bottom: ${props => props.active ? '2px solid #fe2c55' : 'none'};
  color: ${props => props.active ? '#fe2c55' : '#666'};
  font-weight: 600;
  cursor: pointer;
`;

const VideoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 2px;
  padding: 0 2px;
`;

const VideoItem = styled.div`
  position: relative;
  width: 100%;
  padding-top: 177.77%; /* 16:9 的宽高比 */
  overflow: hidden;
`;

const VideoThumbnail = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const VideoStats = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  font-size: 12px;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  color: #999;
`;

const EmptyIcon = styled.div`
  font-size: 40px;
  margin-bottom: 10px;
`;

enum TabType {
  VIDEOS = 'videos',
  LIKED = 'liked',
}

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { userId: paramUserId } = useParams();
  const { isAuthenticated, userId: authUserId, token } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>(TabType.VIDEOS);
  const [videos, setVideos] = useState<Video[]>([]);
  const [likedVideos, setLikedVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);

  const userId = paramUserId || authUserId;
  const isOwnProfile = userId === authUserId;

  useEffect(() => {
    if (userId) {
      fetchUserData();
    }
  }, [userId, token]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      
      if (!token) return;
      
      // 获取用户信息
      const userResponse = await getUserInfo(userId!, token);
      if (userResponse.status_code === 0) {
        setUser(userResponse.user);
      }
      
      // 获取用户视频
      const videosResponse = await getUserVideos(userId!, token);
      if (videosResponse.status_code === 0) {
        setVideos(videosResponse.video_list || []);
      }
      
      // 获取关注列表
      const followingResponse = await getFollowList(userId!, token);
      if (followingResponse.status_code === 0) {
        setFollowingCount(followingResponse.user_list?.length || 0);
      }
      
      // 获取粉丝列表
      const followersResponse = await getFollowerList(userId!, token);
      if (followersResponse.status_code === 0) {
        setFollowerCount(followersResponse.user_list?.length || 0);
        
        // 检查当前登录用户是否已关注该用户
        if (!isOwnProfile && authUserId) {
          const followers = followersResponse.user_list || [];
          setIsFollowing(followers.some(follower => follower.id === parseInt(authUserId)));
        }
      }
      
    } catch (error) {
      console.error('获取用户数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    if (!isAuthenticated || !token) {
      navigate('/login');
      return;
    }

    try {
      const actionType = isFollowing ? '2' : '1';
      await followAction(token, userId!, actionType);
      
      // 更新关注状态
      setIsFollowing(!isFollowing);
      setFollowerCount(prevCount => isFollowing ? prevCount - 1 : prevCount + 1);
    } catch (error) {
      console.error('关注操作失败:', error);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <Container>
      <Header>
        <BackButton onClick={handleBack}>
          <ArrowLeftOutlined />
        </BackButton>
        
        <CoverImage backgroundImage={user?.background_image || ''} />
        
        <ProfileInfo>
          {user?.avatar ? (
            <Avatar src={user.avatar} alt={user.name} />
          ) : (
            <DefaultAvatar>
              <UserOutlined />
            </DefaultAvatar>
          )}
          
          <Username>@{user?.name}</Username>
          
          {user?.signature && (
            <Signature>{user.signature}</Signature>
          )}
          
          <Stats>
            <StatItem>
              <StatCount>{videos.length}</StatCount>
              <StatLabel>作品</StatLabel>
            </StatItem>
            
            <StatItem>
              <StatCount>{followingCount}</StatCount>
              <StatLabel>关注</StatLabel>
            </StatItem>
            
            <StatItem>
              <StatCount>{followerCount}</StatCount>
              <StatLabel>粉丝</StatLabel>
            </StatItem>
          </Stats>
          
          {!isOwnProfile && isAuthenticated && (
            <FollowButton isFollowing={isFollowing} onClick={handleFollow}>
              {isFollowing ? '已关注' : '关注'}
            </FollowButton>
          )}
        </ProfileInfo>
      </Header>
      
      <Tabs>
        <Tab 
          active={activeTab === TabType.VIDEOS} 
          onClick={() => setActiveTab(TabType.VIDEOS)}
        >
          <VideoCameraOutlined style={{ marginRight: '5px' }} />
          作品
        </Tab>
        
        <Tab 
          active={activeTab === TabType.LIKED} 
          onClick={() => setActiveTab(TabType.LIKED)}
        >
          <HeartOutlined style={{ marginRight: '5px' }} />
          喜欢
        </Tab>
      </Tabs>
      
      {activeTab === TabType.VIDEOS && (
        videos.length > 0 ? (
          <VideoGrid>
            {videos.map(video => (
              <VideoItem key={video.id} onClick={() => navigate(`/video/${video.id}`)}>
                <VideoThumbnail src={video.cover_url} alt={video.title} />
                <VideoStats>
                  <HeartOutlined style={{ marginRight: '5px' }} />
                  {video.favorite_count}
                </VideoStats>
              </VideoItem>
            ))}
          </VideoGrid>
        ) : (
          <EmptyState>
            <EmptyIcon><VideoCameraOutlined /></EmptyIcon>
            <p>还没有发布作品</p>
          </EmptyState>
        )
      )}
      
      {activeTab === TabType.LIKED && (
        likedVideos.length > 0 ? (
          <VideoGrid>
            {likedVideos.map(video => (
              <VideoItem key={video.id} onClick={() => navigate(`/video/${video.id}`)}>
                <VideoThumbnail src={video.cover_url} alt={video.title} />
                <VideoStats>
                  <HeartOutlined style={{ marginRight: '5px' }} />
                  {video.favorite_count}
                </VideoStats>
              </VideoItem>
            ))}
          </VideoGrid>
        ) : (
          <EmptyState>
            <EmptyIcon><HeartOutlined /></EmptyIcon>
            <p>还没有喜欢的视频</p>
          </EmptyState>
        )
      )}
    </Container>
  );
};

export default ProfilePage; 