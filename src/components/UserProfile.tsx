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
    alert('تم حفظ الإعدادات بنجاح!');
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
        className={`flex items-center space-x-2 space-x-reverse p-2 border-2 rounded-lg transition-all duration-200 hover:scale-105 h-14 ${
          theme === 'light'
            ? 'border-gray-300 bg-white hover:bg-gray-50'
            : 'border-gray-600 bg-black hover:bg-gray-800'
        }`}
      >
        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold ${
          theme === 'light'
            ? 'bg-blue-500 text-white'
            : 'bg-blue-600 text-white'
        }`}>
          {currentUser?.avatar || currentUser?.name?.charAt(0).toUpperCase() || '👤'}
        </div>
        
        <div className="text-right">
          <div className={`text-sm font-medium ${
            theme === 'light' ? 'text-black' : 'text-white'
          }`}>
            {currentUser ? currentUser.name : 'جهاز غير معروف'}
          </div>
          <div className={`text-xs ${
            theme === 'light' ? 'text-gray-600' : 'text-gray-400'
          }`}>
            مستوى {level} • {coins} عملة
          </div>
        </div>
      </button>

      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
          <div className={`p-6 border-2 rounded-lg max-w-md w-full mx-4 ${
            theme === 'light'
              ? 'border-gray-300 bg-white'
              : 'border-gray-600 bg-black'
          }`}>
            <h3 className={`text-lg font-bold mb-4 ${
              theme === 'light' ? 'text-black' : 'text-white'
            }`}>إعدادات الجهاز</h3>
            
            <div className="space-y-4">
              <div>
                <label className={`block mb-2 text-sm font-medium ${
                  theme === 'light' ? 'text-black' : 'text-white'
                }`}>
                  اسم الجهاز
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="أدخل اسم الجهاز"
                  className={`w-full px-3 py-2 border-2 rounded focus:outline-none ${
                    theme === 'light'
                      ? 'border-gray-300 bg-white text-black focus:border-black'
                      : 'border-gray-600 bg-black text-white focus:border-white'
                  }`}
                />
              </div>
              
              <div>
                <label className={`block mb-2 text-sm font-medium ${
                  theme === 'light' ? 'text-black' : 'text-white'
                }`}>
                  المظهر
                </label>
                <div className="flex items-center justify-center p-2 border-2 rounded-lg">
                  <ThemeToggle />
                </div>
              </div>
              
              <div>
                <label className={`block mb-2 text-sm font-medium ${
                  theme === 'light' ? 'text-black' : 'text-white'
                }`}>
                  الأفاتار
                </label>
                <div className="grid grid-cols-8 gap-2">
                  {AVATARS.map((avatar) => (
                    <button
                      key={avatar}
                      onClick={() => setSelectedAvatar(avatar)}
                      className={`p-2 text-2xl border-2 rounded transition-colors ${
                        selectedAvatar === avatar
                          ? theme === 'light'
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-blue-400 bg-blue-900/30'
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

            <div className={`p-4 border-2 rounded-lg mb-4 ${
              theme === 'light'
                ? 'border-gray-200 bg-gray-50'
                : 'border-gray-700 bg-gray-900'
            }`}>
              <h4 className={`font-bold mb-3 text-center ${
                theme === 'light' ? 'text-black' : 'text-white'
              }`}>إحصائيات الجهاز</h4>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className={`text-2xl font-bold ${
                    theme === 'light' ? 'text-yellow-600' : 'text-yellow-400'
                  }`}>{coins}</div>
                  <div className={`text-sm ${
                    theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                  }`}>عملات</div>
                </div>
                <div>
                  <div className={`text-2xl font-bold ${
                    theme === 'light' ? 'text-blue-600' : 'text-blue-400'
                  }`}>{level}</div>
                  <div className={`text-sm ${
                    theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                  }`}>مستوى</div>
                </div>
                <div>
                  <div className={`text-2xl font-bold ${
                    theme === 'light' ? 'text-green-600' : 'text-green-400'
                  }`}>{experience}</div>
                  <div className={`text-sm ${
                    theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                  }`}>نقاط خبرة</div>
                </div>
                <div>
                  <div className={`text-2xl font-bold ${
                    theme === 'light' ? 'text-purple-600' : 'text-purple-400'
                  }`}>{currentUser?.rank || 1}</div>
                  <div className={`text-sm ${
                    theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                  }`}>ترتيب</div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2 space-x-reverse mt-6">
              <button
                onClick={() => setShowSettings(false)}
                className={`px-4 py-2 border-2 rounded font-medium transition-colors ${
                  theme === 'light'
                    ? 'border-gray-300 bg-white text-black hover:bg-gray-100'
                    : 'border-gray-600 bg-black text-white hover:bg-gray-800'
                }`}
              >
                إلغاء
              </button>
              <button
                onClick={handleSaveSettings}
                className={`px-4 py-2 border-2 rounded font-medium transition-colors ${
                  theme === 'light'
                    ? 'border-green-600 bg-green-600 text-white hover:bg-green-700'
                    : 'border-green-500 bg-green-500 text-white hover:bg-green-600'
                }`}
              >
                حفظ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}