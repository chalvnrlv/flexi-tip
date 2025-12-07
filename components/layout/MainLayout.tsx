import React, { ReactNode } from 'react';
import Navbar from './Navbar';
import BottomNav from './BottomNav';

interface MainLayoutProps {
    children: ReactNode;
    showBottomNav?: boolean;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, showBottomNav = true }) => {
    return (
        <div className="min-h-screen w-full bg-white flex flex-col relative overflow-hidden">
            {/* Minimalistic Background Ellipses */}
            <div className="fixed top-[-20%] left-[-10%] w-[600px] h-[600px] bg-brand-medium/10 rounded-full blur-[100px] pointer-events-none z-0 mix-blend-multiply opacity-70" />
            <div className="fixed bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-brand-light/20 rounded-full blur-[100px] pointer-events-none z-0 mix-blend-multiply opacity-70" />

            <div className="relative z-10 flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-1 w-full relative">
                    {children}
                </main>
                {showBottomNav && <BottomNav />}
            </div>
        </div>
    );
};

export default MainLayout;
