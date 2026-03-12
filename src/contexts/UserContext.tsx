'use client';

import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { getDeviceId, getDeviceInfo } from '@/utils/deviceId';
import { useGamification } from '@/contexts/GamificationContext';
import { formatStudyTime } from '@/utils/timeFormat';
import { dbClientOperations } from '@/lib/sqlite-client';

interface DeviceUser {
  deviceId: string;
  name: string;
  avatar?: string;
  score: number;
  rank: number;
  studyTime: number; // in seconds
  studyTimeFormatted?: string; // formatted time for display
  createdAt: string;
  lastActive: string;
}

interface UserContextType {
  users: DeviceUser[];
  getCurrentDeviceUser: () => DeviceUser | null;
  updateDeviceUserName: (name: string) => void;
  updateDeviceUserAvatar: (avatar: string) => void;
  updateDeviceStudyTime: (additionalTime: number) => void;
  getAllDeviceUsers: () => DeviceUser[];
  setTimerActive: (isActive: boolean) => void;
  isTimerActive: () => boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const { addCoins } = useGamification();
  const [users, setUsers] = useState<DeviceUser[]>([]);
  const [currentDeviceId, setCurrentDeviceId] = useState<string>('');
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  
  // WebSocket client reference
  const wsClientRef = useRef<any>(null);
  const dbSyncAccumulator = useRef(0);

  useEffect(() => {
    // Get device ID
    const deviceId = getDeviceId();
    setCurrentDeviceId(deviceId);
    
    // Initialize WebSocket connection
    initializeWebSocket();
    
    return () => {
      // Cleanup WebSocket on unmount
      if (wsClientRef.current) {
        wsClientRef.current.disconnect();
      }
    };
  }, []);

  const initializeWebSocket = async () => {
    try {
      // Import WebSocketClient dynamically to avoid SSR issues
      const { WebSocketClient } = await import('@/lib/websocket-client');
      const wsClient = new WebSocketClient('ws://localhost:8080');
      wsClientRef.current = wsClient;

      // Connect to WebSocket
      await wsClient.connect();
      console.log('WebSocket connected successfully');

      // Set up message handler
      wsClient.onMessage((leaderboardData: any[]) => {
        console.log('Received WebSocket message:', leaderboardData);
        const deviceUsers: DeviceUser[] = leaderboardData.map((dbDevice: any) => ({
          deviceId: dbDevice.id,
          name: dbDevice.name,
          avatar: dbDevice.avatar || '🖥️',
          score: dbDevice.score,
          rank: dbDevice.rank,
          studyTime: dbDevice.study_time,
          studyTimeFormatted: formatStudyTime(dbDevice.study_time),
          createdAt: dbDevice.created_at,
          lastActive: dbDevice.last_active
        }));
        
        // Update state without overwriting local timer progress
        setUsers(prevUsers => {
          const currentDevice = prevUsers.find(u => u.deviceId === currentDeviceId);
          
          return deviceUsers.map(user => {
            // Preserve local study time for current device
            if (user.deviceId === currentDeviceId && currentDevice) {
              return {
                ...user,
                studyTime: currentDevice.studyTime,
                studyTimeFormatted: formatStudyTime(currentDevice.studyTime)
              };
            }
            return user;
          });
        });
      });

      // Load initial leaderboard
      await loadInitialLeaderboard();
    } catch (error) {
      console.error('Failed to initialize WebSocket:', error);
      console.log('Falling back to local device creation');
      // Fallback to local device creation
      createCurrentDevice();
    }
  };

  const loadInitialLeaderboard = async () => {
    try {
      const devices = await dbClientOperations.getAllDevices();
      if (devices && devices.length > 0) {
        const deviceUsers: DeviceUser[] = devices.map((dbDevice: any) => ({
          deviceId: dbDevice.id,
          name: dbDevice.name,
          avatar: dbDevice.avatar || '🖥️',
          score: dbDevice.score,
          rank: dbDevice.rank,
          studyTime: dbDevice.study_time,
          studyTimeFormatted: formatStudyTime(dbDevice.study_time),
          createdAt: dbDevice.created_at,
          lastActive: dbDevice.last_active
        }));
        setUsers(deviceUsers);
      } else {
        createCurrentDevice();
      }
    } catch (error) {
      console.error('Error loading initial leaderboard:', error);
      createCurrentDevice();
    }
  };

  const createCurrentDevice = async () => {
    const deviceId = getDeviceId();
    const currentDevice: DeviceUser = {
      deviceId,
      name: `جهاز ${deviceId.slice(-6)}`,
      avatar: '🖥️',
      score: 0,
      rank: 1,
      studyTime: 0,
      studyTimeFormatted: formatStudyTime(0),
      createdAt: new Date().toISOString(),
      lastActive: new Date().toISOString()
    };
    await saveDeviceToDatabase(currentDevice);
    setUsers([currentDevice]);
  };

  const saveDeviceToDatabase = async (deviceUser: DeviceUser) => {
    try {
      await dbClientOperations.upsertDevice({
        id: deviceUser.deviceId,
        name: deviceUser.name,
        avatar: deviceUser.avatar,
        score: deviceUser.score,
        rank: deviceUser.rank,
        study_time: deviceUser.studyTime,
        created_at: deviceUser.createdAt,
        last_active: deviceUser.lastActive
      });
    } catch (error) {
      console.error('Error saving device:', error);
    }
  };

  const getCurrentDeviceUser = (): DeviceUser | null => {
    if (!currentDeviceId) return null;
    return users.find(user => user.deviceId === currentDeviceId) || null;
  };

  const updateDeviceUserName = (name: string) => {
    if (!currentDeviceId) return;
    
    setUsers(prevUsers => {
      const newUsers = prevUsers.map(user => {
        if (user.deviceId === currentDeviceId) {
          return { ...user, name, lastActive: new Date().toISOString() };
        }
        return user;
      });
      return newUsers;
    });
    
    // Send update via WebSocket
    if (wsClientRef.current) {
      wsClientRef.current.sendMessage({
        type: 'update_device',
        deviceId: currentDeviceId,
        updates: { name }
      });
    }
  };

  const updateDeviceUserAvatar = (avatar: string) => {
    if (!currentDeviceId) return;
    
    setUsers(prevUsers => {
      const newUsers = prevUsers.map(user => {
        if (user.deviceId === currentDeviceId) {
          return { ...user, avatar, lastActive: new Date().toISOString() };
        }
        return user;
      });
      return newUsers;
    });
    
    // Send update via WebSocket
    if (wsClientRef.current) {
      wsClientRef.current.sendMessage({
        type: 'update_device',
        deviceId: currentDeviceId,
        updates: { avatar }
      });
    }
  };

  const updateDeviceStudyTime = async (additionalTime: number) => {
    if (!currentDeviceId) return;

    const pointsEarned = Math.floor(additionalTime / 10); // 1 point per 10 seconds

    // Accumulate time for database sync
    dbSyncAccumulator.current += additionalTime;

    setUsers(prevUsers => {
      const newUsers = prevUsers.map(user => {
        if (user.deviceId === currentDeviceId) {
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
        const currentUser = newUsers.find(u => u.deviceId === currentDeviceId);
        if (currentUser) {
          // Save directly to database via API
          dbClientOperations.updateDevice(currentDeviceId, {
            study_time: currentUser.studyTime,
            score: currentUser.score,
            rank: currentUser.rank
          }).then(() => {
            console.log('Device study time saved to database');
          }).catch(error => {
            console.error('Error saving device study time:', error);
          });
          
          // Also send via WebSocket for real-time updates
          if (wsClientRef.current) {
            wsClientRef.current.sendMessage({
              type: 'update_device',
              deviceId: currentDeviceId,
              updates: {
                study_time: currentUser.studyTime,
                score: currentUser.score,
                rank: currentUser.rank
              }
            });
          }
        }
        dbSyncAccumulator.current = 0;
      }

      return newUsers;
    });

    // Add coins to gamification system
    addCoins(pointsEarned);
  };

  const getAllDeviceUsers = (): DeviceUser[] => {
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
      getCurrentDeviceUser,
      updateDeviceUserName,
      updateDeviceUserAvatar,
      updateDeviceStudyTime,
      getAllDeviceUsers,
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