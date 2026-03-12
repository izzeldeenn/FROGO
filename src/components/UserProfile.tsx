'use client';

import { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useGamification } from '@/contexts/GamificationContext';
import { useUser } from '@/contexts/UserContext';
import { ThemeToggle } from '@/components/ThemeToggle';

const AVATARS = ['😀', '😎', '🤓', '🦄', '🚀', '⭐', '🌟', '💫', '🔥', '⚡', '🎯', '🏆', '🎨', '🎭', '🎪'];

export function UserProfile() {
  const { theme } = useTheme();
  const { coins, level, experience } = useGamification();
  const { getCurrentDeviceUser, updateDeviceUserName, updateDeviceUserAvatar } = useUser();
  const [showSettings, setShowSettings] = useState(false);
  const [username, setUsername] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('');

  const currentUser = getCurrentDeviceUser();

  const handleSaveSettings = () => {
    if (username.trim()) {
      updateDeviceUserName(username.trim());
    }
    if (selectedAvatar) {
      updateDeviceUserAvatar(selectedAvatar);
    }
    setShowSettings(false);
  };

  const handleLoadSettings = () => {
    if (currentUser) {
      setUsername(currentUser.name || '');
      setSelectedAvatar(currentUser.avatar || '👤');
    }
    setShowSettings(true);
  };

  return (
    <div>
      <button
        onClick={handleLoadSettings}
        className={`flex items-center space-x-3 space-x-reverse p-3 border-2 rounded-xl transition-all duration-200 hover:scale-[1.02] shadow-md hover:shadow-lg ${
          theme === 'light'
            ? 'border-gray-200 bg-white hover:bg-gray-50'
            : 'border-gray-700 bg-gray-900 hover:bg-gray-800'
        }`}
      >
        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold bg-gradient-to-br ${
          theme === 'light'
            ? 'from-blue-400 to-purple-500 text-white'
            : 'from-blue-600 to-purple-700 text-white'
        }`}>
          {currentUser?.avatar || currentUser?.name?.charAt(0).toUpperCase() || '👤'}
        </div>
        
        <div className="text-right flex-1">
          <div className={`text-base font-semibold ${
            theme === 'light' ? 'text-gray-800' : 'text-gray-200'
          }`}>
            {currentUser ? currentUser.name : 'جهاز غير معروف'}
          </div>
          <div className={`text-sm ${
            theme === 'light' ? 'text-gray-600' : 'text-gray-400'
          }`}>
            مستوى {level} • {coins} 🪙
          </div>
        </div>

        <div className={`p-2 rounded-lg transition-colors ${
          theme === 'light'
            ? 'bg-gray-100 hover:bg-gray-200 text-gray-600'
            : 'bg-gray-800 hover:bg-gray-700 text-gray-400'
        }`}>
          ⚙️
        </div>
      </button>

      {showSettings && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
          <div className={`p-8 rounded-3xl max-w-2xl w-full mx-4 shadow-2xl transform transition-all ${
            theme === 'light'
              ? 'bg-white border border-gray-200'
              : 'bg-gray-900 border border-gray-700'
          }`}>
            <div className="flex items-center justify-between mb-8">
              <h3 className={`text-2xl font-bold ${
                theme === 'light' ? 'text-gray-800' : 'text-gray-200'
              }`}>
                إعدادات الملف الشخصي
              </h3>
              <button
                onClick={() => setShowSettings(false)}
                className={`p-2 rounded-full transition-colors ${
                  theme === 'light'
                    ? 'hover:bg-gray-100 text-gray-600'
                    : 'hover:bg-gray-800 text-gray-400'
                }`}
              >
                ✕
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className={`block mb-3 text-lg font-medium ${
                    theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                  }`}>
                    اسم الجهاز
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="أدخل اسم الجهاز"
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors text-lg ${
                      theme === 'light'
                        ? 'border-gray-300 bg-white text-black focus:border-blue-500'
                        : 'border-gray-600 bg-gray-800 text-white focus:border-blue-400'
                    }`}
                  />
                </div>
                
                <div>
                  <label className={`block mb-3 text-lg font-medium ${
                    theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                  }`}>
                    المظهر
                  </label>
                  <div className="flex items-center justify-center p-4 border-2 rounded-xl">
                    <ThemeToggle />
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className={`block mb-3 text-lg font-medium ${
                    theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                  }`}>
                    الأفاتار
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    {AVATARS.map((avatar) => (
                      <button
                        key={avatar}
                        onClick={() => setSelectedAvatar(avatar)}
                        className={`p-3 text-2xl border-2 rounded-xl transition-all duration-200 hover:scale-110 ${
                          selectedAvatar === avatar
                            ? theme === 'light'
                              ? 'border-blue-500 bg-blue-50 shadow-lg shadow-blue-200/50'
                              : 'border-blue-400 bg-blue-900/30 shadow-lg shadow-blue-500/30'
                            : theme === 'light'
                              ? 'border-gray-300 hover:border-gray-400'
                              : 'border-gray-600 hover:border-gray-500'
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
                ? 'border-gray-200 bg-gradient-to-br from-gray-50 to-blue-50'
                : 'border-gray-700 bg-gradient-to-br from-gray-900 to-blue-900/30'
            }`}>
              <h4 className={`font-bold text-xl mb-6 text-center ${
                theme === 'light' ? 'text-gray-800' : 'text-gray-200'
              }`}>إحصائيات الجهاز</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className={`p-4 rounded-xl ${
                  theme === 'light' ? 'bg-white/80' : 'bg-gray-800/50'
                }`}>
                  <div className={`text-2xl font-bold mb-1 ${
                    theme === 'light' ? 'text-yellow-600' : 'text-yellow-400'
                  }`}>{coins}</div>
                  <div className={`text-sm ${
                    theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                  }`}>🪙 عملات</div>
                </div>
                <div className={`p-4 rounded-xl ${
                  theme === 'light' ? 'bg-white/80' : 'bg-gray-800/50'
                }`}>
                  <div className={`text-2xl font-bold mb-1 ${
                    theme === 'light' ? 'text-blue-600' : 'text-blue-400'
                  }`}>{level}</div>
                  <div className={`text-sm ${
                    theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                  }`}>🎯 مستوى</div>
                </div>
                <div className={`p-4 rounded-xl ${
                  theme === 'light' ? 'bg-white/80' : 'bg-gray-800/50'
                }`}>
                  <div className={`text-2xl font-bold mb-1 ${
                    theme === 'light' ? 'text-green-600' : 'text-green-400'
                  }`}>{experience}</div>
                  <div className={`text-sm ${
                    theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                  }`}>⚡ خبرة</div>
                </div>
                <div className={`p-4 rounded-xl ${
                  theme === 'light' ? 'bg-white/80' : 'bg-gray-800/50'
                }`}>
                  <div className={`text-2xl font-bold mb-1 ${
                    theme === 'light' ? 'text-purple-600' : 'text-purple-400'
                  }`}>{currentUser?.rank || 1}</div>
                  <div className={`text-sm ${
                    theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                  }`}>🏆 ترتيب</div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 space-x-reverse mt-8">
              <button
                onClick={() => setShowSettings(false)}
                className={`px-6 py-3 border-2 rounded-xl font-medium transition-all duration-200 text-lg ${
                  theme === 'light'
                    ? 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                    : 'border-gray-600 bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                إلغاء
              </button>
              <button
                onClick={handleSaveSettings}
                className={`px-6 py-3 border-2 rounded-xl font-medium transition-all duration-200 text-lg ${
                  theme === 'light'
                    ? 'border-blue-500 bg-blue-500 text-white hover:bg-blue-600 shadow-lg shadow-blue-200/50'
                    : 'border-blue-600 bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/30'
                }`}
              >
                حفظ التغييرات
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}