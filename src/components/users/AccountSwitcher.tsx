'use client';

import React, { useState, useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useCustomThemeClasses } from '@/hooks/useCustomThemeClasses';
import { userDB, UserAccount } from '@/lib/supabase';

interface AccountSwitcherProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AccountSwitcher({ isOpen, onClose }: AccountSwitcherProps) {
  const { currentAccountId, isLoggedIn, switchAccount, logout } = useUser();
  const { language, t } = useLanguage();
  const { theme } = useTheme();
  const customTheme = useCustomThemeClasses();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [allUsers, setAllUsers] = useState<UserAccount[]>([]);
  const [fetchingUsers, setFetchingUsers] = useState(false);

  // Fetch all users from database when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchAllUsers();
    }
  }, [isOpen]);

  const fetchAllUsers = async () => {
    setFetchingUsers(true);
    try {
      const users = await userDB.getAllUsers();
      setAllUsers(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to load accounts');
    } finally {
      setFetchingUsers(false);
    }
  };

  const handleSwitchAccount = async (accountId: string) => {
    if (accountId === currentAccountId) return;
    
    setLoading(true);
    setError('');
    
    try {
      const result = await switchAccount(accountId);
      if (result.success) {
        onClose();
      } else {
        setError(result.error || 'Failed to switch account');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const handleLogout = () => {
    logout();
    onClose();
  };

  const currentUser = allUsers.find(u => u.account_id === currentAccountId);

  return (
    <>
      <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[9999] p-4">
        <div className={`w-full max-w-md max-h-[80vh] rounded-3xl shadow-2xl overflow-hidden ${
          theme === 'light' ? 'bg-white' : 'bg-gray-900'
        }`}
        style={{ border: `2px solid ${customTheme.colors.border}` }}
        >
        <div 
          className="p-6 border-b"
          style={{
            background: `linear-gradient(to right, ${customTheme.colors.surface}, ${customTheme.colors.background})`,
            borderColor: customTheme.colors.border
          }}
        >
          <div className="flex items-center justify-between">
            <h3 className={`text-2xl font-bold ${
              theme === 'light' ? 'text-gray-800' : 'text-gray-100'
            }`}>
              اختيار الحساب
            </h3>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full flex items-center justify-center transition-colors"
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

        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 rounded-xl text-red-600 text-sm" 
                 style={{ backgroundColor: '#fee2e2', border: '1px solid #fecaca' }}>
              {error}
            </div>
          )}

          {isLoggedIn && currentUser && (
            <div className="mb-6 p-4 rounded-xl"
                 style={{ backgroundColor: customTheme.colors.surface + '30' }}>
              <div className="flex items-center space-x-3 space-x-reverse">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                     style={{ backgroundColor: customTheme.colors.primary + '20' }}>
                      <img src={currentUser.avatar || '👤'} alt="" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                </div>
                <div className="flex-1">
                  <div className={`font-semibold ${
                    theme === 'light' ? 'text-gray-800' : 'text-gray-100'
                  }`}>
                    {currentUser.username}
                  </div>
                  <div className={`text-sm ${
                    theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                  }`}>
                    {currentUser.email}
                  </div>
                  <div className={`text-xs ${
                    theme === 'light' ? 'text-gray-500' : 'text-gray-500'
                  }`}>
                    الحساب الحالي
                  </div>
                </div>
              </div>
            </div>
          )}

          {fetchingUsers ? (
            <div className={`text-center py-8 ${
              theme === 'light' ? 'text-gray-500' : 'text-gray-400'
            }`}>
              جاري تحميل الحسابات...
            </div>
          ) : (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {allUsers
                .filter((user: UserAccount) => 
                  user.account_id !== currentAccountId && 
                  user.email === currentUser?.email
                )
                .map((user: UserAccount) => (
                  <button
                    key={user.account_id}
                    onClick={() => handleSwitchAccount(user.account_id)}
                    disabled={loading}
                    className="w-full p-3 rounded-xl text-right transition-all disabled:opacity-50 hover:scale-[1.02]"
                    style={{
                      backgroundColor: customTheme.colors.surface + '20',
                      border: `1px solid ${customTheme.colors.border}`
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = customTheme.colors.surface + '40';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = customTheme.colors.surface + '20';
                    }}
                  >
                    <div className="flex items-center space-x-3 space-x-reverse">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
                           style={{ backgroundColor: customTheme.colors.primary + '20' }}>
                        <img src={user.avatar || '👤'} alt="" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                      </div>
                      <div className="flex-1 text-right">
                        <div className={`font-medium ${
                          theme === 'light' ? 'text-gray-800' : 'text-gray-100'
                        }`}>
                          {user.username}
                        </div>
                        <div className={`text-sm ${
                          theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                        }`}>
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
            </div>
          )}

          {!fetchingUsers && allUsers.filter((user: UserAccount) => 
            user.account_id !== currentAccountId && 
            user.email === currentUser?.email
          ).length === 0 && (
            <div className={`text-center py-8 ${
              theme === 'light' ? 'text-gray-500' : 'text-gray-400'
            }`}>
              لا توجد حسابات أخرى بنفس البريد الإلكتروني
            </div>
          )}

          <div className="mt-6 space-y-3">
            {isLoggedIn && (
              <button
                onClick={handleLogout}
                className="w-full px-4 py-3 rounded-xl font-medium transition-all"
                style={{
                  backgroundColor: '#ef4444',
                  color: '#ffffff',
                  border: '2px solid #ef4444'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#dc2626';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#ef4444';
                }}
              >
                تسجيل الخروج
              </button>
            )}
            
            <button
              onClick={onClose}
              className="w-full px-4 py-3 rounded-xl font-medium transition-all"
              style={{
                backgroundColor: customTheme.colors.surface,
                color: customTheme.colors.text,
                border: `2px solid ${customTheme.colors.border}`
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = customTheme.colors.border;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = customTheme.colors.surface;
              }}
            >
              إغلاق
            </button>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}
