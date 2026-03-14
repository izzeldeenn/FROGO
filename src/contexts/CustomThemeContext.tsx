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

const defaultThemes: CustomTheme[] = [
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

  useEffect(() => {
    // Load saved theme from localStorage
    const savedTheme = localStorage.getItem('customTheme');
    if (savedTheme) {
      try {
        const parsed = JSON.parse(savedTheme);
        const theme = availableThemes.find(t => t.name === parsed.name) || parsed;
        setCurrentTheme(theme);
      } catch (error) {
        console.error('Error loading saved theme:', error);
      }
    }
  }, []);

  const setTheme = (theme: CustomTheme) => {
    setCurrentTheme(theme);
    localStorage.setItem('customTheme', JSON.stringify(theme));
  };

  const createCustomTheme = (name: string, colors: ThemeColors) => {
    const newTheme: CustomTheme = { name, colors };
    const updatedThemes = [...availableThemes, newTheme];
    setAvailableThemes(updatedThemes);
    setTheme(newTheme);
  };

  const updateThemeColors = (colors: Partial<ThemeColors>) => {
    const updatedTheme: CustomTheme = {
      ...currentTheme,
      colors: { ...currentTheme.colors, ...colors }
    };
    setTheme(updatedTheme);
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

// Helper function to get Tailwind class from color
export function getThemeClasses(theme: CustomTheme, isDark: boolean = false) {
  const colors = theme.colors;
  
  return {
    primary: isDark ? colors.primary : colors.primary,
    secondary: isDark ? colors.secondary : colors.secondary,
    accent: isDark ? colors.accent : colors.accent,
    background: isDark ? '#000000' : colors.background,
    surface: isDark ? '#111111' : colors.surface,
    text: isDark ? '#ffffff' : colors.text,
    border: isDark ? colors.accent : colors.border
  };
}
