'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useGamification } from '@/contexts/GamificationContext';
import { useUser } from '@/contexts/UserContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCustomTheme, getThemeClasses } from '@/contexts/CustomThemeContext';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { AuthModal } from '@/components/auth/AuthModal';
import { AccountSwitcher } from '@/components/users/AccountSwitcher';
import { dailyActivityDB } from '@/lib/dailyActivity';
import { ActivityContribution } from '@/lib/dailyActivity';
import { useCustomThemeClasses } from '@/hooks/useCustomThemeClasses';
import { BACKGROUNDS } from '@/constants/backgrounds';

// Generate 250 avatars dynamically
const AVATARS = Array.from({ length: 250 }, (_, i) => 
  `https://api.dicebear.com/7.x/avataaars/svg?seed=avatar${i + 1}`
);

interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  border: string;
}

// Mobile settings sections - same as desktop but optimized for mobile
const MOBILE_SETTINGS_SECTIONS = [
  { id: 'profile', name: 'الملف الشخصي', icon: '👤' },
  { id: 'appearance', name: 'المظهر', icon: '🎨' },
  { id: 'themes', name: 'الثيمات', icon: '🎭' },
  { id: 'account', name: 'الحساب', icon: '🔐' },
];

export function SettingsMobileButton() {
  const { theme } = useTheme();
  const { coins, level, experience } = useGamification();
  const { getCurrentUser, updateUserName, updateUserAvatar, isLoggedIn } = useUser();
  const { language, setLanguage, t } = useLanguage();
  const { currentTheme, setTheme, availableThemes, createCustomTheme, updateThemeColors } = useCustomTheme();
  const customTheme = useCustomThemeClasses();
  const [showSettings, setShowSettings] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showAccountSwitcher, setShowAccountSwitcher] = useState(false);
  const [activeSection, setActiveSection] = useState('profile');
  const [showCustomCreator, setShowCustomCreator] = useState(false);
  const [customColors, setCustomColors] = useState<ThemeColors>({
    primary: '#84cc16',
    secondary: '#fbbf24',
    accent: '#166534',
    background: '#fef3c7',
    surface: '#fde68a',
    text: '#000000',
    border: '#fbbf24'
  });
  const [customThemeName, setCustomThemeName] = useState('');
  const [selectedBackground, setSelectedBackground] = useState('default');
  const [username, setUsername] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('');
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');
  const [activityData, setActivityData] = useState<{ contributions: ActivityContribution[] }>({ contributions: [] });
  const [avatarPage, setAvatarPage] = useState(1);
  const [avatarSearch, setAvatarSearch] = useState('');
  const avatarsPerPage = 12; // Less for mobile

  // Theme-related functions
  const handleColorChange = (colorType: keyof ThemeColors, value: string) => {
    setCustomColors(prev => ({ ...prev, [colorType]: value }));
  };

  const handleCreateCustomTheme = () => {
    if (customThemeName.trim()) {
      createCustomTheme(customThemeName.trim(), customColors);
      setShowCustomCreator(false);
      setCustomThemeName('');
      setCustomColors({
        primary: '#84cc16',
        secondary: '#fbbf24',
        accent: '#166534',
        background: '#fef3c7',
        surface: '#fde68a',
        text: '#000000',
        border: '#fbbf24'
      });
    }
  };

  const handleQuickColorUpdate = () => {
    updateThemeColors(customColors);
  };

  const handleBackgroundSelect = (backgroundId: string) => {
    setSelectedBackground(backgroundId);
    // Store in localStorage for global access
    localStorage.setItem('selectedBackground', backgroundId);
    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent('backgroundChange', { detail: backgroundId }));
  };

  // Load background from localStorage on mount
  useEffect(() => {
    const savedBackground = localStorage.getItem('selectedBackground');
    if (savedBackground) {
      setSelectedBackground(savedBackground);
    }
  }, []);

  const handleSaveSettings = () => {
    if (username.trim()) {
      updateUserName(username.trim());
    }
    if (customAvatarUrl) {
      updateUserAvatar(customAvatarUrl);
    } else if (selectedAvatar) {
      updateUserAvatar(selectedAvatar);
    }
    setShowSettings(false);
  };

  const handleLoadSettings = () => {
    if (currentUser) {
      setUsername(currentUser.username || '');
      // Check if avatar is a URL (starts with http) or from preset avatars
      if (currentUser.avatar?.startsWith('http')) {
        setCustomAvatarUrl(currentUser.avatar);
        setSelectedAvatar('');
      } else {
        setSelectedAvatar(currentUser.avatar || AVATARS[0]);
        setCustomAvatarUrl('');
      }
    }
    setShowSettings(true);
  };

  const currentUser = getCurrentUser();

  // Filter and paginate avatars
  const filteredAvatars = avatarSearch 
    ? AVATARS.filter((_, index) => 
        (index + 1).toString().includes(avatarSearch)
      )
    : AVATARS;

  const totalPages = Math.ceil(filteredAvatars.length / avatarsPerPage);
  const startIndex = (avatarPage - 1) * avatarsPerPage;
  const endIndex = startIndex + avatarsPerPage;
  const currentAvatars = filteredAvatars.slice(startIndex, endIndex);

  // Reset page when search changes
  useEffect(() => {
    setAvatarPage(1);
  }, [avatarSearch]);

  // Fetch user activity data
  useEffect(() => {
    const fetchActivityData = async () => {
      if (currentUser?.id) {
        try {
          const contributions = await dailyActivityDB.getUserActivityContributions(currentUser.id);
          setActivityData({ contributions });
        } catch (error) {
          console.error('Failed to fetch activity data:', error);
          setActivityData({ contributions: [] });
        }
      }
    };

    fetchActivityData();
  }, [currentUser?.id]);

  
  return (
    <>
      {/* Settings Button */}
      <button
        onClick={handleLoadSettings}
        className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
        style={{
          background: `linear-gradient(135deg, ${customTheme.colors.primary}, ${customTheme.colors.accent})`,
          boxShadow: `0 4px 16px ${customTheme.colors.primary}40`
        }}
      >
        <span className="text-white text-lg">⚙️</span>
      </button>

      {/* Settings Modal */}
      {showSettings && (
        <>
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999] transition-opacity duration-300"
            onClick={() => setShowSettings(false)}
          />
          <div 
            className="fixed inset-0 bg-white dark:bg-gray-900 z-[1000] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div 
              className="flex items-center justify-between p-4 border-b flex-shrink-0"
              style={{
                backgroundColor: theme === 'light' ? '#ffffff' : '#1f2937',
                borderBottom: `1px solid ${customTheme.colors.border}`
              }}
            >
              <button
                onClick={() => setShowSettings(false)}
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300"
                style={{
                  backgroundColor: customTheme.colors.surface + '30',
                  color: customTheme.colors.text
                }}
              >
                <span className="text-lg">←</span>
              </button>
              <h2 className="text-lg font-bold" style={{ color: customTheme.colors.text }}>
                الإعدادات
              </h2>
              <button
                onClick={handleSaveSettings}
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300"
                style={{
                  background: `linear-gradient(135deg, ${customTheme.colors.primary}, ${customTheme.colors.accent})`,
                  color: '#ffffff'
                }}
              >
                <span className="text-sm">✓</span>
              </button>
            </div>

            {/* Navigation Tabs */}
            <div 
              className="flex overflow-x-auto p-4 gap-2 flex-shrink-0"
              style={{
                backgroundColor: customTheme.colors.surface + '20'
              }}
            >
              {MOBILE_SETTINGS_SECTIONS.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    activeSection === section.id ? 'text-white' : ''
                  }`}
                  style={{
                    background: activeSection === section.id 
                      ? `linear-gradient(135deg, ${customTheme.colors.primary}, ${customTheme.colors.accent})`
                      : customTheme.colors.surface + '50',
                    color: activeSection === section.id ? '#ffffff' : customTheme.colors.text
                  }}
                >
                  <span className="mr-2">{section.icon}</span>
                  {section.name}
                </button>
              ))}
            </div>

            {/* Content - Scrollable */}
            <div className="flex-1 overflow-y-auto p-4">
              {activeSection === 'profile' && (
                <div className="space-y-4">
                  {/* Username */}
                  <div 
                    className="p-4 rounded-2xl"
                    style={{
                      backgroundColor: customTheme.colors.surface + '30',
                      border: `1px solid ${customTheme.colors.border}30`
                    }}
                  >
                    <label className="block text-sm font-medium mb-2" style={{ color: customTheme.colors.text }}>
                      اسم المستخدم
                    </label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="أدخل اسم المستخدم"
                      className="w-full px-3 py-2 rounded-xl focus:outline-none"
                      style={{
                        backgroundColor: customTheme.colors.surface + '50',
                        color: customTheme.colors.text,
                        border: `1px solid ${customTheme.colors.border}50`
                      }}
                    />
                  </div>

                  {/* Avatar */}
                  <div 
                    className="p-4 rounded-2xl"
                    style={{
                      backgroundColor: customTheme.colors.surface + '30',
                      border: `1px solid ${customTheme.colors.border}30`
                    }}
                  >
                    <label className="block text-sm font-medium mb-3" style={{ color: customTheme.colors.text }}>
                      الصورة الرمزية
                    </label>
                    
                    {/* Custom URL */}
                    <input
                      type="url"
                      value={customAvatarUrl}
                      onChange={(e) => {
                        setCustomAvatarUrl(e.target.value);
                        setSelectedAvatar('');
                      }}
                      placeholder="رابط الصورة المخصص..."
                      className="w-full px-3 py-2 rounded-xl mb-3 focus:outline-none"
                      style={{
                        backgroundColor: customTheme.colors.surface + '50',
                        color: customTheme.colors.text,
                        border: `1px solid ${customTheme.colors.border}50`
                      }}
                    />

                    {/* Avatar Search */}
                    <div className="mb-3">
                      <input
                        type="text"
                        value={avatarSearch}
                        onChange={(e) => setAvatarSearch(e.target.value)}
                        placeholder="بحث بالرقم..."
                        className="w-full px-3 py-2 rounded-xl focus:outline-none"
                        style={{
                          backgroundColor: customTheme.colors.surface + '50',
                          color: customTheme.colors.text,
                          border: `1px solid ${customTheme.colors.border}50`
                        }}
                      />
                    </div>

                    {/* Avatar Grid */}
                    <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto mb-3">
                      {currentAvatars.map((avatar, index) => {
                        const originalIndex = avatarSearch 
                          ? AVATARS.indexOf(avatar) + 1
                          : startIndex + index + 1;
                        return (
                          <button
                            key={avatar}
                            onClick={() => {
                              setSelectedAvatar(avatar);
                              setCustomAvatarUrl('');
                            }}
                            className={`aspect-square rounded-xl overflow-hidden transition-all relative ${
                              selectedAvatar === avatar ? 'ring-2 ring-offset-2' : ''
                            }`}
                            style={{
                              borderColor: selectedAvatar === avatar ? customTheme.colors.primary : 'transparent',
                              boxShadow: selectedAvatar === avatar 
                                ? `0 4px 12px ${customTheme.colors.primary}40` 
                                : '0 2px 4px rgba(0,0,0,0.1)'
                            }}
                            title={`Avatar ${originalIndex}`}
                          >
                            <img 
                              src={avatar} 
                              alt={`Avatar ${originalIndex}`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                              }}
                            />
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent text-white text-xs py-1 opacity-0 hover:opacity-100 transition-opacity">
                              {originalIndex}
                            </div>
                            {selectedAvatar === avatar && (
                              <div 
                                className="absolute top-1 right-1 w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold"
                                style={{
                                  background: `linear-gradient(135deg, ${customTheme.colors.primary}, ${customTheme.colors.accent})`,
                                  color: '#ffffff'
                                }}
                              >
                                ✓
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => setAvatarPage(Math.max(1, avatarPage - 1))}
                          disabled={avatarPage === 1}
                          className="px-3 py-1 rounded-lg text-sm disabled:opacity-50"
                          style={{
                            backgroundColor: avatarPage === 1 ? customTheme.colors.surface + '50' : customTheme.colors.primary,
                            color: avatarPage === 1 ? customTheme.colors.text : '#ffffff'
                          }}
                        >
                          ←
                        </button>
                        <span className="text-sm" style={{ color: customTheme.colors.text }}>
                          {avatarPage}/{totalPages}
                        </span>
                        <button
                          onClick={() => setAvatarPage(Math.min(totalPages, avatarPage + 1))}
                          disabled={avatarPage === totalPages}
                          className="px-3 py-1 rounded-lg text-sm disabled:opacity-50"
                          style={{
                            backgroundColor: avatarPage === totalPages ? customTheme.colors.surface + '50' : customTheme.colors.primary,
                            color: avatarPage === totalPages ? customTheme.colors.text : '#ffffff'
                          }}
                        >
                          →
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeSection === 'appearance' && (
                <div className="space-y-4">
                  {/* Theme Toggle */}
                  <div 
                    className="p-4 rounded-2xl"
                    style={{
                      backgroundColor: customTheme.colors.surface + '30',
                      border: `1px solid ${customTheme.colors.border}30`
                    }}
                  >
                    <label className="block text-sm font-medium mb-3" style={{ color: customTheme.colors.text }}>
                      الوضع الليلي
                    </label>
                    <ThemeToggle />
                  </div>

                  {/* Language */}
                  <div 
                    className="p-4 rounded-2xl"
                    style={{
                      backgroundColor: customTheme.colors.surface + '30',
                      border: `1px solid ${customTheme.colors.border}30`
                    }}
                  >
                    <label className="block text-sm font-medium mb-3" style={{ color: customTheme.colors.text }}>
                      اللغة
                    </label>
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value as 'en' | 'ar')}
                      className="w-full px-3 py-2 rounded-xl focus:outline-none"
                      style={{
                        backgroundColor: customTheme.colors.surface + '50',
                        color: customTheme.colors.text,
                        border: `1px solid ${customTheme.colors.border}50`
                      }}
                    >
                      <option value="en">English</option>
                      <option value="ar">العربية</option>
                    </select>
                  </div>
                </div>
              )}

              {activeSection === 'themes' && (
                <div className="space-y-4">
                  {/* Predefined Themes */}
                  <div 
                    className="p-4 rounded-2xl"
                    style={{
                      backgroundColor: customTheme.colors.surface + '30',
                      border: `1px solid ${customTheme.colors.border}30`
                    }}
                  >
                    <label className="block text-sm font-medium mb-3" style={{ color: customTheme.colors.text }}>
                      الثيمات الجاهزة
                    </label>
                    <div className="space-y-2">
                      {availableThemes.map((themeOption) => (
                        <button
                          key={themeOption.name}
                          onClick={() => setTheme(themeOption)}
                          className={`w-full p-3 rounded-xl text-left transition-all ${
                            currentTheme.name === themeOption.name ? 'text-white' : ''
                          }`}
                          style={{
                            background: currentTheme.name === themeOption.name 
                              ? `linear-gradient(135deg, ${customTheme.colors.primary}, ${customTheme.colors.accent})`
                              : customTheme.colors.surface + '50',
                            color: currentTheme.name === themeOption.name ? '#ffffff' : customTheme.colors.text
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <div className="flex gap-1">
                              <div 
                                className="w-4 h-4 rounded-full border border-gray-300"
                                style={{ backgroundColor: themeOption.colors.primary }}
                              />
                              <div 
                                className="w-4 h-4 rounded-full border border-gray-300"
                                style={{ backgroundColor: themeOption.colors.secondary }}
                              />
                              <div 
                                className="w-4 h-4 rounded-full border border-gray-300"
                                style={{ backgroundColor: themeOption.colors.accent }}
                              />
                            </div>
                            <span className="text-sm font-medium">{themeOption.name}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Custom Theme Creator Button */}
                  <div className="mb-4">
                    <button
                      onClick={() => setShowCustomCreator(!showCustomCreator)}
                      className={`w-full p-3 rounded-xl font-medium transition-all ${
                        showCustomCreator ? 'text-white' : ''
                      }`}
                      style={{
                        background: showCustomCreator 
                          ? `linear-gradient(135deg, ${customTheme.colors.primary}, ${customTheme.colors.accent})`
                          : customTheme.colors.surface + '50',
                        color: showCustomCreator ? '#ffffff' : customTheme.colors.text
                      }}
                    >
                      {showCustomCreator ? 'إغلاق' : 'إنشاء ثيم مخصص'}
                    </button>
                  </div>

                  {/* Custom Theme Creator */}
                  {showCustomCreator && (
                    <div 
                      className="p-4 rounded-2xl"
                      style={{
                        backgroundColor: customTheme.colors.surface + '30',
                        border: `1px solid ${customTheme.colors.border}30`
                      }}
                    >
                      <h4 className="text-lg font-medium mb-3" style={{ color: customTheme.colors.text }}>
                        مصمم الألوان
                      </h4>
                      
                      {/* Theme Name */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium mb-2" style={{ color: customTheme.colors.text }}>
                          اسم الثيم
                        </label>
                        <input
                          type="text"
                          value={customThemeName}
                          onChange={(e) => setCustomThemeName(e.target.value)}
                          placeholder="أدخل اسم الثيم"
                          className="w-full px-3 py-2 rounded-xl focus:outline-none"
                          style={{
                            backgroundColor: customTheme.colors.surface + '50',
                            color: customTheme.colors.text,
                            border: `1px solid ${customTheme.colors.border}50`
                          }}
                        />
                      </div>

                      {/* Color Pickers */}
                      <div className="space-y-3 mb-4">
                        {Object.entries(customColors).map(([key, value]) => (
                          <div key={key}>
                            <label className="block text-sm font-medium mb-1" style={{ color: customTheme.colors.text }}>
                              {key.charAt(0).toUpperCase() + key.slice(1)}
                            </label>
                            <div className="flex items-center gap-2">
                              <input
                                type="color"
                                value={value}
                                onChange={(e) => handleColorChange(key as keyof ThemeColors, e.target.value)}
                                className="w-10 h-10 rounded cursor-pointer"
                              />
                              <input
                                type="text"
                                value={value}
                                onChange={(e) => handleColorChange(key as keyof ThemeColors, e.target.value)}
                                className="flex-1 px-3 py-2 rounded-xl focus:outline-none text-sm"
                                style={{
                                  backgroundColor: customTheme.colors.surface + '50',
                                  color: customTheme.colors.text,
                                  border: `1px solid ${customTheme.colors.border}50`
                                }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <button
                          onClick={handleQuickColorUpdate}
                          className="flex-1 p-2 rounded-xl font-medium transition-all text-sm"
                          style={{
                            background: 'linear-gradient(135deg, #10b981, #059669)',
                            color: '#ffffff'
                          }}
                        >
                          معاينة سريعة
                        </button>
                        <button
                          onClick={handleCreateCustomTheme}
                          disabled={!customThemeName.trim()}
                          className="flex-1 p-2 rounded-xl font-medium transition-all text-sm disabled:opacity-50"
                          style={{
                            background: customThemeName.trim() 
                              ? `linear-gradient(135deg, ${customTheme.colors.primary}, ${customTheme.colors.accent})`
                              : '#6b7280',
                            color: '#ffffff'
                          }}
                        >
                          حفظ الثيم
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Background Selection */}
                  <div 
                    className="p-4 rounded-2xl"
                    style={{
                      backgroundColor: customTheme.colors.surface + '30',
                      border: `1px solid ${customTheme.colors.border}30`
                    }}
                  >
                    <label className="block text-sm font-medium mb-3" style={{ color: customTheme.colors.text }}>
                      خلفية القسم الأيمن
                    </label>
                    
                    {/* Basic Backgrounds */}
                    <div className="mb-4">
                      <h5 className="text-sm font-medium mb-2" style={{ color: customTheme.colors.text + '80' }}>
                        أساسية
                      </h5>
                      <div className="grid grid-cols-2 gap-2">
                        {BACKGROUNDS.filter(bg => ['default', 'gradient1', 'gradient2', 'gradient3', 'gradient4', 'gradient5', 'pattern1', 'pattern2'].includes(bg.id)).map((background) => (
                          <button
                            key={background.id}
                            onClick={() => handleBackgroundSelect(background.id)}
                            className={`p-2 rounded-xl transition-all ${
                              selectedBackground === background.id ? 'ring-2 ring-offset-2' : ''
                            }`}
                            style={{
                              background: selectedBackground === background.id
                                ? `linear-gradient(135deg, ${customTheme.colors.primary}, ${customTheme.colors.accent})`
                                : customTheme.colors.surface + '50'
                            }}
                          >
                            <div 
                              className="w-full h-12 rounded mb-1"
                              style={{ 
                                background: background.value,
                                border: background.value === 'transparent' ? '2px dashed #d1d5db' : 'none'
                              }}
                            />
                            <div className={`text-xs ${
                              selectedBackground === background.id ? 'text-white' : customTheme.colors.text
                            }`}>
                              {background.name}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Focus Images */}
                    <div className="mb-4">
                      <h5 className="text-sm font-medium mb-2" style={{ color: customTheme.colors.text + '80' }}>
                        صور للتركيز
                      </h5>
                      <div className="grid grid-cols-2 gap-2">
                        {BACKGROUNDS.filter(bg => ['focus1', 'focus2', 'focus3', 'focus4', 'focus5'].includes(bg.id)).map((background) => (
                          <button
                            key={background.id}
                            onClick={() => handleBackgroundSelect(background.id)}
                            className={`p-2 rounded-xl transition-all ${
                              selectedBackground === background.id ? 'ring-2 ring-offset-2' : ''
                            }`}
                            style={{
                              background: selectedBackground === background.id
                                ? `linear-gradient(135deg, ${customTheme.colors.primary}, ${customTheme.colors.accent})`
                                : customTheme.colors.surface + '50'
                            }}
                          >
                            <div 
                              className="w-full h-12 rounded mb-1 bg-cover bg-center"
                              style={{ 
                                backgroundImage: background.value,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center'
                              }}
                            />
                            <div className={`text-xs ${
                              selectedBackground === background.id ? 'text-white' : customTheme.colors.text
                            }`}>
                              {background.name}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Animated Backgrounds */}
                    <div>
                      <h5 className="text-sm font-medium mb-2" style={{ color: customTheme.colors.text + '80' }}>
                        خلفيات متحركة
                      </h5>
                      <div className="grid grid-cols-2 gap-2">
                        {BACKGROUNDS.filter(bg => ['animated1', 'animated2', 'animated3', 'animated4', 'animated5', 'animated6', 'animated7', 'animated8', 'animated9', 'animated10'].includes(bg.id)).map((background) => (
                          <button
                            key={background.id}
                            onClick={() => handleBackgroundSelect(background.id)}
                            className={`p-2 rounded-xl transition-all ${
                              selectedBackground === background.id ? 'ring-2 ring-offset-2' : ''
                            }`}
                            style={{
                              background: selectedBackground === background.id
                                ? `linear-gradient(135deg, ${customTheme.colors.primary}, ${customTheme.colors.accent})`
                                : customTheme.colors.surface + '50'
                            }}
                          >
                            <div 
                              className="w-full h-12 rounded"
                              style={{ 
                                background: background.value,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center'
                              }}
                            />
                            <div className={`text-xs ${
                              selectedBackground === background.id ? 'text-white' : customTheme.colors.text
                            }`}>
                              {background.name}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'account' && (
                <div className="space-y-4">
                  <div 
                    className="p-4 rounded-2xl"
                    style={{
                      backgroundColor: customTheme.colors.surface + '30',
                      border: `1px solid ${customTheme.colors.border}30`
                    }}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div 
                        className="w-8 h-8 rounded-xl flex items-center justify-center"
                        style={{
                          background: `linear-gradient(135deg, ${customTheme.colors.primary}, ${customTheme.colors.accent})`,
                          boxShadow: `0 4px 16px ${customTheme.colors.primary}40`
                        }}
                      >
                        <span className="text-white text-sm">🔐</span>
                      </div>
                      <label className="text-sm font-black uppercase tracking-wider" style={{ color: customTheme.colors.text }}>
                        الحساب
                      </label>
                    </div>
                    
                    <div className="space-y-4">
                      {isLoggedIn ? (
                        <div 
                          className="p-4 rounded-xl"
                          style={{ 
                            background: `linear-gradient(135deg, ${customTheme.colors.primary}20, ${customTheme.colors.surface}40)`,
                            border: `1px solid ${customTheme.colors.primary}30`,
                            boxShadow: `0 8px 32px ${customTheme.colors.primary}20`
                          }}>
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-12 h-12 rounded-xl flex items-center justify-center"
                              style={{
                                background: `linear-gradient(135deg, ${customTheme.colors.primary}, ${customTheme.colors.accent})`,
                                boxShadow: `0 8px 32px ${customTheme.colors.primary}40`
                              }}
                            >
                              <span className="text-white text-xl">👤</span>
                            </div>
                            <div>
                              <div className="font-black" style={{ color: customTheme.colors.text }}>
                                {currentUser?.username || 'مستخدم'}
                              </div>
                              <div className="text-sm opacity-80" style={{ color: customTheme.colors.text }}>
                                {currentUser?.email || 'user@example.com'}
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div 
                          className="p-4 rounded-xl"
                          style={{ 
                            background: `linear-gradient(135deg, ${customTheme.colors.surface}40, ${customTheme.colors.background}20)`,
                            border: `1px solid ${customTheme.colors.border}30`,
                            boxShadow: `0 4px 16px ${customTheme.colors.border}15`
                          }}>
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-12 h-12 rounded-xl flex items-center justify-center"
                              style={{
                                background: `linear-gradient(135deg, ${customTheme.colors.border}, ${customTheme.colors.surface})`,
                                boxShadow: `0 4px 16px ${customTheme.colors.border}30`
                              }}
                            >
                              <span className="text-lg">👤</span>
                            </div>
                            <div>
                              <div className="font-medium" style={{ color: customTheme.colors.text }}>
                                حساب ضيف
                              </div>
                              <div className="text-sm opacity-70" style={{ color: customTheme.colors.text }}>
                                قم بترقية الحساب للحفاظ على بياناتك
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <div className="grid grid-cols-2 gap-3">
                        {!isLoggedIn ? (
                          <>
                            <button
                              onClick={() => {
                                setShowSettings(false);
                                setTimeout(() => setShowAuthModal(true), 300);
                              }}
                              className="p-3 rounded-xl font-black transition-all text-sm"
                              style={{
                                background: `linear-gradient(135deg, ${customTheme.colors.primary}, ${customTheme.colors.accent})`,
                                color: '#ffffff',
                                boxShadow: `0 12px 48px ${customTheme.colors.primary}40`
                              }}
                            >
                              تسجيل الدخول
                            </button>
                            <button
                              onClick={() => {
                                setShowSettings(false);
                                setTimeout(() => setShowAuthModal(true), 300);
                              }}
                              className="p-3 rounded-xl font-black transition-all text-sm"
                              style={{
                                background: `linear-gradient(135deg, ${customTheme.colors.surface}, ${customTheme.colors.background})`,
                                color: customTheme.colors.text,
                                boxShadow: `0 8px 32px ${customTheme.colors.border}30`
                              }}
                            >
                              ترقية الحساب
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => {
                              setShowSettings(false);
                              setTimeout(() => setShowAccountSwitcher(true), 300);
                            }}
                            className="p-3 rounded-xl font-black transition-all text-sm"
                            style={{
                              background: `linear-gradient(135deg, ${customTheme.colors.surface}, ${customTheme.colors.background})`,
                              color: customTheme.colors.text,
                              boxShadow: `0 8px 32px ${customTheme.colors.border}30`
                            }}
                          >
                            تبديل الحساب
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal 
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
        />
      )}

      {/* Account Switcher Modal */}
      {showAccountSwitcher && (
        <AccountSwitcher 
          isOpen={showAccountSwitcher}
          onClose={() => setShowAccountSwitcher(false)}
        />
      )}
    </>
  );
}
