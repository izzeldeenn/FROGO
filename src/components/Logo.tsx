'use client';

import { useTheme } from '@/contexts/ThemeContext';

export function Logo() {
  const { theme } = useTheme();
  
  return (
    <div className="flex items-center justify-center">
      <div className="flex items-center space-x-3 space-x-reverse">
        <img 
          src="/mr_frogo.png" 
          alt="Mr Frogo" 
          className="w-14 h-14 object-contain"
        />
        <div className="flex flex-col items-center">
          <div className={`text-2xl font-bold tracking-tight ${
            theme === 'light' ? 'text-black' : 'text-white'
          }`}>
            <span className={`inline-block font-black ${
              theme === 'light' ? 'text-gray-700' : 'text-gray-300'
            }`}>
              Frogo
            </span>
          </div>
          <div className={`text-xs mt-1 font-medium tracking-wider ${
            theme === 'light' ? 'text-gray-500' : 'text-gray-400'
          }`}>
            Focus. Rise. Organize. Go.
          </div>
        </div>
      </div>
    </div>
  );
}
