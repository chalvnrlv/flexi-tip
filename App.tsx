import React, { useEffect } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useParams } from 'react-router-dom';
import WelcomePage from './pages/WelcomePage';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import CheckoutPage from './pages/CheckoutPage';
import OrderHistory from './pages/OrderHistory';
import { useAuthStore } from './store/authStore';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

// Wrapper components to handle navigation props
const WelcomeWrapper = () => {
  const navigate = useNavigate();
  return <WelcomePage onNavigateToLogin={() => navigate('/login')} />;
};

const LoginWrapper = () => {
  const navigate = useNavigate();
  return (
    <AuthPage
      defaultMode="login"
      onLogin={() => navigate('/dashboard')}
      onSwitchToRegister={() => navigate('/register')}
    />
  );
};

const RegisterWrapper = () => {
  const navigate = useNavigate();
  return (
    <AuthPage
      defaultMode="register"
      onLogin={() => navigate('/dashboard')}
      onSwitchToLogin={() => navigate('/login')}
    />
  );
};

const DashboardWrapper = () => {
  const navigate = useNavigate();
  const logout = useAuthStore(state => state.logout);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return <Dashboard onLogout={handleLogout} />;
};

const CheckoutWrapper = () => {
  const { productId } = useParams<{ productId: string }>();
  if (!productId) return <Navigate to="/dashboard" replace />;
  return <CheckoutPage productId={productId} />;
};

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
};

function App() {
  const loadUser = useAuthStore(state => state.loadUserFromStorage);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <div className="antialiased min-h-screen w-full">
          <Routes>
            <Route path="/" element={<PublicRoute><WelcomeWrapper /></PublicRoute>} />
            <Route path="/login" element={<PublicRoute><LoginWrapper /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><RegisterWrapper /></PublicRoute>} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardWrapper />
                </ProtectedRoute>
              }
            />
            <Route
              path="/checkout/:productId"
              element={
                <ProtectedRoute>
                  <CheckoutWrapper />
                </ProtectedRoute>
              }
            />
            <Route
              path="/order-history"
              element={
                <ProtectedRoute>
                  <OrderHistory />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;
