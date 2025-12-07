import React from 'react';
import { Home as HomeIcon, Archive, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const BottomNav = () => {
    const navigate = useNavigate();
    // In a real app, we check location to highlight active tab
    const location = useLocation();

    return (
        <div className="fixed bottom-0 left-0 w-full border-t border-white/20 bg-white/95 backdrop-blur-md pb-8 pt-4 z-50 rounded-t-[25px] shadow-[0_-4px_20px_rgba(0,0,0,0.1)] lg:hidden">
            <div className="flex justify-around items-center">
                <button
                    onClick={() => navigate('/dashboard')}
                    className="flex flex-col items-center gap-1 text-[#06373B]"
                >
                    <HomeIcon className="h-6 w-6 fill-current" />
                    <div className="h-1 w-1 rounded-full bg-[#06373B]"></div>
                </button>
                <button className="flex flex-col items-center gap-1 text-gray-300 hover:text-[#06373B] transition-colors">
                    <Archive className="h-6 w-6" />
                </button>
                <button className="flex flex-col items-center gap-1 text-gray-300 hover:text-[#06373B] transition-colors">
                    <User className="h-6 w-6" />
                </button>
            </div>
        </div>
    );
};

export default BottomNav;
