
import React, { useState } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import WelcomePage from './pages/WelcomePage';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import { Page } from './types';

// Get Google Client ID from environment variable
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>(Page.WELCOME);

  const navigateToDashboard = () => {
    setCurrentPage(Page.DASHBOARD);
  };

  const navigateToLogin = () => {
    setCurrentPage(Page.LOGIN);
  };

  const navigateToRegister = () => {
    setCurrentPage(Page.REGISTER);
  };

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div className="antialiased min-h-screen w-full">
        {currentPage === Page.WELCOME && (
          <WelcomePage 
            onNavigateToLogin={navigateToLogin} 
          />
        )}
        {currentPage === Page.REGISTER && (
          <AuthPage 
            onLogin={navigateToDashboard} 
            onSwitchToLogin={navigateToLogin}
            defaultMode="register" 
          />
        )}
        {currentPage === Page.LOGIN && (
          <AuthPage 
            onLogin={navigateToDashboard} 
            onSwitchToRegister={navigateToRegister}
            defaultMode="login" 
          />
        )}
        {currentPage === Page.DASHBOARD && (
          <Dashboard 
            onLogout={() => setCurrentPage(Page.WELCOME)} 
          />
        )}
      </div>
    </GoogleOAuthProvider>
  );
}

export default App;
