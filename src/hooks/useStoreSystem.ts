'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import { usePoints } from '@/contexts/PointsContext';

interface StoreRewards {
  dailyLogin: number;
  sessionComplete: number;
  pomodoroSession: number;
  streakDay: number;
  levelUp: number;
  achievement: number;
}

export const useStoreSystem = () => {
  const { getCurrentUser } = useUser();
  const { 
    coins, 
    level, 
    calculateCoinsFromStudyTime,
    rewardDailyLogin,
    rewardSessionComplete,
    rewardPomodoroSession,
    rewardLevelUp,
    rewardAchievement,
    purchaseItem: purchaseItemPoints
  } = usePoints();
  
  const currentUser = getCurrentUser();

  const REWARDS: StoreRewards = {
    dailyLogin: 10,
    sessionComplete: 5,
    pomodoroSession: 15,
    streakDay: 20,
    levelUp: 50,
    achievement: 25
  };

  useEffect(() => {
    if (currentUser) {
      rewardDailyLogin();
    }
  }, [currentUser, rewardDailyLogin]);

  // Wrapper functions for backward compatibility
  const checkDailyReward = () => {
    return rewardDailyLogin();
  };

  const getStoreStats = () => {
    return {
      coins, // This is the real user score from users table
      level,
      totalEarned: 0, // Now tracked in PointsContext
      totalSpent: 0, // Now tracked in PointsContext
      currentStreak: 0, // Now tracked in PointsContext
      achievements: 0, // Now tracked in PointsContext
      canClaimDaily: true // PointsContext handles this
    };
  };

  const getRewardsInfo = () => {
    return {
      dailyLogin: REWARDS.dailyLogin,
      sessionComplete: REWARDS.sessionComplete,
      pomodoroSession: REWARDS.pomodoroSession,
      streakDay: REWARDS.streakDay,
      levelUp: REWARDS.levelUp,
      achievement: REWARDS.achievement
    };
  };

  return {
    // Actions - now using centralized functions from PointsContext
    checkDailyReward,
    rewardSessionComplete,
    rewardPomodoroSession,
    rewardLevelUp,
    rewardAchievement,
    purchaseItem: purchaseItemPoints,
    
    // Getters
    getStoreStats,
    getRewardsInfo,
    
    // Helper function
    calculateCoinsFromStudyTime
  };
};
