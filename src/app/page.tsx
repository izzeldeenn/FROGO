'use client';

import { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageLayout } from '@/components/LanguageLayout';
import { Logo } from '@/components/Logo';
import { ThemeToggle } from '@/components/ThemeToggle';
import { CustomThemeProvider } from '@/contexts/CustomThemeContext';
import { useCustomThemeClasses } from '@/hooks/useCustomThemeClasses';

export default function LandingPage() {
  return (
    <CustomThemeProvider>
      <LandingPageContent />
    </CustomThemeProvider>
  );
}

function LandingPageContent() {
  const { theme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const [email, setEmail] = useState('');
  const customTheme = useCustomThemeClasses();

  const features = [
    {
      icon: '⏱️',
      title: language === 'ar' ? 'مؤقت ذكي' : 'Smart Timer',
      description: language === 'ar' 
        ? 'تتبع وقت الدراسة بدقة مع حفظ تلقائي' 
        : 'Track study time accurately with automatic saving'
    },
    {
      icon: '🏆',
      title: language === 'ar' ? 'نظام نقاط' : 'Points System',
      description: language === 'ar' 
        ? 'اجمع العملات وارتفع في المستويات' 
        : 'Collect coins and level up'
    },
    {
      icon: '📊',
      title: language === 'ar' ? 'لوحة متصدرين' : 'Leaderboard',
      description: language === 'ar' 
        ? 'تنافس مع الأصدقاء وتتبع تقدمك' 
        : 'Compete with friends and track your progress'
    },
    {
      icon: '🎨',
      title: language === 'ar' ? 'تخصيص' : 'Customization',
      description: language === 'ar' 
        ? 'اختر أفاتارك وشخصّن تجربتك' 
        : 'Choose your avatar and personalize your experience'
    },
    {
      icon: '📱',
      title: language === 'ar' ? 'متعدد المنصات' : 'Multi-Platform',
      description: language === 'ar' 
        ? 'يعمل على جميع الأجهزة' 
        : 'Works on all devices'
    },
    {
      icon: '🔄',
      title: language === 'ar' ? 'مزامنة فورية' : 'Real-time Sync',
      description: language === 'ar' 
        ? 'بياناتك محفوظة ومتزامنة دائماً' 
        : 'Your data is always saved and synchronized'
    }
  ];

  const stats = [
    { number: '10K+', label: language === 'ar' ? 'مستخدم نشط' : 'Active Users' },
    { number: '50K+', label: language === 'ar' ? 'ساعة دراسة' : 'Study Hours' },
    { number: '100+', label: language === 'ar' ? 'مستوى' : 'Levels' },
    { number: '24/7', label: language === 'ar' ? 'متاح' : 'Available' }
  ];

  return (
    <LanguageLayout>
      <div className={`min-h-screen ${
        theme === 'light' ? 'bg-white' : 'bg-black'
      }`}>
      {/* Header */}
      <header className={`sticky top-0 z-50 border-b ${
        theme === 'light' 
          ? 'bg-white/90 backdrop-blur-sm border-gray-200' 
          : 'bg-black/90 backdrop-blur-sm border-gray-800'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Logo />
            <div className="flex items-center gap-6 space-x-reverse">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as 'en' | 'ar')}
                className={`px-4 py-2 border-2 rounded-lg text-sm font-medium transition-colors min-w-[100px] ${
                  theme === 'light'
                    ? 'border-gray-300 bg-white text-black hover:border-gray-400'
                    : 'border-gray-600 bg-black text-white hover:border-gray-500'
                }`}
              >
                <option value="en">English</option>
                <option value="ar">العربية</option>
              </select>
              <ThemeToggle />
              <a 
                href="/app"
                className="px-6 py-2 rounded-lg font-medium transition-colors whitespace-nowrap"
                style={{
                  backgroundColor: customTheme.colors.primary,
                  color: '#ffffff',
                  border: `2px solid ${customTheme.colors.primary}`
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = customTheme.colors.accent;
                  e.currentTarget.style.borderColor = customTheme.colors.accent;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = customTheme.colors.primary;
                  e.currentTarget.style.borderColor = customTheme.colors.primary;
                }}
              >
                {language === 'ar' ? 'ابدأ الدراسة' : 'Start Studying'}
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className={`text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 ${
            theme === 'light' ? 'text-black' : 'text-white'
          }`}>
            {language === 'ar' ? 'دراسة ذكية' : 'Smart Study'}
            <span className="block" style={{ color: customTheme.colors.primary }}>
              {language === 'ar' ? 'بأسلوب جديد' : 'In a New Way'}
            </span>
          </h1>
          
          <p className={`text-xl sm:text-2xl mb-8 max-w-3xl mx-auto ${
            theme === 'light' ? 'text-gray-600' : 'text-gray-400'
          }`}>
            {language === 'ar' 
              ? 'نظام متكامل لتتبع وقت الدراسة، تحصيل نقاط، والتنافس مع الأصدقاء. حوّل وقت الدراسة إلى تجربة ممتعة ومجزية.'
              : 'A comprehensive system for tracking study time, earning points, and competing with friends. Turn study time into a fun and rewarding experience.'
            }
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <a 
              href="/app"
              className="px-8 py-4 rounded-lg font-bold text-lg transition-all hover:scale-105"
              style={{
                backgroundColor: customTheme.colors.primary,
                color: '#ffffff',
                border: `2px solid ${customTheme.colors.primary}`
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = customTheme.colors.accent;
                e.currentTarget.style.borderColor = customTheme.colors.accent;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = customTheme.colors.primary;
                e.currentTarget.style.borderColor = customTheme.colors.primary;
              }}
            >
              {language === 'ar' ? 'ابدأ الدراسة الآن' : 'Start Studying Now'}
            </a>
            <button 
              className="px-8 py-4 rounded-lg font-bold text-lg border-2 transition-all hover:scale-105"
              style={{
                borderColor: customTheme.colors.border,
                color: customTheme.colors.text,
                backgroundColor: 'transparent'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = customTheme.colors.border;
                e.currentTarget.style.color = '#ffffff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = customTheme.colors.text;
              }}
            >
              {language === 'ar' ? 'تعرف أكثر' : 'Learn More'}
            </button>
          </div>

          {/* Get Updates */}
          <div 
            className="max-w-md mx-auto p-6 rounded-2xl border-2"
            style={{
              backgroundColor: customTheme.colors.surface,
              borderColor: customTheme.colors.border
            }}
          >
            <h3 className={`text-lg font-bold mb-4 ${
              theme === 'light' ? 'text-black' : 'text-white'
            }`}>
              {language === 'ar' ? 'احصل على تحديثات جديدة' : 'Get New Updates'}
            </h3>
            <div className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={language === 'ar' ? 'بريدك الإلكتروني' : 'Your email'}
                className="flex-1 px-4 py-2 rounded-lg border-2 focus:outline-none"
                style={{
                  backgroundColor: theme === 'light' ? '#ffffff' : '#000000',
                  borderColor: customTheme.colors.border,
                  color: customTheme.colors.text
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = customTheme.colors.primary;
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = customTheme.colors.border;
                }}
              />
              <button 
                className="px-6 py-2 rounded-lg font-medium transition-colors"
                style={{
                  backgroundColor: customTheme.colors.primary,
                  color: '#ffffff',
                  border: `2px solid ${customTheme.colors.primary}`
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = customTheme.colors.accent;
                  e.currentTarget.style.borderColor = customTheme.colors.accent;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = customTheme.colors.primary;
                  e.currentTarget.style.borderColor = customTheme.colors.primary;
                }}
              >
                {language === 'ar' ? 'اشترك' : 'Subscribe'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section 
        className="py-16 px-4 sm:px-6 lg:px-8"
        style={{ backgroundColor: customTheme.colors.surface }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index}>
                <div className="text-3xl sm:text-4xl font-bold mb-2" style={{ color: customTheme.colors.primary }}>
                  {stat.number}
                </div>
                <div className={`text-sm sm:text-base ${
                  theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                }`}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className={`text-4xl sm:text-5xl font-bold mb-4 ${
              theme === 'light' ? 'text-black' : 'text-white'
            }`}>
              {language === 'ar' ? 'المميزات' : 'Features'}
            </h2>
            <p className={`text-xl ${
              theme === 'light' ? 'text-gray-600' : 'text-gray-400'
            }`}>
              {language === 'ar' 
                ? 'كل ما تحتاجه لدراسة أفضل وأكثر فعالية'
                : 'Everything you need for better and more effective study'
              }
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="p-8 rounded-2xl border-2 transition-all hover:scale-105"
                style={{
                  backgroundColor: theme === 'light' ? '#ffffff' : '#000000',
                  borderColor: customTheme.colors.border
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = customTheme.colors.primary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = customTheme.colors.border;
                }}
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className={`text-xl font-bold mb-2 ${
                  theme === 'light' ? 'text-black' : 'text-white'
                }`}>
                  {feature.title}
                </h3>
                <p className={`
                  ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}
                }`}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section 
        className="py-20 px-4 sm:px-6 lg:px-8"
        style={{ backgroundColor: customTheme.colors.background }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className={`text-4xl sm:text-5xl font-bold mb-4 ${
            theme === 'light' ? 'text-black' : 'text-white'
          }`}>
            {language === 'ar' ? 'هل أنت مستعد للبدء؟' : 'Ready to Start?'}
          </h2>
          <p className={`text-xl mb-8 ${
            theme === 'light' ? 'text-gray-600' : 'text-gray-400'
          }`}>
            {language === 'ar' 
              ? 'ابدأ دراستك الآن بدون تسجيل أو إنشاء حساب' 
              : 'Start studying now without registration or account creation'
            }
          </p>
          <a 
            href="/app"
            className="inline-block px-8 py-4 rounded-lg font-bold text-lg transition-all hover:scale-105"
            style={{
              backgroundColor: customTheme.colors.primary,
              color: '#ffffff',
              border: `2px solid ${customTheme.colors.primary}`
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = customTheme.colors.accent;
              e.currentTarget.style.borderColor = customTheme.colors.accent;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = customTheme.colors.primary;
              e.currentTarget.style.borderColor = customTheme.colors.primary;
            }}
          >
            {language === 'ar' ? 'ابدأ الدراسة فوراً' : 'Start Studying Now'}
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer 
        className="py-12 px-4 sm:px-6 lg:px-8 border-t"
        style={{
          backgroundColor: customTheme.colors.surface,
          borderColor: customTheme.colors.border
        }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div>
              <Logo />
              <p className={`mt-4 text-sm ${
                theme === 'light' ? 'text-gray-600' : 'text-gray-400'
              }`}>
                {language === 'ar' 
                  ? 'نظام ذكي لإدارة وقت الدراسة وتحسين الأداء' 
                  : 'Smart system for managing study time and improving performance'
                }
              </p>
            </div>
            
            <div>
              <h4 className={`font-bold mb-4 ${
                theme === 'light' ? 'text-black' : 'text-white'
              }`}>
                {language === 'ar' ? 'المنتج' : 'Product'}
              </h4>
              <ul className={`space-y-2 text-sm ${
                theme === 'light' ? 'text-gray-600' : 'text-gray-400'
              }`}>
                <li>{language === 'ar' ? 'المميزات' : 'Features'}</li>
                <li>{language === 'ar' ? 'الأسعار' : 'Pricing'}</li>
                <li>{language === 'ar' ? 'المدونة' : 'Blog'}</li>
                <li>{language === 'ar' ? 'الدعم' : 'Support'}</li>
              </ul>
            </div>
            
            <div>
              <h4 className={`font-bold mb-4 ${
                theme === 'light' ? 'text-black' : 'text-white'
              }`}>
                {language === 'ar' ? 'الشركة' : 'Company'}
              </h4>
              <ul className={`space-y-2 text-sm ${
                theme === 'light' ? 'text-gray-600' : 'text-gray-400'
              }`}>
                <li>{language === 'ar' ? 'من نحن' : 'About Us'}</li>
                <li>{language === 'ar' ? 'الفريق' : 'Team'}</li>
                <li>{language === 'ar' ? 'الوظائف' : 'Careers'}</li>
                <li>{language === 'ar' ? 'اتصل بنا' : 'Contact'}</li>
              </ul>
            </div>
            
            <div>
              <h4 className={`font-bold mb-4 ${
                theme === 'light' ? 'text-black' : 'text-white'
              }`}>
                {language === 'ar' ? 'متابعة' : 'Follow'}
              </h4>
              <div className="flex space-x-4 space-x-reverse text-2xl">
                <span>📱</span>
                <span>💬</span>
                <span>📧</span>
                <span>🐦</span>
              </div>
            </div>
          </div>
          
          <div className={`pt-8 border-t text-center text-sm ${
            theme === 'light' 
              ? 'border-gray-200 text-gray-600' 
              : 'border-gray-800 text-gray-400'
          }`}>
            © 2024 {language === 'ar' ? 'فروجو. جميع الحقوق محفوظة.' : 'Frogo. All rights reserved.'}
          </div>
        </div>
      </footer>
      </div>
    </LanguageLayout>
  );
}
