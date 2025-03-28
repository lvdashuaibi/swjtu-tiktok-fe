import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { HomeOutlined, UserOutlined, HeartOutlined, PlusCircleOutlined, LogoutOutlined } from '@ant-design/icons';
import { useAuth } from '../utils/AuthContext';

const NavContainer = styled.nav`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: space-around;
  border-top: 1px solid var(--border-color);
  z-index: 1000;
  padding: 0 12px;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
`;

const NavItem = styled(Link)<{ active: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: ${props => props.active ? 'var(--primary-color)' : 'var(--text-secondary)'};
  font-size: 10px;
  text-decoration: none;
  position: relative;
  padding: 6px 0;
  transition: all 0.2s ease;
  
  &:hover {
    color: ${props => props.active ? 'var(--primary-color)' : 'var(--primary-light)'};
    transform: translateY(-2px);
  }

  .anticon {
    font-size: 22px;
    margin-bottom: 4px;
    transition: all 0.3s ease;
  }
  
  &::after {
    content: "";
    position: absolute;
    bottom: -1px;
    left: 50%;
    width: ${props => props.active ? '16px' : '0'};
    height: 3px;
    background-color: var(--primary-color);
    border-radius: 4px;
    transform: translateX(-50%);
    transition: width 0.2s ease;
  }
`;

const NavText = styled.span`
  font-size: 12px;
  font-weight: 500;
  opacity: 0.9;
`;

const UploadButton = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #fff;
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-light) 100%);
  font-size: 10px;
  text-decoration: none;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  position: relative;
  bottom: 15px;
  box-shadow: 0 4px 12px rgba(254, 44, 85, 0.4);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px) scale(1.05);
    box-shadow: 0 6px 16px rgba(254, 44, 85, 0.5);
  }

  .anticon {
    font-size: 24px;
  }
`;

const Navbar: React.FC = () => {
  const location = useLocation();
  const { isAuthenticated, logout } = useAuth();

  return (
    <NavContainer>
      <NavItem to="/" active={location.pathname === '/'}>
        <HomeOutlined />
        <NavText>首页</NavText>
      </NavItem>
      
      {isAuthenticated && (
        <NavItem to="/favorite" active={location.pathname === '/favorite'}>
          <HeartOutlined />
          <NavText>喜欢</NavText>
        </NavItem>
      )}
      
      {isAuthenticated && (
        <UploadButton to="/upload" className="pulse">
          <PlusCircleOutlined />
        </UploadButton>
      )}
      
      {isAuthenticated ? (
        <>
          <NavItem to="/profile" active={location.pathname === '/profile'}>
            <UserOutlined />
            <NavText>我的</NavText>
          </NavItem>
          
          <NavItem to="/" active={false} onClick={logout}>
            <LogoutOutlined />
            <NavText>登出</NavText>
          </NavItem>
        </>
      ) : (
        <NavItem to="/login" active={location.pathname === '/login'}>
          <UserOutlined />
          <NavText>登录</NavText>
        </NavItem>
      )}
    </NavContainer>
  );
};

export default Navbar; 