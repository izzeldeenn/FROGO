'use client';

import { useTheme } from '@/contexts/ThemeContext';
import { Logo } from '@/components/Logo';
import { UserRankings } from '@/components/UserRankings';
import { CurrentUserSelector } from '@/components/CurrentUserSelector';
import { SettingsButton } from '@/components/SettingsButton';
import { TimerSelector } from '@/components/TimerSelector';
import { ThemeToggle } from '@/components/ThemeToggle';
import { UserProfile } from '@/components/UserProfile';
import { FullscreenPrompt } from '@/components/FullscreenPrompt';
import { FullscreenProvider } from '@/contexts/FullscreenContext';
import { CustomThemeProvider } from '@/contexts/CustomThemeContext';
import { ThemeSelector } from '@/components/ThemeSelector';
import { useCustomThemeClasses } from '@/hooks/useCustomThemeClasses';
import { useUser } from '@/contexts/UserContext';
import { useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useState } from 'react';

function HomeContent() {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const { setTimerActive } = useUser();
  const customTheme = useCustomThemeClasses();
  const [showThemeSelector, setShowThemeSelector] = useState(false);

  useEffect(() => {
    // Listen for fullscreen changes
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        // User exited fullscreen, stop timer
        setTimerActive(false);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, [setTimerActive]);

  return (
    <>
    <div className={`flex h-screen overflow-hidden ${
      theme === 'light' ? 'bg-white' : 'bg-black'
    }`}>
      <FullscreenPrompt />

      {/* Desktop Layout - Side by side */}
      <div className="hidden md:flex w-full h-full">
        {/* Left section - 1/4 width */}
        <div 
          className="w-1/4 p-6 flex flex-col h-full overflow-y-auto"
          style={{
            backgroundColor: customTheme.colors.surface,
            borderLeft: `2px solid ${customTheme.colors.border}`
          }}
        >
          <div className="flex justify-between items-start mb-6 flex-shrink-0">
            <Logo />
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowThemeSelector(true)}
                className="p-2 rounded-lg transition-colors"
                style={{
                  backgroundColor: 'transparent',
                  color: customTheme.colors.text
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = customTheme.colors.primary;
                  e.currentTarget.style.color = '#ffffff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = customTheme.colors.text;
                }}
                title={language === 'ar' ? 'تخصيص الثيم' : 'Customize Theme'}
              >
                🎨
              </button>
              <SettingsButton />
            </div>
          </div>
          <CurrentUserSelector />
          <UserRankings />
        </div>
        
        {/* Right section - 3/4 width */}
        <div className="w-3/4 flex items-center justify-center p-8 relative h-full overflow-hidden">
          <div className="absolute top-4 left-4 flex items-center space-x-2 space-x-reverse z-[9998] flex-shrink-0">
       
          </div>
          <TimerSelector />
        </div>
      </div>

      {/* Mobile Layout - Vertical */}
      <div className="md:hidden flex flex-col w-full h-screen overflow-hidden">
        {/* Mobile Header */}
        <div 
          className="flex justify-between items-center p-4 border-b sticky top-0 z-10 flex-shrink-0"
          style={{
            backgroundColor: customTheme.colors.surface,
            borderColor: customTheme.colors.border
          }}
        >
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
          <div 
            className="p-4 border-t flex-shrink-0"
            style={{
              backgroundColor: customTheme.colors.surface,
              borderColor: customTheme.colors.border
            }}
          >
            <CurrentUserSelector />
            <div className="mt-4">
              <UserRankings />
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Theme Selector Modal */}
    {showThemeSelector && (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
        <div className="w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-3xl shadow-2xl">
          <div className={`p-6 border-b ${
            theme === 'light' ? 'bg-white border-gray-200' : 'bg-gray-900 border-gray-700'
          }`}>
            <div className="flex items-center justify-between">
              <h3 className={`text-2xl font-bold ${
                theme === 'light' ? 'text-gray-800' : 'text-gray-200'
              }`}>
                {language === 'ar' ? 'تخصيص الثيم' : 'Theme Customization'}
              </h3>
              <button
                onClick={() => setShowThemeSelector(false)}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                  theme === 'light'
                    ? 'hover:bg-gray-100 text-gray-600'
                    : 'hover:bg-gray-800 text-gray-400'
                }`}
              >
                ✕
              </button>
            </div>
          </div>
          <div className="overflow-y-auto max-h-[calc(90vh-100px)]">
            <ThemeSelector />
          </div>
        </div>
      </div>
    )}
    </>
  );
}

export default function Home() {
  return (
    <CustomThemeProvider>
      <FullscreenProvider>
        <HomeContent />
      </FullscreenProvider>
    </CustomThemeProvider>
  );
}
