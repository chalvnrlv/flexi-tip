import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { Mail, Lock, User as UserIcon, Calendar, Phone, ArrowLeft } from 'lucide-react';
import Input from '../components/Input';
import Button from '../components/Button';
import { useAuthStore } from '../store/authStore';
import { getUserByEmail, MOCK_USERS, MockUser } from '../src/mockData';
import logoFlexiTip from '../images/flexi-tip.png';

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
  const [role, setRole] = useState<'customer' | 'jastiper'>('customer');
  const [asalDaerah, setAsalDaerah] = useState('');

  // Store
  const { login: storeLogin, isLoading: storeLoading, error: storeError, setLoading, setError: setStoreError } = useAuthStore();
  const [localError, setLocalError] = useState('');



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setLocalError('');
    setStoreError(null);

    try {
      if (mode === 'login') {
        // Login dengan mock data
        const user = getUserByEmail(email);
        if (!user || user.password !== password) {
          throw new Error('Email atau password salah');
        }

        // Login success
        const { password: _, ...userWithoutPassword } = user;
        const mockToken = 'mock-token-' + Date.now();
        storeLogin(userWithoutPassword, mockToken);
        onLogin();
      } else {
        // Register - simpan user baru ke localStorage
        const existingUser = getUserByEmail(email);
        if (existingUser) {
          throw new Error('Email sudah terdaftar');
        }

        if (!role || !asalDaerah) {
          throw new Error('Role dan asal daerah harus diisi');
        }

        // Create new user
        const newUser: MockUser = {
          id: 'user-' + Date.now(),
          name,
          email,
          password,
          phone,
          role,
          asalDaerah,
          isJastiper: role === 'jastiper',
          avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
        };

        // Save to localStorage
        const allUsers = [...MOCK_USERS, newUser];
        localStorage.setItem('flexitip_users', JSON.stringify(allUsers));

        // Login the new user
        const { password: _, ...userWithoutPassword } = newUser;
        const mockToken = 'mock-token-' + Date.now();
        storeLogin(userWithoutPassword, mockToken);
        onLogin();
      }
    } catch (err: any) {
      setLocalError(err.message || 'Terjadi kesalahan');
      setStoreError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchMode = (newMode: 'login' | 'register') => {
    setMode(newMode);
    setLocalError('');
    setStoreError(null);
    setRole('customer');
    setAsalDaerah('');
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
      <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-gray-50 font-poppins">
        {/* Modern Background Elements */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          {/* Main Curve - Deep Dark Green */}
          <div className="absolute -top-[30%] -left-[10%] w-[120%] h-[70vh] rounded-[100%] bg-gradient-to-br from-brand-darkest via-brand-dark to-brand-medium shadow-2xl skew-y-3 origin-bottom-left" />

          {/* Secondary Accent Curve - Softer Green */}
          <div className="absolute -top-[35%] -right-[15%] w-[130%] h-[65vh] rounded-[100%] bg-gradient-to-bl from-brand-green/80 to-brand-teal/80 mix-blend-overlay shadow-lg -skew-y-3 origin-bottom-right" />

          {/* Subtle Glow */}
          <div className="absolute top-0 inset-x-0 h-full bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
        </div>

        {/* Content Container - Z-Index to sit above background */}
        <div className="relative z-10 flex w-full max-w-sm flex-col items-center px-4 pt-12 md:pt-0">

          {/* Logo & Welcome Section */}
          <div className="mb-8 flex flex-col items-center text-center">
            {/* Animated Logo */}
            <div className="relative mb-6 group">
              <div className="absolute inset-0 bg-white/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              <img
                src={logoFlexiTip}
                alt="FlexiTip Logo"
                className="relative h-32 w-32 object-contain drop-shadow-2xl transition-transform duration-500 hover:scale-110 hover:rotate-3"
              />
            </div>

            <h1 className="text-4xl font-extrabold text-white drop-shadow-lg tracking-tight mb-2">
              Selamat Datang!
            </h1>
            <p className="text-brand-light font-medium text-sm bg-brand-darkest/30 px-4 py-1 rounded-full backdrop-blur-sm border border-white/10">
              Silahkan masuk ke akun anda
            </p>
          </div>

          {/* Login Form Card */}
          <div className="w-full">
            <div className="overflow-hidden rounded-3xl bg-white/80 p-1 shadow-[0_8px_30px_rgb(0,0,0,0.12)] backdrop-blur-md border border-white/50 ring-1 ring-white/60">
              <div className="rounded-[20px] bg-white/50 p-6 sm:p-8">

                {/* Error Message */}
                {(localError || storeError) && (
                  <div className="mb-6 rounded-xl bg-red-50 border border-red-200 p-3 flex items-start gap-3">
                    <div className="flex-shrink-0 w-1 h-full bg-red-500 rounded-full" />
                    <p className="text-xs font-medium text-red-600 leading-relaxed">{localError || storeError}</p>
                  </div>
                )}

                {/* Form */}
                <form className="space-y-5" onSubmit={handleSubmit}>
                  <div className="space-y-1.5">
                    <label className="ml-1 text-xs font-bold text-brand-dark uppercase tracking-wide">Email</label>
                    <div className="group relative overflow-hidden rounded-2xl bg-gray-50/80 border border-gray-200 focus-within:border-brand-medium focus-within:bg-white focus-within:ring-4 focus-within:ring-brand-medium/10 transition-all duration-300">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="peer w-full bg-transparent px-4 py-3.5 text-sm font-medium text-gray-800 placeholder-gray-400 focus:outline-none"
                        placeholder="name@example.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="ml-1 text-xs font-bold text-brand-dark uppercase tracking-wide">Password</label>
                    <div className="group relative overflow-hidden rounded-2xl bg-gray-50/80 border border-gray-200 focus-within:border-brand-medium focus-within:bg-white focus-within:ring-4 focus-within:ring-brand-medium/10 transition-all duration-300">
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="peer w-full bg-transparent px-4 py-3.5 text-sm font-medium text-gray-800 placeholder-gray-400 focus:outline-none"
                        placeholder="••••••••"
                        required
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={storeLoading}
                      className="relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-brand-dark to-brand-green p-[1px] shadow-lg transition-all duration-300 hover:shadow-brand-green/30 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100"
                    >
                      <div className="relative flex items-center justify-center rounded-2xl bg-brand-dark px-4 py-3.5 transition-all duration-300 hover:bg-transparent">
                        <span className="text-sm font-bold text-white tracking-wide">
                          {storeLoading ? 'Signing in...' : 'Sign In'}
                        </span>
                      </div>
                    </button>
                  </div>
                </form>

                {/* Divider */}
                <div className="my-8 flex items-center justify-center gap-3 opacity-60">
                  <div className="h-px w-full bg-gradient-to-r from-transparent via-brand-dark/20 to-transparent"></div>
                  <span className="text-[10px] font-bold text-brand-dark/40 uppercase tracking-widest whitespace-nowrap">Atau Masuk Dengan</span>
                  <div className="h-px w-full bg-gradient-to-r from-transparent via-brand-dark/20 to-transparent"></div>
                </div>

                {/* Fallback Google Button Text if Icon only is confusing or just to be safe, keeping standard button style might be better but user asked for modern. Let's stick closer to the original logical flow but nicer */}
                {/* Reverting Google Button to standard look but cleaner wrapper because 'icon' type might be too minimal for some */}
                <div className="flex justify-center mt-4">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={handleGoogleError}
                    useOneTap
                    theme="outline"
                    size="large"
                    width="280"
                    text="continue_with"
                    shape="pill"
                  />
                </div>

                {/* Footer */}
                <p className="mt-8 text-center text-xs text-gray-600">
                  Belum punya akun?{' '}
                  <button
                    onClick={() => handleSwitchMode('register')}
                    className="font-bold text-brand-green hover:text-brand-dark hover:underline transition-colors"
                    type="button"
                  >
                    Daftar Sekarang
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-gray-50 font-poppins py-10">
      {/* Modern Background Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Main Curve - Deep Dark Green */}
        <div className="absolute -top-[20%] -left-[10%] w-[120%] h-[80vh] rounded-[100%] bg-gradient-to-br from-brand-darkest via-brand-dark to-brand-medium shadow-2xl skew-y-3 origin-bottom-left" />

        {/* Secondary Accent Curve - Softer Green */}
        <div className="absolute -top-[25%] -right-[15%] w-[130%] h-[75vh] rounded-[100%] bg-gradient-to-bl from-brand-green/80 to-brand-teal/80 mix-blend-overlay shadow-lg -skew-y-3 origin-bottom-right" />

        {/* Subtle Glow */}
        <div className="absolute top-0 inset-x-0 h-full bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 flex w-full max-w-md flex-col items-center px-4">

        {/* Header Section */}
        <div className="mb-8 w-full">
          <button
            onClick={() => handleSwitchMode('login')}
            className="mb-6 flex items-center gap-2 text-white/80 hover:text-white transition-colors group"
            type="button"
          >
            <div className="rounded-full bg-white/10 p-2 group-hover:bg-white/20 transition-all">
              <ArrowLeft className="h-5 w-5" />
            </div>
            <span className="text-sm font-medium">Kembali</span>
          </button>

          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-white drop-shadow-lg tracking-tight mb-2">
              Buat Akun Baru
            </h1>
            <p className="text-brand-light font-medium text-sm bg-brand-darkest/30 inline-block px-4 py-1 rounded-full backdrop-blur-sm border border-white/10">
              Bergabunglah komunitas Flexi-Tip sekarang
            </p>
          </div>
        </div>

        {/* Register Form Card */}
        <div className="w-full">
          <div className="overflow-hidden rounded-3xl bg-white/80 p-1 shadow-[0_8px_30px_rgb(0,0,0,0.12)] backdrop-blur-md border border-white/50 ring-1 ring-white/60">
            <div className="rounded-[20px] bg-white/50 p-6 sm:p-8">

              {/* Error Message */}
              {(localError || storeError) && (
                <div className="mb-6 rounded-xl bg-red-50 border border-red-200 p-3 flex items-start gap-3">
                  <div className="flex-shrink-0 w-1 h-full bg-red-500 rounded-full" />
                  <p className="text-xs font-medium text-red-600 leading-relaxed">{localError || storeError}</p>
                </div>
              )}

              <form className="space-y-4" onSubmit={handleSubmit}>

                {/* Nama Lengkap */}
                <div className="space-y-1">
                  <label className="ml-1 text-xs font-bold text-brand-dark uppercase tracking-wide">Nama Lengkap</label>
                  <div className="group relative overflow-hidden rounded-2xl bg-gray-50/80 border border-gray-200 focus-within:border-brand-medium focus-within:bg-white focus-within:ring-4 focus-within:ring-brand-medium/10 transition-all duration-300">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-medium transition-colors">
                      <UserIcon className="h-5 w-5" />
                    </div>
                    <input
                      type="text"
                      placeholder="Masukkan nama lengkap"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="peer w-full bg-transparent pl-12 pr-4 py-3.5 text-sm font-medium text-gray-800 placeholder-gray-400 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <label className="ml-1 text-xs font-bold text-brand-dark uppercase tracking-wide">Email</label>
                  <div className="group relative overflow-hidden rounded-2xl bg-gray-50/80 border border-gray-200 focus-within:border-brand-medium focus-within:bg-white focus-within:ring-4 focus-within:ring-brand-medium/10 transition-all duration-300">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-medium transition-colors">
                      <Mail className="h-5 w-5" />
                    </div>
                    <input
                      type="email"
                      placeholder="email@address.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="peer w-full bg-transparent pl-12 pr-4 py-3.5 text-sm font-medium text-gray-800 placeholder-gray-400 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                {/* Two Columns for Date and Phone */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="ml-1 text-xs font-bold text-brand-dark uppercase tracking-wide">Tanggal Lahir</label>
                    <div className="group relative overflow-hidden rounded-2xl bg-gray-50/80 border border-gray-200 focus-within:border-brand-medium focus-within:bg-white focus-within:ring-4 focus-within:ring-brand-medium/10 transition-all duration-300">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-medium transition-colors">
                        <Calendar className="h-5 w-5" />
                      </div>
                      <input
                        type="date"
                        value={birthDate}
                        onChange={(e) => setBirthDate(e.target.value)}
                        className="peer w-full bg-transparent pl-12 pr-4 py-3.5 text-sm font-medium text-gray-800 placeholder-gray-400 focus:outline-none"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="ml-1 text-xs font-bold text-brand-dark uppercase tracking-wide">No. Telp</label>
                    <div className="group relative overflow-hidden rounded-2xl bg-gray-50/80 border border-gray-200 focus-within:border-brand-medium focus-within:bg-white focus-within:ring-4 focus-within:ring-brand-medium/10 transition-all duration-300">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-medium transition-colors">
                        <Phone className="h-5 w-5" />
                      </div>
                      <input
                        type="tel"
                        placeholder="0812..."
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="peer w-full bg-transparent pl-12 pr-4 py-3.5 text-sm font-medium text-gray-800 placeholder-gray-400 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Sandi */}
                <div className="space-y-1">
                  <label className="ml-1 text-xs font-bold text-brand-dark uppercase tracking-wide">Password</label>
                  <div className="group relative overflow-hidden rounded-2xl bg-gray-50/80 border border-gray-200 focus-within:border-brand-medium focus-within:bg-white focus-within:ring-4 focus-within:ring-brand-medium/10 transition-all duration-300">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-medium transition-colors">
                      <Lock className="h-5 w-5" />
                    </div>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="peer w-full bg-transparent pl-12 pr-4 py-3.5 text-sm font-medium text-gray-800 placeholder-gray-400 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                {/* Role Selection */}
                <div className="space-y-1">
                  <label className="ml-1 text-xs font-bold text-brand-dark uppercase tracking-wide">Daftar Sebagai</label>
                  <div className="grid grid-cols-2 gap-3 p-1 bg-gray-50/80 rounded-2xl border border-gray-200">
                    <label className={`cursor-pointer rounded-xl p-3 text-center transition-all ${role === 'customer' ? 'bg-brand-medium text-white shadow-md' : 'text-gray-500 hover:bg-gray-100'}`}>
                      <input
                        type="radio"
                        name="role"
                        value="customer"
                        checked={role === 'customer'}
                        onChange={(e) => setRole(e.target.value as 'customer' | 'jastiper')}
                        className="hidden"
                      />
                      <span className="text-sm font-bold">Customer</span>
                    </label>
                    <label className={`cursor-pointer rounded-xl p-3 text-center transition-all ${role === 'jastiper' ? 'bg-brand-medium text-white shadow-md' : 'text-gray-500 hover:bg-gray-100'}`}>
                      <input
                        type="radio"
                        name="role"
                        value="jastiper"
                        checked={role === 'jastiper'}
                        onChange={(e) => setRole(e.target.value as 'customer' | 'jastiper')}
                        className="hidden"
                      />
                      <span className="text-sm font-bold">Jastiper</span>
                    </label>
                  </div>
                </div>

                {/* Asal Daerah */}
                <div className="space-y-1">
                  <label className="ml-1 text-xs font-bold text-brand-dark uppercase tracking-wide">Asal Daerah</label>
                  <div className="group relative overflow-hidden rounded-2xl bg-gray-50/80 border border-gray-200 focus-within:border-brand-medium focus-within:bg-white focus-within:ring-4 focus-within:ring-brand-medium/10 transition-all duration-300">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-medium transition-colors">
                      <UserIcon className="h-5 w-5" />
                    </div>
                    <input
                      type="text"
                      placeholder="Contoh: Jakarta, Bandung..."
                      value={asalDaerah}
                      onChange={(e) => setAsalDaerah(e.target.value)}
                      className="peer w-full bg-transparent pl-12 pr-4 py-3.5 text-sm font-medium text-gray-800 placeholder-gray-400 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={storeLoading}
                    className="relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-brand-dark to-brand-green p-[1px] shadow-lg transition-all duration-300 hover:shadow-brand-green/30 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100"
                  >
                    <div className="relative flex items-center justify-center rounded-2xl bg-brand-dark px-4 py-3.5 transition-all duration-300 hover:bg-transparent">
                      <span className="text-sm font-bold text-white tracking-wide">
                        {storeLoading ? 'Mendaftar...' : 'Daftar Sekarang'}
                      </span>
                    </div>
                  </button>
                </div>

                <p className="text-center text-xs text-gray-600 pt-2">
                  Sudah punya akun?{' '}
                  <button
                    type="button"
                    onClick={() => handleSwitchMode('login')}
                    className="font-bold text-brand-green hover:text-brand-dark hover:underline transition-colors"
                  >
                    Masuk
                  </button>
                </p>

              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AuthPage;
