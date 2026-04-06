'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useUser } from './UserContext';

interface Task {
  id: string;
  title: string;
  description: string;
  points: number;
  type: 'daily' | 'weekly' | 'achievement';
  completed: boolean;
  completedAt?: string;
}

interface GamificationState {
  coins: number;
  level: number;
  experience: number;
  tasks: Task[];
  streak: number;
  lastStudyDate: string | null;
}

interface GamificationContextType {
  coins: number;
  level: number;
  experience: number;
  tasks: Task[];
  streak: number;
  completeTask: (taskId: string) => void;
  addCoins: (amount: number) => void;
  removeCoins: (amount: number) => void;
  generateDailyTasks: () => void;
  resetDailyTasks: () => void;
}

const GamificationContext = createContext<GamificationContextType | undefined>(undefined);

export function GamificationProvider({ children }: { children: ReactNode }) {
  const { getCurrentUser, updateUserScore } = useUser();
  const currentUser = getCurrentUser();
  
  const [state, setState] = useState<GamificationState>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('fahman_hub_gamification');
      if (saved) {
        try {
          const parsedState = JSON.parse(saved);
          // If we have a current user with a score, prioritize the database score
          if (currentUser?.score !== undefined) {
            return {
              ...parsedState,
              coins: currentUser.score,
              level: Math.floor(currentUser.score / 100) + 1,
              experience: currentUser.score
            };
          }
          return parsedState;
        } catch (error) {
          console.error('Failed to parse gamification state:', error);
        }
      }
      
      // Initialize with current user score if available, otherwise default to 0
      const initialScore = currentUser?.score !== undefined ? currentUser.score : 0;
      return {
        coins: initialScore,
        level: Math.floor(initialScore / 100) + 1,
        experience: initialScore,
        tasks: [],
        streak: 0,
        lastStudyDate: null
      };
    }
    
    // Fallback for server-side rendering
    return {
      coins: 0,
      level: 1,
      experience: 0,
      tasks: [],
      streak: 0,
      lastStudyDate: null
    };
  });

  // Track if we're in the middle of a purchase operation
  const [isUpdating, setIsUpdating] = useState(false);

  // Sync coins with real user score from database (only when not updating and when user first loads)
  useEffect(() => {
    if (currentUser?.score !== undefined && !isUpdating) {
      // Only sync if current state coins are different from user score
      const hasSyncedBefore = localStorage.getItem('fahman_hub_gamification_synced');
      if (!hasSyncedBefore || state.coins !== currentUser.score) {
        setState(prev => ({
          ...prev,
          coins: currentUser.score,
          level: Math.floor(currentUser.score / 100) + 1,
          experience: currentUser.score
        }));
        localStorage.setItem('fahman_hub_gamification_synced', 'true');
      }
    }
  }, [currentUser?.score, isUpdating]);

  useEffect(() => {
    localStorage.setItem('fahman_hub_gamification', JSON.stringify(state));
  }, [state]);

  const calculateLevel = (exp: number) => {
    return Math.floor(exp / 100) + 1;
  };

  const completeTask = (taskId: string) => {
    setState(prev => {
      const task = prev.tasks.find(t => t.id === taskId);
      if (!task || task.completed) return prev;

      const newTasks = prev.tasks.map(t => 
        t.id === taskId ? { ...t, completed: true, completedAt: new Date().toISOString() } : t
      );

      const newExperience = prev.experience + task.points;
      const newLevel = calculateLevel(newExperience);
      const newCoins = prev.coins + task.points;

      return {
        ...prev,
        tasks: newTasks,
        experience: newExperience,
        level: newLevel,
        coins: newCoins
      };
    });
  };

  const addCoins = (amount: number) => {
    // Set updating flag to prevent sync override
    setIsUpdating(true);
    
    // Update real user score in database
    if (currentUser) {
      updateUserScore(amount);
    }
    
    // Update local state for immediate UI feedback
    setState(prev => {
      const newState = {
        ...prev,
        coins: prev.coins + amount,
        experience: prev.experience + amount,
        level: Math.floor((prev.experience + amount) / 100) + 1
      };
      return newState;
    });
    
    // Clear updating flag after a short delay to allow database update
    setTimeout(() => {
      setIsUpdating(false);
      // Clear sync flag to allow proper sync next time
      localStorage.removeItem('fahman_hub_gamification_synced');
    }, 1000);
  };

  const removeCoins = (amount: number) => {
    // Set updating flag to prevent sync override
    setIsUpdating(true);
    
    // Update real user score in database
    if (currentUser) {
      updateUserScore(-amount);
    }
    
    // Update local state for immediate UI feedback
    setState(prev => {
      const newState = {
        ...prev,
        coins: Math.max(0, prev.coins - amount),
        experience: Math.max(0, prev.experience - amount),
        level: Math.floor(Math.max(0, prev.experience - amount) / 100) + 1
      };
      return newState;
    });
    
    // Clear updating flag after a short delay to allow database update
    setTimeout(() => {
      setIsUpdating(false);
      // Clear sync flag to allow proper sync next time
      localStorage.removeItem('fahman_hub_gamification_synced');
    }, 1000);
  };

  const generateDailyTasks = () => {
    const dailyTasks: Task[] = [
      {
        id: 'daily-1',
        title: 'دراسة لمدة 30 دقيقة',
        description: 'ادرس لمدة 30 دقيقة متتالية',
        points: 20,
        type: 'daily',
        completed: false
      },
      {
        id: 'daily-2',
        title: 'إكمال 3 جلسات بومودورو',
        description: 'أكمل 3 جلسات بومودورو كاملة',
        points: 30,
        type: 'daily',
        completed: false
      },
      {
        id: 'daily-3',
        title: 'الدراسة في وقت متأخر',
        description: 'ادرس بعد الساعة 10 مساءً',
        points: 15,
        type: 'daily',
        completed: false
      }
    ];

    setState(prev => ({
      ...prev,
      tasks: [...prev.tasks.filter(t => t.type !== 'daily'), ...dailyTasks]
    }));
  };

  const resetDailyTasks = () => {
    setState(prev => ({
      ...prev,
      tasks: prev.tasks.filter(t => t.type !== 'daily')
    }));
  };

  // Check for daily reset
  useEffect(() => {
    const checkDailyReset = () => {
      const now = new Date();
      const lastReset = localStorage.getItem('fahman_hub_daily_reset');
      
      if (!lastReset || new Date(lastReset).toDateString() !== now.toDateString()) {
        resetDailyTasks();
        localStorage.setItem('fahman_hub_daily_reset', now.toISOString());
      }
    };

    checkDailyReset();
    const interval = setInterval(checkDailyReset, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  // Generate initial tasks if none exist
  useEffect(() => {
    if (state.tasks.length === 0) {
      generateDailyTasks();
    }
  }, []);

  return (
    <GamificationContext.Provider value={{
      coins: state.coins,
      level: state.level,
      experience: state.experience,
      tasks: state.tasks,
      streak: state.streak,
      completeTask,
      addCoins,
      removeCoins,
      generateDailyTasks,
      resetDailyTasks
    }}>
      {children}
    </GamificationContext.Provider>
  );
}

export function useGamification() {
  const context = useContext(GamificationContext);
  if (context === undefined) {
    throw new Error('useGamification must be used within a GamificationProvider');
  }
  return context;
}
