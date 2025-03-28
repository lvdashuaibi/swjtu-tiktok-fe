import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import { AuthProvider } from './utils/AuthContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import UploadPage from './pages/UploadPage';
import FavoritePage from './pages/FavoritePage';
import './App.css';

const AppContainer = styled.div`
  max-width: 480px;
  margin: 0 auto;
  min-height: 100vh;
  position: relative;
  background-color: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContainer>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/user/:userId" element={<ProfilePage />} />
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/favorite" element={<FavoritePage />} />
          </Routes>
          <Navbar />
        </AppContainer>
      </Router>
    </AuthProvider>
  );
}

export default App;
