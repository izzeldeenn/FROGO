'use client';

import { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useUser } from '@/contexts/UserContext';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

interface SocialNavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function SocialNavbar({ activeTab, setActiveTab }: SocialNavbarProps) {
  const { theme } = useTheme();
  const { language, t } = useLanguage();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const currentUser = useUser().getCurrentUser();

  return (
    <>
      {/* Compact Header */}
      <header className={`sticky top-0 z-50 border-b ${
        theme === 'light' 
          ? 'bg-white/90 backdrop-blur-sm border-gray-200' 
          : 'bg-gray-800/90 backdrop-blur-sm border-gray-700'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-12">
            {/* Left side - Custom Logo */}
            <div className="flex items-center">
              {/* Custom Logo */}
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                theme === 'light' ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
              }`}>
                ف
              </div>
            </div>

            {/* Right side - Search, Profile, Theme */}
            <div className="flex items-center gap-2">
              {/* Search Bar */}
              <div className={`relative hidden sm:block`}>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={language === 'ar' ? 'بحث...' : 'Search...'}
                  className={`w-48 px-3 py-1.5 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    theme === 'light'
                      ? 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
                      : 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                  }`}
                />
              </div>

              {/* User Profile */}
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-colors ${
                    theme === 'light'
                      ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                  }`}
                >
                  {currentUser?.avatar?.startsWith('http') ? (
                    <img 
                      src={currentUser.avatar} 
                      alt={currentUser.username}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    currentUser?.avatar || '👤'
                  )}
                </button>

                {/* Profile Dropdown */}
                {showProfileMenu && (
                  <div className={`absolute right-0 mt-2 w-56 rounded-lg shadow-lg border py-2 ${
                    theme === 'light'
                      ? 'bg-white border-gray-200'
                      : 'bg-gray-800 border-gray-700'
                  }`}>
                    <div className="px-4 py-3 border-b border-gray-200">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                          theme === 'light' ? 'bg-gray-100' : 'bg-gray-700'
                        }`}>
                          {currentUser?.avatar?.startsWith('http') ? (
                            <img 
                              src={currentUser.avatar} 
                              alt={currentUser.username}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            currentUser?.avatar || '👤'
                          )}
                        </div>
                        <div>
                          <div className={`font-medium ${
                            theme === 'light' ? 'text-gray-900' : 'text-white'
                          }`}>
                            {currentUser?.username || 'مستخدم'}
                          </div>
                          <div className={`text-sm ${
                            theme === 'light' ? 'text-gray-500' : 'text-gray-400'
                          }`}>
                            {language === 'ar' ? 'عرض الملف الشخصي' : 'View Profile'}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => {
                        // Navigate to settings
                        window.location.href = '/focus#settings';
                      }}
                      className={`w-full text-right px-4 py-2 text-sm hover:bg-gray-100 transition-colors ${
                        theme === 'light' ? 'text-gray-700 hover:bg-gray-100' : 'text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      {language === 'ar' ? 'الإعدادات' : 'Settings'}
                    </button>
                  </div>
                )}
              </div>

              {/* Theme Toggle */}
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Search Bar */}
      <div className={`sm:hidden border-b ${
        theme === 'light' ? 'bg-white border-gray-200' : 'bg-gray-800 border-gray-700'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={language === 'ar' ? 'بحث...' : 'Search...'}
            className={`w-full px-3 py-2 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              theme === 'light'
                ? 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
                : 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
            }`}
          />
        </div>
      </div>
    </>
  );
}
