import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { ArrowLeftOutlined, CloudUploadOutlined, VideoCameraOutlined, CheckCircleFilled } from '@ant-design/icons';
import { useAuth } from '../utils/AuthContext';
import { publishVideo } from '../services/api';

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

const Content = styled.div`
  padding: 20px;
`;

const UploadArea = styled.div<{ isDragOver: boolean }>`
  border: 2px dashed ${props => props.isDragOver ? '#fe2c55' : '#ddd'};
  border-radius: 8px;
  padding: 40px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  cursor: pointer;
  transition: all 0.3s;
  
  &:hover {
    border-color: #fe2c55;
  }
`;

const UploadIcon = styled.div`
  font-size: 48px;
  color: #fe2c55;
  margin-bottom: 16px;
`;

const UploadText = styled.p`
  margin: 0;
  text-align: center;
  color: #666;
`;

const UploadButton = styled.button`
  display: block;
  width: 100%;
  padding: 12px;
  background-color: #fe2c55;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 20px;
  
  &:disabled {
    background-color: #ffa9ba;
    cursor: not-allowed;
  }
`;

const VideoPreview = styled.div`
  margin-top: 20px;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
`;

const StyledVideo = styled.video`
  width: 100%;
  border-radius: 8px;
  display: block;
`;

const InputGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  
  &:focus {
    outline: none;
    border-color: #fe2c55;
  }
`;

const ErrorMessage = styled.div`
  color: #fe2c55;
  margin-top: 8px;
  font-size: 14px;
`;

const SuccessMessage = styled.div`
  display: flex;
  align-items: center;
  color: #52c41a;
  margin-top: 8px;
  font-size: 14px;
`;

const UploadPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, token } = useAuth();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('video/')) {
        setSelectedFile(file);
        setError('');
      } else {
        setError('请上传视频文件');
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.type.startsWith('video/')) {
        setSelectedFile(file);
        setError('');
      } else {
        setError('请上传视频文件');
      }
    }
  };

  const handleClickUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      setError('请选择视频文件');
      return;
    }

    if (!title.trim()) {
      setError('请输入视频标题');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('data', selectedFile);
      formData.append('token', token || '');
      formData.append('title', title);

      const response = await publishVideo(formData);
      
      if (response.status_code === 0) {
        setSuccess(true);
        // 重置表单
        setSelectedFile(null);
        setTitle('');
        
        // 2秒后跳转到个人页面
        setTimeout(() => {
          navigate('/profile');
        }, 2000);
      } else {
        setError(response.status_msg || '上传失败，请重试');
      }
    } catch (error: any) {
      console.error('视频上传失败:', error);
      setError(error.response?.data?.status_msg || '上传失败，请重试');
    } finally {
      setLoading(false);
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
        <Title>上传视频</Title>
        <div style={{ width: '24px' }}></div> {/* 占位元素，保持标题居中 */}
      </Header>
      
      <Content>
        <UploadArea 
          isDragOver={isDragOver}
          onClick={handleClickUpload}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input 
            type="file" 
            ref={fileInputRef}
            style={{ display: 'none' }} 
            accept="video/*"
            onChange={handleFileChange}
          />
          
          <UploadIcon>
            {selectedFile ? <VideoCameraOutlined /> : <CloudUploadOutlined />}
          </UploadIcon>
          
          <UploadText>
            {selectedFile 
              ? `已选择: ${selectedFile.name}`
              : '点击或拖拽视频文件至此处上传'
            }
          </UploadText>
        </UploadArea>
        
        {selectedFile && (
          <VideoPreview>
            <StyledVideo 
              ref={videoRef}
              src={URL.createObjectURL(selectedFile)} 
              controls
            />
          </VideoPreview>
        )}
        
        <InputGroup>
          <Label htmlFor="title">视频标题</Label>
          <Input
            id="title"
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="给你的视频起个标题吧"
          />
        </InputGroup>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        {success && (
          <SuccessMessage>
            <CheckCircleFilled style={{ marginRight: '8px' }} />
            视频上传成功！即将跳转到个人页面...
          </SuccessMessage>
        )}
        
        <UploadButton 
          onClick={handleSubmit} 
          disabled={loading || !selectedFile || !title.trim() || success}
        >
          {loading ? '上传中...' : '发布视频'}
        </UploadButton>
      </Content>
    </Container>
  );
};

export default UploadPage; 