import React, { createContext, useState, useEffect, useContext } from 'react';
import { User } from '../types';
import { getUserInfo } from '../services/api';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  userId: string | null;
  login: (userId: string, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // 从localStorage恢复登录状态
    const storedToken = localStorage.getItem('token');
    const storedUserId = localStorage.getItem('userId');
    
    if (storedToken && storedUserId) {
      setToken(storedToken);
      setUserId(storedUserId);
      setIsAuthenticated(true);
      
      // 获取用户信息
      getUserInfo(storedUserId, storedToken)
        .then(response => {
          if (response.status_code === 0) {
            setUser(response.user);
          } else {
            // 如果获取用户信息失败，清除登录状态
            logout();
          }
        })
        .catch(() => {
          logout();
        });
    }
  }, []);

  const login = (newUserId: string, newToken: string) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('userId', newUserId);
    setToken(newToken);
    setUserId(newUserId);
    setIsAuthenticated(true);
    
    // 获取用户信息
    getUserInfo(newUserId, newToken)
      .then(response => {
        if (response.status_code === 0) {
          setUser(response.user);
        }
      })
      .catch(error => {
        console.error('获取用户信息失败:', error);
      });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setToken(null);
    setUserId(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider 
      value={{ 
        isAuthenticated, 
        user, 
        token, 
        userId, 
        login, 
        logout 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth必须在AuthProvider内部使用');
  }
  return context;
}; 