'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  border: string;
}

interface CustomTheme {
  name: string;
  colors: ThemeColors;
}

const lightThemes: CustomTheme[] = [
  {
    name: 'Tea Theme',
    colors: {
      primary: '#84cc16', // lime green
      secondary: '#fbbf24', // yellow
      accent: '#166534', // dark green
      background: '#fef3c7', // light yellow
      surface: '#fde68a', // yellow
      text: '#000000',
      border: '#fbbf24'
    }
  },
  {
    name: 'Ocean Theme',
    colors: {
      primary: '#3b82f6', // blue
      secondary: '#06b6d4', // cyan
      accent: '#1e40af', // dark blue
      background: '#dbeafe', // light blue
      surface: '#bfdbfe', // blue
      text: '#000000',
      border: '#3b82f6'
    }
  },
  {
    name: 'Sunset Theme',
    colors: {
      primary: '#f97316', // orange
      secondary: '#fbbf24', // yellow
      accent: '#dc2626', // red
      background: '#fed7aa', // light orange
      surface: '#fdba74', // orange
      text: '#000000',
      border: '#f97316'
    }
  },
  {
    name: 'Forest Theme',
    colors: {
      primary: '#10b981', // emerald
      secondary: '#84cc16', // lime
      accent: '#047857', // dark emerald
      background: '#d1fae5', // light emerald
      surface: '#a7f3d0', // emerald
      text: '#000000',
      border: '#10b981'
    }
  },
  {
    name: 'Purple Dream',
    colors: {
      primary: '#8b5cf6', // violet
      secondary: '#ec4899', // pink
      accent: '#6d28d9', // dark violet
      background: '#ede9fe', // light violet
      surface: '#ddd6fe', // violet
      text: '#000000',
      border: '#8b5cf6'
    }
  }
];

const darkThemes: CustomTheme[] = [
  {
    name: 'Tea Theme',
    colors: {
      primary: '#22c55e', // brighter green for dark
      secondary: '#f59e0b', // amber for dark
      accent: '#16a34a', // green for dark
      background: '#000000',
      surface: '#111111',
      text: '#ffffff',
      border: '#374151'
    }
  },
  {
    name: 'Ocean Theme',
    colors: {
      primary: '#60a5fa', // brighter blue for dark
      secondary: '#22d3ee', // brighter cyan for dark
      accent: '#2563eb', // blue for dark
      background: '#000000',
      surface: '#111111',
      text: '#ffffff',
      border: '#1e3a8a'
    }
  },
  {
    name: 'Sunset Theme',
    colors: {
      primary: '#fb923c', // brighter orange for dark
      secondary: '#fbbf24', // yellow
      accent: '#ef4444', // red for dark
      background: '#000000',
      surface: '#111111',
      text: '#ffffff',
      border: '#7c2d12'
    }
  },
  {
    name: 'Forest Theme',
    colors: {
      primary: '#34d399', // brighter emerald for dark
      secondary: '#22c55e', // green for dark
      accent: '#059669', // dark emerald for dark
      background: '#000000',
      surface: '#111111',
      text: '#ffffff',
      border: '#064e3b'
    }
  },
  {
    name: 'Purple Dream',
    colors: {
      primary: '#a78bfa', // brighter violet for dark
      secondary: '#f472b6', // pink for dark
      accent: '#7c3aed', // violet for dark
      background: '#000000',
      surface: '#111111',
      text: '#ffffff',
      border: '#4c1d95'
    }
  }
];

const defaultThemes = lightThemes;

interface CustomThemeContextType {
  currentTheme: CustomTheme;
  setTheme: (theme: CustomTheme) => void;
  availableThemes: CustomTheme[];
  createCustomTheme: (name: string, colors: ThemeColors) => void;
  updateThemeColors: (colors: Partial<ThemeColors>) => void;
}

const CustomThemeContext = createContext<CustomThemeContextType | undefined>(undefined);

export function CustomThemeProvider({ children }: { children: ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState<CustomTheme>(defaultThemes[0]);
  const [availableThemes, setAvailableThemes] = useState<CustomTheme[]>(defaultThemes);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Update available themes based on dark/light mode
  useEffect(() => {
    const checkDarkMode = () => {
      const darkMode = document.documentElement.classList.contains('dark');
      setIsDarkMode(darkMode);
      setAvailableThemes(darkMode ? darkThemes : lightThemes);
    };

    // Initial check
    checkDarkMode();

    // Listen for theme changes
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    // Load saved theme from localStorage
    const savedTheme = localStorage.getItem('customTheme');
    if (savedTheme) {
      try {
        const parsed = JSON.parse(savedTheme);
        const theme = availableThemes.find(t => t.name === parsed.name) || parsed;
        if (theme && theme.colors) {
          setCurrentTheme(theme);
        }
      } catch (error) {
        console.error('Error loading saved theme:', error);
      }
    }
  }, [availableThemes]);

  const setTheme = (theme: CustomTheme) => {
    if (theme && theme.colors) {
      setCurrentTheme(theme);
      localStorage.setItem('customTheme', JSON.stringify(theme));
    }
  };

  const createCustomTheme = (name: string, colors: ThemeColors) => {
    const newTheme: CustomTheme = { name, colors };
    const updatedThemes = [...availableThemes, newTheme];
    setAvailableThemes(updatedThemes);
    setTheme(newTheme);
    
    // Also set timer settings to use large fonts when creating custom theme
    const largeTimerSettings = {
      color: colors.primary || '#84cc16',
      font: 'font-mono',
      design: 'minimal',
      size: 'text-6xl'
    };
    
    localStorage.setItem('timer_settings', JSON.stringify(largeTimerSettings));
    window.dispatchEvent(new CustomEvent('timerSettingsChanged', { detail: largeTimerSettings }));
    
    // Also set countdown and pomodoro to use large fonts
    const largeCountdownSettings = {
      color: colors.secondary || '#fbbf24',
      font: 'font-mono',
      design: 'minimal',
      size: 'text-6xl'
    };
    
    localStorage.setItem('countdown_timer_settings', JSON.stringify(largeCountdownSettings));
    window.dispatchEvent(new CustomEvent('countdownTimerSettingsChanged', { detail: largeCountdownSettings }));
    
    const largePomodoroSettings = {
      color: colors.accent || '#166534',
      font: 'font-mono',
      design: 'minimal',
      size: 'text-6xl',
      completedIcon: '🍅'
    };
    
    localStorage.setItem('pomodoro_timer_settings', JSON.stringify(largePomodoroSettings));
    window.dispatchEvent(new CustomEvent('pomodoroTimerSettingsChanged', { detail: largePomodoroSettings }));
  };

  const updateThemeColors = (colors: Partial<ThemeColors>) => {
    if (currentTheme && currentTheme.colors) {
      const updatedTheme: CustomTheme = {
        ...currentTheme,
        colors: { ...currentTheme.colors, ...colors }
      };
      setTheme(updatedTheme);
      
      // Also update timer settings with new colors while keeping large fonts
      const currentTimerSettings = localStorage.getItem('timer_settings');
      if (currentTimerSettings) {
        try {
          const timerSettings = JSON.parse(currentTimerSettings);
          const updatedTimerSettings = {
            ...timerSettings,
            color: colors.primary || timerSettings.color,
            size: 'text-6xl' // Ensure large font
          };
          localStorage.setItem('timer_settings', JSON.stringify(updatedTimerSettings));
          window.dispatchEvent(new CustomEvent('timerSettingsChanged', { detail: updatedTimerSettings }));
        } catch (error) {
          console.error('Error updating timer settings:', error);
        }
      }
    }
  };

  return (
    <CustomThemeContext.Provider value={{
      currentTheme,
      setTheme,
      availableThemes,
      createCustomTheme,
      updateThemeColors
    }}>
      {children}
    </CustomThemeContext.Provider>
  );
}

export function useCustomTheme() {
  const context = useContext(CustomThemeContext);
  if (context === undefined) {
    throw new Error('useCustomTheme must be used within a CustomThemeProvider');
  }
  return context;
}

// Export theme arrays for use in other components
export { lightThemes, darkThemes };

// Helper function to get Tailwind class from color
export function getThemeClasses(theme: CustomTheme | null, isDark: boolean = false) {
  // If we have a theme, find its dark/light variant
  if (theme) {
    const themes = isDark ? darkThemes : lightThemes;
    const themeVariant = themes.find(t => t.name === theme.name);
    
    if (themeVariant) {
      return themeVariant.colors;
    }
    
    // Fallback to theme colors if no variant found
    return theme.colors;
  }
  
  // Fallback colors if no theme is provided
  const fallbackColors = {
    primary: '#84cc16',
    secondary: '#fbbf24',
    accent: '#166534',
    background: '#fef3c7',
    surface: '#fde68a',
    text: '#000000',
    border: '#fbbf24'
  };
  
  // Dark mode fallback colors
  const darkFallbackColors = {
    primary: '#22c55e', // brighter green for dark mode
    secondary: '#f59e0b', // amber for dark mode
    accent: '#16a34a', // green for dark mode
    background: '#000000',
    surface: '#111111',
    text: '#ffffff',
    border: '#374151'
  };
  
  return isDark ? darkFallbackColors : fallbackColors;
}
