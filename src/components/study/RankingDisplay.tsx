'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCustomThemeClasses } from '@/hooks/useCustomThemeClasses';
import { useUser } from '@/contexts/UserContext';
import { dailyActivityDB, DailyActivityFrontend } from '@/lib/dailyActivity';
import { UserRankings } from '../users/UserRankings';
import { CurrentUserSelector } from '../users/CurrentUserSelector';

interface RankingDisplayProps {
  studyStreak: number;
  onUserClick?: (user: any) => void;
}

export function RankingDisplay({ studyStreak, onUserClick }: RankingDisplayProps) {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const { getCurrentUser } = useUser();
  const customTheme = useCustomThemeClasses();
  const [displayMode, setDisplayMode] = useState('bottom');
  const [isRankingsOpen, setIsRankingsOpen] = useState(false);
  const [dailyRankings, setDailyRankings] = useState<DailyActivityFrontend[]>([]);
  const [currentRank, setCurrentRank] = useState(1);

  // Get current user
  const currentUser = getCurrentUser();

  // Floating window state
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Load saved display mode
    if (typeof window !== 'undefined') {
      const savedMode = localStorage.getItem('rankingDisplayMode') || 'bottom';
      setDisplayMode(savedMode);
    }

    // Load daily rankings to get current user's rank
    loadDailyRankings();

    // Listen for display mode changes
    const handleDisplayModeChange = (event: CustomEvent) => {
      setDisplayMode(event.detail);
    };

    window.addEventListener('rankingDisplayModeChange', handleDisplayModeChange as EventListener);
    
    return () => {
      window.removeEventListener('rankingDisplayModeChange', handleDisplayModeChange as EventListener);
    };
  }, []);

  const loadDailyRankings = async () => {
    try {
      const rankings = await dailyActivityDB.getTodayRankings();
      
      const formattedRankings = rankings.map(activity => ({
        id: activity.id,
        accountId: activity.account_id,
        date: activity.date,
        studyMinutes: Math.floor((activity.study_seconds || 0) / 60),
        studySeconds: activity.study_seconds || 0,
        lastUpdated: activity.last_updated || activity.updated_at,
        startTime: activity.start_time,
        endTime: activity.end_time,
        pointsEarned: activity.points_earned || 0,
        dailyRank: activity.daily_rank || 999,
        sessionsCount: activity.sessions_count || 0,
        focusScore: activity.focus_score || 0,
        createdAt: activity.created_at,
        updatedAt: activity.updated_at
      }));
      
      setDailyRankings(formattedRankings);
      
      // Find current user's rank
      if (currentUser) {
        const userActivity = formattedRankings.find(r => r.accountId === currentUser.accountId);
        const rank = userActivity?.dailyRank || 1;
        setCurrentRank(rank);
      }
    } catch (error) {
      console.error('Failed to load daily rankings:', error);
      setCurrentRank(1);
    }
  };

  // Update rankings every 2 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      loadDailyRankings();
    }, 120000); // 2 minutes
    
    return () => clearInterval(interval);
  }, [currentUser]);

  // Floating window drag handlers
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - dragStart.x,
          y: e.clientY - dragStart.y
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragStart]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const renderRankingButton = () => (
    <button
      onClick={() => setIsRankingsOpen(!isRankingsOpen)}
      className="group relative w-10 h-10 rounded-xl transition-all duration-200 hover:scale-110 focus:outline-none inline-flex items-center justify-center"
      style={{
        background: isRankingsOpen 
          ? `linear-gradient(135deg, ${customTheme.colors.accent}, ${customTheme.colors.primary})` 
          : `linear-gradient(135deg, ${customTheme.colors.primary}, ${customTheme.colors.accent})`,
        boxShadow: isRankingsOpen 
          ? `0 4px 20px ${customTheme.colors.accent}40` 
          : `0 2px 10px ${customTheme.colors.primary}30`,
        color: '#ffffff'
      }}
      aria-label={language === 'ar' ? 'الترتيب' : 'Rankings'}
      title={`${language === 'ar' ? 'الترتيب' : 'Rankings'} - ${language === 'ar' ? 'الترتيب اليومي' : 'Daily Rank'} ${currentRank}`}
    >
      <span className="text-xl transition-transform duration-200 group-hover:rotate-12">
        🏆
      </span>
      <div className="absolute -top-1 -right-1 min-w-[16px] h-4 rounded-full bg-green-500 border-2 border-white shadow-lg flex items-center justify-center px-1">
        <span className="text-[10px] font-bold text-white">{currentRank}</span>
      </div>
    </button>
  );

  const renderBottomSlideUp = () => (
    <>
      {renderRankingButton()}
      {/* Backdrop overlay - mobile only */}
      {isRankingsOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={() => setIsRankingsOpen(false)}
        />
      )}
      <div 
        className={`fixed bottom-0 left-0 right-0 transition-all duration-500 ease-out z-50 ${
          isRankingsOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div 
          className="w-full max-w-4xl mx-auto md:m-4 rounded-t-3xl md:rounded-3xl shadow-2xl overflow-hidden"
          style={{
            backgroundColor: customTheme.colors.surface,
            border: `2px solid ${customTheme.colors.border}`,
            backdropFilter: 'blur(10px)',
            maxHeight: '85vh'
          }}
        >
          {/* Drag Handle */}
          <div className="flex justify-center py-3 cursor-pointer" onClick={() => setIsRankingsOpen(false)}>
            <div 
              className="w-16 h-1 rounded-full"
              style={{ backgroundColor: customTheme.colors.border }}
            />
          </div>
          
          {/* Rankings Content */}
          <div className="p-4 md:p-6 overflow-y-auto" style={{ maxHeight: 'calc(85vh - 60px)' }}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold" style={{ color: customTheme.colors.text }}>
                🏆 {language === 'ar' ? 'الترتيب' : 'Rankings'}
              </h3>
              <button
                onClick={() => setIsRankingsOpen(false)}
                className="p-2 rounded-lg transition-colors"
                style={{
                  backgroundColor: 'transparent',
                  color: customTheme.colors.text
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = customTheme.colors.primary;
                  e.currentTarget.style.color = '#ffffff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = customTheme.colors.text;
                }}
              >
                ✕
              </button>
            </div>
            <CurrentUserSelector studyStreak={studyStreak} />
            <UserRankings onUserClick={onUserClick} />
          </div>
        </div>
      </div>
    </>
  );

  const renderTopSlideDown = () => (
    <>
      {renderRankingButton()}
      {/* Backdrop overlay - mobile only */}
      {isRankingsOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={() => setIsRankingsOpen(false)}
        />
      )}
      <div 
        className={`fixed top-0 left-0 right-0 transition-all duration-500 ease-out z-50 ${
          isRankingsOpen ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div 
          className="w-full max-w-4xl mx-auto md:m-4 rounded-b-3xl md:rounded-3xl shadow-2xl overflow-hidden"
          style={{
            backgroundColor: customTheme.colors.surface,
            border: `2px solid ${customTheme.colors.border}`,
            backdropFilter: 'blur(10px)',
            maxHeight: '85vh'
          }}
        >
          {/* Drag Handle */}
          <div className="flex justify-center py-3 cursor-pointer" onClick={() => setIsRankingsOpen(false)}>
            <div 
              className="w-16 h-1 rounded-full"
              style={{ backgroundColor: customTheme.colors.border }}
            />
          </div>
          
          {/* Rankings Content */}
          <div className="p-4 md:p-6 overflow-y-auto" style={{ maxHeight: 'calc(85vh - 60px)' }}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold" style={{ color: customTheme.colors.text }}>
                🏆 {language === 'ar' ? 'الترتيب' : 'Rankings'}
              </h3>
              <button
                onClick={() => setIsRankingsOpen(false)}
                className="p-2 rounded-lg transition-colors"
                style={{
                  backgroundColor: 'transparent',
                  color: customTheme.colors.text
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = customTheme.colors.primary;
                  e.currentTarget.style.color = '#ffffff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = customTheme.colors.text;
                }}
              >
                ✕
              </button>
            </div>
            <CurrentUserSelector studyStreak={studyStreak} />
            <UserRankings onUserClick={onUserClick} />
          </div>
        </div>
      </div>
    </>
  );

  const renderSideBar = () => (
    <>
      {renderRankingButton()}
      {/* Backdrop overlay - mobile only */}
      {isRankingsOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={() => setIsRankingsOpen(false)}
        />
      )}
      <div 
        className={`md:absolute md:top-20 fixed top-0 right-0 md:h-[calc(100vh-5rem)] h-full transition-all duration-300 z-50 ${
          isRankingsOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div 
          className="h-full w-80 md:w-96 shadow-2xl overflow-hidden"
          style={{
            backgroundColor: customTheme.colors.surface,
            border: `2px solid ${customTheme.colors.border}`,
            backdropFilter: 'blur(10px)',
            borderTopLeftRadius: '1rem',
            borderBottomLeftRadius: '1rem'
          }}
        >
          {/* Rankings Content */}
          <div className="p-4 md:p-6 h-full overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold" style={{ color: customTheme.colors.text }}>
                🏆 {language === 'ar' ? 'الترتيب' : 'Rankings'}
              </h3>
              <button
                onClick={() => setIsRankingsOpen(false)}
                className="p-2 rounded-lg transition-colors"
                style={{
                  backgroundColor: 'transparent',
                  color: customTheme.colors.text
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = customTheme.colors.primary;
                  e.currentTarget.style.color = '#ffffff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = customTheme.colors.text;
                }}
              >
                ✕
              </button>
            </div>
            <CurrentUserSelector studyStreak={studyStreak} />
            <UserRankings onUserClick={onUserClick} />
          </div>
        </div>
      </div>
    </>
  );

  const renderFloating = () => (
    <>
      {renderRankingButton()}
      {isRankingsOpen && (
        <div
          className="absolute z-50 shadow-2xl overflow-hidden"
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
            width: '320px',
            maxHeight: '500px',
            backgroundColor: customTheme.colors.surface,
            border: `2px solid ${customTheme.colors.border}`,
            backdropFilter: 'blur(10px)',
            borderRadius: '1rem',
            cursor: isDragging ? 'grabbing' : 'grab'
          }}
          onMouseDown={handleMouseDown}
        >
          {/* Drag Handle */}
          <div 
            className="p-3 cursor-grab active:cursor-grabbing"
            style={{ 
              backgroundColor: `${customTheme.colors.primary}20`,
              borderBottom: `1px solid ${customTheme.colors.border}`
            }}
          >
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold" style={{ color: customTheme.colors.text }}>
                🏆 {language === 'ar' ? 'الترتيب' : 'Rankings'}
              </h3>
              <button
                onClick={() => setIsRankingsOpen(false)}
                className="p-1 rounded transition-colors"
                style={{
                  backgroundColor: 'transparent',
                  color: customTheme.colors.text
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = customTheme.colors.primary;
                  e.currentTarget.style.color = '#ffffff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = customTheme.colors.text;
                }}
              >
                ✕
              </button>
            </div>
          </div>
          
          {/* Rankings Content */}
          <div className="p-4 max-h-80 overflow-y-auto">
            <CurrentUserSelector studyStreak={studyStreak} />
            <UserRankings onUserClick={onUserClick} />
          </div>
        </div>
      )}
    </>
  );

  // Render based on display mode
  switch (displayMode) {
    case 'bottom':
      return renderBottomSlideUp();
    case 'top':
      return renderTopSlideDown();
    case 'side':
      return renderSideBar();
    case 'floating':
      return renderFloating();
    default:
      return renderBottomSlideUp();
  }
}
