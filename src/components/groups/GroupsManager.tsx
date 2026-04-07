'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useUser } from '@/contexts/UserContext';
import { socialDB, Group, GroupPost, GroupComment } from '@/lib/social';

interface GroupsManagerProps {
  onGroupSelect: (group: Group) => void;
  selectedGroup: Group | null;
}

export function GroupsManager({ onGroupSelect, selectedGroup }: GroupsManagerProps) {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const currentUser = useUser().getCurrentUser();
  
  const [groups, setGroups] = useState<Group[]>([]);
  const [userGroups, setUserGroups] = useState<Group[]>([]);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Create group form state
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);

  const loadGroups = async () => {
    setLoading(true);
    try {
      const [allGroups, myGroups] = await Promise.all([
        socialDB.getGroups(),
        currentUser ? socialDB.getUserGroups(currentUser.accountId) : []
      ]);
      
      setGroups(allGroups);
      setUserGroups(myGroups);
    } catch (error) {
      console.error('Error loading groups:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGroups();
  }, []);

  const handleCreateGroup = async () => {
    if (!currentUser || !groupName.trim()) return;
    
    try {
      const newGroup = await socialDB.createGroup(
        groupName,
        groupDescription,
        isPrivate,
        currentUser.accountId,
        currentUser.username || 'User',
        currentUser.avatar || 'User'
      );
      
      if (newGroup) {
        setGroupName('');
        setGroupDescription('');
        setIsPrivate(false);
        setShowCreateGroup(false);
        loadGroups();
      }
    } catch (error) {
      console.error('Error creating group:', error);
    }
  };

  const handleJoinGroup = async (groupId: string) => {
    if (!currentUser) return;
    
    try {
      const success = await socialDB.joinGroup(
        groupId,
        currentUser.accountId,
        currentUser.username || 'User',
        currentUser.avatar || 'User'
      );
      
      if (success) {
        loadGroups();
      }
    } catch (error) {
      console.error('Error joining group:', error);
    }
  };

  const handleLeaveGroup = async (groupId: string) => {
    if (!currentUser) return;
    
    try {
      const success = await socialDB.leaveGroup(groupId, currentUser.accountId);
      
      if (success) {
        loadGroups();
        if (selectedGroup?.id === groupId) {
          onGroupSelect(null as any);
        }
      }
    } catch (error) {
      console.error('Error leaving group:', error);
    }
  };

  const isUserMember = (groupId: string) => {
    return userGroups.some(group => group.id === groupId);
  };

  // Filter groups based on search term
  const filteredGroups = groups.filter(group =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredUserGroups = userGroups.filter(group =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header with Search */}
      <div className="flex items-center justify-between gap-4">
        <h1 className={`text-2xl font-bold ${
          theme === 'light' ? 'text-gray-900' : 'text-white'
        }`}>
          {language === 'ar' ? 'Groups' : 'Groups'}
        </h1>
        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={language === 'ar' ? 'ابحث عن مجموعات...' : 'Search groups...'}
              className={`pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 w-64 ${
                theme === 'light'
                  ? 'bg-white border-gray-300 text-gray-900'
                  : 'bg-gray-800 border-gray-700 text-white'
              }`}
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              🔍
            </div>
          </div>
          <button
            onClick={() => setShowCreateGroup(true)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              theme === 'light'
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {language === 'ar' ? 'Create Group' : 'Create Group'}
          </button>
        </div>
      </div>

      {/* Create Group Modal */}
      {showCreateGroup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-md rounded-2xl p-6 ${
            theme === 'light' ? 'bg-white' : 'bg-gray-900'
          }`}>
            <h2 className={`text-xl font-bold mb-4 ${
              theme === 'light' ? 'text-gray-900' : 'text-white'
            }`}>
              {language === 'ar' ? 'Create New Group' : 'Create New Group'}
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                }`}>
                  {language === 'ar' ? 'Group Name' : 'Group Name'}
                </label>
                <input
                  type="text"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    theme === 'light'
                      ? 'bg-white border-gray-300 text-gray-900'
                      : 'bg-gray-800 border-gray-700 text-white'
                  }`}
                  placeholder={language === 'ar' ? 'Enter group name...' : 'Enter group name...'}
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                }`}>
                  {language === 'ar' ? 'Description' : 'Description'}
                </label>
                <textarea
                  value={groupDescription}
                  onChange={(e) => setGroupDescription(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    theme === 'light'
                      ? 'bg-white border-gray-300 text-gray-900'
                      : 'bg-gray-800 border-gray-700 text-white'
                  }`}
                  rows={3}
                  placeholder={language === 'ar' ? 'Describe your group...' : 'Describe your group...'}
                />
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="private"
                  checked={isPrivate}
                  onChange={(e) => setIsPrivate(e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="private" className={`text-sm ${
                  theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                }`}>
                  {language === 'ar' ? 'Private Group' : 'Private Group'}
                </label>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowCreateGroup(false)}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                  theme === 'light'
                    ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {language === 'ar' ? 'Cancel' : 'Cancel'}
              </button>
              <button
                onClick={handleCreateGroup}
                disabled={!groupName.trim()}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                  groupName.trim()
                    ? theme === 'light'
                      ? 'bg-blue-500 text-white hover:bg-blue-600'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                    : theme === 'light'
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-800 text-gray-600 cursor-not-allowed'
                }`}
              >
                {language === 'ar' ? 'Create' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}

    {/* Reddit-style Groups Display */}
    {loading ? (
      <div className="text-center py-12">
        <div className={`text-lg ${
          theme === 'light' ? 'text-gray-600' : 'text-gray-400'
        }`}>
          {language === 'ar' ? 'Loading groups...' : 'Loading groups...'}
        </div>
      </div>
    ) : (
      <div className="space-y-8">
        {/* All Groups Section */}
        {filteredGroups.length > 0 && (
          <div>
            <h2 className={`text-lg font-semibold mb-4 ${
              theme === 'light' ? 'text-gray-900' : 'text-white'
            }`}>
              {language === 'ar' ? 'جميع المجموعات' : 'All Groups'}
            </h2>
            <div className="space-y-4">
              {filteredGroups.map((group) => (
                <div
                  key={group.id}
                  className={`p-4 rounded-lg border transition-all hover:shadow-md ${
                    theme === 'light'
                      ? 'bg-white border-gray-200 hover:border-blue-300'
                      : 'bg-gray-900 border-gray-700 hover:border-blue-600'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <img
                      src={group.creator_avatar}
                      alt={group.creator_username}
                      className="w-16 h-16 rounded-full object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className={`font-bold text-lg hover:text-blue-500 cursor-pointer transition-colors ${
                          theme === 'light' ? 'text-gray-900' : 'text-white'
                        }`}
                          onClick={() => onGroupSelect(group)}
                        >
                          {group.name}
                        </h3>
                        {group.is_private && (
                          <span className="text-yellow-500">🔒</span>
                        )}
                      </div>
                      <p className={`text-sm mb-3 line-clamp-2 ${
                        theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                      }`}>
                        {group.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm">
                          <span className={`${
                            theme === 'light' ? 'text-gray-500' : 'text-gray-400'
                          }`}>
                            {language === 'ar' ? '👥' : '👥'} {group.members_count} {language === 'ar' ? 'أعضاء' : 'members'}
                          </span>
                          <span className={`${
                            theme === 'light' ? 'text-gray-500' : 'text-gray-400'
                          }`}>
                            📝 {group.posts_count} {language === 'ar' ? 'منشور' : 'posts'}
                          </span>
                        </div>
                        
                        {!isUserMember(group.id) ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleJoinGroup(group.id);
                            }}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                              group.is_private
                                ? theme === 'light'
                                  ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                                  : 'bg-yellow-600 text-white hover:bg-yellow-700'
                                : theme === 'light'
                                  ? 'bg-blue-500 text-white hover:bg-blue-600'
                                  : 'bg-blue-600 text-white hover:bg-blue-700'
                            }`}
                          >
                            {group.is_private 
                              ? (language === 'ar' ? 'طلب الانضمام' : 'Request to Join')
                              : (language === 'ar' ? 'انضمام' : 'Join')
                            }
                          </button>
                        ) : (
                          <button
                            onClick={() => onGroupSelect(group)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                              theme === 'light'
                                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                            }`}
                          >
                            {language === 'ar' ? 'عرض' : 'View'}
                          </button>
                        )}
                      </div>
                      <div className={`text-xs ${
                        theme === 'light' ? 'text-gray-500' : 'text-gray-400'
                      }`}>
                        {language === 'ar' ? 'أنشأها' : 'Created by'} {group.creator_username}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* My Groups Section */}
        {filteredUserGroups.length > 0 && (
          <div>
            <h2 className={`text-lg font-semibold mb-4 ${
              theme === 'light' ? 'text-gray-900' : 'text-white'
            }`}>
              {language === 'ar' ? 'مجموعاتي' : 'My Groups'}
            </h2>
            <div className="space-y-4">
              {filteredUserGroups.map((group) => (
                <div
                  key={group.id}
                  className={`p-4 rounded-lg border transition-all hover:shadow-md ${
                    theme === 'light'
                      ? 'bg-white border-gray-200 hover:border-blue-300'
                      : 'bg-gray-900 border-gray-700 hover:border-blue-600'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <img
                      src={group.creator_avatar}
                      alt={group.creator_username}
                      className="w-16 h-16 rounded-full object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className={`font-bold text-lg hover:text-blue-500 cursor-pointer transition-colors ${
                          theme === 'light' ? 'text-gray-900' : 'text-white'
                        }`}
                          onClick={() => onGroupSelect(group)}
                        >
                          {group.name}
                        </h3>
                        {group.is_private && (
                          <span className="text-yellow-500">🔒</span>
                        )}
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          theme === 'light'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-green-900 text-green-300'
                        }`}>
                          {language === 'ar' ? 'عضو' : 'Member'}
                        </span>
                      </div>
                      <p className={`text-sm mb-3 line-clamp-2 ${
                        theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                      }`}>
                        {group.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm">
                          <span className={`${
                            theme === 'light' ? 'text-gray-500' : 'text-gray-400'
                          }`}>
                            {language === 'ar' ? '👥' : '👥'} {group.members_count} {language === 'ar' ? 'أعضاء' : 'members'}
                          </span>
                          <span className={`${
                            theme === 'light' ? 'text-gray-500' : 'text-gray-400'
                          }`}>
                            📝 {group.posts_count} {language === 'ar' ? 'منشور' : 'posts'}
                          </span>
                        </div>
                        
                        <div className="flex gap-2">
                          <button
                            onClick={() => onGroupSelect(group)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                              theme === 'light'
                                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                            }`}
                          >
                            {language === 'ar' ? 'عرض' : 'View'}
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleLeaveGroup(group.id);
                            }}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                              theme === 'light'
                                ? 'bg-red-500 text-white hover:bg-red-600'
                                : 'bg-red-600 text-white hover:bg-red-700'
                            }`}
                          >
                            {language === 'ar' ? 'مغادرة' : 'Leave'}
                          </button>
                        </div>
                      </div>
                      <div className={`text-xs ${
                        theme === 'light' ? 'text-gray-500' : 'text-gray-400'
                      }`}>
                        {language === 'ar' ? 'أنشأها' : 'Created by'} {group.creator_username}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Results */}
        {filteredGroups.length === 0 && filteredUserGroups.length === 0 && (
          <div className="text-center py-12">
            <p className={`${
              theme === 'light' ? 'text-gray-600' : 'text-gray-400'
            }`}>
              {language === 'ar' ? 'لا توجد مجموعات مطابقة للبحث' : 'No groups found matching your search'}
            </p>
          </div>
        )}
      </div>
    )}
    </div>
  );
}
