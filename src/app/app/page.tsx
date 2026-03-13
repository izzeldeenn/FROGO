'use client';

import { useTheme } from '@/contexts/ThemeContext';
import { Logo } from '@/components/Logo';
import { UserRankings } from '@/components/UserRankings';
import { CurrentUserSelector } from '@/components/CurrentUserSelector';
import { TimerSelector } from '@/components/TimerSelector';
import { ThemeToggle } from '@/components/ThemeToggle';
import { UserProfile } from '@/components/UserProfile';
import { useUser } from '@/contexts/UserContext';
import { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Home() {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const [showFullscreenPrompt, setShowFullscreenPrompt] = useState(false);

  useEffect(() => {
    const requestFullscreen = async () => {
      try {
        const elem = document.documentElement;
        
        // Check if fullscreen is already active
        if (document.fullscreenElement) {
          setShowFullscreenPrompt(false);
          return;
        }

        // Try to request fullscreen with user gesture
        if (elem.requestFullscreen) {
          await elem.requestFullscreen();
        } else if ((elem as any).webkitRequestFullscreen) {
          await (elem as any).webkitRequestFullscreen();
        } else if ((elem as any).msRequestFullscreen) {
          await (elem as any).msRequestFullscreen();
        }
        
        setShowFullscreenPrompt(false);
      } catch (error) {
        console.log('Fullscreen request failed:', error);
        // Keep showing prompt if failed
      }
    };

    // Show fullscreen prompt after a short delay
    const timer = setTimeout(() => {
      if (!document.fullscreenElement) {
        setShowFullscreenPrompt(true);
      }
    }, 1000);

    // Add click listener to request fullscreen on first user interaction
    const handleFirstInteraction = () => {
      if (showFullscreenPrompt) {
        requestFullscreen();
      }
    };

    // Listen for fullscreen changes
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        // User exited fullscreen, show prompt again
        setShowFullscreenPrompt(true);
      } else {
        // User entered fullscreen, hide prompt
        setShowFullscreenPrompt(false);
      }
    };

    // Add event listeners
    document.addEventListener('click', handleFirstInteraction);
    document.addEventListener('touchstart', handleFirstInteraction);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, [showFullscreenPrompt]);

  return (
    <div className={`flex h-screen overflow-hidden ${
      theme === 'light' ? 'bg-white' : 'bg-black'
    }`}>
      {/* Fullscreen Prompt Modal */}
      {showFullscreenPrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-[9999] backdrop-blur-sm">
          <div className={`max-w-md mx-4 p-8 rounded-2xl border-2 shadow-2xl transform transition-all duration-300 ${
            theme === 'light' 
              ? 'bg-white border-gray-300' 
              : 'bg-black border-gray-700'
          }`}>
            <div className="text-center">
              <h2 className={`text-2xl font-bold mb-6 ${
                theme === 'light' ? 'text-gray-800' : 'text-white'
              }`}>
                {language === 'ar' ? 'تفعيل وضع ملء الشاشة' : 'Enable Fullscreen Mode'}
              </h2>
              <p className={`text-base mb-8 leading-relaxed ${
                theme === 'light' ? 'text-gray-600' : 'text-gray-400'
              }`}>
                {language === 'ar' 
                  ? 'لضمان تجربة دراسة مركزة ومنع الغش، يرجى تفعيل وضع ملء الشاشة. هذا يساعد على الحفاظ على تركيزك وتجنب الإلهاءات.'
                  : 'To ensure a focused study experience and prevent cheating, please enable fullscreen mode. This helps maintain your concentration and avoid distractions.'
                }
              </p>
              <div className="flex justify-center">
                <button
                  onClick={async () => {
                    try {
                      const elem = document.documentElement;
                      if (elem.requestFullscreen) {
                        await elem.requestFullscreen();
                      } else if ((elem as any).webkitRequestFullscreen) {
                        await (elem as any).webkitRequestFullscreen();
                      } else if ((elem as any).msRequestFullscreen) {
                        await (elem as any).msRequestFullscreen();
                      }
                      setShowFullscreenPrompt(false);
                    } catch (error) {
                      console.log('Fullscreen request failed:', error);
                    }
                  }}
                  className={`px-6 py-3 rounded-lg font-semibold text-base transition-all duration-200 shadow-lg ${
                    theme === 'light'
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                >
                  {language === 'ar' ? 'تفعيل ملء الشاشة' : 'Enable Fullscreen'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
