'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useUser } from '@/contexts/UserContext';
import { socialDB, SocialComment, Group } from '@/lib/social';

interface Post {
  id: string;
  user_id: string;
  username: string;
  user_avatar: string;
  content: string;
  likes: number;
  comments: number;
  created_at: string;
  updated_at: string;
  liked: boolean;
  commentsList: SocialComment[];
}

interface FeedTabProps {
  posts: Post[];
  newPost: string;
  loading: boolean;
  showComments: { [key: string]: boolean };
  commentInputs: { [key: string]: string };
  replyInputs: { [key: string]: string };
  showReplies: { [key: string]: boolean };
  editingPost: { [key: string]: boolean };
  editingComment: { [key: string]: boolean };
  editingPostContent: { [key: string]: string };
  editingCommentContent: { [key: string]: string };
  onNewPostChange: (value: string) => void;
  onPostSubmit: () => void;
  onLike: (postId: string) => void;
  onToggleComments: (postId: string) => void;
  onCommentChange: (postId: string, value: string) => void;
  onCommentSubmit: (postId: string) => void;
  onReplyChange: (commentId: string, value: string) => void;
  onReplySubmit: (postId: string, commentId: string) => void;
  onToggleReplies: (commentId: string) => void;
  onEditPost: (postId: string, content: string) => void;
  onSavePostEdit: (postId: string) => void;
  onEditComment: (commentId: string, content: string) => void;
  onSaveCommentEdit: (commentId: string, postId: string) => void;
  onDeletePost: (postId: string) => void;
  onDeleteComment: (commentId: string, postId: string) => void;
  onEditPostContentChange: (postId: string, value: string) => void;
  onEditCommentContentChange: (commentId: string, value: string) => void;
  onExploreGroups: () => void;
}

export function FeedTab({
  posts,
  newPost,
  loading,
  showComments,
  commentInputs,
  replyInputs,
  showReplies,
  editingPost,
  editingComment,
  editingPostContent,
  editingCommentContent,
  onNewPostChange,
  onPostSubmit,
  onLike,
  onToggleComments,
  onCommentChange,
  onCommentSubmit,
  onReplyChange,
  onReplySubmit,
  onToggleReplies,
  onEditPost,
  onSavePostEdit,
  onEditComment,
  onSaveCommentEdit,
  onDeletePost,
  onDeleteComment,
  onEditPostContentChange,
  onEditCommentContentChange,
  onExploreGroups
}: FeedTabProps) {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const currentUser = useUser().getCurrentUser();

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    return `${Math.floor(seconds / 86400)} days ago`;
  };

  // State for suggested groups
  const [suggestedGroups, setSuggestedGroups] = useState<Group[]>([]);
  const [userGroups, setUserGroups] = useState<Group[]>([]);
  const [joiningGroups, setJoiningGroups] = useState<{ [key: string]: boolean }>({});

  // Load groups from database
  useEffect(() => {
    const loadGroups = async () => {
      try {
        const [allGroups, myGroups] = await Promise.all([
          socialDB.getGroups(5, 0), // Get first 5 groups
          currentUser ? socialDB.getUserGroups(currentUser.accountId) : Promise.resolve([])
        ]);
        setSuggestedGroups(allGroups);
        setUserGroups(myGroups);
      } catch (error) {
        console.error('Error loading groups:', error);
      }
    };

    loadGroups();
  }, [currentUser?.accountId]);

  // Check if user is member of group
  const isUserMember = (groupId: string) => {
    return userGroups.some(group => group.id === groupId);
  };

  // Handle joining a group - using GroupsManager logic
  const handleJoinGroup = async (groupId: string) => {
    if (!currentUser) return;
    
    setJoiningGroups(prev => ({ ...prev, [groupId]: true }));
    
    try {
      const success = await socialDB.joinGroup(
        groupId,
        currentUser.accountId,
        currentUser.username || 'User',
        currentUser.avatar || 'User'
      );
      
      if (success) {
        // Reload groups to update the UI
        const [allGroups, myGroups] = await Promise.all([
          socialDB.getGroups(5, 0),
          socialDB.getUserGroups(currentUser.accountId)
        ]);
        setSuggestedGroups(allGroups);
        setUserGroups(myGroups);
      }
    } catch (error) {
      console.error('Error joining group:', error);
    } finally {
      setJoiningGroups(prev => ({ ...prev, [groupId]: false }));
    }
  };

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        {/* Elegant background decoration for feed */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none overflow-hidden -z-10">
          <div className={`absolute top-20 left-20 w-32 h-32 rounded-full blur-2xl ${
            theme === 'light' ? 'bg-blue-400' : 'bg-blue-300'
          }`}></div>
          <div className={`absolute top-40 right-20 w-24 h-24 rounded-full blur-xl ${
            theme === 'light' ? 'bg-purple-400' : 'bg-purple-300'
          }`}></div>
        </div>

        <div className={`p-6 rounded-2xl border backdrop-blur-sm transition-all duration-300 ${
          theme === 'light' 
            ? 'bg-white/95 border-gray-200/60 shadow-sm shadow-gray-500/10' 
            : 'bg-gray-900/95 border-gray-800/60 shadow-xl shadow-black/20'
        }`}>
          <div className="flex items-start gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold transition-all duration-300 hover:scale-105 shadow-lg ${
              theme === 'light'
                ? 'bg-gradient-to-br from-blue-500 to-purple-500 shadow-blue-500/25'
                : 'bg-gradient-to-br from-blue-400 to-purple-400 shadow-blue-400/25'
            }`}>
              <span className="text-lg">{currentUser?.username?.charAt(0) || 'U'}</span>
            </div>
            <div className="flex-1">
              <textarea
                value={newPost}
                onChange={(e) => onNewPostChange(e.target.value)}
                placeholder={language === 'ar' ? 'Share your study progress...' : 'Share your study progress...'}
                className={`w-full p-4 rounded-xl border resize-none transition-all duration-300 backdrop-blur-sm ${
                  theme === 'light'
                    ? 'bg-gray-50/80 border-gray-200/50 text-gray-900 placeholder-gray-500 focus:bg-white/90 focus:border-blue-400/50 focus:shadow-lg focus:shadow-blue-500/20'
                    : 'bg-gray-800/80 border-gray-700/50 text-white placeholder-gray-400 focus:bg-gray-700/90 focus:border-blue-400/50 focus:shadow-lg focus:shadow-blue-500/20'
                }`}
                rows={3}
              />
              <div className="flex justify-between items-center mt-4">
                <span className={`text-sm font-medium transition-colors duration-300 ${
                  theme === 'light' ? 'text-gray-500' : 'text-gray-400'
                }`}>
                  {newPost.length}/280
                </span>
                <button
                  onClick={onPostSubmit}
                  disabled={!newPost.trim() || !currentUser}
                  className={`px-6 py-2.5 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                    newPost.trim() && currentUser
                      ? theme === 'light'
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-lg shadow-blue-500/25'
                        : 'bg-gradient-to-r from-blue-400 to-blue-500 text-white hover:from-blue-500 hover:to-blue-600 shadow-xl shadow-blue-400/25'
                      : theme === 'light'
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-gray-800 text-gray-600 cursor-not-allowed'
                  }`}
                >
                  {language === 'ar' ? 'Post' : 'Post'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {loading && (
          <div className={`text-center py-12 rounded-2xl backdrop-blur-sm transition-all duration-300 ${
            theme === 'light' 
              ? 'bg-white/95 border border-gray-200/60 shadow-sm shadow-gray-500/10' 
              : 'bg-gray-900/95 border border-gray-800/60 shadow-xl shadow-black/20'
          }`}>
            <div className={`text-lg font-medium transition-colors duration-300 ${
              theme === 'light' ? 'text-gray-600' : 'text-gray-400'
            }`}>
              Loading posts...
            </div>
          </div>
        )}

        {!loading && posts.map((post) => (
          <div 
            key={post.id}
            className={`p-6 rounded-2xl border backdrop-blur-sm transition-all duration-300 hover:shadow-lg ${
              theme === 'light' 
                ? 'bg-white/95 border-gray-200/60 shadow-sm shadow-gray-500/10 hover:shadow-gray-500/20' 
                : 'bg-gray-900/95 border-gray-800/60 shadow-xl shadow-black/20 hover:shadow-black/30'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold transition-all duration-300 hover:scale-105 shadow-lg ${
                theme === 'light'
                  ? 'bg-gradient-to-br from-gray-400 to-gray-600 shadow-gray-500/25'
                  : 'bg-gradient-to-br from-gray-600 to-gray-800 shadow-gray-400/25'
              }`}>
                <span className="text-lg">{post.username.charAt(0)}</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <span className={`font-semibold text-base transition-colors duration-300 ${
                    theme === 'light' ? 'text-gray-900' : 'text-white'
                  }`}>
                    {post.username}
                  </span>
                  <span className={`text-sm font-medium transition-colors duration-300 ${
                    theme === 'light' ? 'text-gray-500' : 'text-gray-400'
                  }`}>
                    {formatTimeAgo(post.created_at)}
                  </span>
                </div>
                {editingPost[post.id] ? (
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold transition-all duration-300 hover:scale-105 shadow-lg ${
                      theme === 'light'
                        ? 'bg-gradient-to-br from-blue-500 to-purple-500 shadow-blue-500/25'
                        : 'bg-gradient-to-br from-blue-400 to-purple-400 shadow-blue-400/25'
                    }`}>
                      <span className="text-lg">{currentUser?.username?.charAt(0) || 'U'}</span>
                    </div>
                    <div className="flex-1">
                      <textarea
                        value={editingPostContent[post.id] || ''}
                        onChange={(e) => onEditPostContentChange(post.id, e.target.value)}
                        placeholder={language === 'ar' ? 'اكتب منشوراً...' : 'Write your post...'}
                        className={`w-full p-4 rounded-xl border text-sm resize-none transition-all duration-300 backdrop-blur-sm ${
                          theme === 'light'
                            ? 'bg-white/80 border-gray-200/50 text-gray-900 placeholder-gray-500 focus:bg-white/90 focus:border-blue-400/50 focus:shadow-lg focus:shadow-blue-500/20'
                            : 'bg-gray-800/80 border-gray-700/50 text-white placeholder-gray-400 focus:bg-gray-700/90 focus:border-blue-400/50 focus:shadow-lg focus:shadow-blue-500/20'
                        }`}
                        rows={3}
                      />
                      <div className="flex gap-3 mt-3">
                        <button
                          onClick={() => onSavePostEdit(post.id)}
                          disabled={!editingPostContent[post.id]?.trim()}
                          className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                            editingPostContent[post.id]?.trim()
                              ? theme === 'light'
                                ? 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 shadow-lg shadow-green-500/25'
                                : 'bg-gradient-to-r from-green-400 to-green-500 text-white hover:from-green-500 hover:to-green-600 shadow-xl shadow-green-400/25'
                              : theme === 'light'
                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                : 'bg-gray-800 text-gray-600 cursor-not-allowed'
                          }`}
                        >
                          {language === 'ar' ? 'حفظ' : 'Save'}
                        </button>
                        <button
                          onClick={() => onEditPost(post.id, '')}
                          className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                            theme === 'light'
                              ? 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                              : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                          }`}
                        >
                          {language === 'ar' ? 'إلغاء' : 'Cancel'}
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className={`mb-4 text-base leading-relaxed transition-colors duration-300 ${
                    theme === 'light' ? 'text-gray-700' : 'text-gray-200'
                  }`}>
                    {post.content}
                  </p>
                )}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onLike(post.id)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                      post.liked
                        ? theme === 'light'
                          ? 'bg-red-50 text-red-600 border border-red-200/60 shadow-sm shadow-red-500/20'
                          : 'bg-red-900/30 text-red-400 border border-red-700/40 shadow-lg shadow-red-400/20'
                        : theme === 'light'
                          ? 'bg-gray-50 text-gray-600 hover:bg-red-50 hover:text-red-600 border border-transparent hover:border-red-200/60'
                          : 'bg-gray-800/40 text-gray-400 hover:bg-red-900/30 hover:text-red-400 border border-transparent hover:border-red-700/40'
                    }`}
                  >
                    <svg className="w-4 h-4" fill={post.liked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <span>{post.likes}</span>
                  </button>
                  <button
                    onClick={() => onToggleComments(post.id)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                      theme === 'light'
                        ? 'bg-gray-50 text-gray-600 hover:bg-blue-50 hover:text-blue-600 border border-transparent hover:border-blue-200/60'
                        : 'bg-gray-800/40 text-gray-400 hover:bg-blue-900/30 hover:text-blue-400 border border-transparent hover:border-blue-700/40'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span>{post.comments}</span>
                  </button>
                  <button className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                    theme === 'light'
                      ? 'bg-gray-50 text-gray-600 hover:bg-green-50 hover:text-green-600 border border-transparent hover:border-green-200/60'
                      : 'bg-gray-800/40 text-gray-400 hover:bg-green-900/30 hover:text-green-400 border border-transparent hover:border-green-700/40'
                  }`}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                  {post.user_id === currentUser?.accountId && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onEditPost(post.id, post.content)}
                        className={`p-1.5 rounded-lg text-sm transition-all duration-300 transform hover:scale-105 ${
                          theme === 'light'
                            ? 'text-gray-500 hover:text-green-600 hover:bg-green-50'
                            : 'text-gray-400 hover:text-green-400 hover:bg-green-900/30'
                        }`}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => onDeletePost(post.id)}
                        className={`p-1.5 rounded-lg text-sm transition-all duration-300 transform hover:scale-105 ${
                          theme === 'light'
                            ? 'text-gray-500 hover:text-red-600 hover:bg-red-50'
                            : 'text-gray-400 hover:text-red-400 hover:bg-red-900/30'
                        }`}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>

                {showComments[post.id] && (
                  <div className={`mt-6 pt-6 border-t transition-all duration-300 ${
                    theme === 'light' ? 'border-gray-200/60' : 'border-gray-800/60'
                  }`}>
                    {post.commentsList.map((comment) => (
                      <div key={comment.id} className="mb-4">
                        <div className="flex items-start gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold transition-all duration-300 hover:scale-105 shadow-md ${
                            theme === 'light'
                              ? 'bg-gradient-to-br from-gray-400 to-gray-600 shadow-gray-500/25'
                              : 'bg-gradient-to-br from-gray-600 to-gray-800 shadow-gray-400/25'
                          }`}>
                            <span className="text-sm">{comment.username.charAt(0)}</span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className={`font-semibold text-sm transition-colors duration-300 ${
                                theme === 'light' ? 'text-gray-900' : 'text-white'
                              }`}>
                                {comment.username}
                              </span>
                              <span className={`text-xs font-medium transition-colors duration-300 ${
                                theme === 'light' ? 'text-gray-500' : 'text-gray-400'
                              }`}>
                                {formatTimeAgo(comment.created_at)}
                              </span>
                            </div>
                            {editingComment[comment.id] ? (
                              <div className="mb-3">
                                <textarea
                                  value={editingCommentContent[comment.id] || ''}
                                  onChange={(e) => onEditCommentContentChange(comment.id, e.target.value)}
                                  placeholder={language === 'ar' ? 'اكتب تعليقاً...' : 'Write a comment...'}
                                  className={`w-full p-3 rounded-lg border text-sm resize-none transition-all duration-300 backdrop-blur-sm ${
                                    theme === 'light'
                                      ? 'bg-white/80 border-gray-200/50 text-gray-900 placeholder-gray-500 focus:bg-white/90 focus:border-blue-400/50 focus:shadow-lg focus:shadow-blue-500/20'
                                      : 'bg-gray-800/80 border-gray-700/50 text-white placeholder-gray-400 focus:bg-gray-700/90 focus:border-blue-400/50 focus:shadow-lg focus:shadow-blue-500/20'
                                  }`}
                                  rows={2}
                                />
                                <div className="flex gap-2 mt-2">
                                  <button
                                    onClick={() => onSaveCommentEdit(comment.id, post.id)}
                                    disabled={!editingCommentContent[comment.id]?.trim()}
                                    className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                                      editingCommentContent[comment.id]?.trim()
                                        ? theme === 'light'
                                          ? 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 shadow-md shadow-green-500/25'
                                          : 'bg-gradient-to-r from-green-400 to-green-500 text-white hover:from-green-500 hover:to-green-600 shadow-lg shadow-green-400/25'
                                        : theme === 'light'
                                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                          : 'bg-gray-800 text-gray-600 cursor-not-allowed'
                                    }`}
                                  >
                                    {language === 'ar' ? 'حفظ' : 'Save'}
                                  </button>
                                  <button
                                    onClick={() => onEditComment(comment.id, '')}
                                    className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                                      theme === 'light'
                                        ? 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                                    }`}
                                  >
                                    {language === 'ar' ? 'إلغاء' : 'Cancel'}
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div>
                                <p className={`text-sm leading-relaxed mb-3 transition-colors duration-300 ${
                                  theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                                }`}>
                                  {comment.content}
                                </p>
                                <div className="flex items-center gap-2 mb-3">
                                  <button
                                    onClick={() => onToggleReplies(comment.id)}
                                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-300 transform hover:scale-105 ${
                                      theme === 'light'
                                        ? 'bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200/60'
                                        : 'bg-blue-900/30 text-blue-400 hover:bg-blue-800/40 border border-blue-700/40'
                                    }`}
                                  >
                                    {language === 'ar' ? 'رد' : 'Reply'}
                                  </button>
                                  {comment.user_id === currentUser?.accountId && (
                                    <div className="flex items-center gap-1">
                                      <button
                                        onClick={() => onEditComment(comment.id, comment.content)}
                                        className={`p-1 rounded-lg text-xs transition-all duration-300 transform hover:scale-105 ${
                                          theme === 'light'
                                            ? 'text-gray-500 hover:text-green-600 hover:bg-green-50'
                                            : 'text-gray-400 hover:text-green-400 hover:bg-green-900/30'
                                        }`}
                                      >
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                      </button>
                                      <button
                                        onClick={() => onDeleteComment(comment.id, post.id)}
                                        className={`p-1 rounded-lg text-xs transition-all duration-300 transform hover:scale-105 ${
                                          theme === 'light'
                                            ? 'text-gray-500 hover:text-red-600 hover:bg-red-50'
                                            : 'text-gray-400 hover:text-red-400 hover:bg-red-900/30'
                                        }`}
                                      >
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}

                            {showReplies[comment.id] && (
                              <div className={`flex items-start gap-2 mt-3 p-3 rounded-lg backdrop-blur-sm transition-all duration-300 ${
                                theme === 'light'
                                  ? 'bg-gray-50/80 border border-gray-200/50'
                                  : 'bg-gray-800/80 border border-gray-700/50'
                              }`}>
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold transition-all duration-300 hover:scale-105 shadow-md ${
                                  theme === 'light'
                                    ? 'bg-gradient-to-br from-blue-500 to-purple-500 shadow-blue-500/25'
                                    : 'bg-gradient-to-br from-blue-400 to-purple-400 shadow-blue-400/25'
                                }`}>
                                  <span className="text-xs">{currentUser?.username?.charAt(0) || 'U'}</span>
                                </div>
                                <div className="flex-1">
                                  <input
                                    type="text"
                                    value={replyInputs[comment.id] || ''}
                                    onChange={(e) => onReplyChange(comment.id, e.target.value)}
                                    placeholder={language === 'ar' ? 'اكتب رداً...' : 'Write a reply...'}
                                    className={`w-full p-2 rounded-lg border text-xs transition-all duration-300 backdrop-blur-sm ${
                                      theme === 'light'
                                        ? 'bg-white/80 border-gray-200/50 text-gray-900 placeholder-gray-500 focus:bg-white/90 focus:border-blue-400/50 focus:shadow-lg focus:shadow-blue-500/20'
                                        : 'bg-gray-800/80 border-gray-700/50 text-white placeholder-gray-400 focus:bg-gray-700/90 focus:border-blue-400/50 focus:shadow-lg focus:shadow-blue-500/20'
                                    }`}
                                    onKeyPress={(e) => {
                                      if (e.key === 'Enter') {
                                        onReplySubmit(post.id, comment.id);
                                      }
                                    }}
                                  />
                                  <button
                                    onClick={() => onReplySubmit(post.id, comment.id)}
                                    disabled={!replyInputs[comment.id]?.trim()}
                                    className={`mt-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                                      replyInputs[comment.id]?.trim()
                                        ? theme === 'light'
                                          ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-md shadow-blue-500/25'
                                          : 'bg-gradient-to-r from-blue-400 to-blue-500 text-white hover:from-blue-500 hover:to-blue-600 shadow-lg shadow-blue-400/25'
                                        : theme === 'light'
                                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                          : 'bg-gray-800 text-gray-600 cursor-not-allowed'
                                    }`}
                                  >
                                    {language === 'ar' ? 'إرسال' : 'Send'}
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}

                    <div className="flex items-start gap-3 mt-6">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold transition-all duration-300 hover:scale-105 shadow-lg ${
                        theme === 'light'
                          ? 'bg-gradient-to-br from-blue-500 to-purple-500 shadow-blue-500/25'
                          : 'bg-gradient-to-br from-blue-400 to-purple-400 shadow-blue-400/25'
                      }`}>
                        <span className="text-sm">{currentUser?.username?.charAt(0) || 'U'}</span>
                      </div>
                      <div className="flex-1">
                        <input
                          type="text"
                          value={commentInputs[post.id] || ''}
                          onChange={(e) => onCommentChange(post.id, e.target.value)}
                          placeholder={language === 'ar' ? 'Add a comment...' : 'Add a comment...'}
                          className={`w-full p-3 rounded-lg border text-sm transition-all duration-300 backdrop-blur-sm ${
                            theme === 'light'
                              ? 'bg-gray-50/80 border-gray-200/50 text-gray-900 placeholder-gray-500 focus:bg-white/90 focus:border-blue-400/50 focus:shadow-lg focus:shadow-blue-500/20'
                              : 'bg-gray-800/80 border-gray-700/50 text-white placeholder-gray-400 focus:bg-gray-700/90 focus:border-blue-400/50 focus:shadow-lg focus:shadow-blue-500/20'
                          }`}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              onCommentSubmit(post.id);
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {!loading && posts.length === 0 && (
          <div className={`text-center py-16 rounded-2xl backdrop-blur-sm transition-all duration-300 ${
            theme === 'light' 
              ? 'bg-white/95 border border-gray-200/60 shadow-sm shadow-gray-500/10' 
              : 'bg-gray-900/95 border border-gray-800/60 shadow-xl shadow-black/20'
          }`}>
            <div className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${
              theme === 'light'
                ? 'bg-gradient-to-br from-gray-100 to-gray-200'
                : 'bg-gradient-to-br from-gray-800 to-gray-900'
            }`}>
              <svg className={`w-8 h-8 ${
                theme === 'light' ? 'text-gray-400' : 'text-gray-500'
              }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <p className={`text-lg font-medium transition-colors duration-300 ${
              theme === 'light' ? 'text-gray-600' : 'text-gray-400'
            }`}>
              {language === 'ar' ? 'No posts yet. Be the first to share something!' : 'No posts yet. Be the first to share something!'}
            </p>
          </div>
        )}
      </div>

      {/* Right Sidebar - Suggested Groups */}
      <div className="space-y-6">
        {/* Elegant background decoration for sidebar */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none overflow-hidden -z-10">
          <div className={`absolute top-10 right-10 w-28 h-28 rounded-full blur-2xl ${
            theme === 'light' ? 'bg-purple-400' : 'bg-purple-300'
          }`}></div>
          <div className={`absolute bottom-20 right-20 w-20 h-20 rounded-full blur-xl ${
            theme === 'light' ? 'bg-pink-400' : 'bg-pink-300'
          }`}></div>
        </div>

        <div className={`p-6 rounded-2xl border backdrop-blur-xl transition-all duration-300 ${
          theme === 'light' 
            ? 'bg-white/95 border-gray-200/60 shadow-lg shadow-gray-500/10' 
            : 'bg-gray-900/95 border-gray-800/60 shadow-xl shadow-black/20'
        }`}>
          <div className="flex items-center justify-between mb-6">
            <h3 className={`text-lg font-bold bg-gradient-to-r bg-clip-text transition-all duration-300 ${
              theme === 'light' 
                ? 'from-purple-600 via-pink-600 to-red-600 text-transparent' 
                : 'from-purple-400 via-pink-400 to-red-400 text-transparent'
            }`}>
              {language === 'ar' ? 'Discover Groups' : 'Discover Groups'}
            </h3>
            <div className={`px-2 py-1 rounded-full text-xs font-medium ${
              theme === 'light' 
                ? 'bg-blue-100 text-blue-700' 
                : 'bg-blue-900/50 text-blue-300'
            }`}>
              {suggestedGroups.length} {language === 'ar' ? 'groups' : 'groups'}
            </div>
          </div>
          
          <div className="space-y-3">
            {suggestedGroups.map((group) => (
              <div 
                key={group.id} 
                className={`group relative overflow-hidden rounded-xl border transition-all duration-300 hover:scale-[1.02] hover:shadow-lg ${
                  theme === 'light' 
                    ? 'bg-gradient-to-br from-gray-50 to-white border-gray-200 hover:border-blue-300 hover:shadow-blue-500/10' 
                    : 'bg-gradient-to-br from-gray-900 to-black border-gray-700 hover:border-blue-500/50 hover:shadow-blue-500/20'
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <div className={`h-full w-full ${
                    theme === 'light' 
                      ? 'bg-gradient-to-r from-blue-500/5 to-purple-500/5' 
                      : 'bg-gradient-to-r from-blue-500/10 to-purple-500/10'
                  }`}></div>
                </div>
                
                <div className="relative p-4">
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <img 
                        src={group.creator_avatar} 
                        alt={group.creator_username}
                        className="w-12 h-12 rounded-full object-cover ring-2 ring-offset-2 transition-all duration-300 group-hover:scale-110 ${
                          theme === 'light' 
                            ? 'ring-gray-200 ring-offset-white' 
                            : 'ring-gray-700 ring-offset-black'
                        }"
                      />
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-green-500 border-2 border-white"></div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className={`font-semibold text-sm mb-1 truncate transition-colors group-hover:text-blue-500 ${
                        theme === 'light' ? 'text-gray-900' : 'text-white'
                      }`}>
                        {group.name}
                      </h4>
                      <p className={`text-xs mb-3 line-clamp-2 leading-relaxed ${
                        theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                      }`}>
                        {group.description}
                      </p>
                      
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`flex items-center gap-1 text-xs ${
                            theme === 'light' ? 'text-gray-500' : 'text-gray-400'
                          }`}>
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
                            </svg>
                            <span>{group.members_count}</span>
                          </div>
                          <div className={`flex items-center gap-1 text-xs ${
                            theme === 'light' ? 'text-gray-500' : 'text-gray-400'
                          }`}>
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3.293 1.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L7.586 10 5.293 7.707a1 1 0 010-1.414zM11 12a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"/>
                            </svg>
                            <span>{group.posts_count}</span>
                          </div>
                        </div>
                        {group.is_private && (
                          <div className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            theme === 'light' 
                              ? 'bg-amber-100 text-amber-700' 
                              : 'bg-amber-900/50 text-amber-300'
                          }`}>
                            {language === 'ar' ? 'private' : 'Private'}
                          </div>
                        )}
                      </div>
                      
                      {isUserMember(group.id) ? (
                        <button
                          disabled
                          className={`w-full px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-300 ${
                            theme === 'light'
                              ? 'bg-gradient-to-r from-green-500 to-green-600 text-white cursor-not-allowed'
                              : 'bg-gradient-to-r from-green-600 to-green-700 text-white cursor-not-allowed'
                          }`}
                        >
                          {language === 'ar' ? 'Joined' : 'Joined'}
                        </button>
                      ) : (
                        <button
                          onClick={() => handleJoinGroup(group.id)}
                          disabled={joiningGroups[group.id] || !currentUser}
                          className={`w-full px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                            joiningGroups[group.id] || !currentUser
                              ? theme === 'light'
                                ? 'bg-gradient-to-r from-gray-400 to-gray-500 text-white cursor-not-allowed'
                                : 'bg-gradient-to-r from-gray-600 to-gray-700 text-white cursor-not-allowed'
                              : theme === 'light'
                                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-md hover:shadow-lg'
                                : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl'
                          }`}
                        >
                          {joiningGroups[group.id] 
                            ? (language === 'ar' ? 'Joining...' : 'Joining...')
                            : (language === 'ar' ? 'Join Group' : 'Join Group')
                          }
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <button 
            onClick={onExploreGroups}
            className={`mt-4 w-full px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 hover:scale-105 active:scale-95 ${
              theme === 'light'
                ? 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 hover:from-gray-200 hover:to-gray-300'
                : 'bg-gradient-to-r from-gray-800 to-gray-700 text-gray-300 hover:from-gray-700 hover:to-gray-600'
            }`}
          >
            {language === 'ar' ? 'Explore All Groups' : 'Explore All Groups'}
          </button>
        </div>
      </div>
    </div>
  );
}