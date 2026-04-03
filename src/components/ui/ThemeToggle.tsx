'use client';

import { useTheme } from '@/contexts/ThemeContext';
import styles from './ThemeToggle.module.css';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <label className={styles.switch}>
      <input 
        type="checkbox" 
        checked={theme === 'dark'}
        onChange={toggleTheme}
      />
      <span className={styles.slider}></span>
    </label>
  );
}
