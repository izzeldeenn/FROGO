'use client';

import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { getAccountId, getAccountInfo } from '@/utils/deviceId';
import { useGamification } from '@/contexts/GamificationContext';
import { formatStudyTime } from '@/utils/timeFormat';
import { userDB, UserAccountRecord, isPocketBaseAvailable } from '@/lib/pocketbase';

interface UserAccount {
  accountId: string;
  username: string;
  email: string;
  hashKey: string;
  avatar?: string;
  score: number;
  rank: number;
  studyTime: number; // in seconds
  studyTimeFormatted?: string; // formatted time for display
  createdAt: string;
  lastActive: string;
}

interface UserContextType {
  users: UserAccount[];
  currentAccountId: string;
  isTimerRunning: boolean;
  getCurrentUser: () => UserAccount | null;
  updateUserName: (name: string) => void;
  updateUserAvatar: (avatar: string) => void;
  updateUserStudyTime: (additionalTime: number) => void;
  updateUserScore: (additionalScore: number) => void;
  setTimerActive: (active: boolean) => void;
  isTimerActive: () => boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const { addCoins } = useGamification();
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [currentAccountId, setCurrentAccountId] = useState<string>('');
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  
  const dbSyncAccumulator = useRef(0);

  useEffect(() => {
    const initializeApp = async () => {
      // Get account ID
      const accountId = getAccountId();
      setCurrentAccountId(accountId);
      
      // Load initial leaderboard
      await loadInitialLeaderboard();
      
      // Set up real-time updates
      try {
        const pocketBaseReady = await isPocketBaseAvailable();
        if (pocketBaseReady) {
          userDB.subscribeToUsers((updatedUsers: UserAccountRecord[]) => {
            const userAccounts: UserAccount[] = updatedUsers.map((dbUser: UserAccountRecord) => ({
              accountId: dbUser.accountId,
              username: dbUser.username,
              email: dbUser.email,
              hashKey: dbUser.hashKey,
              avatar: dbUser.avatar || '👤',
              score: dbUser.score,
              rank: dbUser.rank,
              studyTime: dbUser.studyTime,
              studyTimeFormatted: formatStudyTime(dbUser.studyTime),
              createdAt: dbUser.createdAt,
              lastActive: dbUser.lastActive
            }));
            setUsers(userAccounts);
          });
        } else {
          console.log('🔄 Real-time updates disabled (PocketBase not available)');
        }
      } catch (error) {
        console.log('🔄 Real-time subscription failed, using fallback mode');
        // Continue without real-time updates
      }
    };
    
    initializeApp();
    
    // Cleanup subscription on unmount
    return () => {
      userDB.unsubscribeFromUsers();
    };
  }, []);


  const loadInitialLeaderboard = async () => {
    try {
      // Check if PocketBase is available
      const pocketBaseReady = await isPocketBaseAvailable();
      
      if (pocketBaseReady) {
        console.log('🗄️ Using PocketBase database');
        // Try PocketBase first
        const users = await userDB.getAllUsers();
        
        if (users && users.length > 0) {
          const userAccounts: UserAccount[] = users.map((dbUser: UserAccountRecord) => ({
            accountId: dbUser.accountId,
            username: dbUser.username,
            email: dbUser.email,
            hashKey: dbUser.hashKey,
            avatar: dbUser.avatar || '👤',
            score: dbUser.score,
            rank: dbUser.rank,
            studyTime: dbUser.studyTime,
            studyTimeFormatted: formatStudyTime(dbUser.studyTime),
            createdAt: dbUser.createdAt,
            lastActive: dbUser.lastActive
          }));
          setUsers(userAccounts);
        } else {
          createCurrentAccount();
        }
      } else {
        console.log('💾 Using in-memory storage (PocketBase not available)');
        // Fallback to in-memory storage
        createCurrentAccount();
      }
    } catch (error) {
      console.log('💾 Using in-memory storage (PocketBase error)');
      // Fallback to in-memory storage until PocketBase is set up
      createCurrentAccount();
    }
  };

  const createCurrentAccount = async () => {
    const accountInfo = getAccountInfo();
    
    const currentAccount: UserAccount = {
      accountId: accountInfo.accountId,
      username: accountInfo.username,
      email: accountInfo.email,
      hashKey: accountInfo.hashKey,
      avatar: '�',
      score: 0,
      rank: 1,
      studyTime: 0,
      studyTimeFormatted: formatStudyTime(0),
      createdAt: accountInfo.createdAt,
      lastActive: accountInfo.lastLogin
    };
    await saveAccountToDatabase(currentAccount);
    setUsers([currentAccount]);
  };

  const saveAccountToDatabase = async (userAccount: UserAccount) => {
    try {
      console.log('💾 Saving account to PocketBase:', userAccount.accountId);
      // Save account to PocketBase
      await userDB.upsertUser({
        accountId: userAccount.accountId,
        username: userAccount.username,
        email: userAccount.email,
        hashKey: userAccount.hashKey,
        avatar: userAccount.avatar,
        score: userAccount.score,
        rank: userAccount.rank,
        studyTime: userAccount.studyTime,
        createdAt: userAccount.createdAt,
        lastActive: userAccount.lastActive
      });
      console.log('✅ Account saved successfully');
    } catch (error: any) {
      console.error('❌ Error saving account:', error);
    }
  };

  const getCurrentUser = (): UserAccount | null => {
    if (!currentAccountId) return null;
    return users.find(user => user.accountId === currentAccountId) || null;
  };

  const updateUserName = (name: string) => {
    if (!currentAccountId) return;
    
    setUsers(prevUsers => {
      const newUsers = prevUsers.map(user => {
        if (user.accountId === currentAccountId) {
          return { ...user, username: name, lastActive: new Date().toISOString() };
        }
        return user;
      });
      return newUsers;
    });
    
    // Update in PocketBase if available
    isPocketBaseAvailable().then(available => {
      if (available) {
        userDB.updateUserProfile(currentAccountId, name).catch((error: any) => {
          console.error('Error updating username:', error);
        });
      }
    });
  };

  const updateUserAvatar = (avatar: string) => {
    if (!currentAccountId) return;
    
    setUsers(prevUsers => {
      const newUsers = prevUsers.map(user => {
        if (user.accountId === currentAccountId) {
          return { ...user, avatar, lastActive: new Date().toISOString() };
        }
        return user;
      });
      return newUsers;
    });
    
    // Update in PocketBase if available
    const currentUser = users.find(u => u.accountId === currentAccountId);
    if (currentUser) {
      isPocketBaseAvailable().then(available => {
        if (available) {
          userDB.updateUserProfile(currentAccountId, currentUser.username, avatar).catch((error: any) => {
            console.error('Error updating avatar:', error);
          });
        }
      });
    }
  };

  const updateUserStudyTime = async (additionalTime: number) => {
    if (!currentAccountId) return;

    const pointsEarned = Math.floor(additionalTime / 10); // 1 point per 10 seconds

    // Accumulate time for database sync
    dbSyncAccumulator.current += additionalTime;

    setUsers(prevUsers => {
      const newUsers = prevUsers.map(user => {
        if (user.accountId === currentAccountId) {
          return {
            ...user,
            studyTime: user.studyTime + additionalTime,
            score: user.score + pointsEarned,
            lastActive: new Date().toISOString(),
            studyTimeFormatted: formatStudyTime(user.studyTime + additionalTime)
          };
        }
        return user;
      });

      // Sort by score and update ranks
      newUsers.sort((a, b) => b.score - a.score);
      newUsers.forEach((user, index) => {
        user.rank = index + 1;
      });

      // Send to database every 10 seconds
      if (dbSyncAccumulator.current >= 10) {
        const currentUser = newUsers.find(u => u.accountId === currentAccountId);
        if (currentUser) {
          // Check if PocketBase is available before saving
          isPocketBaseAvailable().then(available => {
            if (available) {
              userDB.updateUserStudyTime(
                currentAccountId,
                currentUser.studyTime,
                currentUser.score
              ).then(() => {
                console.log('💾 User study time saved to PocketBase');
              }).catch((error: any) => {
                console.error('Error saving user study time:', error);
              });
            } else {
              console.log('💾 PocketBase not available, using in-memory storage');
            }
          });
        }
        dbSyncAccumulator.current = 0;
      }

      return newUsers;
    });

    // Add coins to gamification system
    addCoins(pointsEarned);
  };

  const updateUserScore = async (additionalScore: number) => {
    if (!currentAccountId) return;

    setUsers(prevUsers => {
      const newUsers = prevUsers.map(user => {
        if (user.accountId === currentAccountId) {
          return { ...user, score: user.score + additionalScore, lastActive: new Date().toISOString() };
        }
        return user;
      });
      return newUsers;
    });
  };

  const getAllDeviceUsers = (): UserAccount[] => {
    return users.map(user => ({
      ...user,
      studyTimeFormatted: formatStudyTime(user.studyTime)
    })).sort((a, b) => b.score - a.score);
  };

  const setTimerActive = (isActive: boolean) => {
    setIsTimerRunning(isActive);
  };

  const isTimerActive = (): boolean => {
    return isTimerRunning;
  };

  return (
    <UserContext.Provider value={{
      users,
      currentAccountId,
      isTimerRunning,
      getCurrentUser,
      updateUserName,
      updateUserAvatar,
      updateUserStudyTime,
      updateUserScore,
      setTimerActive,
      isTimerActive
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}