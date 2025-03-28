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
  height: 50px;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-around;
  border-top: 1px solid #f1f1f1;
  z-index: 1000;
`;

const NavItem = styled(Link)<{ active: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: ${props => props.active ? '#fe2c55' : '#161823'};
  font-size: 10px;
  text-decoration: none;

  .anticon {
    font-size: 24px;
    margin-bottom: 2px;
  }
`;

const NavText = styled.span`
  font-size: 12px;
`;

const UploadButton = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #fff;
  background-color: #fe2c55;
  font-size: 10px;
  text-decoration: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  bottom: 10px;

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
        <UploadButton to="/upload">
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