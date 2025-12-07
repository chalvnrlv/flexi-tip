import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { Mail, Lock, User as UserIcon, Calendar, Phone, ArrowLeft } from 'lucide-react';
import Input from '../components/Input';
import Button from '../components/Button';
import { useAuthStore } from '../store/authStore';

interface AuthPageProps {
  onLogin: () => void;
  onSwitchToRegister?: () => void;
  onSwitchToLogin?: () => void;
  defaultMode?: 'login' | 'register';
}

const AuthPage: React.FC<AuthPageProps> = ({
  onLogin,
  onSwitchToRegister,
  onSwitchToLogin,
  defaultMode = 'login'
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(defaultMode);
  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [isJastiper, setIsJastiper] = useState(false);

  // Store
  const { login: storeLogin, isLoading: storeLoading, error: storeError, setLoading, setError: setStoreError } = useAuthStore();
  const [localError, setLocalError] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setLocalError('');
    setStoreError(null);

    try {
      const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
      const body = mode === 'login'
        ? { email, password }
        : { name, email, password, phone, birthDate, isJastiper }; // Adapt fields to backend requirements

      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Authentication failed');
      }

      // Success
      storeLogin(data.user || data.data, data.token); // Backend usually sends { success: true, token, user/data }
      onLogin(); // Navigate
    } catch (err: any) {
      setLocalError(err.message || 'Something went wrong');
      setStoreError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchMode = (newMode: 'login' | 'register') => {
    setMode(newMode);
    setLocalError('');
    setStoreError(null);
    setIsJastiper(false);
    if (newMode === 'login' && onSwitchToLogin) onSwitchToLogin();
    if (newMode === 'register' && onSwitchToRegister) onSwitchToRegister();
  };

  // Handle Google OAuth success
  const handleGoogleSuccess = async (credentialResponse: any) => {
    setLocalError('');
    setStoreError(null);
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          credential: credentialResponse.credential,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Google authentication failed');
      }

      // Save token and user data via store
      storeLogin(data.user, data.token);
      onLogin();
    } catch (err: any) {
      setLocalError(err.message || 'Google login failed');
      setStoreError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle Google OAuth error
  const handleGoogleError = () => {
    setLocalError('Google login was cancelled or failed');
  };

  // ----------------------------------------------------------------------
  // LOGIN LAYOUT (Based on "Pembuka 2")
  // ----------------------------------------------------------------------
  if (mode === 'login') {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-white p-4">
        {/* Background Image Container */}
        <div className="absolute inset-0 z-0 opacity-10">
          <img src="https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&q=80" className="h-full w-full object-cover" alt="bg" />
        </div>

        <div className="relative z-10 w-full max-w-sm">
          {/* Card Container */}
          <div className="overflow-hidden rounded-3xl bg-gradient-to-b from-brand-teal/10 to-brand-medium/30 p-1 shadow-2xl backdrop-blur-sm">
            <div className="rounded-[20px] bg-white/40 p-6 pt-10">

              {/* Header */}
              <div className="mb-8 text-center">
                <h2 className="text-2xl font-bold text-brand-darkest">Welcome Back!</h2>
                <p className="text-xs text-brand-dark">Please sign in to continue</p>
              </div>

              {/* Error Message */}
              {(localError || storeError) && (
                <div className="mb-4 rounded-lg bg-red-100 border border-red-400 p-3 text-xs text-red-700">
                  {localError || storeError}
                </div>
              )}

              {/* Form */}
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-brand-dark">Email</label>
                  <div className="overflow-hidden rounded-full bg-brand-light shadow-inner">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-transparent px-4 py-3 text-sm text-white placeholder-white/70 focus:outline-none"
                      placeholder="name@example.com"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-brand-dark">Password</label>
                  <div className="overflow-hidden rounded-full bg-brand-light shadow-inner">
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-transparent px-4 py-3 text-sm text-white placeholder-white/70 focus:outline-none"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={storeLoading}
                    className="w-full rounded-full bg-brand-dark py-3 text-sm font-semibold text-white shadow-lg transition-transform hover:scale-105 active:scale-95 disabled:opacity-70"
                  >
                    {storeLoading ? 'Signing in...' : 'Sign in'}
                  </button>
                </div>
              </form>

              {/* Divider */}
              <div className="my-6 flex items-center justify-center gap-2">
                <div className="h-px w-12 bg-brand-dark/20"></div>
                <span className="text-[10px] text-brand-dark/60">OR</span>
                <div className="h-px w-12 bg-brand-dark/20"></div>
              </div>

              {/* Google Button */}
              <div className="flex justify-center">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  useOneTap
                  theme="filled_blue"
                  size="large"
                  text="continue_with"
                  width="320"
                />
              </div>

              {/* Footer */}
              <p className="mt-8 text-center text-xs text-brand-dark">
                Tidak punya akun?{' '}
                <button
                  onClick={() => handleSwitchMode('register')}
                  className="font-bold text-brand-green hover:underline"
                  type="button"
                >
                  Daftar
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------------------------
  // REGISTER LAYOUT (Based on "Daftar")
  // ----------------------------------------------------------------------
  return (
    <div className="flex min-h-screen w-full flex-col bg-white">
      {/* Decorative Header (Ellipses) */}
      <div className="relative h-64 w-full overflow-hidden">
        {/* Ellipse 2 (Lighter Green) */}
        <div className="absolute -left-16 -top-20 h-[400px] w-[400px] rounded-full bg-brand-accent blur-md"></div>
        {/* Ellipse 1 (Darker Teal) */}
        <div className="absolute -left-24 -top-12 h-[350px] w-[350px] rounded-full bg-brand-medium"></div>

        {/* Content over header */}
        <div className="absolute left-6 top-24 z-10">
          <button
            onClick={() => handleSwitchMode('login')}
            className="mb-4 flex items-center gap-2 text-white/80 hover:text-white"
            type="button"
          >
            <ArrowLeft className="h-5 w-5" /> Back
          </button>
          <h1 className="text-4xl font-extrabold text-white drop-shadow-md">
            Daftar
          </h1>
          <p className="mt-1 text-sm text-white/80">Buat akun baru anda</p>
        </div>
      </div>

      {/* Register Form Section */}
      <div className="flex-1 px-8 pb-12 pt-4">
        {(localError || storeError) && (
          <div className="mb-4 rounded-lg bg-red-100 border border-red-400 p-3 text-xs text-red-700">
            {localError || storeError}
          </div>
        )}

        <form className="mx-auto max-w-sm space-y-5" onSubmit={handleSubmit}>

          <div className="space-y-1">
            <label className="text-xs font-bold text-brand-dark ml-1">Nama lengkap</label>
            <Input
              icon={<UserIcon className="h-4 w-4 text-brand-light" />}
              placeholder="Masukkan nama anda"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border-brand-light/30 focus:border-brand-light focus:ring-brand-light"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-brand-dark ml-1">Tanggal lahir</label>
            <Input
              type="date"
              icon={<Calendar className="h-4 w-4 text-brand-light" />}
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="border-brand-light/30 focus:border-brand-light focus:ring-brand-light"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-brand-dark ml-1">No. telp</label>
            <Input
              type="tel"
              icon={<Phone className="h-4 w-4 text-brand-light" />}
              placeholder="0812..."
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="border-brand-light/30 focus:border-brand-light focus:ring-brand-light"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-brand-dark ml-1">Email</label>
            <Input
              type="email"
              icon={<Mail className="h-4 w-4 text-brand-light" />}
              placeholder="email@address.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border-brand-light/30 focus:border-brand-light focus:ring-brand-light"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-brand-dark ml-1">Sandi</label>
            <Input
              type="password"
              icon={<Lock className="h-4 w-4 text-brand-light" />}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border-brand-light/30 focus:border-brand-light focus:ring-brand-light"
              required
            />
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <input
              type="checkbox"
              id="isJastiper"
              checked={isJastiper}
              onChange={(e) => setIsJastiper(e.target.checked)}
              className="h-4 w-4 rounded border-brand-light/30 text-brand-medium focus:ring-brand-light"
            />
            <label htmlFor="isJastiper" className="text-sm font-medium text-brand-dark cursor-pointer select-none">
              Daftar sebagai Jastiper
            </label>
          </div>

          <div className="pt-4">
            <Button type="submit" isLoading={storeLoading} className="w-full shadow-lg hover:shadow-xl">
              Daftar
            </Button>
          </div>

          <p className="text-center text-xs text-brand-dark/70">
            Sudah punya akun?{' '}
            <button
              type="button"
              onClick={() => handleSwitchMode('login')}
              className="font-bold text-brand-medium hover:underline"
            >
              Masuk
            </button>
          </p>

        </form>
      </div>
    </div>
  );
};
export default AuthPage;
