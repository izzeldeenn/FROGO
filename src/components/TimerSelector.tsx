'use client';

import { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Timer } from './Timer';
import { PomodoroTimer } from './PomodoroTimer';
import { CountdownTimer } from './CountdownTimer';
import { YouTubeTimer } from './YouTubeTimer';

type TimerType = 'stopwatch' | 'pomodoro' | 'countdown' | 'youtube';

export function TimerSelector() {
  const { theme } = useTheme();
  const [activeTimer, setActiveTimer] = useState<TimerType>('stopwatch');

  const renderTimer = () => {
    switch (activeTimer) {
      case 'stopwatch':
        return <Timer />;
      case 'pomodoro':
        return <PomodoroTimer />;
      case 'countdown':
        return <CountdownTimer />;
      case 'youtube':
        return <YouTubeTimer />;
      default:
        return <Timer />;
    }
  };

  const timerButtons = [
    { type: 'stopwatch' as TimerType, label: 'ساعة إيقاف', icon: '⏱️' },
    { type: 'pomodoro' as TimerType, label: 'بومودورو', icon: '🍅' },
    { type: 'countdown' as TimerType, label: 'عد تنازلي', icon: '⏰' },
    { type: 'youtube' as TimerType, label: 'مؤقت يوتيوب', icon: '▶️' }
  ];

  return (
    <div className="w-full h-full flex flex-col md:flex-row">
      {/* Active Timer */}
      <div className="flex-1 flex items-center justify-center">
        {renderTimer()}
      </div>

      {/* Side Icons - Desktop Only */}
      <div className="hidden md:flex flex-col items-center justify-center gap-6 p-4">
        {timerButtons.map((button) => (
          <button
            key={button.type}
            onClick={() => setActiveTimer(button.type)}
            className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl transition-all duration-200 backdrop-blur-sm ${
              activeTimer === button.type
                ? theme === 'light'
                  ? 'bg-black/20 border-2 border-black'
                  : 'bg-white/20 border-2 border-white'
                : theme === 'light'
                  ? 'bg-white/10 border-2 border-gray-300 hover:bg-white/20 hover:border-gray-400'
                  : 'bg-black/10 border-2 border-gray-600 hover:bg-black/20 hover:border-gray-500'
            }`}
            title={button.label}
          >
            {button.icon}
          </button>
        ))}
      </div>

      {/* Bottom Icons - Mobile Only */}
      <div className="md:hidden flex justify-center items-center gap-4 p-4 border-t border-gray-200 dark:border-gray-700">
        {timerButtons.map((button) => (
          <button
            key={button.type}
            onClick={() => setActiveTimer(button.type)}
            className={`w-12 h-12 rounded-full flex items-center justify-center text-xl transition-all duration-200 backdrop-blur-sm ${
              activeTimer === button.type
                ? theme === 'light'
                  ? 'bg-black/20 border-2 border-black'
                  : 'bg-white/20 border-2 border-white'
                : theme === 'light'
                  ? 'bg-white/10 border-2 border-gray-300 hover:bg-white/20 hover:border-gray-400'
                  : 'bg-black/10 border-2 border-gray-600 hover:bg-black/20 hover:border-gray-500'
            }`}
            title={button.label}
          >
            {button.icon}
          </button>
        ))}
      </div>
    </div>
  );
}
