import { useState, useEffect } from 'react';
import '@/App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import LoginPage from '@/components/LoginPage';
import ChatPage from '@/components/ChatPage';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

function App() {
  const [token, setToken] = useState(localStorage.getItem('companionbot_token'));
  const [username, setUsername] = useState(localStorage.getItem('companionbot_username'));

  const handleLogin = (newToken, newUsername) => {
    localStorage.setItem('companionbot_token', newToken);
    localStorage.setItem('companionbot_username', newUsername);
    setToken(newToken);
    setUsername(newUsername);
  };

  const handleLogout = () => {
    localStorage.removeItem('companionbot_token');
    localStorage.removeItem('companionbot_username');
    setToken(null);
    setUsername(null);
  };

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route 
            path="/" 
            element={
              token ? 
                <Navigate to="/chat" replace /> : 
                <LoginPage onLogin={handleLogin} apiUrl={API} />
            } 
          />
          <Route 
            path="/chat" 
            element={
              token ? 
                <ChatPage 
                  token={token} 
                  username={username} 
                  onLogout={handleLogout} 
                  apiUrl={API}
                /> : 
                <Navigate to="/" replace />
            } 
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;