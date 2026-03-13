'use client';

import { useTheme } from '@/contexts/ThemeContext';
import { useUser } from '@/contexts/UserContext';
import { useLanguage } from '@/contexts/LanguageContext';

export function CurrentUserSelector() {
  const { theme } = useTheme();
  const { getCurrentUser, isTimerActive } = useUser();
  const { language, t } = useLanguage();
  
  const currentUser = getCurrentUser();
  const isActive = isTimerActive();

  return (
    <div className="mb-6">
      <h3 className={`text-lg font-bold mb-3 ${
        theme === 'light' ? 'text-black' : 'text-white'
      }`}>{language === 'ar' ? 'الحساب الحالي' : 'Current Account'}</h3>
      
      {currentUser ? (
        <div className={`p-3 border-2 rounded-lg ${
          theme === 'light'
            ? 'border-gray-300 bg-white'
            : 'border-gray-600 bg-black'
        }`}>
          <div className="flex justify-between items-center">
            <span className={`font-medium ${
              theme === 'light' ? 'text-black' : 'text-white'
            }`}>
              {currentUser.username}
            </span>
            {isActive && (
              <span className={`text-xs px-2 py-1 rounded-full animate-pulse ${
                theme === 'light'
                  ? 'bg-green-500 text-white'
                  : 'bg-green-600 text-white'
              }`}>
                {t.active}
              </span>
            )}
          </div>
          <div className={`text-xs mt-1 ${
            theme === 'light' ? 'text-gray-600' : 'text-gray-400'
          }`}>
            {language === 'ar' ? 'نقاط' : 'Points'}: {currentUser.score} | {language === 'ar' ? 'وقت الدراسة' : 'Study Time'}: {Math.floor(currentUser.studyTime / 60)} {language === 'ar' ? 'دقيقة' : 'minutes'}
          </div>
        </div>
      ) : (
        <p className={`text-sm ${
          theme === 'light' ? 'text-gray-600' : 'text-gray-400'
        }`}>
          {language === 'ar' ? 'حساب غير معروف' : 'Unknown Account'}
        </p>
      )}
    </div>
  );
}
 