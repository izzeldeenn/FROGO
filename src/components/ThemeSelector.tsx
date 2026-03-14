'use client';

import { useState } from 'react';
import { useCustomTheme, getThemeClasses } from '@/contexts/CustomThemeContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';

interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  border: string;
}

export function ThemeSelector() {
  const { currentTheme, setTheme, availableThemes, createCustomTheme, updateThemeColors } = useCustomTheme();
  const { theme } = useTheme();
  const { language, t } = useLanguage();
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

  const themeClasses = getThemeClasses(currentTheme, theme === 'dark');

  return (
    <div className={`p-6 rounded-2xl border-2 ${
      theme === 'light' ? 'bg-white border-gray-200' : 'bg-gray-900 border-gray-700'
    }`}>
      <h3 className={`text-xl font-bold mb-6 ${
        theme === 'light' ? 'text-gray-800' : 'text-gray-200'
      }`}>
        {language === 'ar' ? 'اختيار الثيم' : 'Theme Selection'}
      </h3>

      {/* Predefined Themes */}
      <div className="mb-8">
        <h4 className={`text-lg font-semibold mb-4 ${
          theme === 'light' ? 'text-gray-700' : 'text-gray-300'
        }`}>
          {language === 'ar' ? 'الثيمات الجاهزة' : 'Predefined Themes'}
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {availableThemes.map((themeOption) => (
            <button
              key={themeOption.name}
              onClick={() => setTheme(themeOption)}
              className={`p-4 rounded-xl border-2 transition-all hover:scale-105 ${
                currentTheme.name === themeOption.name
                  ? 'border-blue-500 shadow-lg'
                  : theme === 'light'
                  ? 'border-gray-300 hover:border-gray-400'
                  : 'border-gray-600 hover:border-gray-500'
              }`}
            >
              <div className="flex items-center space-x-2 mb-2">
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
              <div className={`text-sm font-medium ${
                theme === 'light' ? 'text-gray-700' : 'text-gray-300'
              }`}>
                {themeOption.name}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Theme Creator */}
      <div className="mb-6">
        <button
          onClick={() => setShowCustomCreator(!showCustomCreator)}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            theme === 'light'
              ? 'bg-blue-500 text-white hover:bg-blue-600'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {showCustomCreator 
            ? (language === 'ar' ? 'إغلاق' : 'Close')
            : (language === 'ar' ? 'إنشاء ثيم مخصص' : 'Create Custom Theme')
          }
        </button>
      </div>

      {showCustomCreator && (
        <div className={`p-4 rounded-xl border-2 ${
          theme === 'light' ? 'bg-gray-50 border-gray-200' : 'bg-gray-800 border-gray-700'
        }`}>
          <h4 className={`text-lg font-semibold mb-4 ${
            theme === 'light' ? 'text-gray-700' : 'text-gray-300'
          }`}>
            {language === 'ar' ? 'مصمم الألوان' : 'Color Designer'}
          </h4>

          {/* Theme Name */}
          <div className="mb-4">
            <label className={`block text-sm font-medium mb-2 ${
              theme === 'light' ? 'text-gray-700' : 'text-gray-300'
            }`}>
              {language === 'ar' ? 'اسم الثيم' : 'Theme Name'}
            </label>
            <input
              type="text"
              value={customThemeName}
              onChange={(e) => setCustomThemeName(e.target.value)}
              placeholder={language === 'ar' ? 'أدخل اسم الثيم' : 'Enter theme name'}
              className={`w-full px-3 py-2 border-2 rounded-lg focus:outline-none ${
                theme === 'light'
                  ? 'border-gray-300 bg-white text-black focus:border-blue-500'
                  : 'border-gray-600 bg-black text-white focus:border-blue-400'
              }`}
            />
          </div>

          {/* Color Pickers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {Object.entries(customColors).map(([key, value]) => (
              <div key={key}>
                <label className={`block text-sm font-medium mb-2 ${
                  theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                }`}>
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </label>
                <div className="flex items-center space-x-2">
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
                    className={`flex-1 px-3 py-2 border-2 rounded-lg focus:outline-none ${
                      theme === 'light'
                        ? 'border-gray-300 bg-white text-black focus:border-blue-500'
                        : 'border-gray-600 bg-black text-white focus:border-blue-400'
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <button
              onClick={handleQuickColorUpdate}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                theme === 'light'
                  ? 'bg-green-500 text-white hover:bg-green-600'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              {language === 'ar' ? 'معاينة سريعة' : 'Quick Preview'}
            </button>
            <button
              onClick={handleCreateCustomTheme}
              disabled={!customThemeName.trim()}
              className={`px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                theme === 'light'
                  ? 'bg-blue-500 text-white hover:bg-blue-600'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {language === 'ar' ? 'حفظ الثيم' : 'Save Theme'}
            </button>
          </div>
        </div>
      )}

      {/* Current Theme Preview */}
      <div className={`p-4 rounded-xl border-2 ${
        theme === 'light' ? 'bg-gray-50 border-gray-200' : 'bg-gray-800 border-gray-700'
      }`}>
        <h4 className={`text-lg font-semibold mb-4 ${
          theme === 'light' ? 'text-gray-700' : 'text-gray-300'
        }`}>
          {language === 'ar' ? 'الثيم الحالي' : 'Current Theme'}: {currentTheme.name}
        </h4>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
          {Object.entries(currentTheme.colors).map(([key, value]) => (
            <div key={key} className="text-center">
              <div 
                className="w-full h-12 rounded-lg border-2 border-gray-300 mb-1"
                style={{ backgroundColor: value }}
              />
              <div className={`text-xs ${
                theme === 'light' ? 'text-gray-600' : 'text-gray-400'
              }`}>
                {key}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
