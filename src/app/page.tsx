'use client';

import { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Logo } from '@/components/Logo';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function LandingPage() {
  const { theme } = useTheme();
  const [email, setEmail] = useState('');

  const features = [
    {
      icon: '⏱️',
      title: 'مؤقت ذكي',
      description: 'تتبع وقت الدراسة بدقة مع حفظ تلقائي'
    },
    {
      icon: '🏆',
      title: 'نظام نقاط',
      description: 'اجمع العملات وارتفع في المستويات'
    },
    {
      icon: '📊',
      title: 'لوحة متصدرين',
      description: 'تنافس مع الأصدقاء وتتبع تقدمك'
    },
    {
      icon: '🎨',
      title: 'تخصيص',
      description: 'اختر أفاتارك وشخصّن تجربتك'
    },
    {
      icon: '📱',
      title: 'متعدد المنصات',
      description: 'يعمل على جميع الأجهزة'
    },
    {
      icon: '🔄',
      title: 'مزامنة فورية',
      description: 'بياناتك محفوظة ومتزامنة دائماً'
    }
  ];

  const stats = [
    { number: '10K+', label: 'مستخدم نشط' },
    { number: '50K+', label: 'ساعة دراسة' },
    { number: '100+', label: 'مستوى' },
    { number: '24/7', label: 'متاح' }
  ];

  return (
    <div className={`min-h-screen ${
      theme === 'light' ? 'bg-white' : 'bg-black'
    }`}>
      {/* Header */}
      <header className={`sticky top-0 z-50 border-b ${
        theme === 'light' 
          ? 'bg-white/90 backdrop-blur-sm border-gray-200' 
          : 'bg-black/90 backdrop-blur-sm border-gray-800'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Logo />
            <div className="flex items-center space-x-4 space-x-reverse">
              <ThemeToggle />
              <a 
                href="/app"
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  theme === 'light'
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                ابدأ الدراسة
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className={`text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 ${
            theme === 'light' ? 'text-black' : 'text-white'
          }`}>
            دراسة ذكية
            <span className={`block ${
              theme === 'light' ? 'text-blue-600' : 'text-blue-400'
            }`}>
              بأسلوب جديد
            </span>
          </h1>
          
          <p className={`text-xl sm:text-2xl mb-8 max-w-3xl mx-auto ${
            theme === 'light' ? 'text-gray-600' : 'text-gray-400'
          }`}>
            نظام متكامل لتتبع وقت الدراسة، تحصيل نقاط، والتنافس مع الأصدقاء. 
            حوّل وقت الدراسة إلى تجربة ممتعة ومجزية.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <a 
              href="/app"
              className={`px-8 py-4 rounded-lg font-bold text-lg transition-all hover:scale-105 ${
                theme === 'light'
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              ابدأ الدراسة الآن
            </a>
            <button className={`px-8 py-4 rounded-lg font-bold text-lg border-2 transition-all hover:scale-105 ${
              theme === 'light'
                ? 'border-black text-black hover:bg-black hover:text-white'
                : 'border-white text-white hover:bg-white hover:text-black'
            }`}>
              تعرف أكثر
            </button>
          </div>

          {/* Get Updates */}
          <div className={`max-w-md mx-auto p-6 rounded-2xl border-2 ${
            theme === 'light'
              ? 'bg-gray-50 border-gray-200'
              : 'bg-gray-900 border-gray-700'
          }`}>
            <h3 className={`text-lg font-bold mb-4 ${
              theme === 'light' ? 'text-black' : 'text-white'
            }`}>
              احصل على تحديثات جديدة
            </h3>
            <div className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="بريدك الإلكتروني"
                className={`flex-1 px-4 py-2 rounded-lg border-2 focus:outline-none ${
                  theme === 'light'
                    ? 'bg-white border-gray-300 text-black focus:border-blue-500'
                    : 'bg-black border-gray-600 text-white focus:border-blue-400'
                }`}
              />
              <button className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                theme === 'light'
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}>
                اشترك
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={`py-16 px-4 sm:px-6 lg:px-8 ${
        theme === 'light' ? 'bg-gray-50' : 'bg-gray-900'
      }`}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index}>
                <div className={`text-3xl sm:text-4xl font-bold mb-2 ${
                  theme === 'light' ? 'text-blue-600' : 'text-blue-400'
                }`}>
                  {stat.number}
                </div>
                <div className={`text-sm sm:text-base ${
                  theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                }`}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className={`text-4xl sm:text-5xl font-bold mb-4 ${
              theme === 'light' ? 'text-black' : 'text-white'
            }`}>
              مميزات رائعة
            </h2>
            <p className={`text-xl max-w-2xl mx-auto ${
              theme === 'light' ? 'text-gray-600' : 'text-gray-400'
            }`}>
              كل ما تحتاجه لتجربة دراسة مثالية في مكان واحد
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className={`p-6 rounded-2xl border-2 transition-all hover:scale-105 ${
                theme === 'light'
                  ? 'bg-white border-gray-200 hover:border-blue-500'
                  : 'bg-black border-gray-700 hover:border-blue-400'
              }`}>
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className={`text-xl font-bold mb-2 ${
                  theme === 'light' ? 'text-black' : 'text-white'
                }`}>
                  {feature.title}
                </h3>
                <p className={`${
                  theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                }`}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={`py-20 px-4 sm:px-6 lg:px-8 ${
        theme === 'light' ? 'bg-blue-50' : 'bg-blue-900/20'
      }`}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className={`text-4xl sm:text-5xl font-bold mb-4 ${
            theme === 'light' ? 'text-black' : 'text-white'
          }`}>
            هل أنت مستعد للبدء؟
          </h2>
          <p className={`text-xl mb-8 ${
            theme === 'light' ? 'text-gray-600' : 'text-gray-400'
          }`}>
            ابدأ دراستك الآن بدون تسجيل أو إنشاء حساب
          </p>
          <a 
            href="/app"
            className={`inline-block px-8 py-4 rounded-lg font-bold text-lg transition-all hover:scale-105 ${
              theme === 'light'
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            ابدأ الدراسة فوراً
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className={`py-12 px-4 sm:px-6 lg:px-8 border-t ${
        theme === 'light' 
          ? 'bg-gray-50 border-gray-200' 
          : 'bg-black border-gray-800'
      }`}>
        <div className="max-w-7xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div>
              <Logo />
              <p className={`mt-4 text-sm ${
                theme === 'light' ? 'text-gray-600' : 'text-gray-400'
              }`}>
                نظام ذكي لإدارة وقت الدراسة وتحسين الأداء
              </p>
            </div>
            
            <div>
              <h4 className={`font-bold mb-4 ${
                theme === 'light' ? 'text-black' : 'text-white'
              }`}>
                المنتج
              </h4>
              <ul className={`space-y-2 text-sm ${
                theme === 'light' ? 'text-gray-600' : 'text-gray-400'
              }`}>
                <li>المميزات</li>
                <li>الأسعار</li>
                <li>المدونة</li>
                <li>الدعم</li>
              </ul>
            </div>
            
            <div>
              <h4 className={`font-bold mb-4 ${
                theme === 'light' ? 'text-black' : 'text-white'
              }`}>
                الشركة
              </h4>
              <ul className={`space-y-2 text-sm ${
                theme === 'light' ? 'text-gray-600' : 'text-gray-400'
              }`}>
                <li>من نحن</li>
                <li>الفريق</li>
                <li>الوظائف</li>
                <li>اتصل بنا</li>
              </ul>
            </div>
            
            <div>
              <h4 className={`font-bold mb-4 ${
                theme === 'light' ? 'text-black' : 'text-white'
              }`}>
                متابعة
              </h4>
              <div className="flex space-x-4 space-x-reverse text-2xl">
                <span>📱</span>
                <span>💬</span>
                <span>📧</span>
                <span>🐦</span>
              </div>
            </div>
          </div>
          
          <div className={`pt-8 border-t text-center text-sm ${
            theme === 'light' 
              ? 'border-gray-200 text-gray-600' 
              : 'border-gray-800 text-gray-400'
          }`}>
            © 2024 فهمان هب. جميع الحقوق محفوظة.
          </div>
        </div>
      </footer>
    </div>
  );
}
