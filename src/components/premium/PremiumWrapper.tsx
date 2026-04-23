'use client';

import { ReactNode } from 'react';
import { usePremium } from '@/contexts/PremiumContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useCustomThemeClasses } from '@/hooks/useCustomThemeClasses';

interface PremiumWrapperProps {
  children: ReactNode;
  fallback?: ReactNode;
  showUpgradeButton?: boolean;
  onUpgradeClick?: () => void;
}

export function PremiumWrapper({ 
  children, 
  fallback, 
  showUpgradeButton = true,
  onUpgradeClick 
}: PremiumWrapperProps) {
  const { isPremium, isLoading } = usePremium();
  const { language } = useLanguage();
  const { theme } = useTheme();
  const customTheme = useCustomThemeClasses();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-current border-t-transparent" />
      </div>
    );
  }

  if (isPremium) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  return (
    <div 
      className="relative overflow-hidden rounded-2xl p-6 backdrop-blur-xl"
      style={{
        background: `linear-gradient(135deg, ${customTheme.colors.surface}60, ${customTheme.colors.background}20)`,
        border: `1px solid ${customTheme.colors.border}20`,
        boxShadow: `0 8px 32px ${customTheme.colors.border}15`
      }}
    >
      <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl opacity-20"
        style={{
          background: `radial-gradient(circle, #FFD700, transparent)`
        }}
      />
      
      <div className="relative text-center">
        <div className="text-4xl mb-4">👑</div>
        <h3 className={`text-lg font-black mb-2 ${
          theme === 'light' ? 'text-gray-900' : 'text-gray-50'
        }`}>
          {language === 'ar' ? 'ميزة بريميوم' : 'Premium Feature'}
        </h3>
        <p className={`text-sm mb-4 ${
          theme === 'light' ? 'text-gray-600' : 'text-gray-400'
        }`}>
          {language === 'ar' 
            ? 'هذه الميزة متاحة فقط للمشتركين البريميوم'
            : 'This feature is available for premium subscribers only'
          }
        </p>
        
        {showUpgradeButton && (
          <button
            onClick={onUpgradeClick}
            className={`px-6 py-3 rounded-xl font-medium transition-all hover:scale-105 active:scale-95`}
            style={{
              background: `linear-gradient(135deg, #FFD700, #FFA500)`,
              color: '#ffffff',
              boxShadow: `0 8px 32px #FFD70040`
            }}
          >
            {language === 'ar' ? 'ترقية إلى بريميوم' : 'Upgrade to Premium'}
          </button>
        )}
      </div>
    </div>
  );
}
