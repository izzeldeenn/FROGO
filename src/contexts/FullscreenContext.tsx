'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface FullscreenContextType {
  showFullscreenPrompt: boolean;
  setShowFullscreenPrompt: (show: boolean) => void;
  requestFullscreen: () => Promise<void>;
}

const FullscreenContext = createContext<FullscreenContextType | undefined>(undefined);

export function FullscreenProvider({ children }: { children: ReactNode }) {
  const [showFullscreenPrompt, setShowFullscreenPrompt] = useState(false);

  const requestFullscreen = async () => {
    try {
      const elem = document.documentElement;
      
      // Check if fullscreen is already active
      if (document.fullscreenElement) {
        setShowFullscreenPrompt(false);
        return;
      }

      // Try to request fullscreen with user gesture
      if (elem.requestFullscreen) {
        await elem.requestFullscreen();
      } else if ((elem as any).webkitRequestFullscreen) {
        await (elem as any).webkitRequestFullscreen();
      } else if ((elem as any).msRequestFullscreen) {
        await (elem as any).msRequestFullscreen();
      }
      
      setShowFullscreenPrompt(false);
    } catch (error) {
      // Keep showing prompt if failed
    }
  };

  return (
    <FullscreenContext.Provider value={{
      showFullscreenPrompt,
      setShowFullscreenPrompt,
      requestFullscreen
    }}>
      {children}
    </FullscreenContext.Provider>
  );
}

export function useFullscreen() {
  const context = useContext(FullscreenContext);
  if (context === undefined) {
    throw new Error('useFullscreen must be used within a FullscreenProvider');
  }
  return context;
}
