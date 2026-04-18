'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useUser } from './UserContext';

interface PointsState {
  coins: number;
  level: number;
  experience: number;
}

interface RewardData {
  totalEarned: number;
  totalSpent: number;
  lastDailyReward: string;
  currentStreak: number;
  achievements: string[];
}

interface PointsContextType {
  coins: number;
  level: number;
  experience: number;
  addCoins: (amount: number) => void;
  removeCoins: (amount: number) => void;
  // Helper functions for common operations
  calculateCoinsFromStudyTime: (studySeconds: number) => number;
  rewardDailyLogin: () => boolean;
  rewardSessionComplete: (minutes: number) => number;
  rewardPomodoroSession: () => number;
  rewardLevelUp: () => number;
  rewardAchievement: (achievementId: string) => number;
  purchaseItem: (price: number) => boolean;
}

const PointsContext = createContext<PointsContextType | undefined>(undefined);

export function PointsProvider({ children }: { children: ReactNode }) {
  const { getCurrentUser, updateUserScore } = useUser();
  const currentUser = getCurrentUser();
  
  const [state, setState] = useState<PointsState>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('fahman_hub_points');
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
          console.error('Failed to parse points state:', error);
        }
      }
      
      // Initialize with current user score if available, otherwise default to 0
      const initialScore = currentUser?.score !== undefined ? currentUser.score : 0;
      return {
        coins: initialScore,
        level: Math.floor(initialScore / 100) + 1,
        experience: initialScore
      };
    }
    
    // Fallback for server-side rendering
    return {
      coins: 0,
      level: 1,
      experience: 0
    };
  });

  // Track if we're in the middle of a purchase operation
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Track reward data
  const [rewardData, setRewardData] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('fahman_hub_rewards');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (error) {
          console.error('Failed to parse rewards data:', error);
        }
      }
    }
    return {
      totalEarned: 0,
      totalSpent: 0,
      lastDailyReward: '',
      currentStreak: 0,
      achievements: [] as string[]
    };
  });

  // Sync coins with real user score from database (only when not updating and when user first loads)
  useEffect(() => {
    if (currentUser?.score !== undefined && !isUpdating) {
      // Only sync if current state coins are different from user score
      const hasSyncedBefore = localStorage.getItem('fahman_hub_points_synced');
      if (!hasSyncedBefore || state.coins !== currentUser.score) {
        setState(prev => ({
          ...prev,
          coins: currentUser.score,
          level: Math.floor(currentUser.score / 100) + 1,
          experience: currentUser.score
        }));
        localStorage.setItem('fahman_hub_points_synced', 'true');
      }
    }
  }, [currentUser?.score, isUpdating]);

  useEffect(() => {
    localStorage.setItem('fahman_hub_points', JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    localStorage.setItem('fahman_hub_rewards', JSON.stringify(rewardData));
  }, [rewardData]);

  const calculateLevel = (exp: number) => {
    return Math.floor(exp / 100) + 1;
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
      localStorage.removeItem('fahman_hub_points_synced');
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
      localStorage.removeItem('fahman_hub_points_synced');
    }, 1000);
  };

  // Helper function to calculate coins from study time
  const calculateCoinsFromStudyTime = (studySeconds: number): number => {
    // 1 coin every 10 minutes (600 seconds)
    return Math.floor(studySeconds / 600);
  };

  // Daily login reward
  const rewardDailyLogin = (): boolean => {
    if (!currentUser) return false;

    const today = new Date().toDateString();
    const lastReward = rewardData.lastDailyReward;

    if (lastReward !== today) {
      // Give daily reward
      addCoins(10);
      
      // Update streak
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      let newStreak = 1;
      if (lastReward === yesterday.toDateString()) {
        newStreak = rewardData.currentStreak + 1;
      }

      // Give streak bonus
      if (newStreak > 1) {
        setTimeout(() => addCoins(20), 100);
      }

      setRewardData((prev: RewardData) => ({
        ...prev,
        totalEarned: prev.totalEarned + 10 + (newStreak > 1 ? 20 : 0),
        lastDailyReward: today,
        currentStreak: newStreak
      }));
      return true;
    }

    return false;
  };

  // Session complete reward
  const rewardSessionComplete = (minutes: number): number => {
    if (!currentUser) return 0;

    const baseReward = 5;
    const bonusReward = Math.floor(minutes / 30) * 2; // 2 coins per 30 minutes
    
    const totalReward = baseReward + bonusReward;
    
    setTimeout(() => addCoins(totalReward), 50);

    setRewardData((prev: RewardData) => ({
      ...prev,
      totalEarned: prev.totalEarned + totalReward
    }));

    return totalReward;
  };

  // Pomodoro session reward
  const rewardPomodoroSession = (): number => {
    if (!currentUser) return 0;

    const rewardPoints = 15;
    
    setTimeout(() => addCoins(rewardPoints), 50);

    setRewardData((prev: RewardData) => ({
      ...prev,
      totalEarned: prev.totalEarned + rewardPoints
    }));

    return rewardPoints;
  };

  // Level up reward
  const rewardLevelUp = (): number => {
    if (!currentUser) return 0;

    const rewardPoints = 50;
    
    setTimeout(() => addCoins(rewardPoints), 50);

    setRewardData((prev: RewardData) => ({
      ...prev,
      totalEarned: prev.totalEarned + rewardPoints
    }));

    return rewardPoints;
  };

  // Achievement reward
  const rewardAchievement = (achievementId: string): number => {
    if (!currentUser) return 0;

    // Check if achievement already rewarded
    if (rewardData.achievements.includes(achievementId)) return 0;

    const rewardPoints = 25;
    
    setTimeout(() => addCoins(rewardPoints), 50);

    setRewardData((prev: RewardData) => ({
      ...prev,
      totalEarned: prev.totalEarned + rewardPoints,
      achievements: [...prev.achievements, achievementId]
    }));

    return rewardPoints;
  };

  // Purchase item
  const purchaseItem = (price: number): boolean => {
    if (!currentUser) return false;

    if (state.coins < price) return false;

    removeCoins(price);

    setRewardData((prev: RewardData) => ({
      ...prev,
      totalSpent: prev.totalSpent + price
    }));

    return true;
  };

  return (
    <PointsContext.Provider value={{
      coins: state.coins,
      level: state.level,
      experience: state.experience,
      addCoins,
      removeCoins,
      calculateCoinsFromStudyTime,
      rewardDailyLogin,
      rewardSessionComplete,
      rewardPomodoroSession,
      rewardLevelUp,
      rewardAchievement,
      purchaseItem
    }}>
      {children}
    </PointsContext.Provider>
  );
}

export function usePoints() {
  const context = useContext(PointsContext);
  if (context === undefined) {
    throw new Error('usePoints must be used within a PointsProvider');
  }
  return context;
}
