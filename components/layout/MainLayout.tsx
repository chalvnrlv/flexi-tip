import React, { ReactNode } from 'react';
import Navbar from './Navbar';
import BottomNav from './BottomNav';

interface MainLayoutProps {
    children: ReactNode;
    showBottomNav?: boolean;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, showBottomNav = true }) => {
    return (
        <div className="min-h-screen w-full bg-white flex flex-col">
            <Navbar />
            <main className="flex-1 w-full relative">
                {children}
            </main>
            {showBottomNav && <BottomNav />}
        </div>
    );
};

export default MainLayout;
