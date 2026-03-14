'use client';

import { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useGamification } from '@/contexts/GamificationContext';
import { useUser } from '@/contexts/UserContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useCustomThemeClasses } from '@/hooks/useCustomThemeClasses';

const AVATARS = ['😀', '😎', '🤓', '🦄', '🚀', '⭐', '🌟', '💫', '🔥', '⚡', '🎯', '🏆', '🎨', '🎭', '🎪'];

export function UserProfile() {
  const { theme } = useTheme();
  const { coins, level, experience } = useGamification();
  const { getCurrentUser, updateUserName, updateUserAvatar } = useUser();
  const { language, setLanguage, t } = useLanguage();
  const customTheme = useCustomThemeClasses();
  const [showSettings, setShowSettings] = useState(false);
  const [username, setUsername] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('');

  const currentUser = getCurrentUser();

  const handleSaveSettings = () => {
    if (username.trim()) {
      updateUserName(username.trim());
    }
    if (selectedAvatar) {
      updateUserAvatar(selectedAvatar);
    }
    setShowSettings(false);
  };

  const handleLoadSettings = () => {
    if (currentUser) {
      setUsername(currentUser.username || '');
      setSelectedAvatar(currentUser.avatar || '👤');
    }
    setShowSettings(true);
  };

  return (
    <div>
      <button
        onClick={handleLoadSettings}
        className="flex items-center space-x-3 space-x-reverse p-3 border-2 rounded-xl transition-all duration-200 hover:scale-[1.02] shadow-md hover:shadow-lg"
        style={{
          borderColor: customTheme.colors.border,
          backgroundColor: theme === 'light' ? '#ffffff' : '#000000',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = customTheme.colors.surface;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = theme === 'light' ? '#ffffff' : '#000000';
        }}
      >
        <div 
          className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold"
          style={{
            background: `linear-gradient(to bottom right, ${customTheme.colors.primary}, ${customTheme.colors.secondary})`,
            color: '#ffffff'
          }}
        >
          {currentUser?.avatar || currentUser?.username?.charAt(0).toUpperCase() || '👤'}
        </div>
        
        <div className="text-right flex-1">
          <div className={`text-base font-semibold ${
            theme === 'light' ? 'text-gray-800' : 'text-gray-200'
          }`}>
            {currentUser ? currentUser.username : t.unknownDevice}
          </div>
          <div className={`text-sm ${
            theme === 'light' ? 'text-gray-600' : 'text-gray-400'
          }`}>
            {t.levelText} {level} • {coins} 🪙
          </div>
        </div>

        <div className={`p-2 rounded-lg transition-colors ${
          theme === 'light'
            ? 'bg-yellow-100 hover:bg-yellow-200 text-yellow-700'
            : 'bg-yellow-900 hover:bg-yellow-800 text-yellow-300'
        }`}>
          ⚙️
        </div>
      </button>

      {showSettings && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
          <div className={`p-8 rounded-3xl max-w-2xl w-full mx-4 shadow-2xl transform transition-all max-h-[90vh] overflow-y-auto ${
            theme === 'light'
              ? 'bg-white border border-yellow-200'
              : 'bg-black border border-yellow-800'
          }`}>
            <div className="flex items-center justify-between mb-8">
              <h3 className={`text-2xl font-bold ${
                theme === 'light' ? 'text-gray-800' : 'text-gray-200'
              }`}>
                {t.settings}
              </h3>
              <button
                onClick={() => setShowSettings(false)}
                className={`p-2 rounded-full transition-colors ${
                  theme === 'light'
                    ? 'hover:bg-yellow-100 text-yellow-700'
                    : 'hover:bg-yellow-900 text-yellow-300'
                }`}
              >
                ✕
              </button>
            </div>
            
            <div className="flex flex-col gap-8">
              <div className="space-y-6">
                <div>
                  <label className={`block mb-3 text-lg font-medium ${
                    theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                  }`}>
                    {t.deviceName}
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder={t.enterDeviceName}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors text-lg ${
                      theme === 'light'
                        ? 'border-yellow-300 bg-white text-black focus:border-green-500'
                        : 'border-yellow-600 bg-black text-white focus:border-green-400'
                    }`}
                  />
                </div>
                
                <div>
                  <label className={`block mb-3 text-lg font-medium ${
                    theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                  }`}>
                    {t.appearance}
                  </label>
                  <div className="flex items-center justify-center p-4 border-2 rounded-xl ${
                    theme === 'light' ? 'border-yellow-200' : 'border-yellow-800'
                  }">
                    <ThemeToggle />
                  </div>
                </div>

                <div>
                  <label className={`block mb-3 text-lg font-medium ${
                    theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                  }`}>
                    {t.language}
                  </label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value as 'en' | 'ar')}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors text-lg ${
                      theme === 'light'
                        ? 'border-yellow-300 bg-white text-black focus:border-green-500'
                        : 'border-yellow-600 bg-black text-white focus:border-green-400'
                    }`}
                  >
                    <option value="en">English</option>
                    <option value="ar">العربية</option>
                  </select>
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className={`block mb-3 text-lg font-medium ${
                    theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                  }`}>
                    {t.avatar}
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    {AVATARS.map((avatar) => (
                      <button
                        key={avatar}
                        onClick={() => setSelectedAvatar(avatar)}
                        className={`p-3 text-2xl border-2 rounded-xl transition-all duration-200 hover:scale-110 ${
                          selectedAvatar === avatar
                            ? theme === 'light'
                              ? 'border-green-500 bg-green-50 shadow-lg shadow-green-200/50'
                              : 'border-green-400 bg-green-900/30 shadow-lg shadow-green-500/30'
                            : theme === 'light'
                              ? 'border-yellow-300 hover:border-yellow-400'
                              : 'border-yellow-600 hover:border-yellow-500'
                        }`}
                      >
                        {avatar}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className={`p-6 border-2 rounded-xl mt-8 ${
              theme === 'light'
                ? 'border-yellow-200 bg-gradient-to-br from-yellow-50 to-green-50'
                : 'border-yellow-800 bg-gradient-to-br from-yellow-950 to-green-950/30'
            }`}>
              <h4 className={`font-bold text-xl mb-6 text-center ${
                theme === 'light' ? 'text-gray-800' : 'text-gray-200'
              }`}>{t.statistics}</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className={`p-4 rounded-xl ${
                  theme === 'light' ? 'bg-white/80' : 'bg-gray-800/50'
                }`}>
                  <div className={`text-2xl font-bold mb-1 ${
                    theme === 'light' ? 'text-yellow-600' : 'text-yellow-400'
                  }`}>{coins}</div>
                  <div className={`text-sm ${
                    theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                  }`}>🪙 {t.coins}</div>
                </div>
                <div className={`p-4 rounded-xl ${
                  theme === 'light' ? 'bg-white/80' : 'bg-gray-800/50'
                }`}>
                  <div className={`text-2xl font-bold mb-1 ${
                    theme === 'light' ? 'text-green-600' : 'text-green-400'
                  }`}>{level}</div>
                  <div className={`text-sm ${
                    theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                  }`}>🎯 {t.level}</div>
                </div>
                <div className={`p-4 rounded-xl ${
                  theme === 'light' ? 'bg-white/80' : 'bg-gray-800/50'
                }`}>
                  <div className={`text-2xl font-bold mb-1 ${
                    theme === 'light' ? 'text-yellow-600' : 'text-yellow-400'
                  }`}>{experience}</div>
                  <div className={`text-sm ${
                    theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                  }`}>⚡ {t.experience}</div>
                </div>
                <div className={`p-4 rounded-xl ${
                  theme === 'light' ? 'bg-white/80' : 'bg-gray-800/50'
                }`}>
                  <div className={`text-2xl font-bold mb-1 ${
                    theme === 'light' ? 'text-green-600' : 'text-green-400'
                  }`}>{currentUser?.rank || 1}</div>
                  <div className={`text-sm ${
                    theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                  }`}>🏆 {t.rank}</div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 space-x-reverse mt-8 sticky bottom-0 bg-inherit py-4">
              <button
                onClick={() => setShowSettings(false)}
                className={`px-6 py-3 border-2 rounded-xl font-medium transition-all duration-200 text-lg ${
                  theme === 'light'
                    ? 'border-yellow-300 bg-white text-yellow-700 hover:bg-yellow-50'
                    : 'border-yellow-600 bg-black text-yellow-300 hover:bg-yellow-950'
                }`}
              >
                {t.cancel}
              </button>
              <button
                onClick={handleSaveSettings}
                className={`px-6 py-3 border-2 rounded-xl font-medium transition-all duration-200 text-lg ${
                  theme === 'light'
                    ? 'border-green-500 bg-green-500 text-white hover:bg-green-600 shadow-lg shadow-green-200/50'
                    : 'border-green-600 bg-green-600 text-white hover:bg-green-700 shadow-lg shadow-green-500/30'
                }`}
              >
                {t.saveChanges}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}