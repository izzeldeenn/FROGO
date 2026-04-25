'use client';

import { createContext, useContext, ReactNode, useState, useEffect } from 'react';

// Types for ProductAPI
export interface ProductAPI {
  // Timer operations
  getTimer: () => TimerState;
  updateTimerStyle: (styles: TimerStyles) => void;
  addTimerEffect: (effect: TimerEffect) => void;
  removeTimerEffect: (effectId: string) => void;
  
  // User data
  getUserData: () => UserData;
  
  // Theme operations
  getTheme: () => ThemeState;
  updateTheme: (theme: Partial<ThemeState>) => void;
  
  // Storage operations (sandboxed)
  getProductStorage: (key: string) => any;
  setProductStorage: (key: string, value: any) => void;
  
  // Lifecycle hooks
  onLoad: (callback: () => void) => void;
  onUnload: (callback: () => void) => void;
  
  // Utilities
  log: (message: string, level?: 'info' | 'warn' | 'error') => void;
  version: string;
}

export interface TimerState {
  element: HTMLElement | null;
  timeLeft: number;
  totalTime: number;
  isRunning: boolean;
  isPaused: boolean;
}

export interface TimerStyles {
  backgroundColor?: string;
  textColor?: string;
  fontSize?: string;
  borderRadius?: string;
  padding?: string;
  boxShadow?: string;
  border?: string;
  animation?: string;
}

export interface TimerEffect {
  id: string;
  type: 'pulse' | 'glow' | 'shake' | 'rotate' | 'custom';
  config: any;
}

export interface UserData {
  username: string;
  accountId: string;
  avatar?: string;
  score: number;
  coins: number;
}

export interface ThemeState {
  theme: 'light' | 'dark';
  customColors?: Record<string, string>;
}

// Internal context type
interface ProductAPIContextType {
  api: ProductAPI | null;
  registerProduct: (productId: string, cleanup: () => void) => void;
  unregisterProduct: (productId: string) => void;
}

const ProductAPIContext = createContext<ProductAPIContextType | null>(null);

export function ProductAPIProvider({ children }: { children: ReactNode }) {
  const [loadedProducts, setLoadedProducts] = useState<Record<string, () => void>>({});
  const [api, setApi] = useState<ProductAPI | null>(null);

  useEffect(() => {
    // Initialize ProductAPI
    const productAPI: ProductAPI = {
      version: '1.0.0',
      
      getTimer: () => {
        // Will be connected to actual timer component
        const timerElement = document.querySelector('[data-timer]');
        return {
          element: timerElement as HTMLElement | null,
          timeLeft: 0,
          totalTime: 0,
          isRunning: false,
          isPaused: false
        };
      },
      
      updateTimerStyle: (styles: TimerStyles) => {
        const timerElement = document.querySelector('[data-timer]');
        if (timerElement) {
          Object.assign((timerElement as HTMLElement).style, styles);
        }
      },
      
      addTimerEffect: (effect: TimerEffect) => {
        console.log('Adding timer effect:', effect);
        // Will be implemented with actual timer effects
      },
      
      removeTimerEffect: (effectId: string) => {
        console.log('Removing timer effect:', effectId);
        // Will be implemented with actual timer effects
      },
      
      getUserData: () => {
        // Will be connected to UserContext
        return {
          username: '',
          accountId: '',
          score: 0,
          coins: 0
        };
      },
      
      getTheme: () => {
        // Will be connected to ThemeContext
        return {
          theme: 'dark'
        };
      },
      
      updateTheme: (theme: Partial<ThemeState>) => {
        console.log('Updating theme:', theme);
        // Will be implemented with actual theme updates
      },
      
      getProductStorage: (key: string) => {
        const storageKey = `product_storage_${key}`;
        const value = localStorage.getItem(storageKey);
        return value ? JSON.parse(value) : null;
      },
      
      setProductStorage: (key: string, value: any) => {
        const storageKey = `product_storage_${key}`;
        localStorage.setItem(storageKey, JSON.stringify(value));
      },
      
      onLoad: (callback: () => void) => {
        callback();
      },
      
      onUnload: (callback: () => void) => {
        // Store callback for cleanup
        console.log('Registered unload callback');
      },
      
      log: (message: string, level: 'info' | 'warn' | 'error' = 'info') => {
        console.log(`[Product] ${level.toUpperCase()}:`, message);
      }
    };
    
    setApi(productAPI);
    
    // Expose API globally for sandboxed code
    (window as any).ProductAPI = productAPI;
  }, []);

  const registerProduct = (productId: string, cleanup: () => void) => {
    setLoadedProducts(prev => ({
      ...prev,
      [productId]: cleanup
    }));
  };

  const unregisterProduct = (productId: string) => {
    setLoadedProducts(prev => {
      const newProducts = { ...prev };
      if (newProducts[productId]) {
        newProducts[productId]();
        delete newProducts[productId];
      }
      return newProducts;
    });
  };

  return (
    <ProductAPIContext.Provider value={{ api, registerProduct, unregisterProduct }}>
      {children}
    </ProductAPIContext.Provider>
  );
}

export function useProductAPI() {
  const context = useContext(ProductAPIContext);
  if (!context) {
    throw new Error('useProductAPI must be used within ProductAPIProvider');
  }
  return context;
}
