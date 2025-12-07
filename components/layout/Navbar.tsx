import React, { useState } from 'react';
import { Search, MessageCircle, LogOut } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';
import logoFlexiTip from '../../images/flexi-tip.png';

const Navbar = () => {
    const { logout, user } = useAuthStore();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <>
            {/* Navbar Container */}
            <div className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        {/* Logo & Brand */}
                        <div className="flex items-center gap-8">
                            <div
                                className="flex items-center gap-2 cursor-pointer group"
                                onClick={() => navigate('/dashboard')}
                            >
                                <div className="relative h-10 w-10 overflow-hidden rounded-xl bg-gradient-to-br from-brand-dark to-brand-medium shadow-lg transition-transform group-hover:scale-105">
                                    <img src={logoFlexiTip} alt="Logo" className="h-full w-full object-cover opacity-90" />
                                </div>
                                <span className="text-2xl font-bold bg-gradient-to-r from-brand-dark to-brand-medium bg-clip-text text-transparent tracking-tight">
                                    FlexiTip
                                </span>
                            </div>

                            {/* Desktop Navigation */}
                            <div className="hidden md:flex items-center gap-1">
                                <button className="px-4 py-2 rounded-full text-sm font-medium text-gray-600 hover:text-brand-dark hover:bg-brand-light/10 transition-all">
                                    Lokal
                                </button>
                                <button className="px-4 py-2 rounded-full text-sm font-medium text-gray-600 hover:text-brand-dark hover:bg-brand-light/10 transition-all">
                                    Global
                                </button>
                                <button className="px-4 py-2 rounded-full text-sm font-medium text-gray-600 hover:text-brand-dark hover:bg-brand-light/10 transition-all">
                                    Kategori
                                </button>
                            </div>
                        </div>

                        {/* Search & Actions (Desktop) */}
                        <div className="hidden md:flex items-center gap-4">
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search className="h-4 w-4 text-gray-400 group-focus-within:text-brand-medium transition-colors" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Cari produk..."
                                    className="block w-64 bg-gray-50 border border-gray-200 rounded-full py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-medium/20 focus:border-brand-medium transition-all"
                                />
                            </div>

                            <div className="flex items-center gap-2 border-l border-gray-200 pl-4">
                                <button
                                    className="p-2.5 rounded-full text-gray-500 hover:bg-brand-light/10 hover:text-brand-dark transition-all relative"
                                    title="Pesan"
                                >
                                    <MessageCircle className="h-5 w-5" />
                                    <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 border-2 border-white"></span>
                                </button>

                                <div className="relative group/profile">
                                    <button className="flex items-center gap-2 p-1 pl-2 pr-1 rounded-full hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all">
                                        <span className="text-xs font-semibold text-gray-700">{user?.name?.split(' ')[0]}</span>
                                        <div className="h-8 w-8 rounded-full bg-brand-light/20 flex items-center justify-center overflow-hidden border border-gray-100">
                                            {user?.avatar ? (
                                                <img src={user.avatar} alt="Avatar" className="h-full w-full object-cover" />
                                            ) : (
                                                <span className="text-brand-dark font-bold text-xs">{user?.name?.charAt(0)}</span>
                                            )}
                                        </div>
                                    </button>

                                    {/* Dropdown Menu (Logout) */}
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-1 border border-gray-100 opacity-0 invisible group-hover/profile:opacity-100 group-hover/profile:visible transition-all transform origin-top-right z-50">
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                        >
                                            <LogOut className="h-4 w-4" />
                                            Keluar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="md:hidden flex items-center">
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                            >
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    {isMobileMenuOpen ? (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    ) : (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    )}
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu Dropdown */}
                <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="px-4 pt-2 pb-4 space-y-3 bg-white border-t border-gray-100 shadow-lg">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Cari..."
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-medium"
                            />
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                            <button className="py-2 rounded-lg bg-gray-50 text-sm font-medium text-gray-700 hover:bg-brand-light/20 hover:text-brand-dark">Lokal</button>
                            <button className="py-2 rounded-lg bg-gray-50 text-sm font-medium text-gray-700 hover:bg-brand-light/20 hover:text-brand-dark">Global</button>
                            <button className="py-2 rounded-lg bg-gray-50 text-sm font-medium text-gray-700 hover:bg-brand-light/20 hover:text-brand-dark">Kiri</button>
                        </div>

                        <div className="border-t border-gray-100 pt-3 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="h-9 w-9 rounded-full bg-gray-200 overflow-hidden">
                                    {user?.avatar && <img src={user.avatar} alt="Avatar" className="h-full w-full object-cover" />}
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-gray-900">{user?.name}</p>
                                    <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                                </div>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="p-2 rounded-full bg-red-50 text-red-600 hover:bg-red-100"
                            >
                                <LogOut className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Navbar;
