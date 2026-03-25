'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useGamification } from '@/contexts/GamificationContext';
import { useUser } from '@/contexts/UserContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCustomTheme, getThemeClasses } from '@/contexts/CustomThemeContext';
import { ThemeToggle } from '@/components/ThemeToggle';
import { AuthModal } from '@/components/AuthModal';
import { AccountSwitcher } from '@/components/AccountSwitcher';
import { dailyActivityDB } from '@/lib/dailyActivity';
import { ActivityContribution } from '@/lib/dailyActivity';
import { useCustomThemeClasses } from '@/hooks/useCustomThemeClasses';

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

const BACKGROUNDS = [
  { id: 'default', name: 'افتراضي', value: 'transparent' },
  { id: 'gradient1', name: 'تدرج أخضر', value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
  { id: 'gradient2', name: 'تدرج أزرق', value: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
  { id: 'gradient3', name: 'تدرج برتقالي', value: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' },
  { id: 'gradient4', name: 'تدرج بنفسجي', value: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)' },
  { id: 'gradient5', name: 'تدرج رمادي', value: 'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)' },
  { id: 'pattern1', name: 'نقوش بسيط', value: 'repeating-linear-gradient(45deg, #606dbc 25%, transparent 25%), repeating-linear-gradient(-45deg, #606dbc 25%, transparent 25%)' },
  { id: 'pattern2', name: 'نقوش متقاطع', value: 'repeating-linear-gradient(90deg, #667eea 0%, #764ba2 50%, #667eea 100%)' },
  // Focus-friendly commercial backgrounds
  { id: 'focus1', name: 'غابة مركزة', value: 'url("https://images.unsplash.com/photo-1540206395-68808572332f?w=1920&h=1080&fit=crop&crop=entropy&cs=tinysrgb")' },
  { id: 'focus2', name: 'مكتبة هادئة', value: 'url("https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1920&h=1080&fit=crop&crop=entropy&cs=tinysrgb")' },
  { id: 'focus3', name: 'سماء صافية', value: 'url("https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop&crop=entropy&cs=tinysrgb")' },
  { id: 'focus4', name: 'طبيعة calm', value: 'url("https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1920&h=1080&fit=crop&crop=entropy&cs=tinysrgb")' },
  { id: 'focus5', name: 'محيط طبيعي', value: 'url("https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&h=1080&fit=crop&crop=entropy&cs=tinysrgb")' },
  // Animated focus backgrounds
  { id: 'animated1', name: 'غيوم متحرك', value: 'url("https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3YzYyaWJyMXQ0YWtyYzFyZWVvdDFha3M1bWFkeTg0c3F6YmszeWYwdSZlcD12MV9naWZzX3JlbGF0ZWQmY3Q9Zw/SjkNtYAuV4OXbRIGEc/giphy.gif")' },
  { id: 'animated2', name: 'مطر متحركة', value: 'url("https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3YzYyaWJyMXQ0YWtyYzFyZWVvdDFha3M1bWFkeTg0c3F6YmszeWYwdSZlcD12MV9naWZzX3JlbGF0ZWQmY3Q9Zw/LlDxkLadoRcmlcMbP8/giphy.gif")' },
  { id: 'animated3', name: 'نجوم ساقطة', value: 'url("https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3Y2Z3eTNmdm5qcjY0enNhdWwwbjY5aDFiZ2tzc3AycjM3MG5ma3VucSZlcD12MV9naWZzX3JlbGF0ZWQmY3Q9Zw/jDl06sVsg4WVrCEJtS/giphy.gif")' },
  { id: 'animated4', name: 'موجات متحركة', value: 'url("https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3Y2Z3eTNmdm5qcjY0enNhdWwwbjY5aDFiZ2tzc3AycjM3MG5ma3VucSZlcD12MV9naWZzX3JlbGF0ZWQmY3Q9Zw/j3OL6mSc2FeV0UHMDg/giphy.gif")' },
  { id: 'animated5', name: 'غيوم لطيف', value: 'url("https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3YzYyaWJyMXQ0YWtyYzFyZWVvdDFha3M1bWFkeTg0c3F6YmszeWYwdSZlcD12MV9naWZzX3JlbGF0ZWQmY3Q9Zw/LXxWO0pgGEma8W40A9/giphy.gif")' },
  // Additional animated backgrounds
  { id: 'animated6', name: 'غابة متحركة', value: 'url("https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3YzYyaWJyMXQ0YWtyYzFyZWVvdDFha3M1bWFkeTg0c3F6YmszeWYwdSZlcD12MV9naWZzX3JlbGF0ZWQmY3Q9Zw/SjkNtYAuV4OXbRIGEc/giphy.gif")' },
  { id: 'animated7', name: 'مطر هادئ', value: 'url("https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3YzYyaWJyMXQ0YWtyYzFyZWVvdDFha3M1bWFkeTg0c3F6YmszeWYwdSZlcD12MV9naWZzX3JlbGF0ZWQmY3Q9Zw/LlDxkLadoRcmlcMbP8/giphy.gif")' },
  { id: 'animated8', name: 'نجوم لامعة', value: 'url("https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3Y2Z3eTNmdm5qcjY0enNhdWwwbjY5aDFiZ2tzc3AycjM3MG5ma3VucSZlcD12MV9naWZzX3JlbGF0ZWQmY3Q9Zw/jDl06sVsg4WVrCEJtS/giphy.gif")' },
  { id: 'animated9', name: 'أمواج هادئة', value: 'url("https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3Y2Z3eTNmdm5qcjY0enNhdWwwbjY5aDFiZ2tzc3AycjM3MG5ma3VucSZlcD12MV9naWZzX3JlbGF0ZWQmY3Q9Zw/j3OL6mSc2FeV0UHMDg/giphy.gif")' },
  { id: 'animated10', name: 'غيوم ناعمة', value: 'url("https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3Y2Z3eTNmdm5qcjY0enNhdWwwbjY5aDFiZ2tzc3AycjM3MG5ma3VucSZlcD12MV9naWZzX3JlbGF0ZWQmY3Q9Zw/LXxWO0pgGEma8W40A9/giphy.gif")' }
];

// Settings sections configuration
const SETTINGS_SECTIONS = [
  { id: 'profile', name: 'الملف الشخصي', icon: '👤' },
  { id: 'appearance', name: 'المظهر', icon: '🎨' },
  { id: 'themes', name: 'الثيمات', icon: '🎭' },
  { id: 'account', name: 'الحساب', icon: '🔐' },
];

export function SettingsButton() {
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
  const avatarsPerPage = 20;

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

  return (
    <>
      <button
        onClick={handleLoadSettings}
        className="p-2 rounded-xl transition-all duration-200 hover:scale-110"
        style={{
          backgroundColor: customTheme.colors.surface,
          color: customTheme.colors.text
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = customTheme.colors.primary;
          e.currentTarget.style.color = '#ffffff';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = customTheme.colors.surface;
          e.currentTarget.style.color = customTheme.colors.text;
        }}
      >
        ⚙️
      </button>

      {showSettings && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998] transition-opacity duration-300"
            onClick={() => setShowSettings(false)}
          />
          <div 
            className={`fixed top-0 left-0 h-full w-3/5 shadow-2xl transform transition-transform duration-300 ease-in-out z-[9999] ${
              showSettings ? 'translate-x-0' : '-translate-x-full'
            }`}
            style={{
              backgroundColor: theme === 'light' ? '#ffffff' : '#1f2937',
              borderRight: `2px solid ${customTheme.colors.border}`
            }}
          >
            <div className="flex h-full">
              {/* Sidebar */}
              <div 
                className="w-52 relative overflow-hidden"
                style={{
                  background: `linear-gradient(180deg, ${customTheme.colors.primary}05 0%, transparent 100%)`,
                }}
              >
                {/* Decorative Elements */}
                <div 
                  className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-30"
                  style={{
                    background: `radial-gradient(circle, ${customTheme.colors.primary}, transparent)`
                  }}
                />
                <div 
                  className="absolute bottom-0 left-0 w-24 h-24 rounded-full blur-2xl opacity-20"
                  style={{
                    background: `radial-gradient(circle, ${customTheme.colors.accent}, transparent)`
                  }}
                />
                
                <div className="relative p-6">
                  <div className="mb-8">
                    <div className="flex items-center justify-center mb-4">
                      <div 
                        className="w-16 h-16 rounded-3xl flex items-center justify-center relative overflow-hidden"
                        style={{
                          background: `linear-gradient(135deg, ${customTheme.colors.primary}, ${customTheme.colors.accent})`,
                          boxShadow: `0 8px 32px ${customTheme.colors.primary}40`
                        }}
                      >
                        <span className="text-white text-2xl">⚙️</span>
                        <div 
                          className="absolute inset-0 rounded-3xl"
                          style={{
                            background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)',
                            animation: 'shimmer 3s infinite'
                          }}
                        />
                      </div>
                    </div>
                    <h3 className={`text-center text-lg font-black tracking-tight ${
                      theme === 'light' ? 'text-gray-900' : 'text-gray-50'
                    }`}>
                      {t.settings}
                    </h3>
                    <div className={`text-center text-xs mt-2 opacity-70 ${
                      theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                    }`}>
                      مركز التحكم
                    </div>
                  </div>
                  
                  <nav className="space-y-3">
                    {SETTINGS_SECTIONS.map((section, index) => (
                      <button
                        key={section.id}
                        onClick={() => setActiveSection(section.id)}
                        className={`w-full group relative overflow-hidden rounded-2xl transition-all duration-500 ${
                          activeSection === section.id ? 'scale-105' : 'hover:scale-102'
                        }`}
                        style={{
                          background: activeSection === section.id 
                            ? `linear-gradient(135deg, ${customTheme.colors.primary}, ${customTheme.colors.accent})`
                            : 'transparent',
                          boxShadow: activeSection === section.id 
                            ? `0 12px 48px ${customTheme.colors.primary}50, 0 4px 16px ${customTheme.colors.primary}30`
                            : `0 2px 8px ${customTheme.colors.border}20`,
                          transform: `translateY(${index * 2}px)`
                        }}
                      >
                        <div className="relative px-4 py-4 flex items-center justify-end space-x-reverse space-x-3">
                          <div className="text-right">
                            <div className={`text-sm font-bold transition-colors duration-300 ${
                              activeSection === section.id ? 'text-white' : customTheme.colors.text
                            }`}>
                              {section.name}
                            </div>
                            <div className={`text-xs opacity-70 transition-colors duration-300 ${
                              activeSection === section.id ? 'text-white/80' : customTheme.colors.text + '70'
                            }`}>
                              {section.id === 'profile' && 'المعلومات الشخصية'}
                              {section.id === 'appearance' && 'الشكل والمظهر'}
                              {section.id === 'themes' && 'تخصيص الثيمات'}
                              {section.id === 'account' && 'إدارة الحساب'}
                            </div>
                          </div>
                          <div 
                            className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                            style={{
                              background: activeSection === section.id 
                                ? 'rgba(255,255,255,0.2)' 
                                : `linear-gradient(135deg, ${customTheme.colors.surface}, ${customTheme.colors.background})`,
                              boxShadow: activeSection === section.id 
                                ? 'inset 0 2px 8px rgba(255,255,255,0.3)'
                                : `0 4px 16px ${customTheme.colors.border}30`
                            }}
                          >
                            <span className={`text-xl transition-all duration-300 ${
                              activeSection === section.id ? 'text-white' : ''
                            }`}>{section.icon}</span>
                          </div>
                        </div>
                        
                        {/* Hover Effect Overlay */}
                        <div 
                          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          style={{
                            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)'
                          }}
                        />
                      </button>
                    ))}
                  </nav>
                </div>
              </div>

              {/* Main Content */}
              <div className="flex-1 flex flex-col">
                {/* Premium Header */}
                <div 
                  className="px-8 py-6 relative overflow-hidden"
                  style={{
                    background: `linear-gradient(135deg, ${customTheme.colors.background} 0%, ${customTheme.colors.surface}30 100%)`,
                    borderBottom: `1px solid ${customTheme.colors.border}10`
                  }}
                >
                  {/* Header Decorations */}
                  <div 
                    className="absolute top-0 left-0 w-full h-px"
                    style={{
                      background: `linear-gradient(90deg, transparent, ${customTheme.colors.primary}50, transparent)`
                    }}
                  />
                  
                  <div className="flex items-center justify-between relative">
                    <div className="flex items-center space-x-reverse space-x-4">
                      <div 
                        className="w-3 h-3 rounded-full relative"
                        style={{
                          background: `linear-gradient(135deg, ${customTheme.colors.primary}, ${customTheme.colors.accent})`,
                          boxShadow: `0 0 20px ${customTheme.colors.primary}60`
                        }}
                      >
                        <div 
                          className="absolute inset-0 rounded-full animate-ping"
                          style={{
                            background: `linear-gradient(135deg, ${customTheme.colors.primary}, ${customTheme.colors.accent})`,
                            opacity: 0.3
                          }}
                        />
                      </div>
                      <div>
                        <h3 className={`text-lg font-black tracking-tight ${
                          theme === 'light' ? 'text-gray-900' : 'text-gray-50'
                        }`}>
                          {SETTINGS_SECTIONS.find(s => s.id === activeSection)?.name}
                        </h3>
                        <div className={`text-xs opacity-70 mt-1 ${
                          theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                        }`}>
                          {activeSection === 'profile' && 'إدارة ملفك الشخصي والصورة الرمزية'}
                          {activeSection === 'appearance' && 'تخصيص المظهر واللغة'}
                          {activeSection === 'themes' && 'اختيار وتخصيص الثيمات والخلفيات'}
                          {activeSection === 'account' && 'إعدادات الحساب والأمان'}
                        </div>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => setShowSettings(false)}
                      className="w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-300 group relative overflow-hidden"
                      style={{
                        background: `linear-gradient(135deg, ${customTheme.colors.surface}, ${customTheme.colors.background})`,
                        boxShadow: `0 4px 16px ${customTheme.colors.border}30`
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = `linear-gradient(135deg, ${customTheme.colors.primary}, ${customTheme.colors.accent})`;
                        e.currentTarget.style.transform = 'rotate(90deg) scale(1.1)';
                        e.currentTarget.style.boxShadow = `0 8px 32px ${customTheme.colors.primary}50`;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = `linear-gradient(135deg, ${customTheme.colors.surface}, ${customTheme.colors.background})`;
                        e.currentTarget.style.transform = 'rotate(0deg) scale(1)';
                        e.currentTarget.style.boxShadow = `0 4px 16px ${customTheme.colors.border}30`;
                      }}
                    >
                      <span className="text-lg transition-colors duration-300 group-hover:text-white">✕</span>
                    </button>
                  </div>
                </div>

                <div className="px-8 py-6 overflow-y-auto flex-1">
                  {activeSection === 'profile' && (
                    <div className="space-y-6">
                      {/* Username Section */}
                      <div 
                        className="relative overflow-hidden rounded-3xl p-6 backdrop-blur-xl"
                        style={{
                          background: `linear-gradient(135deg, ${customTheme.colors.surface}60, ${customTheme.colors.background}20)`,
                          border: `1px solid ${customTheme.colors.border}20`,
                          boxShadow: `0 8px 32px ${customTheme.colors.border}15`
                        }}
                      >
                        <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl opacity-20"
                          style={{
                            background: `radial-gradient(circle, ${customTheme.colors.primary}, transparent)`
                          }}
                        />
                        
                        <div className="relative">
                          <div className="flex items-center space-x-reverse space-x-3 mb-4">
                            <div 
                              className="w-8 h-8 rounded-xl flex items-center justify-center"
                              style={{
                                background: `linear-gradient(135deg, ${customTheme.colors.primary}, ${customTheme.colors.accent})`,
                                boxShadow: `0 4px 16px ${customTheme.colors.primary}40`
                              }}
                            >
                              <span className="text-white text-sm">@</span>
                            </div>
                            <label className={`text-sm font-black uppercase tracking-wider ${
                              theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                            }`}>
                              {t.username}
                            </label>
                          </div>
                          
                          <div className="relative">
                            <input
                              type="text"
                              value={username}
                              onChange={(e) => setUsername(e.target.value)}
                              placeholder={t.enterUsername}
                              className="w-full px-5 py-4 rounded-2xl focus:outline-none transition-all duration-300 text-sm font-medium peer"
                              style={{
                                backgroundColor: customTheme.colors.surface + '40',
                                color: customTheme.colors.text,
                                border: `2px solid ${customTheme.colors.border}30`
                              }}
                              onFocus={(e) => {
                                e.currentTarget.style.backgroundColor = customTheme.colors.surface + '80';
                                e.currentTarget.style.borderColor = customTheme.colors.primary;
                                e.currentTarget.style.boxShadow = `0 0 0 4px ${customTheme.colors.primary}20, 0 8px 32px ${customTheme.colors.primary}30`;
                              }}
                              onBlur={(e) => {
                                e.currentTarget.style.backgroundColor = customTheme.colors.surface + '40';
                                e.currentTarget.style.borderColor = customTheme.colors.border + '30';
                                e.currentTarget.style.boxShadow = 'none';
                              }}
                            />
                            <div 
                              className="absolute right-4 top-1/2 transform -translate-y-1/2 w-1 h-6 rounded-full transition-all duration-300 peer-focus:scale-x-150 peer-focus:scale-y-125"
                              style={{
                                background: `linear-gradient(180deg, ${customTheme.colors.primary}, ${customTheme.colors.accent})`,
                                boxShadow: `0 0 12px ${customTheme.colors.primary}60`
                              }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Avatar Section */}
                      <div 
                        className="relative overflow-hidden rounded-3xl p-6 backdrop-blur-xl"
                        style={{
                          background: `linear-gradient(135deg, ${customTheme.colors.surface}60, ${customTheme.colors.background}20)`,
                          border: `1px solid ${customTheme.colors.border}20`,
                          boxShadow: `0 8px 32px ${customTheme.colors.border}15`
                        }}
                      >
                        <div className="absolute top-0 left-0 w-24 h-24 rounded-full blur-2xl opacity-20"
                          style={{
                            background: `radial-gradient(circle, ${customTheme.colors.accent}, transparent)`
                          }}
                        />
                        
                        <div className="relative">
                          <div className="flex items-center space-x-reverse space-x-3 mb-6">
                            <div 
                              className="w-8 h-8 rounded-xl flex items-center justify-center"
                              style={{
                                background: `linear-gradient(135deg, ${customTheme.colors.accent}, ${customTheme.colors.primary})`,
                                boxShadow: `0 4px 16px ${customTheme.colors.accent}40`
                              }}
                            >
                              <span className="text-white text-sm">👤</span>
                            </div>
                            <label className={`text-sm font-black uppercase tracking-wider ${
                              theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                            }`}>
                              {t.avatar}
                            </label>
                          </div>
                          
                          {/* Custom Avatar URL */}
                          <div className="mb-6">
                            <div className="relative">
                              <input
                                type="url"
                                value={customAvatarUrl}
                                onChange={(e) => {
                                  setCustomAvatarUrl(e.target.value);
                                  setSelectedAvatar('');
                                }}
                                placeholder="أدخل رابط الصورة المخصص..."
                                className="w-full px-5 py-4 rounded-2xl focus:outline-none transition-all duration-300 text-sm font-medium peer"
                                style={{
                                  backgroundColor: customTheme.colors.surface + '40',
                                  color: customTheme.colors.text,
                                  border: `2px solid ${customTheme.colors.border}30`
                                }}
                                onFocus={(e) => {
                                  e.currentTarget.style.backgroundColor = customTheme.colors.surface + '80';
                                  e.currentTarget.style.borderColor = customTheme.colors.accent;
                                  e.currentTarget.style.boxShadow = `0 0 0 4px ${customTheme.colors.accent}20, 0 8px 32px ${customTheme.colors.accent}30`;
                                }}
                                onBlur={(e) => {
                                  e.currentTarget.style.backgroundColor = customTheme.colors.surface + '40';
                                  e.currentTarget.style.borderColor = customTheme.colors.border + '30';
                                  e.currentTarget.style.boxShadow = 'none';
                                }}
                              />
                              <div 
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 w-1 h-6 rounded-full transition-all duration-300 peer-focus:scale-x-150 peer-focus:scale-y-125"
                                style={{
                                  background: `linear-gradient(180deg, ${customTheme.colors.accent}, ${customTheme.colors.primary})`,
                                  boxShadow: `0 0 12px ${customTheme.colors.accent}60`
                                }}
                              />
                            </div>
                            
                            {customAvatarUrl && (
                              <div className="flex justify-center mt-4">
                                <div className="relative group">
                                  <div 
                                    className="w-20 h-20 rounded-3xl p-1 relative overflow-hidden"
                                    style={{
                                      background: `linear-gradient(135deg, ${customTheme.colors.primary}, ${customTheme.colors.accent})`,
                                      boxShadow: `0 12px 48px ${customTheme.colors.primary}40`
                                    }}
                                  >
                                    <img 
                                      src={customAvatarUrl} 
                                      alt="Custom avatar preview"
                                      className="w-full h-full rounded-2xl object-cover"
                                      onError={(e) => {
                                        (e.target as HTMLImageElement).style.display = 'none';
                                      }}
                                    />
                                  </div>
                                  <div 
                                    className="absolute -bottom-2 -right-2 w-8 h-8 rounded-2xl flex items-center justify-center text-sm font-bold shadow-lg"
                                    style={{
                                      background: `linear-gradient(135deg, ${customTheme.colors.primary}, ${customTheme.colors.accent})`,
                                      color: '#ffffff'
                                    }}
                                  >
                                    ✓
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Preset Avatars */}
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div className={`text-sm font-medium ${
                                theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                              }`}>
                                أو اختر من المجموعة
                              </div>
                              <div className={`text-xs ${
                                theme === 'light' ? 'text-gray-500' : 'text-gray-500'
                              }`}>
                                {AVATARS.length} صورة متاحة
                              </div>
                            </div>
                            
                            {/* Search */}
                            <div className="relative">
                              <input
                                type="text"
                                value={avatarSearch}
                                onChange={(e) => setAvatarSearch(e.target.value)}
                                placeholder="بحث بالرقم..."
                                className="w-full px-5 py-3 rounded-2xl focus:outline-none transition-all duration-300 text-sm peer"
                                style={{
                                  backgroundColor: customTheme.colors.surface + '40',
                                  color: customTheme.colors.text,
                                  border: `2px solid ${customTheme.colors.border}30`
                                }}
                                onFocus={(e) => {
                                  e.currentTarget.style.backgroundColor = customTheme.colors.surface + '80';
                                  e.currentTarget.style.borderColor = customTheme.colors.primary;
                                  e.currentTarget.style.boxShadow = `0 0 0 4px ${customTheme.colors.primary}20`;
                                }}
                                onBlur={(e) => {
                                  e.currentTarget.style.backgroundColor = customTheme.colors.surface + '40';
                                  e.currentTarget.style.borderColor = customTheme.colors.border + '30';
                                  e.currentTarget.style.boxShadow = 'none';
                                }}
                              />
                            </div>

                            {/* Avatar Grid */}
                            <div className="grid grid-cols-6 gap-3 max-h-64 overflow-y-auto p-4 rounded-2xl"
                                 style={{ 
                                   backgroundColor: customTheme.colors.surface + '30',
                                   border: `1px solid ${customTheme.colors.border}20`
                                 }}>
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
                                    className="aspect-square rounded-2xl overflow-hidden transition-all duration-300 relative group"
                                    style={{
                                      boxShadow: selectedAvatar === avatar 
                                        ? `0 12px 48px ${customTheme.colors.primary}50` 
                                        : `0 4px 16px ${customTheme.colors.border}20`,
                                      transform: selectedAvatar === avatar ? 'scale(1.1)' : 'scale(1)',
                                      border: selectedAvatar === avatar 
                                        ? `3px solid ${customTheme.colors.primary}` 
                                        : '3px solid transparent'
                                    }}
                                    title={`Avatar ${originalIndex}`}
                                  >
                                    <img 
                                      src={avatar} 
                                      alt={`Avatar ${originalIndex}`}
                                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                      onError={(e) => {
                                        (e.target as HTMLImageElement).style.display = 'none';
                                      }}
                                    />
                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent text-white text-xs py-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                      {originalIndex}
                                    </div>
                                    {selectedAvatar === avatar && (
                                      <div 
                                        className="absolute top-2 right-2 w-6 h-6 rounded-xl flex items-center justify-center text-xs font-bold shadow-lg"
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
                              <div className="flex items-center justify-center space-x-reverse space-x-4">
                                <button
                                  onClick={() => setAvatarPage(Math.max(1, avatarPage - 1))}
                                  disabled={avatarPage === 1}
                                  className="px-4 py-2 rounded-xl transition-all duration-300 disabled:opacity-50 font-bold text-sm"
                                  style={{
                                    background: avatarPage === 1 
                                      ? customTheme.colors.surface + '60' 
                                      : `linear-gradient(135deg, ${customTheme.colors.primary}, ${customTheme.colors.accent})`,
                                    color: avatarPage === 1 ? customTheme.colors.text : '#ffffff',
                                    boxShadow: avatarPage === 1 
                                      ? `inset 0 2px 4px ${customTheme.colors.border}40`
                                      : `0 8px 32px ${customTheme.colors.primary}40`
                                  }}
                                >
                                  ←
                                </button>
                                
                                <div 
                                  className="px-4 py-2 rounded-xl font-bold text-sm"
                                  style={{
                                    background: `linear-gradient(135deg, ${customTheme.colors.surface}, ${customTheme.colors.background})`,
                                    color: customTheme.colors.text,
                                    boxShadow: `inset 0 2px 4px ${customTheme.colors.border}40`
                                  }}
                                >
                                  {avatarPage} / {totalPages}
                                </div>
                                
                                <button
                                  onClick={() => setAvatarPage(Math.min(totalPages, avatarPage + 1))}
                                  disabled={avatarPage === totalPages}
                                  className="px-4 py-2 rounded-xl transition-all duration-300 disabled:opacity-50 font-bold text-sm"
                                  style={{
                                    background: avatarPage === totalPages 
                                      ? customTheme.colors.surface + '60' 
                                      : `linear-gradient(135deg, ${customTheme.colors.primary}, ${customTheme.colors.accent})`,
                                    color: avatarPage === totalPages ? customTheme.colors.text : '#ffffff',
                                    boxShadow: avatarPage === totalPages 
                                      ? `inset 0 2px 4px ${customTheme.colors.border}40`
                                      : `0 8px 32px ${customTheme.colors.primary}40`
                                  }}
                                >
                                  →
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeSection === 'appearance' && (
                    <div className="space-y-6">
                      {/* Theme Section */}
                      <div 
                        className="relative overflow-hidden rounded-3xl p-6 backdrop-blur-xl"
                        style={{
                          background: `linear-gradient(135deg, ${customTheme.colors.surface}60, ${customTheme.colors.background}20)`,
                          border: `1px solid ${customTheme.colors.border}20`,
                          boxShadow: `0 8px 32px ${customTheme.colors.border}15`
                        }}
                      >
                        <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl opacity-20"
                          style={{
                            background: `radial-gradient(circle, ${customTheme.colors.primary}, transparent)`
                          }}
                        />
                        
                        <div className="relative">
                          <div className="flex items-center space-x-reverse space-x-3 mb-6">
                            <div 
                              className="w-8 h-8 rounded-xl flex items-center justify-center"
                              style={{
                                background: `linear-gradient(135deg, ${customTheme.colors.primary}, ${customTheme.colors.accent})`,
                                boxShadow: `0 4px 16px ${customTheme.colors.primary}40`
                              }}
                            >
                              <span className="text-white text-sm">🎨</span>
                            </div>
                            <label className={`text-sm font-black uppercase tracking-wider ${
                              theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                            }`}>
                              {t.appearance}
                            </label>
                          </div>
                          
                          <div 
                            className="p-6 rounded-2xl"
                            style={{
                              background: `linear-gradient(135deg, ${customTheme.colors.surface}40, ${customTheme.colors.background}10)`,
                              border: `1px solid ${customTheme.colors.border}20`
                            }}
                          >
                            <ThemeToggle />
                          </div>
                        </div>
                      </div>

                      {/* Language Section */}
                      <div 
                        className="relative overflow-hidden rounded-3xl p-6 backdrop-blur-xl"
                        style={{
                          background: `linear-gradient(135deg, ${customTheme.colors.surface}60, ${customTheme.colors.background}20)`,
                          border: `1px solid ${customTheme.colors.border}20`,
                          boxShadow: `0 8px 32px ${customTheme.colors.border}15`
                        }}
                      >
                        <div className="absolute top-0 left-0 w-24 h-24 rounded-full blur-2xl opacity-20"
                          style={{
                            background: `radial-gradient(circle, ${customTheme.colors.accent}, transparent)`
                          }}
                        />
                        
                        <div className="relative">
                          <div className="flex items-center space-x-reverse space-x-3 mb-6">
                            <div 
                              className="w-8 h-8 rounded-xl flex items-center justify-center"
                              style={{
                                background: `linear-gradient(135deg, ${customTheme.colors.accent}, ${customTheme.colors.primary})`,
                                boxShadow: `0 4px 16px ${customTheme.colors.accent}40`
                              }}
                            >
                              <span className="text-white text-sm">🌐</span>
                            </div>
                            <label className={`text-sm font-black uppercase tracking-wider ${
                              theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                            }`}>
                              {t.language}
                            </label>
                          </div>
                          
                          <div className="relative">
                            <select
                              value={language}
                              onChange={(e) => setLanguage(e.target.value as 'en' | 'ar')}
                              className="w-full px-5 py-4 rounded-2xl focus:outline-none transition-all duration-300 text-sm font-medium appearance-none peer"
                              style={{
                                backgroundColor: customTheme.colors.surface + '40',
                                color: customTheme.colors.text,
                                border: `2px solid ${customTheme.colors.border}30`
                              }}
                              onFocus={(e) => {
                                e.currentTarget.style.backgroundColor = customTheme.colors.surface + '80';
                                e.currentTarget.style.borderColor = customTheme.colors.primary;
                                e.currentTarget.style.boxShadow = `0 0 0 4px ${customTheme.colors.primary}20, 0 8px 32px ${customTheme.colors.primary}30`;
                              }}
                              onBlur={(e) => {
                                e.currentTarget.style.backgroundColor = customTheme.colors.surface + '40';
                                e.currentTarget.style.borderColor = customTheme.colors.border + '30';
                                e.currentTarget.style.boxShadow = 'none';
                              }}
                            >
                              <option value="en">English</option>
                              <option value="ar">العربية</option>
                            </select>
                            <div 
                              className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none transition-transform duration-300 peer-focus:rotate-180"
                              style={{
                                background: `linear-gradient(135deg, ${customTheme.colors.primary}, ${customTheme.colors.accent})`,
                                clipPath: 'polygon(0 0%, 100% 0%, 50% 100%)',
                                width: '12px',
                                height: '12px'
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeSection === 'themes' && (
                    <div className="space-y-6">
                      {/* Predefined Themes */}
                      <div 
                        className="relative overflow-hidden rounded-3xl p-6 backdrop-blur-xl"
                        style={{
                          background: `linear-gradient(135deg, ${customTheme.colors.surface}60, ${customTheme.colors.background}20)`,
                          border: `1px solid ${customTheme.colors.border}20`,
                          boxShadow: `0 8px 32px ${customTheme.colors.border}15`
                        }}
                      >
                        <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl opacity-20"
                          style={{
                            background: `radial-gradient(circle, ${customTheme.colors.primary}, transparent)`
                          }}
                        />
                        
                        <div className="relative">
                          <div className="flex items-center space-x-reverse space-x-3 mb-6">
                            <div 
                              className="w-8 h-8 rounded-xl flex items-center justify-center"
                              style={{
                                background: `linear-gradient(135deg, ${customTheme.colors.primary}, ${customTheme.colors.accent})`,
                                boxShadow: `0 4px 16px ${customTheme.colors.primary}40`
                              }}
                            >
                              <span className="text-white text-sm">🎨</span>
                            </div>
                            <label className={`text-sm font-black uppercase tracking-wider ${
                              theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                            }`}>
                              الثيمات الجاهزة
                            </label>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {availableThemes.map((themeOption) => (
                              <button
                                key={themeOption.name}
                                onClick={() => setTheme(themeOption)}
                                className={`p-4 rounded-2xl transition-all duration-300 relative overflow-hidden group ${
                                  currentTheme.name === themeOption.name
                                    ? 'ring-2 ring-offset-2'
                                    : ''
                                }`}
                                style={{
                                  background: currentTheme.name === themeOption.name 
                                    ? `linear-gradient(135deg, ${customTheme.colors.primary}, ${customTheme.colors.accent})`
                                    : `linear-gradient(135deg, ${customTheme.colors.surface}, ${customTheme.colors.background})`,
                                  boxShadow: currentTheme.name === themeOption.name
                                    ? `0 12px 48px ${customTheme.colors.primary}50, 0 4px 16px ${customTheme.colors.primary}30`
                                    : `0 4px 16px ${customTheme.colors.border}30`
                                }}
                              >
                                <div className="flex items-center space-x-reverse space-x-2 mb-3">
                                  <div 
                                    className="w-6 h-6 rounded-full border-2 border-gray-300"
                                    style={{ backgroundColor: themeOption.colors.primary }}
                                  />
                                  <div 
                                    className="w-6 h-6 rounded-full border-2 border-gray-300"
                                    style={{ backgroundColor: themeOption.colors.secondary }}
                                  />
                                  <div 
                                    className="w-6 h-6 rounded-full border-2 border-gray-300"
                                    style={{ backgroundColor: themeOption.colors.accent }}
                                  />
                                </div>
                                <div className={`text-sm font-bold ${
                                  currentTheme.name === themeOption.name ? 'text-white' : customTheme.colors.text
                                }`}>
                                  {themeOption.name}
                                </div>
                                
                                {/* Hover effect */}
                                <div 
                                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                  style={{
                                    background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)'
                                  }}
                                />
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Custom Theme Creator */}
                      <div className="mb-6">
                        <button
                          onClick={() => setShowCustomCreator(!showCustomCreator)}
                          className={`px-6 py-3 rounded-2xl font-bold transition-all duration-300 relative overflow-hidden group ${
                            showCustomCreator 
                              ? 'ring-2 ring-offset-2'
                              : ''
                          }`}
                          style={{
                            background: showCustomCreator 
                              ? `linear-gradient(135deg, ${customTheme.colors.primary}, ${customTheme.colors.accent})`
                              : `linear-gradient(135deg, ${customTheme.colors.surface}, ${customTheme.colors.background})`,
                            color: showCustomCreator ? '#ffffff' : customTheme.colors.text,
                            boxShadow: showCustomCreator
                              ? `0 12px 48px ${customTheme.colors.primary}40`
                              : `0 8px 32px ${customTheme.colors.border}30`
                          }}
                        >
                          <span className="relative z-10">
                            {showCustomCreator 
                              ? 'إغلاق'
                              : 'إنشاء ثيم مخصص'
                            }
                          </span>
                          <div 
                            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            style={{
                              background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)'
                            }}
                          />
                        </button>
                      </div>

                      {/* Background Selection */}
                      <div 
                        className="relative overflow-hidden rounded-3xl p-6 backdrop-blur-xl"
                        style={{
                          background: `linear-gradient(135deg, ${customTheme.colors.surface}60, ${customTheme.colors.background}20)`,
                          border: `1px solid ${customTheme.colors.border}20`,
                          boxShadow: `0 8px 32px ${customTheme.colors.border}15`
                        }}
                      >
                        <div className="absolute top-0 left-0 w-24 h-24 rounded-full blur-2xl opacity-20"
                          style={{
                            background: `radial-gradient(circle, ${customTheme.colors.accent}, transparent)`
                          }}
                        />
                        
                        <div className="relative">
                          <div className="flex items-center space-x-reverse space-x-3 mb-6">
                            <div 
                              className="w-8 h-8 rounded-xl flex items-center justify-center"
                              style={{
                                background: `linear-gradient(135deg, ${customTheme.colors.accent}, ${customTheme.colors.primary})`,
                                boxShadow: `0 4px 16px ${customTheme.colors.accent}40`
                              }}
                            >
                              <span className="text-white text-sm">🎭</span>
                            </div>
                            <label className={`text-sm font-black uppercase tracking-wider ${
                              theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                            }`}>
                              خلفية القسم الأيمن
                            </label>
                          </div>
                          
                          {/* Background Categories */}
                          <div className="space-y-4">
                            {/* Basic Backgrounds */}
                            <div>
                              <h5 className={`text-sm font-medium mb-3 ${
                                theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                              }`}>
                                أساسية
                              </h5>
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {BACKGROUNDS.filter(bg => ['default', 'gradient1', 'gradient2', 'gradient3', 'gradient4', 'gradient5', 'pattern1', 'pattern2'].includes(bg.id)).map((background) => (
                                  <button
                                    key={background.id}
                                    onClick={() => handleBackgroundSelect(background.id)}
                                    className={`p-3 rounded-2xl transition-all duration-300 relative overflow-hidden group ${
                                      selectedBackground === background.id
                                        ? 'ring-2 ring-offset-2'
                                        : ''
                                    }`}
                                    style={{
                                      background: selectedBackground === background.id
                                        ? `linear-gradient(135deg, ${customTheme.colors.primary}, ${customTheme.colors.accent})`
                                        : `linear-gradient(135deg, ${customTheme.colors.surface}, ${customTheme.colors.background})`,
                                      boxShadow: selectedBackground === background.id
                                        ? `0 12px 48px ${customTheme.colors.primary}50, 0 4px 16px ${customTheme.colors.primary}30`
                                        : `0 4px 16px ${customTheme.colors.border}30`
                                    }}
                                  >
                                    <div 
                                      className="w-full h-12 rounded mb-2"
                                      style={{ 
                                        background: background.value,
                                        border: background.value === 'transparent' ? '2px dashed #d1d5db' : 'none'
                                      }}
                                    />
                                    <div className={`text-xs font-medium ${
                                      selectedBackground === background.id ? 'text-white' : customTheme.colors.text
                                    }`}>
                                      {background.name}
                                    </div>
                                    
                                    {/* Hover effect */}
                                    <div 
                                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                      style={{
                                        background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)'
                                      }}
                                    />
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Focus Images */}
                            <div>
                              <h5 className={`text-sm font-medium mb-3 ${
                                theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                              }`}>
                                صور للتركيز
                              </h5>
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {BACKGROUNDS.filter(bg => ['focus1', 'focus2', 'focus3', 'focus4', 'focus5'].includes(bg.id)).map((background) => (
                                  <button
                                    key={background.id}
                                    onClick={() => handleBackgroundSelect(background.id)}
                                    className={`p-3 rounded-2xl transition-all duration-300 relative overflow-hidden group ${
                                      selectedBackground === background.id
                                        ? 'ring-2 ring-offset-2'
                                        : ''
                                    }`}
                                    style={{
                                      background: selectedBackground === background.id
                                        ? `linear-gradient(135deg, ${customTheme.colors.primary}, ${customTheme.colors.accent})`
                                        : `linear-gradient(135deg, ${customTheme.colors.surface}, ${customTheme.colors.background})`,
                                      boxShadow: selectedBackground === background.id
                                        ? `0 12px 48px ${customTheme.colors.primary}50, 0 4px 16px ${customTheme.colors.primary}30`
                                        : `0 4px 16px ${customTheme.colors.border}30`
                                    }}
                                  >
                                    <div 
                                      className="w-full h-12 rounded mb-2 bg-cover bg-center"
                                      style={{ 
                                        backgroundImage: background.value,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center'
                                      }}
                                    />
                                    <div className={`text-xs font-medium ${
                                      selectedBackground === background.id ? 'text-white' : customTheme.colors.text
                                    }`}>
                                      {background.name}
                                    </div>
                                    
                                    {/* Hover effect */}
                                    <div 
                                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                      style={{
                                        background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)'
                                      }}
                                    />
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Animated Backgrounds */}
                            <div>
                              <h5 className={`text-sm font-medium mb-3 ${
                                theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                              }`}>
                                خلفيات متحركة
                              </h5>
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {BACKGROUNDS.filter(bg => ['animated1', 'animated2', 'animated3', 'animated4', 'animated5', 'animated6', 'animated7', 'animated8', 'animated9', 'animated10'].includes(bg.id)).map((background) => (
                                  <button
                                    key={background.id}
                                    onClick={() => handleBackgroundSelect(background.id)}
                                    className={`p-3 rounded-2xl transition-all duration-300 relative overflow-hidden group ${
                                      selectedBackground === background.id
                                        ? 'ring-2 ring-offset-2'
                                        : ''
                                    }`}
                                    style={{
                                      background: selectedBackground === background.id
                                        ? `linear-gradient(135deg, ${customTheme.colors.primary}, ${customTheme.colors.accent})`
                                        : `linear-gradient(135deg, ${customTheme.colors.surface}, ${customTheme.colors.background})`,
                                      boxShadow: selectedBackground === background.id
                                        ? `0 12px 48px ${customTheme.colors.primary}50, 0 4px 16px ${customTheme.colors.primary}30`
                                        : `0 4px 16px ${customTheme.colors.border}30`
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
                                    <div className={`text-xs font-medium ${
                                      selectedBackground === background.id ? 'text-white' : customTheme.colors.text
                                    }`}>
                                      {background.name}
                                    </div>
                                    
                                    {/* Hover effect */}
                                    <div 
                                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                      style={{
                                        background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)'
                                      }}
                                    />
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>

                        {showCustomCreator && (
                          <div 
                            className="relative overflow-hidden rounded-3xl p-6 backdrop-blur-xl"
                            style={{
                              background: `linear-gradient(135deg, ${customTheme.colors.surface}60, ${customTheme.colors.background}20)`,
                              border: `1px solid ${customTheme.colors.border}20`,
                              boxShadow: `0 8px 32px ${customTheme.colors.border}15`
                            }}
                          >
                            <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl opacity-20"
                              style={{
                                background: `radial-gradient(circle, ${customTheme.colors.primary}, transparent)`
                              }}
                            />
                            
                            <div className="relative">
                              <h4 className={`text-lg font-black mb-6 ${
                                theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                              }`}>
                                مصمم الألوان
                              </h4>

                              {/* Theme Name */}
                              <div className="mb-6">
                                <label className={`block text-sm font-bold mb-2 ${
                                  theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                                }`}>
                                  اسم الثيم
                                </label>
                                <div className="relative">
                                  <input
                                    type="text"
                                    value={customThemeName}
                                    onChange={(e) => setCustomThemeName(e.target.value)}
                                    placeholder="أدخل اسم الثيم"
                                    className="w-full px-5 py-3 rounded-2xl focus:outline-none transition-all duration-300 text-sm font-medium peer"
                                    style={{
                                      backgroundColor: customTheme.colors.surface + '40',
                                      color: customTheme.colors.text,
                                      border: `2px solid ${customTheme.colors.border}30`
                                    }}
                                    onFocus={(e) => {
                                      e.currentTarget.style.backgroundColor = customTheme.colors.surface + '80';
                                      e.currentTarget.style.borderColor = customTheme.colors.primary;
                                      e.currentTarget.style.boxShadow = `0 0 0 4px ${customTheme.colors.primary}20, 0 8px 32px ${customTheme.colors.primary}30`;
                                    }}
                                    onBlur={(e) => {
                                      e.currentTarget.style.backgroundColor = customTheme.colors.surface + '40';
                                      e.currentTarget.style.borderColor = customTheme.colors.border + '30';
                                      e.currentTarget.style.boxShadow = 'none';
                                    }}
                                  />
                                  <div 
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 w-1 h-6 rounded-full transition-all duration-300 peer-focus:scale-x-150 peer-focus:scale-y-125"
                                    style={{
                                      background: `linear-gradient(180deg, ${customTheme.colors.primary}, ${customTheme.colors.accent})`,
                                      boxShadow: `0 0 12px ${customTheme.colors.primary}60`
                                    }}
                                  />
                                </div>
                              </div>

                              {/* Color Pickers */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                {Object.entries(customColors).map(([key, value]) => (
                                  <div key={key}>
                                    <label className={`block text-sm font-bold mb-2 ${
                                      theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                                    }`}>
                                      {key.charAt(0).toUpperCase() + key.slice(1)}
                                    </label>
                                    <div className="flex items-center space-x-3">
                                      <input
                                        type="color"
                                        value={value}
                                        onChange={(e) => handleColorChange(key as keyof ThemeColors, e.target.value)}
                                        className="w-12 h-12 rounded cursor-pointer"
                                      />
                                      <input
                                        type="text"
                                        value={value}
                                        onChange={(e) => handleColorChange(key as keyof ThemeColors, e.target.value)}
                                        className="flex-1 px-5 py-3 rounded-2xl focus:outline-none transition-all duration-300 text-sm font-medium peer"
                                        style={{
                                          backgroundColor: customTheme.colors.surface + '40',
                                          color: customTheme.colors.text,
                                          border: `2px solid ${customTheme.colors.border}30`
                                        }}
                                        onFocus={(e) => {
                                          e.currentTarget.style.backgroundColor = customTheme.colors.surface + '80';
                                          e.currentTarget.style.borderColor = customTheme.colors.primary;
                                          e.currentTarget.style.boxShadow = `0 0 0 4px ${customTheme.colors.primary}20, 0 8px 32px ${customTheme.colors.primary}30`;
                                        }}
                                        onBlur={(e) => {
                                          e.currentTarget.style.backgroundColor = customTheme.colors.surface + '40';
                                          e.currentTarget.style.borderColor = customTheme.colors.border + '30';
                                          e.currentTarget.style.boxShadow = 'none';
                                        }}
                                      />
                                    </div>
                                  </div>
                                ))}
                              </div>

                              {/* Action Buttons */}
                              <div className="flex space-x-4">
                                <button
                                  onClick={handleQuickColorUpdate}
                                  className="px-6 py-3 rounded-2xl font-bold transition-all duration-300 relative overflow-hidden group"
                                  style={{
                                    background: `linear-gradient(135deg, #10b981, #059669)`,
                                    color: '#ffffff',
                                    boxShadow: `0 8px 32px #10b98140`
                                  }}
                                >
                                  <span className="relative z-10">معاينة سريعة</span>
                                  <div 
                                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                    style={{
                                      background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)'
                                    }}
                                  />
                                </button>
                                <button
                                  onClick={handleCreateCustomTheme}
                                  disabled={!customThemeName.trim()}
                                  className="px-6 py-3 rounded-2xl font-bold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
                                  style={{
                                    background: customThemeName.trim() 
                                      ? `linear-gradient(135deg, ${customTheme.colors.primary}, ${customTheme.colors.accent})`
                                      : `linear-gradient(135deg, #6b7280, #a78bfa)`,
                                    color: '#ffffff',
                                    boxShadow: !customThemeName.trim() ? '0 4px 16px #6b728040' : `0 12px 48px ${customTheme.colors.primary}40`
                                  }}
                                >
                                  <span className="relative z-10">حفظظ الثيم</span>
                                  <div 
                                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                    style={{
                                      background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)'
                                    }}
                                  />
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {activeSection === 'account' && (
                    <div className="space-y-6">
                      <div 
                        className="relative overflow-hidden rounded-3xl p-6 backdrop-blur-xl"
                        style={{
                          background: `linear-gradient(135deg, ${customTheme.colors.surface}60, ${customTheme.colors.background}20)`,
                          border: `1px solid ${customTheme.colors.border}20`,
                          boxShadow: `0 8px 32px ${customTheme.colors.border}15`
                        }}
                      >
                        <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl opacity-20"
                          style={{
                            background: `radial-gradient(circle, ${customTheme.colors.primary}, transparent)`
                          }}
                        />
                        
                        <div className="relative">
                          <div className="flex items-center space-x-reverse space-x-3 mb-6">
                            <div 
                              className="w-8 h-8 rounded-xl flex items-center justify-center"
                              style={{
                                background: `linear-gradient(135deg, ${customTheme.colors.primary}, ${customTheme.colors.accent})`,
                                boxShadow: `0 4px 16px ${customTheme.colors.primary}40`
                              }}
                            >
                              <span className="text-white text-sm">🔐</span>
                            </div>
                            <label className={`text-sm font-black uppercase tracking-wider ${
                              theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                            }`}>
                              الحساب
                            </label>
                          </div>
                          
                          <div className="space-y-4">
                            {isLoggedIn ? (
                              <div 
                                className="p-5 rounded-2xl backdrop-blur-sm relative overflow-hidden"
                                style={{ 
                                  background: `linear-gradient(135deg, ${customTheme.colors.primary}20, ${customTheme.colors.surface}40)`,
                                  border: `1px solid ${customTheme.colors.primary}30`,
                                  boxShadow: `0 8px 32px ${customTheme.colors.primary}20`
                                }}>
                                <div className="absolute top-0 right-0 w-20 h-20 rounded-full blur-xl opacity-30"
                                  style={{
                                    background: `radial-gradient(circle, ${customTheme.colors.primary}, transparent)`
                                  }}
                                />
                                
                                <div className="flex items-center space-x-reverse space-x-4 relative">
                                  <div 
                                    className="w-14 h-14 rounded-2xl flex items-center justify-center relative overflow-hidden"
                                    style={{
                                      background: `linear-gradient(135deg, ${customTheme.colors.primary}, ${customTheme.colors.accent})`,
                                      boxShadow: `0 8px 32px ${customTheme.colors.primary}40`
                                    }}
                                  >
                                    <span className="text-white text-xl">👤</span>
                                    <div 
                                      className="absolute inset-0 rounded-2xl"
                                      style={{
                                        background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.2) 50%, transparent 70%)',
                                        animation: 'shimmer 3s infinite'
                                      }}
                                    />
                                  </div>
                                  <div>
                                    <div className={`text-base font-black ${
                                      theme === 'light' ? 'text-gray-900' : 'text-gray-50'
                                    }`}>
                                      {currentUser?.username || 'مستخدم'}
                                    </div>
                                    <div className={`text-sm opacity-80 ${
                                      theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                                    }`}>
                                      {currentUser?.email || 'user@example.com'}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div 
                                className="p-5 rounded-2xl backdrop-blur-sm"
                                style={{ 
                                  background: `linear-gradient(135deg, ${customTheme.colors.surface}40, ${customTheme.colors.background}20)`,
                                  border: `1px solid ${customTheme.colors.border}30`,
                                  boxShadow: `0 4px 16px ${customTheme.colors.border}15`
                                }}>
                                <div className="flex items-center space-x-reverse space-x-4">
                                  <div 
                                    className="w-14 h-14 rounded-2xl flex items-center justify-center"
                                    style={{
                                      background: `linear-gradient(135deg, ${customTheme.colors.border}, ${customTheme.colors.surface})`,
                                      boxShadow: `0 4px 16px ${customTheme.colors.border}30`
                                    }}
                                  >
                                    <span className="text-lg">👤</span>
                                  </div>
                                  <div>
                                    <div className={`text-base font-medium ${
                                      theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                                    }`}>
                                      حساب ضيف
                                    </div>
                                    <div className={`text-sm opacity-70 ${
                                      theme === 'light' ? 'text-gray-500' : 'text-gray-400'
                                    }`}>
                                      قم بترقية الحساب للحفاظ على بياناتك
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                            
                            <div className="grid grid-cols-2 gap-4">
                              {!isLoggedIn ? (
                                <button
                                  onClick={() => setShowAuthModal(true)}
                                  className="px-5 py-4 rounded-2xl font-black transition-all duration-300 text-sm hover:scale-105 relative overflow-hidden group"
                                  style={{
                                    background: `linear-gradient(135deg, ${customTheme.colors.primary}, ${customTheme.colors.accent})`,
                                    color: '#ffffff',
                                    boxShadow: `0 12px 48px ${customTheme.colors.primary}40`
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'scale(1.05)';
                                    e.currentTarget.style.boxShadow = `0 16px 64px ${customTheme.colors.primary}50`;
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'scale(1)';
                                    e.currentTarget.style.boxShadow = `0 12px 48px ${customTheme.colors.primary}40`;
                                  }}
                                >
                                  <span className="relative z-10">تسجيل الدخول</span>
                                  <div 
                                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                    style={{
                                      background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)'
                                    }}
                                  />
                                </button>
                              ) : (
                                <button
                                  onClick={() => setShowAccountSwitcher(true)}
                                  className="px-5 py-4 rounded-2xl font-black transition-all duration-300 text-sm hover:scale-105"
                                  style={{
                                    background: `linear-gradient(135deg, ${customTheme.colors.surface}, ${customTheme.colors.background})`,
                                    color: customTheme.colors.text,
                                    boxShadow: `0 8px 32px ${customTheme.colors.border}30`
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'scale(1.05)';
                                    e.currentTarget.style.boxShadow = `0 12px 48px ${customTheme.colors.border}40`;
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'scale(1)';
                                    e.currentTarget.style.boxShadow = `0 8px 32px ${customTheme.colors.border}30`;
                                  }}
                                >
                                  تبديل الحساب
                                </button>
                              )}
                              
                              {!isLoggedIn && (
                                <button
                                  onClick={() => {
                                    setShowAuthModal(true);
                                  }}
                                  className="px-5 py-4 rounded-2xl font-black transition-all duration-300 text-sm hover:scale-105"
                                  style={{
                                    background: `linear-gradient(135deg, ${customTheme.colors.surface}, ${customTheme.colors.background})`,
                                    color: customTheme.colors.text,
                                    boxShadow: `0 8px 32px ${customTheme.colors.border}30`
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'scale(1.05)';
                                    e.currentTarget.style.boxShadow = `0 12px 48px ${customTheme.colors.border}40`;
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'scale(1)';
                                    e.currentTarget.style.boxShadow = `0 8px 32px ${customTheme.colors.border}30`;
                                  }}
                                >
                                  ترقية الحساب
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Premium Footer */}
                <div 
                  className="px-8 py-6 relative overflow-hidden"
                  style={{
                    background: `linear-gradient(135deg, ${customTheme.colors.background} 0%, ${customTheme.colors.surface}30 100%)`,
                    borderTop: `1px solid ${customTheme.colors.border}10`
                  }}
                >
                  <div 
                    className="absolute bottom-0 left-0 w-full h-px"
                    style={{
                      background: `linear-gradient(90deg, transparent, ${customTheme.colors.primary}30, transparent)`
                    }}
                  />
                  
                  <div className="flex justify-end space-x-reverse space-x-4 relative">
                    <button
                      onClick={() => setShowSettings(false)}
                      className="px-6 py-3 rounded-2xl font-bold transition-all duration-300 text-sm hover:scale-105 relative overflow-hidden group"
                      style={{
                        background: `linear-gradient(135deg, ${customTheme.colors.surface}, ${customTheme.colors.background})`,
                        color: customTheme.colors.text,
                        boxShadow: `0 8px 32px ${customTheme.colors.border}30`
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.05)';
                        e.currentTarget.style.boxShadow = `0 12px 48px ${customTheme.colors.border}40`;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.boxShadow = `0 8px 32px ${customTheme.colors.border}30`;
                      }}
                    >
                      <span className="relative z-10">{t.cancel}</span>
                    </button>
                    <button
                      onClick={handleSaveSettings}
                      className="px-6 py-3 rounded-2xl font-black transition-all duration-300 text-sm hover:scale-105 relative overflow-hidden group"
                      style={{
                        background: `linear-gradient(135deg, ${customTheme.colors.primary}, ${customTheme.colors.accent})`,
                        color: '#ffffff',
                        boxShadow: `0 12px 48px ${customTheme.colors.primary}40`
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.05)';
                        e.currentTarget.style.boxShadow = `0 16px 64px ${customTheme.colors.primary}50`;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.boxShadow = `0 12px 48px ${customTheme.colors.primary}40`;
                      }}
                    >
                      <span className="relative z-10">{t.saveChanges}</span>
                      <div 
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{
                          background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)'
                        }}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Authentication Modals */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
      
      <AccountSwitcher 
        isOpen={showAccountSwitcher} 
        onClose={() => setShowAccountSwitcher(false)} 
      />
    </>
  );
}
