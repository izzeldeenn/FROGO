'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useUser } from '@/contexts/UserContext';
import { useCustomThemeClasses } from '@/hooks/useCustomThemeClasses';

interface UserAccount {
  accountId: string;
  username: string;
  email: string;
  hashKey: string;
  avatar?: string;
  score: number;
  rank: number;
  studyTime: number;
  createdAt: string;
  lastActive: string;
}

export function UserRankings() {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const { users, isTimerActive } = useUser();
  const customTheme = useCustomThemeClasses();
  const [displayUsers, setDisplayUsers] = useState<UserAccount[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    setDisplayUsers(users);
  }, [users]);

  useEffect(() => {
    // Update rankings every second for live changes
    const interval = setInterval(() => {
      setDisplayUsers(users);
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, [users]);

  const formatStudyTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTodayStudyTime = (user: UserAccount) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const lastActiveDate = new Date(user.lastActive);
    
    // If last active was today, return the actual study time for today
    if (lastActiveDate >= today) {
      // For simplicity, we'll use a portion of total study time based on recent activity
      // In a real app, you'd track daily study time separately
      const todayPortion = Math.min(user.studyTime, 4 * 60 * 60); // Max 4 hours today display
      return todayPortion; // Return in seconds
    }
    return 0;
  };

  const getCoinsFromStudyTime = (studySeconds: number) => {
    // 1 coin every 10 minutes (600 seconds)
    return Math.floor(studySeconds / 600);
  };

  const isCurrentUserActive = (user: UserAccount) => {
    // Check if this is the current account and timer is active
    return isTimerActive();
  };

  return (
    <div className="flex-1 p-4">
      <h2 className={`text-2xl font-bold mb-6 text-center ${
        theme === 'light' ? 'text-black' : 'text-white'
      }`}>{t.rankings}</h2>
      <div className="h-[calc(100vh-180px)] overflow-y-auto space-y-2 w-full">
        {displayUsers.length === 0 ? (
          <p className={`text-center py-12 ${
            theme === 'light' ? 'text-gray-500' : 'text-gray-400'
          }`}>
            {t.noDevices}
          </p>
        ) : (
          displayUsers.map((user) => {
            const todaySeconds = getTodayStudyTime(user);
            const todayTimeFormatted = formatStudyTime(todaySeconds);
            const todayCoins = getCoinsFromStudyTime(todaySeconds);
            const userIsActive = isCurrentUserActive(user);
            
            return (
              <div
                key={user.accountId}
                className="p-3 rounded-xl transition-all duration-300 hover:scale-[1.02] bg-white/10 border-2"
                style={{
                  borderColor: user.rank === 1 
                    ? customTheme.colors.secondary
                    : user.rank % 2 === 0 
                    ? customTheme.colors.primary 
                    : customTheme.colors.secondary,
                  backgroundColor: theme === 'dark' ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)',
                  boxShadow: user.rank <= 3 ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none'
                }}
              >
                <div className="flex items-center mb-2">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="flex items-center justify-center w-10 h-10 rounded-full text-lg font-bold"
                      style={{
                        backgroundColor: user.rank === 1 
                          ? customTheme.colors.secondary
                          : user.rank % 2 === 0 
                          ? customTheme.colors.primary 
                          : customTheme.colors.secondary,
                        color: '#ffffff',
                        boxShadow: user.rank <= 3 ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none'
                      }}
                    >
                      {user.rank}
                    </div>
                    <div className="text-2xl">{user.avatar || '👤'}</div>
                    <div className="flex flex-col">
                      <div className="flex items-center space-x-2">
                        <span className={`text-base font-semibold ${
                          theme === 'light' ? 'text-black' : 'text-white'
                        }`}>{user.username}</span>
                        {userIsActive && (
                          <span 
                            className="px-2 py-1 text-xs rounded-full animate-pulse font-medium"
                            style={{
                              backgroundColor: customTheme.colors.primary,
                              color: '#ffffff',
                              boxShadow: theme === 'light' ? '0 1px 2px 0 rgba(0, 0, 0, 0.05)' : '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                            }}
                          >
                            {t.active}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div 
                    className="p-2 rounded-lg"
                    style={{
                      backgroundColor: theme === 'light' 
                        ? `${customTheme.colors.primary}20` 
                        : `${customTheme.colors.primary}40`,
                    }}
                  >
                    <div className="text-sm font-bold" style={{ color: customTheme.colors.primary }}>
                      {todayTimeFormatted}
                    </div>
                    <div className="text-xs" style={{ color: customTheme.colors.primary }}>
                      {t.timeToday}
                    </div>
                  </div>
                  <div 
                    className="p-2 rounded-lg"
                    style={{
                      backgroundColor: theme === 'light' 
                        ? `${customTheme.colors.secondary}20` 
                        : `${customTheme.colors.secondary}40`,
                    }}
                  >
                    <div className="text-sm font-bold" style={{ color: customTheme.colors.secondary }}>
                      +{todayCoins} {t.coins}
                    </div>
                    <div className="text-xs" style={{ color: customTheme.colors.secondary }}>
                      {t.coinsToday}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
