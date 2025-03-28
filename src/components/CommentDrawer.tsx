import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { CloseOutlined, SendOutlined, UserOutlined } from '@ant-design/icons';
import { Comment } from '../types';
import { useAuth } from '../utils/AuthContext';
import { getCommentList, commentAction } from '../services/api';

interface CommentDrawerProps {
  videoId: number;
  isOpen: boolean;
  onClose: () => void;
}

const DrawerContainer = styled.div<{ isOpen: boolean }>`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 70vh;
  background-color: white;
  border-radius: 20px 20px 0 0;
  z-index: 1001;
  transform: ${props => props.isOpen ? 'translateY(0)' : 'translateY(100%)'};
  transition: transform 0.3s ease-in-out;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #f1f1f1;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 16px;
  font-weight: 600;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
`;

const CommentList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
`;

const CommentItem = styled.div`
  display: flex;
  margin-bottom: 16px;
`;

const Avatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 12px;
  object-fit: cover;
`;

const DefaultAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #f1f1f1;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 12px;
`;

const CommentContent = styled.div`
  flex: 1;
`;

const UserName = styled.div`
  font-weight: 600;
  margin-bottom: 4px;
`;

const CommentText = styled.div`
  color: #333;
  margin-bottom: 4px;
`;

const CommentDate = styled.div`
  font-size: 12px;
  color: #999;
`;

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 16px;
  border-top: 1px solid #f1f1f1;
`;

const CommentInput = styled.input`
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #f1f1f1;
  border-radius: 20px;
  outline: none;
  
  &:focus {
    border-color: #fe2c55;
  }
`;

const SendButton = styled.button<{ disabled: boolean }>`
  background: none;
  border: none;
  cursor: ${props => props.disabled ? 'default' : 'pointer'};
  color: ${props => props.disabled ? '#999' : '#fe2c55'};
  font-size: 24px;
  margin-left: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Overlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: ${props => props.isOpen ? 'block' : 'none'};
`;

const CommentDrawer: React.FC<CommentDrawerProps> = ({ videoId, isOpen, onClose }) => {
  const { isAuthenticated, token, user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && token) {
      fetchComments();
    }
  }, [isOpen, token, videoId]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await getCommentList(token!, videoId.toString());
      if (response.status_code === 0) {
        setComments(response.comment_list || []);
      }
    } catch (error) {
      console.error('获取评论列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendComment = async () => {
    if (!isAuthenticated) {
      alert('请先登录');
      return;
    }

    if (!commentText.trim()) return;

    try {
      const response = await commentAction(
        token!,
        videoId.toString(),
        '1',
        commentText,
      );

      if (response.status_code === 0) {
        // 添加新评论到列表
        setComments(prevComments => [response.comment, ...prevComments]);
        // 清空输入框
        setCommentText('');
      }
    } catch (error) {
      console.error('发送评论失败:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendComment();
    }
  };

  return (
    <>
      <Overlay isOpen={isOpen} onClick={onClose} />
      <DrawerContainer isOpen={isOpen}>
        <Header>
          <Title>评论</Title>
          <CloseButton onClick={onClose}>
            <CloseOutlined />
          </CloseButton>
        </Header>
        
        <CommentList>
          {comments.map(comment => (
            <CommentItem key={comment.id}>
              {comment.user.avatar ? (
                <Avatar src={comment.user.avatar} alt={comment.user.name} />
              ) : (
                <DefaultAvatar>
                  <UserOutlined style={{ fontSize: '20px' }} />
                </DefaultAvatar>
              )}
              
              <CommentContent>
                <UserName>@{comment.user.name}</UserName>
                <CommentText>{comment.content}</CommentText>
                <CommentDate>{comment.create_date}</CommentDate>
              </CommentContent>
            </CommentItem>
          ))}
          
          {comments.length === 0 && !loading && (
            <div style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
              还没有评论，快来发表第一条评论吧！
            </div>
          )}
          
          {loading && (
            <div style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
              加载中...
            </div>
          )}
        </CommentList>
        
        <InputContainer>
          <CommentInput
            placeholder="添加评论..."
            value={commentText}
            onChange={e => setCommentText(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <SendButton 
            disabled={!commentText.trim() || !isAuthenticated} 
            onClick={handleSendComment}
          >
            <SendOutlined />
          </SendButton>
        </InputContainer>
      </DrawerContainer>
    </>
  );
};

export default CommentDrawer; 