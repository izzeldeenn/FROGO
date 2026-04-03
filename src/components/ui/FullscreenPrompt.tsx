'use client';

import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useFullscreen } from '@/contexts/FullscreenContext';

export function FullscreenPrompt() {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const { showFullscreenPrompt, setShowFullscreenPrompt, requestFullscreen } = useFullscreen();

  if (!showFullscreenPrompt) return null;

  return (
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
          <div className="flex justify-center space-x-4 space-x-reverse">
            <button
              onClick={requestFullscreen}
              className={`px-6 py-3 rounded-lg font-semibold text-base transition-all duration-200 shadow-lg ${
                theme === 'light'
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              {language === 'ar' ? 'تفعيل ملء الشاشة' : 'Enable Fullscreen'}
            </button>
            <button
              onClick={() => setShowFullscreenPrompt(false)}
              className={`px-6 py-3 rounded-lg font-semibold text-base transition-all duration-200 shadow-lg ${
                theme === 'light'
                  ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
              }`}
            >
              {language === 'ar' ? 'تخطي' : 'Skip'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
