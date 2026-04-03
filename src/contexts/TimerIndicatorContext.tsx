'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface TimerIndicatorContextType {
  isTimerActive: boolean;
  setTimerActive: (active: boolean) => void;
}

const TimerIndicatorContext = createContext<TimerIndicatorContextType | undefined>(undefined);

export function TimerIndicatorProvider({ children }: { children: ReactNode }) {
  const [isTimerActive, setIsTimerActive] = useState(false);

  const setTimerActiveState = (active: boolean) => {
    setIsTimerActive(active);
    
    // Also store in localStorage for backup
    if (typeof window !== 'undefined') {
      localStorage.setItem('timerIndicatorActive', active.toString());
    }
  };

  // Initialize from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('timerIndicatorActive');
      if (stored !== null) {
        setIsTimerActive(stored === 'true');
      }
    }
  }, []);

  return (
    <TimerIndicatorContext.Provider value={{ isTimerActive, setTimerActive: setTimerActiveState }}>
      {children}
    </TimerIndicatorContext.Provider>
  );
}

export function useTimerIndicator() {
  const context = useContext(TimerIndicatorContext);
  if (context === undefined) {
    throw new Error('useTimerIndicator must be used within a TimerIndicatorProvider');
  }
  return context;
}
