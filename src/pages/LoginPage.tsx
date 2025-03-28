import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { UserOutlined, LockOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { login, register } from '../services/api';
import { useAuth } from '../utils/AuthContext';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
  background-color: #fff;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  margin-bottom: 40px;
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
  font-size: 24px;
  font-weight: 600;
  margin: 0;
`;

const Form = styled.form`
  width: 100%;
  max-width: 400px;
`;

const InputGroup = styled.div`
  margin-bottom: 20px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  padding-left: 45px;
  border: 1px solid #f1f1f1;
  border-radius: 4px;
  font-size: 16px;
  outline: none;
  
  &:focus {
    border-color: #fe2c55;
  }
`;

const InputWrapper = styled.div`
  position: relative;
`;

const IconWrapper = styled.div`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 20px;
  color: #999;
`;

const Button = styled.button`
  width: 100%;
  padding: 14px;
  background-color: #fe2c55;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  
  &:disabled {
    background-color: #ffa9ba;
    cursor: not-allowed;
  }
`;

const ToggleText = styled.p`
  margin-top: 20px;
  color: #333;
  text-align: center;
`;

const ToggleButton = styled.button`
  background: none;
  border: none;
  color: #fe2c55;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
  margin-left: 5px;
`;

const ErrorMessage = styled.div`
  color: #fe2c55;
  margin-top: 8px;
  font-size: 14px;
`;

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleBack = () => {
    navigate(-1);
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('请输入用户名和密码');
      return;
    }

    try {
      setLoading(true);
      
      if (isLogin) {
        // 登录
        const response = await login(username, password);
        if (response.user_id && response.token) {
          authLogin(response.user_id.toString(), response.token);
          navigate('/');
        }
      } else {
        // 注册
        const response = await register(username, password);
        if (response.user_id && response.token) {
          authLogin(response.user_id.toString(), response.token);
          navigate('/');
        }
      }
    } catch (error: any) {
      console.error('登录/注册失败:', error);
      if (error.response?.data?.StatusMsg) {
        setError(error.response.data.StatusMsg);
      } else {
        setError(isLogin ? '登录失败，请检查用户名和密码' : '注册失败，该用户名可能已存在');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Header>
        <BackButton onClick={handleBack}>
          <ArrowLeftOutlined />
        </BackButton>
        <Title>{isLogin ? '登录' : '注册'}</Title>
        <div style={{ width: '24px' }}></div> {/* 占位，保持标题居中 */}
      </Header>
      
      <Form onSubmit={handleSubmit}>
        <InputGroup>
          <InputWrapper>
            <IconWrapper>
              <UserOutlined />
            </IconWrapper>
            <Input
              type="text"
              placeholder="用户名"
              value={username}
              onChange={e => setUsername(e.target.value)}
            />
          </InputWrapper>
        </InputGroup>
        
        <InputGroup>
          <InputWrapper>
            <IconWrapper>
              <LockOutlined />
            </IconWrapper>
            <Input
              type="password"
              placeholder="密码"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </InputWrapper>
        </InputGroup>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <Button type="submit" disabled={loading}>
          {loading ? '处理中...' : isLogin ? '登录' : '注册'}
        </Button>
        
        <ToggleText>
          {isLogin ? '还没有账号?' : '已有账号?'}
          <ToggleButton type="button" onClick={toggleMode}>
            {isLogin ? '立即注册' : '去登录'}
          </ToggleButton>
        </ToggleText>
      </Form>
    </Container>
  );
};

export default LoginPage; 