import React from 'react';
import { Search, MessageCircle, MoreVertical, LogOut } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const { logout } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <>
            {/* Desktop Header */}
            <div className="hidden lg:block sticky top-0 z-30 bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <h1 className="text-2xl font-bold text-[#1F605C] cursor-pointer" onClick={() => navigate('/dashboard')}>FlexiTip</h1>
                        <div className="flex items-center gap-6 text-sm text-gray-600">
                            <button className="hover:text-[#159946] font-medium">Lokal</button>
                            <button className="hover:text-[#159946] font-medium">Global</button>
                            <button className="hover:text-[#159946] font-medium">Kategori</button>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center bg-gray-100 rounded-full px-4 py-2 w-96 transition-all focus-within:ring-2 focus-within:ring-[#1F605C]/20">
                            <Search className="h-5 w-5 text-gray-400 mr-2" />
                            <input
                                type="text"
                                placeholder="Cari produk atau jastiper..."
                                className="bg-transparent flex-1 outline-none text-sm placeholder-gray-400"
                            />
                        </div>
                        <button
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            title="Assistant"
                        >
                            <MessageCircle className="h-6 w-6 text-[#1F605C]" />
                        </button>
                        <button onClick={handleLogout} className="p-2 hover:bg-gray-100 rounded-full transition-colors" title="Logout">
                            <LogOut className="h-6 w-6 text-[#1F605C]" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Header (Minimal) */}
            <div className="lg:hidden absolute right-6 top-8 z-20">
                <button onClick={handleLogout} className="rounded-full p-2 text-white/80 hover:bg-white/10 transition-colors bg-black/5" title="Logout">
                    <MoreVertical className="h-6 w-6" />
                </button>
            </div>
        </>
    );
};

export default Navbar;
