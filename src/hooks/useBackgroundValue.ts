'use client';

import { BACKGROUNDS } from '@/constants/backgrounds';

export const useBackgroundValue = (backgroundId?: string) => {
  const getBackgroundValue = (id?: string): string => {
    const currentId = id || (typeof window !== 'undefined' ? localStorage.getItem('selectedBackground') : 'default');
    const customValue = typeof window !== 'undefined' ? localStorage.getItem('customBackgroundValue') : null;

    // Handle custom backgrounds
    if (currentId?.startsWith('custom-') && customValue) {
      return customValue;
    }

    // Handle default backgrounds
    const background = BACKGROUNDS.find(bg => bg.id === currentId);
    return background?.value || 'transparent';
  };

  const getBackgroundInfo = (id?: string) => {
    const currentId = id || (typeof window !== 'undefined' ? localStorage.getItem('selectedBackground') : 'default');
    const customValue = typeof window !== 'undefined' ? localStorage.getItem('customBackgroundValue') : null;

    // Handle custom backgrounds
    if (currentId?.startsWith('custom-')) {
      return {
        id: currentId,
        name: currentId === 'custom-upload' ? 'مرفوعة من الجهاز' : 'من الإنترنت',
        value: customValue || 'transparent',
        isCustom: true
      };
    }

    // Handle default backgrounds
    const background = BACKGROUNDS.find(bg => bg.id === currentId);
    return background ? {
      ...background,
      isCustom: false
    } : {
      id: 'default',
      name: 'افتراضي',
      value: 'transparent',
      isCustom: false
    };
  };

  return {
    getBackgroundValue,
    getBackgroundInfo
  };
};
