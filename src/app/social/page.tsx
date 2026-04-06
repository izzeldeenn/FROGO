'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useUser } from '@/contexts/UserContext';
import { CustomThemeProvider } from '@/contexts/CustomThemeContext';
import { SocialNavbar } from '@/components/social/SocialNavbar';

function SocialPageContent() {
  const { theme } = useTheme();
  const { language, t } = useLanguage();
  const currentUser = useUser().getCurrentUser();
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

  return (
    <CustomThemeProvider>
      <div className={`min-h-screen ${
        theme === 'light' ? 'bg-gray-50' : 'bg-gray-900'
      }`}>
        <SocialNavbar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {activeTab === 'feed' && (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Feed */}
              <div className="lg:col-span-2 space-y-6">
                {posts.map((post) => (
                  <div 
                    key={post.id}
                    className="p-6 rounded-2xl border-2"
                    style={{
                      backgroundColor: theme === 'light' ? '#ffffff' : '#1f2937',
                      borderColor: theme === 'light' ? '#e5e7eb' : '#374151'
                    }}
                  >
                    <div className="flex items-start gap-4">
                      <div className="text-3xl">{post.avatar}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`font-semibold ${
                            theme === 'light' ? 'text-gray-900' : 'text-white'
                          }`}>
                            {post.user}
                          </span>
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
                        <div className="flex items-center gap-4">
                          <button className={`flex items-center gap-1 text-sm transition-colors ${
                            theme === 'light'
                              ? 'text-gray-500 hover:text-red-500'
                              : 'text-gray-400 hover:text-red-400'
                          }`}>
                            ❤️ {post.likes}
                          </button>
                          <button className={`flex items-center gap-1 text-sm transition-colors ${
                            theme === 'light'
                              ? 'text-gray-500 hover:text-blue-500'
                              : 'text-gray-400 hover:text-blue-400'
                          }`}>
                            💬 {post.comments}
                          </button>
                          <button className={`text-sm transition-colors ${
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
            </div>
          )}

          {activeTab === 'friends' && (
            <div className="text-center py-12">
              <h2 className={`text-2xl font-bold mb-4 ${
                theme === 'light' ? 'text-gray-900' : 'text-white'
              }`}>
                {language === 'ar' ? 'الأصدقاء' : 'Friends'}
              </h2>
              <p className={`${
                theme === 'light' ? 'text-gray-600' : 'text-gray-400'
              }`}>
                {language === 'ar' ? 'قيد التطوير...' : 'Coming soon...'}
              </p>
            </div>
          )}

          {activeTab === 'challenges' && (
            <div className="text-center py-12">
              <h2 className={`text-2xl font-bold mb-4 ${
                theme === 'light' ? 'text-gray-900' : 'text-white'
              }`}>
                {language === 'ar' ? 'التحديات' : 'Challenges'}
              </h2>
              <p className={`${
                theme === 'light' ? 'text-gray-600' : 'text-gray-400'
              }`}>
                {language === 'ar' ? 'قيد التطوير...' : 'Coming soon...'}
              </p>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="text-center py-12">
              <h2 className={`text-2xl font-bold mb-4 ${
                theme === 'light' ? 'text-gray-900' : 'text-white'
              }`}>
                {language === 'ar' ? 'الملف الشخصي' : 'Profile'}
              </h2>
              <p className={`${
                theme === 'light' ? 'text-gray-600' : 'text-gray-400'
              }`}>
                {language === 'ar' ? 'قيد التطوير...' : 'Coming soon...'}
              </p>
            </div>
          )}
        </div>
      </div>
    </CustomThemeProvider>
  );
}

export default function SocialPage() {
  return <SocialPageContent />;
}