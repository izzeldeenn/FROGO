'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'ar';

const translations = {
  en: {
    // Timer
    timer: 'Timer',
    stopwatch: 'Stopwatch',
    pomodoro: 'Pomodoro',
    countdown: 'Countdown',
    youtube: 'YouTube Timer',
    // Rankings
    rankings: 'Rankings',
    noDevices: 'No devices yet',
    active: 'Active',
    today: 'Today',
    coins: 'Coins',
    // Settings
    settings: 'Settings',
    deviceName: 'Device Name',
    appearance: 'Appearance',
    avatar: 'Avatar',
    statistics: 'Device Statistics',
    level: 'Level',
    experience: 'Experience',
    rank: 'Rank',
    language: 'Language',
    saveChanges: 'Save Changes',
    cancel: 'Cancel',
    deviceActive: 'Active Device',
    unknownDevice: 'Unknown Device',
    enterDeviceName: 'Enter device name',
    // Common
    coinsText: 'Coins',
    levelText: 'Level',
    timeToday: 'Time Today',
    coinsToday: 'Coins Today',
    up: 'Up',
    down: 'Down'
  },
  ar: {
    // Timer
    timer: 'مؤقت',
    stopwatch: 'ساعة إيقاف',
    pomodoro: 'بومودورو',
    countdown: 'عد تنازلي',
    youtube: 'مؤقت يوتيوب',
    // Rankings
    rankings: 'الترتيب',
    noDevices: 'لا يوجد أجهزة بعد',
    active: 'نشط',
    today: 'اليوم',
    coins: 'عملات',
    // Settings
    settings: 'إعدادات',
    deviceName: 'اسم الجهاز',
    appearance: 'المظهر',
    avatar: 'الأفاتار',
    statistics: 'إحصائيات الجهاز',
    level: 'مستوى',
    experience: 'خبرة',
    rank: 'ترتيب',
    language: 'اللغة',
    saveChanges: 'حفظ التغييرات',
    cancel: 'إلغاء',
    deviceActive: 'جهاز نشط',
    unknownDevice: 'جهاز غير معروف',
    enterDeviceName: 'أدخل اسم الجهاز',
    // Common
    coinsText: 'عملات',
    levelText: 'مستوى',
    timeToday: 'وقت اليوم',
    coinsToday: 'عملات اليوم',
    up: 'صاعد',
    down: 'نازل'
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations.en;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('fahman_hub_language', lang);
  };

  useEffect(() => {
    const savedLanguage = localStorage.getItem('fahman_hub_language') as Language;
    if (savedLanguage) {
      setLanguageState(savedLanguage);
    }
  }, []);

  const t = translations[language];
  const isRTL = language === 'ar';

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
