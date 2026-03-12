'use client';

import { useTheme } from '@/contexts/ThemeContext';
import { Logo } from '@/components/Logo';
import { UserRankings } from '@/components/UserRankings';
import { CurrentUserSelector } from '@/components/CurrentUserSelector';
import { TimerSelector } from '@/components/TimerSelector';
import { ThemeToggle } from '@/components/ThemeToggle';
import { CoinsButton } from '@/components/CoinsButton';
import { UserProfile } from '@/components/UserProfile';
import { useUser } from '@/contexts/UserContext';

export default function Home() {
  const { theme } = useTheme();

  return (
    <div className={`flex h-screen overflow-hidden ${
      theme === 'light' ? 'bg-white' : 'bg-black'
    }`}>
      {/* Desktop Layout - Side by side */}
      <div className="hidden md:flex w-full h-full">
        {/* Left section - 1/4 width */}
        <div className={`w-1/4 p-6 flex flex-col h-full overflow-y-auto ${
          theme === 'light' 
            ? 'bg-white border-l border-gray-200' 
            : 'bg-black border-l border-gray-800'
        }`}>
          <div className="flex justify-between items-start mb-8 flex-shrink-0">
            <Logo />
      
          </div>
            <CurrentUserSelector />
            <UserRankings />
        </div>
        
        {/* Right section - 3/4 width */}
        <div className="w-3/4 flex items-center justify-center p-8 relative h-full overflow-hidden">
          <div className="absolute top-4 left-4 flex items-center space-x-2 space-x-reverse z-[9998] flex-shrink-0">
            <div className="relative">
              <UserProfile />
            </div>
          </div>
          <TimerSelector />
        </div>
      </div>

      {/* Mobile Layout - Vertical */}
      <div className="md:hidden flex flex-col w-full h-screen overflow-hidden">
        {/* Mobile Header */}
        <div className={`flex justify-between items-center p-4 border-b sticky top-0 z-10 flex-shrink-0 ${
          theme === 'light' 
            ? 'bg-white border-gray-200' 
            : 'bg-black border-gray-800'
        }`}>
          <Logo />
          <div className="flex items-center space-x-1 space-x-reverse">
              <UserProfile />
          </div>
        </div>

        {/* Mobile Content */}
        <div className="flex-1 flex flex-col min-h-0 overflow-y-auto">
          {/* Timer Section - Takes most space */}
          <div className="flex-1 flex items-center justify-center p-4 min-h-[60vh] flex-shrink-0">
            <TimerSelector />
          </div>

          {/* User Section - Bottom */}
          <div className={`p-4 border-t flex-shrink-0 ${
            theme === 'light' 
              ? 'bg-white border-gray-200' 
              : 'bg-black border-gray-800'
          }`}>
            <CurrentUserSelector />
            <div className="mt-4">
              <UserRankings />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
