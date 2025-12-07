
import React from 'react';
import { ArrowRight } from 'lucide-react';
import logoFlexiTip from '../images/flexi-tip.png';

interface WelcomePageProps {
  onNavigateToLogin: () => void;
}

const WelcomePage: React.FC<WelcomePageProps> = ({ onNavigateToLogin }) => {
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-between overflow-hidden bg-gradient-to-b from-brand-darkest to-brand-teal text-white">

      {/* Content Center */}
      <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
        <div className="relative mb-12">
          {/* Decorative Circles/Glow behind image */}
          <div className="absolute left-1/2 top-1/2 -z-10 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/10 blur-3xl"></div>

          <img
            src={logoFlexiTip}
            alt="FlexiTip Logo"
            className="h-64 w-64 rounded-3xl object-cover shadow-[12px_20px_15px_rgba(0,0,0,0.25)] rotate-3 hover:rotate-0 transition-transform duration-500"
          />
        </div>

        <h1 className="mb-4 text-4xl font-bold tracking-tight text-white drop-shadow-md">
          FlexiTip
        </h1>
        <p className="max-w-xs text-sm text-brand-light/90">
          Titip beli barang dari seluruh dunia dengan mudah dan aman.
        </p>
      </div>

      {/* Bottom Action Area */}
      <div className="w-full pb-16 pt-8">
        <div className="relative mx-auto w-full max-w-xs">
          <button
            onClick={onNavigateToLogin}
            className="group relative flex w-full items-center justify-between rounded-full bg-white py-3 pl-8 pr-2 shadow-lg transition-all hover:scale-105 active:scale-95"
          >
            <span className="text-lg font-medium text-brand-darkest">Masuk</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-dark text-white transition-colors group-hover:bg-brand-medium">
              <ArrowRight className="h-5 w-5" />
            </div>
          </button>

          <div className="mt-6 flex justify-center gap-1">
            <div className="h-1.5 w-1.5 rounded-full bg-white/40"></div>
            <div className="h-1.5 w-4 rounded-full bg-white"></div>
            <div className="h-1.5 w-1.5 rounded-full bg-white/40"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
