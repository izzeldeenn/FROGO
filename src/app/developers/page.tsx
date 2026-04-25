'use client';

import { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import Link from 'next/link';

export default function DevelopersPage() {
  const { theme } = useTheme();
  const { language, t } = useLanguage();
  const [email, setEmail] = useState('');

  const isRTL = language === 'ar';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement newsletter signup
    alert('Thanks for subscribing!');
    setEmail('');
  };

  return (
    <div className={`min-h-screen ${theme === 'light' ? 'bg-white' : 'bg-black'}`}>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="text-center">
            <h1 className={`text-5xl lg:text-7xl font-bold mb-6 ${
              theme === 'light' ? 'text-gray-900' : 'text-white'
            }`}>
              {language === 'ar' ? 'سوق المطورين' : 'Developer Marketplace'}
            </h1>
            <p className={`text-xl lg:text-2xl mb-8 max-w-3xl mx-auto ${
              theme === 'light' ? 'text-gray-600' : 'text-gray-300'
            }`}>
              {language === 'ar' 
                ? 'ابنِ وبيع برمجياتك في سوق Goatly. وصل لملايين المستخدمين واكسب من إبداعك.'
                : 'Build and sell your software on the Goatly marketplace. Reach millions of users and earn from your creativity.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/developers/dashboard"
                className={`px-8 py-4 rounded-xl font-bold text-lg transition-all ${
                  theme === 'light'
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                {language === 'ar' ? 'ابدأ الآن' : 'Get Started'}
              </Link>
              <Link
                href="/store"
                className={`px-8 py-4 rounded-xl font-bold text-lg transition-all ${
                  theme === 'light'
                    ? 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                    : 'bg-gray-800 text-white hover:bg-gray-700'
                }`}
              >
                {language === 'ar' ? 'تصفح السوق' : 'Browse Marketplace'}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={`py-20 ${theme === 'light' ? 'bg-gray-50' : 'bg-gray-900'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className={`text-4xl font-bold text-center mb-12 ${
            theme === 'light' ? 'text-gray-900' : 'text-white'
          }`}>
            {language === 'ar' ? 'لماذا تنشر معنا؟' : 'Why Publish With Us?'}
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className={`p-8 rounded-2xl ${
              theme === 'light' ? 'bg-white shadow-lg' : 'bg-gray-800'
            }`}>
              <div className="text-5xl mb-4">🌍</div>
              <h3 className={`text-2xl font-bold mb-3 ${
                theme === 'light' ? 'text-gray-900' : 'text-white'
              }`}>
                {language === 'ar' ? 'وصول واسع' : 'Wide Reach'}
              </h3>
              <p className={theme === 'light' ? 'text-gray-600' : 'text-gray-300'}>
                {language === 'ar'
                  ? 'وصل لملايين المستخدمين حول العالم الذين يستخدمون Goatly يومياً'
                  : 'Reach millions of users worldwide who use Goatly daily'}
              </p>
            </div>
            <div className={`p-8 rounded-2xl ${
              theme === 'light' ? 'bg-white shadow-lg' : 'bg-gray-800'
            }`}>
              <div className="text-5xl mb-4">💰</div>
              <h3 className={`text-2xl font-bold mb-3 ${
                theme === 'light' ? 'text-gray-900' : 'text-white'
              }`}>
                {language === 'ar' ? 'أرباح عالية' : 'High Earnings'}
              </h3>
              <p className={theme === 'light' ? 'text-gray-600' : 'text-gray-300'}>
                {language === 'ar'
                  ? 'احصل على 70% من كل عملية بيع مع نظام دفع سريع وموثوق'
                  : 'Get 70% of every sale with fast and reliable payment system'}
              </p>
            </div>
            <div className={`p-8 rounded-2xl ${
              theme === 'light' ? 'bg-white shadow-lg' : 'bg-gray-800'
            }`}>
              <div className="text-5xl mb-4">🛠️</div>
              <h3 className={`text-2xl font-bold mb-3 ${
                theme === 'light' ? 'text-gray-900' : 'text-white'
              }`}>
                {language === 'ar' ? 'أدوات سهلة' : 'Easy Tools'}
              </h3>
              <p className={theme === 'light' ? 'text-gray-600' : 'text-gray-300'}>
                {language === 'ar'
                  ? 'لوحة تحكم بسيطة لنشر وإدارة منتجاتك بسهولة'
                  : 'Simple dashboard to publish and manage your products easily'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className={`text-4xl font-bold text-center mb-12 ${
            theme === 'light' ? 'text-gray-900' : 'text-white'
          }`}>
            {language === 'ar' ? 'كيف يعمل؟' : 'How It Works'}
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 ${
                theme === 'light' ? 'bg-blue-100 text-blue-600' : 'bg-blue-900 text-blue-400'
              }`}>
                1
              </div>
              <h3 className={`text-xl font-bold mb-2 ${
                theme === 'light' ? 'text-gray-900' : 'text-white'
              }`}>
                {language === 'ar' ? 'سجل حساب' : 'Sign Up'}
              </h3>
              <p className={theme === 'light' ? 'text-gray-600' : 'text-gray-300'}>
                {language === 'ar' ? 'أنشئ حساب مطور مجاني' : 'Create a free developer account'}
              </p>
            </div>
            <div className="text-center">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 ${
                theme === 'light' ? 'bg-blue-100 text-blue-600' : 'bg-blue-900 text-blue-400'
              }`}>
                2
              </div>
              <h3 className={`text-xl font-bold mb-2 ${
                theme === 'light' ? 'text-gray-900' : 'text-white'
              }`}>
                {language === 'ar' ? 'ابنِ منتجك' : 'Build Your Product'}
              </h3>
              <p className={theme === 'light' ? 'text-gray-600' : 'text-gray-300'}>
                {language === 'ar' ? 'طور برمجية متوافقة مع Goatly' : 'Develop software compatible with Goatly'}
              </p>
            </div>
            <div className="text-center">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 ${
                theme === 'light' ? 'bg-blue-100 text-blue-600' : 'bg-blue-900 text-blue-400'
              }`}>
                3
              </div>
              <h3 className={`text-xl font-bold mb-2 ${
                theme === 'light' ? 'text-gray-900' : 'text-white'
              }`}>
                {language === 'ar' ? 'انشر للمراجعة' : 'Submit for Review'}
              </h3>
              <p className={theme === 'light' ? 'text-gray-600' : 'text-gray-300'}>
                {language === 'ar' ? 'أرسل منتجك للموافقة' : 'Submit your product for approval'}
              </p>
            </div>
            <div className="text-center">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 ${
                theme === 'light' ? 'bg-blue-100 text-blue-600' : 'bg-blue-900 text-blue-400'
              }`}>
                4
              </div>
              <h3 className={`text-xl font-bold mb-2 ${
                theme === 'light' ? 'text-gray-900' : 'text-white'
              }`}>
                {language === 'ar' ? 'ابدأ البيع' : 'Start Selling'}
              </h3>
              <p className={theme === 'light' ? 'text-gray-600' : 'text-gray-300'}>
                {language === 'ar' ? 'ابدأ في البيع واكسب الأرباح' : 'Start selling and earn profits'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Product Types */}
      <section className={`py-20 ${theme === 'light' ? 'bg-gray-50' : 'bg-gray-900'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className={`text-4xl font-bold text-center mb-12 ${
            theme === 'light' ? 'text-gray-900' : 'text-white'
          }`}>
            {language === 'ar' ? 'أنواع المنتجات' : 'Product Types'}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className={`p-6 rounded-xl border-2 ${
              theme === 'light' ? 'border-gray-200 bg-white' : 'border-gray-700 bg-gray-800'
            }`}>
              <div className="text-4xl mb-4">🎨</div>
              <h3 className={`text-xl font-bold mb-2 ${
                theme === 'light' ? 'text-gray-900' : 'text-white'
              }`}>
                {language === 'ar' ? 'السمات' : 'Themes'}
              </h3>
              <p className={theme === 'light' ? 'text-gray-600' : 'text-gray-300'}>
                {language === 'ar' ? 'تصميمات مخصصة لواجهة التطبيق' : 'Custom app interface designs'}
              </p>
            </div>
            <div className={`p-6 rounded-xl border-2 ${
              theme === 'light' ? 'border-gray-200 bg-white' : 'border-gray-700 bg-gray-800'
            }`}>
              <div className="text-4xl mb-4">👤</div>
              <h3 className={`text-xl font-bold mb-2 ${
                theme === 'light' ? 'text-gray-900' : 'text-white'
              }`}>
                {language === 'ar' ? 'الصور الرمزية' : 'Avatars'}
              </h3>
              <p className={theme === 'light' ? 'text-gray-600' : 'text-gray-300'}>
                {language === 'ar' ? 'صور شخصية مخصصة للمستخدمين' : 'Custom profile pictures for users'}
              </p>
            </div>
            <div className={`p-6 rounded-xl border-2 ${
              theme === 'light' ? 'border-gray-200 bg-white' : 'border-gray-700 bg-gray-800'
            }`}>
              <div className="text-4xl mb-4">🖼️</div>
              <h3 className={`text-xl font-bold mb-2 ${
                theme === 'light' ? 'text-gray-900' : 'text-white'
              }`}>
                {language === 'ar' ? 'الخلفيات' : 'Backgrounds'}
              </h3>
              <p className={theme === 'light' ? 'text-gray-600' : 'text-gray-300'}>
                {language === 'ar' ? 'خلفيات جميلة للشاشة' : 'Beautiful screen backgrounds'}
              </p>
            </div>
            <div className={`p-6 rounded-xl border-2 ${
              theme === 'light' ? 'border-gray-200 bg-white' : 'border-gray-700 bg-gray-800'
            }`}>
              <div className="text-4xl mb-4">🏆</div>
              <h3 className={`text-xl font-bold mb-2 ${
                theme === 'light' ? 'text-gray-900' : 'text-white'
              }`}>
                {language === 'ar' ? 'الشارات' : 'Badges'}
              </h3>
              <p className={theme === 'light' ? 'text-gray-600' : 'text-gray-300'}>
                {language === 'ar' ? 'شارات تميز للمستخدمين' : 'Achievement badges for users'}
              </p>
            </div>
            <div className={`p-6 rounded-xl border-2 ${
              theme === 'light' ? 'border-gray-200 bg-white' : 'border-gray-700 bg-gray-800'
            }`}>
              <div className="text-4xl mb-4">✨</div>
              <h3 className={`text-xl font-bold mb-2 ${
                theme === 'light' ? 'text-gray-900' : 'text-white'
              }`}>
                {language === 'ar' ? 'التأثيرات' : 'Effects'}
              </h3>
              <p className={theme === 'light' ? 'text-gray-600' : 'text-gray-300'}>
                {language === 'ar' ? 'تأثيرات بصرية متحركة' : 'Animated visual effects'}
              </p>
            </div>
            <div className={`p-6 rounded-xl border-2 ${
              theme === 'light' ? 'border-gray-200 bg-white' : 'border-gray-700 bg-gray-800'
            }`}>
              <div className="text-4xl mb-4">⚡</div>
              <h3 className={`text-xl font-bold mb-2 ${
                theme === 'light' ? 'text-gray-900' : 'text-white'
              }`}>
                {language === 'ar' ? 'الخدمات' : 'Services'}
              </h3>
              <p className={theme === 'light' ? 'text-gray-600' : 'text-gray-300'}>
                {language === 'ar' ? 'خدمات إضافية وميزات متقدمة' : 'Additional services and advanced features'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className={`text-4xl font-bold mb-6 ${
            theme === 'light' ? 'text-gray-900' : 'text-white'
          }`}>
            {language === 'ar' ? 'جاهز للبدء؟' : 'Ready to Get Started?'}
          </h2>
          <p className={`text-xl mb-8 ${
            theme === 'light' ? 'text-gray-600' : 'text-gray-300'
          }`}>
            {language === 'ar'
              ? 'انضم إلى آلاف المطورين الذين يكسبون من إبداعهم'
              : 'Join thousands of developers earning from their creativity'}
          </p>
          <Link
            href="/developers/dashboard"
            className={`inline-block px-8 py-4 rounded-xl font-bold text-lg transition-all ${
              theme === 'light'
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            {language === 'ar' ? 'أنشئ حساب مطور' : 'Create Developer Account'}
          </Link>
        </div>
      </section>

      {/* Newsletter */}
      <section className={`py-20 ${theme === 'light' ? 'bg-gray-50' : 'bg-gray-900'}`}>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className={`text-3xl font-bold mb-4 ${
            theme === 'light' ? 'text-gray-900' : 'text-white'
          }`}>
            {language === 'ar' ? 'ابق على اطلاع' : 'Stay Updated'}
          </h2>
          <p className={`mb-8 ${
            theme === 'light' ? 'text-gray-600' : 'text-gray-300'
          }`}>
            {language === 'ar'
              ? 'اشترك للحصول على آخر الأخبار والتحديثات من سوق المطورين'
              : 'Subscribe to get the latest news and updates from the developer marketplace'}
          </p>
          <form onSubmit={handleSubmit} className="flex gap-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={language === 'ar' ? 'بريدك الإلكتروني' : 'Your email'}
              className={`flex-1 px-6 py-4 rounded-xl ${
                theme === 'light'
                  ? 'bg-white border border-gray-300 text-gray-900'
                  : 'bg-gray-800 border border-gray-700 text-white'
              }`}
              required
            />
            <button
              type="submit"
              className={`px-8 py-4 rounded-xl font-bold transition-all ${
                theme === 'light'
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              {language === 'ar' ? 'اشترك' : 'Subscribe'}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
