'use client';

import { useLanguage } from '@/contexts/LanguageContext';

interface LanguageLayoutProps {
  children: React.ReactNode;
}

export function LanguageLayout({ children }: LanguageLayoutProps) {
  const { isRTL } = useLanguage();

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className="w-full h-full">
      {children}
    </div>
  );
}
