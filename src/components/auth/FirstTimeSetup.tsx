'use client';

import { useEffect } from 'react';
import { applyPreset, getDefaultPreset } from '@/constants/defaultPresets';

export function FirstTimeSetup() {
  useEffect(() => {
    const setupDefaultSettings = () => {
      try {
        const hasAppliedDefaultPreset = localStorage.getItem('defaultPresetApplied');
        
        if (!hasAppliedDefaultPreset) {
          // Apply productive preset immediately for first-time users
          const defaultPreset = getDefaultPreset();
          applyPreset(defaultPreset);
          
          // Mark that default preset has been applied
          localStorage.setItem('defaultPresetApplied', 'true');
          
        }
      } catch (error) {
        console.error('Error in first time setup:', error);
      }
    };

    // Run setup immediately when component mounts
    setupDefaultSettings();
  }, []);

  // This component doesn't render anything
  return null;
}
