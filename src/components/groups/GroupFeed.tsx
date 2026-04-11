'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useUser } from '@/contexts/UserContext';
import { socialDB, Group, GroupPost, GroupComment } from '@/lib/social';

interface GroupFeedProps {
  group: Group | null;
  onBack: () => void;
}

export function GroupFeed({ group, onBack }: GroupFeedProps) {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const currentUser = useUser().getCurrentUser();
  
  const [posts, setPosts] = useState<Array<{
    id: string;
    group_id: string;
    user_id: string;
    username: string;
    user_avatar: string;
    content: string;
    likes: number;
    comments: number;
    created_at: string;
    updated_at: string;
    liked: boolean;
    commentsList: GroupComment[];
  }>>([]);
  const [newPost, setNewPost] = useState('');
  const [showComments, setShowComments] = useState<{ [key: string]: boolean }>({});
  const [commentInputs, setCommentInputs] = useState<{ [key: string]: string }>({});
  const [replyInputs, setReplyInputs] = useState<{ [key: string]: string }>({});
  const [showReplies, setShowReplies] = useState<{ [key: string]: boolean }>({});
  const [loading, setLoading] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const [editingPost, setEditingPost] = useState<string | null>(null);
  const [editingPostContent, setEditingPostContent] = useState('');
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editingCommentContent, setEditingCommentContent] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<{ type: 'post' | 'comment'; id: string } | null>(null);

  const loadGroupPosts = async () => {
    if (!group) return;
    
    setLoading(true);
    try {
      const dbPosts = await socialDB.getGroupPosts(group.id);
      
      const postsWithDetails = await Promise.all(
        dbPosts.map(async (post) => {
          const comments = await socialDB.getGroupComments(post.id);
          const liked = currentUser ? await socialDB.didUserLikeGroupPost(post.id, currentUser.accountId) : false;
          
          return {
            ...post,
            liked,
            commentsList: comments
          };
        })
      );
      
      setPosts(postsWithDetails);
    } catch (error) {
      console.error('Error loading group posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkMembership = async () => {
    if (!group || !currentUser) return;
    
    try {
      const member = await socialDB.isGroupMember(group.id, currentUser.accountId);
      setIsMember(member);
    } catch (error) {
      console.error('Error checking membership:', error);
    }
  };

  useEffect(() => {
    if (group) {
      loadGroupPosts();
      checkMembership();
    }
  }, [group]);

  const handlePostSubmit = async () => {
    if (!currentUser || !group || !newPost.trim() || !isMember) return;
    
    try {
      const newPostData = await socialDB.createGroupPost(
        group.id,
        currentUser.accountId,
        currentUser.username || 'User',
        currentUser.avatar || 'User',
        newPost
      );
      
      if (newPostData) {
        setPosts([{
          ...newPostData,
          liked: false,
          commentsList: []
        }, ...posts]);
        setNewPost('');
      }
    } catch (error) {
      console.error('Error creating group post:', error);
    }
  };

  const handleComment = async (postId: string) => {
    if (!currentUser) return;
    
    const commentText = commentInputs[postId];
    if (!commentText?.trim()) return;
    
    try {
      const newComment = await socialDB.createGroupComment(
        postId,
        currentUser.accountId,
        currentUser.username || 'User',
        currentUser.avatar || 'User',
        commentText
      );
      
      if (newComment) {
        setPosts(posts.map(post => {
          if (post.id === postId) {
            return {
              ...post,
              comments: post.comments + 1,
              commentsList: [...post.commentsList, newComment]
            };
          }
          return post;
        }));
        
        setCommentInputs({ ...commentInputs, [postId]: '' });
      }
    } catch (error) {
      console.error('Error creating group comment:', error);
    }
  };

  const toggleComments = (postId: string) => {
    setShowComments({ ...showComments, [postId]: !showComments[postId] });
  };

  const handleLike = async (postId: string) => {
    if (!currentUser) return;
    
    try {
      const result = await socialDB.toggleGroupPostLike(postId, currentUser.accountId);
      
      setPosts(posts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            liked: result.liked,
            likes: result.likesCount
          };
        }
        return post;
      }));
    } catch (error) {
      console.error('Error toggling group post like:', error);
    }
  };

  const handleReplyInputChange = (commentId: string, value: string) => {
    setReplyInputs({ ...replyInputs, [commentId]: value });
  };

  const handleToggleReplies = (commentId: string) => {
    setShowReplies({ ...showReplies, [commentId]: !showReplies[commentId] });
  };

  const handleReplySubmit = async (postId: string, commentId: string) => {
    if (!currentUser) return;
    
    const replyText = replyInputs[commentId];
    if (!replyText?.trim()) return;
    
    try {
      const newReply = await socialDB.createGroupComment(
        postId,
        currentUser.accountId,
        currentUser.username || 'User',
        currentUser.avatar || 'User',
        `@${commentId.split('-')[0]} ${replyText}`
      );
      
      if (newReply) {
        setPosts(posts.map(post => {
          if (post.id === postId) {
            return {
              ...post,
              comments: post.comments + 1,
              commentsList: [...post.commentsList, newReply]
            };
          }
          return post;
        }));
        
        setReplyInputs({ ...replyInputs, [commentId]: '' });
        setShowReplies({ ...showReplies, [commentId]: false });
      }
    } catch (error) {
      console.error('Error creating group reply:', error);
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!currentUser) return;
    
    try {
      await socialDB.deleteGroupPost(postId, currentUser.accountId);
      setPosts(posts.filter(post => post.id !== postId));
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting group post:', error);
    }
  };

  const handleDeleteComment = async (commentId: string, postId: string) => {
    if (!currentUser) return;
    
    try {
      await socialDB.deleteGroupComment(commentId, currentUser.accountId);
      setPosts(posts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            comments: post.comments - 1,
            commentsList: post.commentsList.filter(comment => comment.id !== commentId)
          };
        }
        return post;
      }));
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting group comment:', error);
    }
  };

  const handleEditPost = (postId: string, content: string) => {
    setEditingPost(postId);
    setEditingPostContent(content);
  };

  const handleSavePostEdit = async (postId: string) => {
    if (!currentUser || !editingPostContent.trim()) return;
    
    try {
      await socialDB.updateGroupPost(postId, currentUser.accountId, editingPostContent);
      setPosts(posts.map(post => {
        if (post.id === postId) {
          return { ...post, content: editingPostContent };
        }
        return post;
      }));
      setEditingPost(null);
      setEditingPostContent('');
    } catch (error) {
      console.error('Error updating group post:', error);
    }
  };

  const handleEditComment = (commentId: string, content: string) => {
    setEditingComment(commentId);
    setEditingCommentContent(content);
  };

  const handleSaveCommentEdit = async (commentId: string, postId: string) => {
    if (!currentUser || !editingCommentContent.trim()) return;
    
    try {
      await socialDB.updateGroupComment(commentId, currentUser.accountId, editingCommentContent);
      setPosts(posts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            commentsList: post.commentsList.map(comment => 
              comment.id === commentId ? { ...comment, content: editingCommentContent } : comment
            )
          };
        }
        return post;
      }));
      setEditingComment(null);
      setEditingCommentContent('');
    } catch (error) {
      console.error('Error updating group comment:', error);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    return `${Math.floor(seconds / 86400)} days ago`;
  };

  if (!group) {
    return (
      <div className="text-center py-12">
        <p className={`${
          theme === 'light' ? 'text-gray-600' : 'text-gray-400'
        }`}>
          {language === 'ar' ? 'Select a group to view posts' : 'Select a group to view posts'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Elegant background decoration */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none overflow-hidden -z-10">
        <div className={`absolute top-0 left-0 w-40 h-40 rounded-full blur-3xl ${
          theme === 'light' ? 'bg-blue-500' : 'bg-blue-400'
        }`}></div>
        <div className={`absolute top-20 right-20 w-32 h-32 rounded-full blur-2xl ${
          theme === 'light' ? 'bg-purple-500' : 'bg-purple-400'
        }`}></div>
        <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-24 rounded-full blur-xl ${
          theme === 'light' ? 'bg-pink-400' : 'bg-pink-300'
        }`}></div>
      </div>

      <div className={`flex items-center gap-4 pb-6 border-b backdrop-blur-sm transition-all duration-300 ${
        theme === 'light' ? 'border-gray-200/60' : 'border-gray-800/60'
      }`}>
        <button
          onClick={onBack}
          className={`p-3 rounded-xl transition-all duration-300 transform hover:scale-105 ${
            theme === 'light'
              ? 'text-gray-600 hover:bg-gray-100 hover:shadow-sm'
              : 'text-gray-400 hover:bg-gray-800 hover:shadow-md'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold text-lg transition-all duration-300 hover:scale-105 shadow-lg ${
          theme === 'light'
            ? 'bg-gradient-to-br from-blue-500 to-purple-500 shadow-blue-500/25'
            : 'bg-gradient-to-br from-blue-400 to-purple-400 shadow-blue-400/25'
        }`}>
          {group.name.charAt(0).toUpperCase()}
        </div>
        
        <div className="flex-1">
          <h1 className={`text-2xl font-bold transition-all duration-300 hover:scale-105 bg-gradient-to-r bg-clip-text ${
            theme === 'light' 
              ? 'from-blue-600 via-purple-600 to-pink-600 text-transparent' 
              : 'from-blue-400 via-purple-400 to-pink-400 text-transparent'
          }`}>
            {group.name}
          </h1>
          <p className={`text-sm font-medium transition-colors duration-300 ${
            theme === 'light' ? 'text-gray-600' : 'text-gray-400'
          }`}>
            {group.members_count} {language === 'ar' ? 'members' : 'members'} • {group.posts_count} {language === 'ar' ? 'posts' : 'posts'}
          </p>
        </div>
        
        {group.is_private && (
          <span className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
            theme === 'light'
              ? 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-600 border border-gray-300/60 shadow-sm'
              : 'bg-gradient-to-r from-gray-800 to-gray-700 text-gray-400 border border-gray-600/60 shadow-md'
          }`}>
            {language === 'ar' ? 'Private' : 'Private'}
          </span>
        )}
      </div>

      {group.description && (
        <div className={`p-6 rounded-xl backdrop-blur-sm transition-all duration-300 ${
          theme === 'light' 
            ? 'bg-gray-50/80 border border-gray-200/60 shadow-sm shadow-gray-500/10' 
            : 'bg-gray-900/80 border border-gray-800/60 shadow-lg shadow-black/20'
        }`}>
          <p className={`text-base leading-relaxed transition-colors duration-300 ${
            theme === 'light' ? 'text-gray-700' : 'text-gray-300'
          }`}>
            {group.description}
          </p>
        </div>
      )}

      {currentUser && isMember && (
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
                onChange={(e) => setNewPost(e.target.value)}
                placeholder={language === 'ar' ? 'Share something with group...' : 'Share something with group...'}
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
                  onClick={handlePostSubmit}
                  disabled={!newPost.trim()}
                  className={`px-6 py-2.5 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                    newPost.trim()
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
      )}

      {currentUser && !isMember && (
        <div className={`p-8 rounded-2xl border backdrop-blur-sm text-center transition-all duration-300 ${
          theme === 'light' 
            ? 'bg-gray-50/80 border-gray-200/60 shadow-sm shadow-gray-500/10' 
            : 'bg-gray-900/80 border-gray-800/60 shadow-lg shadow-black/20'
        }`}>
          <div className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${
            theme === 'light'
              ? 'bg-gradient-to-br from-gray-100 to-gray-200'
              : 'bg-gradient-to-br from-gray-800 to-gray-900'
          }`}>
            <svg className={`w-8 h-8 ${
              theme === 'light' ? 'text-gray-400' : 'text-gray-500'
            }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <p className={`text-lg font-medium transition-colors duration-300 ${
            theme === 'light' ? 'text-gray-600' : 'text-gray-400'
          }`}>
            {language === 'ar' ? 'Join this group to see posts and interact with members.' : 'Join this group to see posts and interact with members.'}
          </p>
        </div>
      )}

      {loading && (
        <div className={`text-center py-12 rounded-2xl backdrop-blur-sm transition-all duration-300 ${
          theme === 'light' 
            ? 'bg-white/95 border border-gray-200/60 shadow-sm shadow-gray-500/10' 
            : 'bg-gray-900/95 border border-gray-800/60 shadow-xl shadow-black/20'
        }`}>
          <div className={`w-12 h-12 rounded-full mx-auto mb-4 border-2 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent animate-spin ${
            theme === 'light' ? 'border-blue-500' : 'border-blue-400'
          }`}></div>
          <div className={`text-lg font-medium transition-colors duration-300 ${
            theme === 'light' ? 'text-gray-600' : 'text-gray-400'
          }`}>
            {language === 'ar' ? 'Loading posts...' : 'Loading posts...'}
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
              
              {editingPost === post.id ? (
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
                      value={editingPostContent}
                      onChange={(e) => setEditingPostContent(e.target.value)}
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
                        onClick={() => handleSavePostEdit(post.id)}
                        disabled={!editingPostContent.trim()}
                        className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                          editingPostContent.trim()
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
                        onClick={() => {
                          setEditingPost(null);
                          setEditingPostContent('');
                        }}
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
                  onClick={() => handleLike(post.id)}
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
                  onClick={() => toggleComments(post.id)}
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
                {post.user_id === currentUser?.accountId && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleEditPost(post.id, post.content)}
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
                      onClick={() => setDeleteConfirm({ type: 'post', id: post.id })}
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
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  {post.commentsList.map((comment) => (
                    <div key={comment.id} className="mb-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center text-white text-sm font-bold">
                          {comment.username.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`font-medium text-sm ${
                              theme === 'light' ? 'text-gray-900' : 'text-white'
                            }`}>
                              {comment.username}
                            </span>
                            <span className={`text-xs ${
                              theme === 'light' ? 'text-gray-500' : 'text-gray-400'
                            }`}>
                              {formatTimeAgo(comment.created_at)}
                            </span>
                          </div>
                          
                          {editingComment === comment.id ? (
                            <div className="mb-2">
                              <textarea
                                value={editingCommentContent}
                                onChange={(e) => setEditingCommentContent(e.target.value)}
                                placeholder={language === 'ar' ? 'اكتب تعليقاً...' : 'Write a comment...'}
                                className={`w-full p-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                  theme === 'light'
                                    ? 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                                    : 'bg-black border-gray-600 text-white placeholder-gray-400'
                                }`}
                                rows={2}
                              />
                              <div className="flex gap-2 mt-1">
                                <button
                                  onClick={() => handleSaveCommentEdit(comment.id, post.id)}
                                  disabled={!editingCommentContent.trim()}
                                  className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                                    editingCommentContent.trim()
                                      ? theme === 'light'
                                        ? 'bg-green-500 text-white hover:bg-green-600'
                                        : 'bg-green-600 text-white hover:bg-green-700'
                                      : theme === 'light'
                                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                        : 'bg-gray-800 text-gray-600 cursor-not-allowed'
                                  }`}
                                >
                                  {language === 'ar' ? 'حفظ' : 'Save'}
                                </button>
                                <button
                                  onClick={() => {
                                    setEditingComment(null);
                                    setEditingCommentContent('');
                                  }}
                                  className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
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
                            <p className={`text-sm mb-2 ${
                              theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                            }`}>
                              {comment.content}
                            </p>
                          )}
                          
                          <button
                            onClick={() => handleToggleReplies(comment.id)}
                            className={`text-xs transition-colors mb-2 ${
                              theme === 'light'
                                ? 'text-blue-600 hover:text-blue-700'
                                : 'text-blue-400 hover:text-blue-300'
                            }`}
                          >
                            {language === 'ar' ? 'رد' : 'Reply'}
                          </button>
                          
                          {comment.user_id === currentUser?.accountId && (
                            <>
                              <button
                                onClick={() => handleEditComment(comment.id, comment.content)}
                                className={`text-xs transition-colors mb-2 ${
                                  theme === 'light'
                                    ? 'text-gray-500 hover:text-green-500'
                                    : 'text-gray-400 hover:text-green-400'
                                }`}
                              >
                                <span>✏️</span>
                              </button>
                              <button
                                onClick={() => setDeleteConfirm({ type: 'comment', id: comment.id })}
                                className={`text-xs transition-colors mb-2 ${
                                  theme === 'light'
                                    ? 'text-gray-500 hover:text-red-500'
                                    : 'text-gray-400 hover:text-red-400'
                                }`}
                              >
                                <span>🗑️</span>
                              </button>
                            </>
                          )}

                          {showReplies[comment.id] && (
                            <div className="flex items-start gap-2 mt-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-800">
                              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                                {currentUser?.username?.charAt(0) || 'U'}
                              </div>
                              <div className="flex-1">
                                <input
                                  type="text"
                                  value={replyInputs[comment.id] || ''}
                                  onChange={(e) => handleReplyInputChange(comment.id, e.target.value)}
                                  placeholder={language === 'ar' ? 'اكتب رداً...' : 'Write a reply...'}
                                  className={`w-full p-2 rounded-lg border text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    theme === 'light'
                                      ? 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                                      : 'bg-black border-gray-600 text-white placeholder-gray-400'
                                  }`}
                                  onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                      handleReplySubmit(post.id, comment.id);
                                    }
                                  }}
                                />
                                <button
                                  onClick={() => handleReplySubmit(post.id, comment.id)}
                                  disabled={!replyInputs[comment.id]?.trim()}
                                  className={`mt-1 px-3 py-1 rounded text-xs font-medium transition-colors ${
                                    replyInputs[comment.id]?.trim()
                                      ? theme === 'light'
                                        ? 'bg-blue-500 text-white hover:bg-blue-600'
                                        : 'bg-blue-600 text-white hover:bg-blue-700'
                                      : theme === 'light'
                                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                        : 'bg-gray-700 text-gray-500 cursor-not-allowed'
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

                  <div className="flex items-start gap-3 mt-4">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
                      {currentUser?.username?.charAt(0) || 'U'}
                    </div>
                    <div className="flex-1">
                      <input
                        type="text"
                        value={commentInputs[post.id] || ''}
                        onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                        placeholder={language === 'ar' ? 'Add a comment...' : 'Add a comment...'}
                        className={`w-full p-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          theme === 'light'
                            ? 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
                            : 'bg-gray-900 border-gray-700 text-white placeholder-gray-400'
                        }`}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleComment(post.id);
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

      {!loading && posts.length === 0 && isMember && (
        <div className="text-center py-12">
          <p className={`${
            theme === 'light' ? 'text-gray-600' : 'text-gray-400'
          }`}>
            {language === 'ar' ? 'No posts yet. Be the first to share something!' : 'No posts yet. Be the first to share something!'}
          </p>
        </div>
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`rounded-lg p-6 max-w-sm mx-4 ${
            theme === 'light' ? 'bg-white text-gray-900' : 'bg-black text-white'
          }`}>
            <h3 className="text-lg font-semibold mb-4">
              {deleteConfirm.type === 'post' 
                ? (language === 'ar' ? 'حذف المنشور' : 'Delete Post')
                : (language === 'ar' ? 'حذف التعليق' : 'Delete Comment')
              }
            </h3>
            <p className={`mb-6 ${
              theme === 'light' ? 'text-gray-600' : 'text-gray-400'
            }`}>
              {deleteConfirm.type === 'post'
                ? (language === 'ar' ? 'هل أنت متأكد من حذف هذا المنشور؟ لا يمكن التراجع عن هذا الإجراء.' : 'Are you sure you want to delete this post? This action cannot be undone.')
                : (language === 'ar' ? 'هل أنت متأكد من حذف هذا التعليق؟ لا يمكن التراجع عن هذا الإجراء.' : 'Are you sure you want to delete this comment? This action cannot be undone.')
              }
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  if (deleteConfirm.type === 'post') {
                    handleDeletePost(deleteConfirm.id);
                  } else {
                    handleDeleteComment(deleteConfirm.id, '');
                  }
                }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  theme === 'light'
                    ? 'bg-red-500 text-white hover:bg-red-600'
                    : 'bg-red-600 text-white hover:bg-red-700'
                }`}
              >
                {language === 'ar' ? 'حذف' : 'Delete'}
              </button>
              <button
                onClick={() => setDeleteConfirm(null)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
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
      )}
    </div>
  );
}
