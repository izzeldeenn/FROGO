'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useUser } from '@/contexts/UserContext';
import { Logo } from '@/components/ui/Logo';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { CustomThemeProvider } from '@/contexts/CustomThemeContext';
import { useCustomThemeClasses } from '@/hooks/useCustomThemeClasses';

function SocialPageContent() {
  const { theme } = useTheme();
  const { language, t } = useLanguage();
  const currentUser = useUser().getCurrentUser();
  const customTheme = useCustomThemeClasses();
  const [activeTab, setActiveTab] = useState('feed');
  const [posts, setPosts] = useState<Array<{
    id: number;
    user: string;
    avatar: string;
    time: string;
    content: string;
    likes: number;
    comments: number;
  }>>([]);
  const [newPost, setNewPost] = useState('');

  useEffect(() => {
    // Mock data for social feed
    setPosts([
      {
        id: 1,
        user: 'أحمد محمد',
        avatar: '👨‍🎓',
        time: '2 ساعة',
        content: 'أكملت 5 ساعات دراسة اليوم! شعور رائع بالإنجاز 🎯',
        likes: 12,
        comments: 3
      },
      {
        id: 2,
        user: 'سارة أحمد',
        avatar: '👩‍🎓',
        time: '4 ساعات',
        content: 'نصيحة: استخدم تقنية بومودورو لتحسين التركيز. أثبتت فعاليتي لي شخصياً! 🍅',
        likes: 25,
        comments: 8
      },
      {
        id: 3,
        user: 'محمد علي',
        avatar: '👨‍💻',
        time: '6 ساعات',
        content: 'وصلت للمستوى 15! التحدي التالي هو 20 ساعة دراسة هذا الأسبوع 🚀',
        likes: 18,
        comments: 5
      }
    ]);
  }, []);

  const handlePostSubmit = () => {
    if (newPost.trim()) {
      const post = {
        id: posts.length + 1,
        user: currentUser?.username || 'مستخدم',
        avatar: '🎓',
        time: 'الآن',
        content: newPost,
        likes: 0,
        comments: 0
      };
      setPosts([post, ...posts]);
      setNewPost('');
    }
  };

  const tabs = [
    { id: 'feed', label: language === 'ar' ? 'الخلاصة' : 'Feed', icon: '📱' },
    { id: 'friends', label: language === 'ar' ? 'الأصدقاء' : 'Friends', icon: '👥' },
    { id: 'challenges', label: language === 'ar' ? 'التحديات' : 'Challenges', icon: '🏆' },
    { id: 'profile', label: language === 'ar' ? 'الملف الشخصي' : 'Profile', icon: '👤' }
  ];

  return (
    <div className={`min-h-screen ${
      theme === 'light' ? 'bg-gray-50' : 'bg-gray-900'
    }`}>
      {/* Header */}
      <header className={`sticky top-0 z-50 border-b ${
        theme === 'light' 
          ? 'bg-white/90 backdrop-blur-sm border-gray-200' 
          : 'bg-gray-800/90 backdrop-blur-sm border-gray-700'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-6">
              <Logo />
              <h1 className={`text-xl font-bold ${
                theme === 'light' ? 'text-gray-900' : 'text-white'
              }`}>
                {language === 'ar' ? 'منصة التواصل' : 'Social Platform'}
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <a 
                href="/focus"
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  theme === 'light'
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                {language === 'ar' ? 'التركيز' : 'Focus'}
              </a>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className={`border-b ${
        theme === 'light' ? 'bg-white border-gray-200' : 'bg-gray-800 border-gray-700'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 space-x-reverse">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? `border-current ${
                        theme === 'light' ? 'text-blue-600' : 'text-blue-400'
                      }`
                    : `border-transparent ${
                        theme === 'light' 
                          ? 'text-gray-500 hover:text-gray-700 hover:border-gray-300' 
                          : 'text-gray-400 hover:text-gray-200 hover:border-gray-600'
                      }`
                }`}
              >
                <span className="ml-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'feed' && (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Feed */}
            <div className="lg:col-span-2 space-y-6">
              {/* Create Post */}
              <div 
                className="p-6 rounded-2xl border-2"
                style={{
                  backgroundColor: customTheme.colors.surface,
                  borderColor: customTheme.colors.border
                }}
              >
                <div className="flex gap-3">
                  <div className="text-3xl">🎓</div>
                  <div className="flex-1">
                    <textarea
                      value={newPost}
                      onChange={(e) => setNewPost(e.target.value)}
                      placeholder={language === 'ar' 
                        ? 'شارك إنجازاتك الدراسية...' 
                        : 'Share your study achievements...'
                      }
                      className={`w-full p-3 rounded-lg border-2 resize-none focus:outline-none ${
                        theme === 'light'
                          ? 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                          : 'bg-gray-700 border-gray-600 text-white focus:border-blue-400'
                      }`}
                      rows={3}
                    />
                    <div className="flex justify-between items-center mt-3">
                      <div className="flex gap-2">
                        <button className={`p-2 rounded-lg transition-colors ${
                          theme === 'light'
                            ? 'hover:bg-gray-100 text-gray-600'
                            : 'hover:bg-gray-700 text-gray-400'
                        }`}>
                          📷
                        </button>
                        <button className={`p-2 rounded-lg transition-colors ${
                          theme === 'light'
                            ? 'hover:bg-gray-100 text-gray-600'
                            : 'hover:bg-gray-700 text-gray-400'
                        }`}>
                          📊
                        </button>
                        <button className={`p-2 rounded-lg transition-colors ${
                          theme === 'light'
                            ? 'hover:bg-gray-100 text-gray-600'
                            : 'hover:bg-gray-700 text-gray-400'
                        }`}>
                          🏆
                        </button>
                      </div>
                      <button
                        onClick={handlePostSubmit}
                        className="px-6 py-2 rounded-lg font-medium transition-colors"
                        style={{
                          backgroundColor: customTheme.colors.primary,
                          color: '#ffffff'
                        }}
                      >
                        {language === 'ar' ? 'نشر' : 'Post'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Posts */}
              {posts.map((post) => (
                <div 
                  key={post.id}
                  className="p-6 rounded-2xl border-2"
                  style={{
                    backgroundColor: customTheme.colors.surface,
                    borderColor: customTheme.colors.border
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div className="text-3xl">{post.avatar}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className={`font-bold ${
                          theme === 'light' ? 'text-gray-900' : 'text-white'
                        }`}>
                          {post.user}
                        </h3>
                        <span className={`text-sm ${
                          theme === 'light' ? 'text-gray-500' : 'text-gray-400'
                        }`}>
                          {post.time}
                        </span>
                      </div>
                      <p className={`mb-4 ${
                        theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                      }`}>
                        {post.content}
                      </p>
                      <div className="flex items-center gap-6">
                        <button className={`flex items-center gap-2 transition-colors ${
                          theme === 'light'
                            ? 'text-gray-500 hover:text-red-500'
                            : 'text-gray-400 hover:text-red-400'
                        }`}>
                          ❤️ {post.likes}
                        </button>
                        <button className={`flex items-center gap-2 transition-colors ${
                          theme === 'light'
                            ? 'text-gray-500 hover:text-blue-500'
                            : 'text-gray-400 hover:text-blue-400'
                        }`}>
                          💬 {post.comments}
                        </button>
                        <button className={`flex items-center gap-2 transition-colors ${
                          theme === 'light'
                            ? 'text-gray-500 hover:text-green-500'
                            : 'text-gray-400 hover:text-green-400'
                        }`}>
                          🔄
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* User Stats */}
              <div 
                className="p-6 rounded-2xl border-2"
                style={{
                  backgroundColor: customTheme.colors.surface,
                  borderColor: customTheme.colors.border
                }}
              >
                <h3 className={`font-bold mb-4 ${
                  theme === 'light' ? 'text-gray-900' : 'text-white'
                }`}>
                  {language === 'ar' ? 'إحصائياتك' : 'Your Stats'}
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className={
                      theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                    }>
                      {language === 'ar' ? 'ساعات الدراسة' : 'Study Hours'}
                    </span>
                    <span className="font-bold" style={{ color: customTheme.colors.primary }}>
                      127
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={
                      theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                    }>
                      {language === 'ar' ? 'المستوى' : 'Level'}
                    </span>
                    <span className="font-bold" style={{ color: customTheme.colors.primary }}>
                      15
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={
                      theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                    }>
                      {language === 'ar' ? 'الإنجازات' : 'Achievements'}
                    </span>
                    <span className="font-bold" style={{ color: customTheme.colors.primary }}>
                      23
                    </span>
                  </div>
                </div>
              </div>

              {/* Active Users */}
              <div 
                className="p-6 rounded-2xl border-2"
                style={{
                  backgroundColor: customTheme.colors.surface,
                  borderColor: customTheme.colors.border
                }}
              >
                <h3 className={`font-bold mb-4 ${
                  theme === 'light' ? 'text-gray-900' : 'text-white'
                }`}>
                  {language === 'ar' ? 'المستخدمون النشطون' : 'Active Users'}
                </h3>
                <div className="space-y-3">
                  {['فاطمة علي', 'خالد سعيد', 'نورا أحمد'].map((user, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="text-2xl">🎓</div>
                      <div className="flex-1">
                        <div className={`font-medium ${
                          theme === 'light' ? 'text-gray-900' : 'text-white'
                        }`}>
                          {user}
                        </div>
                        <div className={`text-sm ${
                          theme === 'light' ? 'text-gray-500' : 'text-gray-400'
                        }`}>
                          {language === 'ar' ? 'يدرس الآن' : 'Studying now'}
                        </div>
                      </div>
                      <button className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                        theme === 'light'
                          ? 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                          : 'bg-blue-900 text-blue-300 hover:bg-blue-800'
                      }`}>
                        {language === 'ar' ? 'متابعة' : 'Follow'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'friends' && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">👥</div>
            <h2 className={`text-2xl font-bold mb-4 ${
              theme === 'light' ? 'text-gray-900' : 'text-white'
            }`}>
              {language === 'ar' ? 'الأصدقاء' : 'Friends'}
            </h2>
            <p className={
              theme === 'light' ? 'text-gray-600' : 'text-gray-400'
            }>
              {language === 'ar' ? 'قسم الأصدقاء قيد التطوير' : 'Friends section coming soon'}
            </p>
          </div>
        )}

        {activeTab === 'challenges' && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🏆</div>
            <h2 className={`text-2xl font-bold mb-4 ${
              theme === 'light' ? 'text-gray-900' : 'text-white'
            }`}>
              {language === 'ar' ? 'التحديات' : 'Challenges'}
            </h2>
            <p className={
              theme === 'light' ? 'text-gray-600' : 'text-gray-400'
            }>
              {language === 'ar' ? 'قسم التحديات قيد التطوير' : 'Challenges section coming soon'}
            </p>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">👤</div>
            <h2 className={`text-2xl font-bold mb-4 ${
              theme === 'light' ? 'text-gray-900' : 'text-white'
            }`}>
              {language === 'ar' ? 'الملف الشخصي' : 'Profile'}
            </h2>
            <p className={
              theme === 'light' ? 'text-gray-600' : 'text-gray-400'
            }>
              {language === 'ar' ? 'قسم الملف الشخصي قيد التطوير' : 'Profile section coming soon'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SocialPage() {
  return (
    <CustomThemeProvider>
      <SocialPageContent />
    </CustomThemeProvider>
  );
}
