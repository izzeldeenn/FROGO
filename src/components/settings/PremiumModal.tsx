'use client';

import { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useUser } from '@/contexts/UserContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCustomThemeClasses } from '@/hooks/useCustomThemeClasses';
import { usePremium } from '@/contexts/PremiumContext';
import { usePoints } from '@/contexts/PointsContext';

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PremiumModal({ isOpen, onClose }: PremiumModalProps) {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const customTheme = useCustomThemeClasses();
  const { subscription, isPremium, subscribeMonthly, subscribeYearly, checkSubscription } = usePremium();
  const { coins, removeCoins } = usePoints();

  const [isProcessing, setIsProcessing] = useState(false);

  const MONTHLY_COINS = 3000;
  const YEARLY_COINS = 10000;

  const handleSubscribeMonthly = async () => {
    if (coins < MONTHLY_COINS) {
      alert(language === 'ar' ? 'ليس لديك عملات كافية' : 'Not enough coins');
      return;
    }

    setIsProcessing(true);
    removeCoins(MONTHLY_COINS);
    
    const subSuccess = await subscribeMonthly();
    if (subSuccess) {
      await checkSubscription();
      onClose();
    } else {
      // Refund coins if subscription failed
      removeCoins(-MONTHLY_COINS);
      alert(language === 'ar' ? 'فشل الاشتراك' : 'Subscription failed');
    }
    
    setIsProcessing(false);
  };

  const handleSubscribeYearly = async () => {
    if (coins < YEARLY_COINS) {
      alert(language === 'ar' ? 'ليس لديك عملات كافية' : 'Not enough coins');
      return;
    }

    setIsProcessing(true);
    removeCoins(YEARLY_COINS);
    
    const subSuccess = await subscribeYearly();
    if (subSuccess) {
      await checkSubscription();
      onClose();
    } else {
      // Refund coins if subscription failed
      removeCoins(-YEARLY_COINS);
      alert(language === 'ar' ? 'فشل الاشتراك' : 'Subscription failed');
    }
    
    setIsProcessing(false);
  };

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998] transition-opacity duration-300"
        onClick={onClose}
      />
      <div 
        className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-11/12 md:w-11/12 lg:w-10/12 xl:w-9/12 max-w-7xl max-h-[95vh] shadow-2xl rounded-3xl transition-all duration-300 ease-in-out z-[9999] overflow-hidden ${
          isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
        style={{
          backgroundColor: theme === 'light' ? '#ffffff' : '#000000',
          border: `2px solid ${customTheme.colors.border}`
        }}
      >
        <div className="flex h-[85vh] flex-col overflow-hidden">
          {/* Header */}
          <div 
            className="px-8 py-6 relative overflow-hidden flex-shrink-0"
            style={{
              background: `linear-gradient(135deg, ${customTheme.colors.background} 0%, ${customTheme.colors.surface}30 100%)`,
              borderBottom: `1px solid ${customTheme.colors.border}10`
            }}
          >
            <div 
              className="absolute top-0 left-0 w-full h-px"
              style={{
                background: `linear-gradient(90deg, transparent, ${customTheme.colors.primary}50, transparent)`
              }}
            />
            
            <div className="flex items-center justify-between relative">
              <div className="flex items-center space-x-reverse space-x-4">
                <div 
                  className="w-3 h-3 rounded-full relative"
                  style={{
                    background: `linear-gradient(135deg, #FFD700, #FFA500)`,
                    boxShadow: `0 0 20px #FFD70060`
                  }}
                >
                  <div 
                    className="absolute inset-0 rounded-full animate-ping"
                    style={{
                      background: `linear-gradient(135deg, #FFD700, #FFA500)`,
                      opacity: 0.3
                    }}
                  />
                </div>
                <div>
                  <h3 className={`text-lg font-black tracking-tight ${
                    theme === 'light' ? 'text-gray-900' : 'text-gray-50'
                  }`}>
                    {language === 'ar' ? 'الاشتراك البريميوم' : 'Premium Subscription'}
                  </h3>
                  <div className={`text-xs opacity-70 mt-1 ${
                    theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                  }`}>
                    {isPremium 
                      ? (language === 'ar' ? 'أنت مشترك بريميوم' : 'You are a premium member')
                      : (language === 'ar' ? 'ارفع مستوى تجربتك' : 'Upgrade your experience')
                    }
                  </div>
                </div>
              </div>
              
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-300 group relative overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${customTheme.colors.surface}, ${customTheme.colors.background})`,
                  boxShadow: `0 4px 16px ${customTheme.colors.border}30`
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = `linear-gradient(135deg, ${customTheme.colors.primary}, ${customTheme.colors.accent})`;
                  e.currentTarget.style.transform = 'rotate(90deg) scale(1.1)';
                  e.currentTarget.style.boxShadow = `0 8px 32px ${customTheme.colors.primary}50`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = `linear-gradient(135deg, ${customTheme.colors.surface}, ${customTheme.colors.background})`;
                  e.currentTarget.style.transform = 'rotate(0deg) scale(1)';
                  e.currentTarget.style.boxShadow = `0 4px 16px ${customTheme.colors.border}30`;
                }}
              >
                <span className="text-lg transition-colors duration-300 group-hover:text-white">✕</span>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="px-8 py-6 overflow-y-auto flex-1">
            {isPremium ? (
              <div 
                className="relative overflow-hidden rounded-3xl p-8 backdrop-blur-xl"
                style={{
                  background: `linear-gradient(135deg, #FFD70020, #FFA50010)`,
                  border: `2px solid #FFD70030`,
                  boxShadow: `0 8px 32px #FFD70015`
                }}
              >
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl opacity-20"
                  style={{
                    background: `radial-gradient(circle, #FFD700, transparent)`
                  }}
                />
                
                <div className="relative text-center">
                  <div className="text-6xl mb-4">👑</div>
                  <h3 className={`text-2xl font-black mb-2 ${
                    theme === 'light' ? 'text-gray-900' : 'text-gray-50'
                  }`}>
                    {language === 'ar' ? 'أنت مشترك بريميوم!' : 'You are Premium!'}
                  </h3>
                  <p className={`text-sm mb-4 ${
                    theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                  }`}>
                    {language === 'ar' 
                      ? `خطة الاشتراك: ${subscription.plan === 'monthly' ? 'شهري' : 'سنوي'}`
                      : `Plan: ${subscription.plan === 'monthly' ? 'Monthly' : 'Yearly'}`
                    }
                  </p>
                  {subscription.endDate && (
                    <p className={`text-sm mb-6 ${
                      theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                    }`}>
                      {language === 'ar' 
                        ? `ينتهي في: ${new Date(subscription.endDate).toLocaleDateString('ar-EG')}`
                        : `Expires on: ${new Date(subscription.endDate).toLocaleDateString('en-US')}`
                      }
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {/* Free Plan */}
                <div 
                  className="relative overflow-hidden rounded-3xl p-6 backdrop-blur-xl"
                  style={{
                    background: `linear-gradient(135deg, ${customTheme.colors.surface}60, ${customTheme.colors.background}20)`,
                    border: `1px solid ${customTheme.colors.border}20`,
                    boxShadow: `0 8px 32px ${customTheme.colors.border}15`
                  }}
                >
                  <div className="absolute top-0 left-0 w-32 h-32 rounded-full blur-2xl opacity-20"
                    style={{
                      background: `radial-gradient(circle, ${customTheme.colors.border}, transparent)`
                    }}
                  />
                  
                  <div className="relative">
                    <div className="flex items-center space-x-reverse space-x-3 mb-4">
                      <div 
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{
                          background: `linear-gradient(135deg, ${customTheme.colors.border}, ${customTheme.colors.surface})`,
                          boxShadow: `0 4px 16px ${customTheme.colors.border}40`
                        }}
                      >
                        <span className="text-white text-lg">🆓</span>
                      </div>
                      <label className={`text-sm font-black uppercase tracking-wider ${
                        theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                      }`}>
                        {language === 'ar' ? 'مجاني' : 'Free'}
                      </label>
                    </div>

                    <div className={`text-3xl font-black mb-2 ${
                      theme === 'light' ? 'text-gray-900' : 'text-gray-50'
                    }`}>
                      $0
                    </div>
                    <p className={`text-xs mb-4 ${
                      theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                    }`}>
                      {language === 'ar' ? 'للأبد' : 'Forever'}
                    </p>

                    <ul className={`space-y-2 text-sm ${
                      theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                    }`}>
                      <li className="flex items-center gap-2">
                        <span>✓</span>
                        {language === 'ar' ? 'الميزات الأساسية' : 'Basic features'}
                      </li>
                      <li className="flex items-center gap-2">
                        <span>✓</span>
                        {language === 'ar' ? 'الوصول المحدود' : 'Limited access'}
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Monthly Plan */}
                <div 
                  className="relative overflow-hidden rounded-3xl p-6 backdrop-blur-xl"
                  style={{
                    background: `linear-gradient(135deg, #5865F220, #7289DA10)`,
                    border: `2px solid #5865F230`,
                    boxShadow: `0 8px 32px #5865F215`
                  }}
                >
                  <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl opacity-20"
                    style={{
                      background: `radial-gradient(circle, #5865F2, transparent)`
                    }}
                  />
                  
                  <div className="relative">
                    <div className="flex items-center space-x-reverse space-x-3 mb-4">
                      <div 
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{
                          background: `linear-gradient(135deg, #5865F2, #7289DA)`,
                          boxShadow: `0 4px 16px #5865F240`
                        }}
                      >
                        <span className="text-white text-lg">⚡</span>
                      </div>
                      <label className={`text-sm font-black uppercase tracking-wider ${
                        theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                      }`}>
                        {language === 'ar' ? 'شهري' : 'Monthly'}
                      </label>
                    </div>

                    <div className={`text-3xl font-black mb-2 ${
                      theme === 'light' ? 'text-gray-900' : 'text-gray-50'
                    }`}>
                      $5
                    </div>
                    <p className={`text-xs mb-4 ${
                      theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                    }`}>
                      {language === 'ar' ? 'شهرياً' : '/month'}
                    </p>

                    <div className={`text-sm mb-4 p-2 rounded-lg ${
                      theme === 'light' ? 'bg-gray-100' : 'bg-gray-800'
                    }`}>
                      {language === 'ar' ? 'أو' : 'or'} {MONTHLY_COINS} {language === 'ar' ? 'عملة' : 'coins'}
                    </div>

                    <button
                      onClick={handleSubscribeMonthly}
                      disabled={isProcessing || coins < MONTHLY_COINS}
                      className={`w-full px-6 py-3 rounded-xl font-medium transition-all ${
                        isProcessing || coins < MONTHLY_COINS
                          ? 'opacity-50 cursor-not-allowed' 
                          : 'hover:scale-105 active:scale-95'
                      }`}
                      style={{
                        background: isProcessing || coins < MONTHLY_COINS
                          ? 'transparent' 
                          : `linear-gradient(135deg, #5865F2, #7289DA)`,
                        color: isProcessing || coins < MONTHLY_COINS ? customTheme.colors.text : '#ffffff',
                        border: isProcessing || coins < MONTHLY_COINS ? `2px solid ${customTheme.colors.border}30` : 'none',
                        boxShadow: isProcessing || coins < MONTHLY_COINS ? 'none' : `0 8px 32px #5865F240`
                      }}
                    >
                      {isProcessing 
                        ? (language === 'ar' ? 'جاري المعالجة...' : 'Processing...')
                        : (language === 'ar' ? 'اشتراك شهري' : 'Subscribe Monthly')
                      }
                    </button>

                    <ul className={`space-y-2 text-sm mt-4 ${
                      theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                    }`}>
                      <li className="flex items-center gap-2">
                        <span>✓</span>
                        {language === 'ar' ? 'جميع الميزات المجانية' : 'All free features'}
                      </li>
                      <li className="flex items-center gap-2">
                        <span>✓</span>
                        {language === 'ar' ? 'الميزات البريميوم' : 'Premium features'}
                      </li>
                      <li className="flex items-center gap-2">
                        <span>✓</span>
                        {language === 'ar' ? 'دعم أولوية' : 'Priority support'}
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Yearly Plan */}
                <div 
                  className="relative overflow-hidden rounded-3xl p-6 backdrop-blur-xl md:col-span-2"
                  style={{
                    background: `linear-gradient(135deg, #FFD70020, #FFA50010)`,
                    border: `2px solid #FFD70030`,
                    boxShadow: `0 8px 32px #FFD70015`
                  }}
                >
                  <div className="absolute top-0 left-0 w-32 h-32 rounded-full blur-2xl opacity-20"
                    style={{
                      background: `radial-gradient(circle, #FFD700, transparent)`
                    }}
                  />
                  
                  <div className="relative flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-reverse space-x-3 mb-4">
                        <div 
                          className="w-10 h-10 rounded-xl flex items-center justify-center"
                          style={{
                            background: `linear-gradient(135deg, #FFD700, #FFA500)`,
                            boxShadow: `0 4px 16px #FFD70040`
                          }}
                        >
                          <span className="text-white text-lg">👑</span>
                        </div>
                        <label className={`text-sm font-black uppercase tracking-wider ${
                          theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                        }`}>
                          {language === 'ar' ? 'سنوي' : 'Yearly'}
                        </label>
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                          theme === 'light' ? 'bg-green-100 text-green-700' : 'bg-green-900 text-green-300'
                        }`}>
                          {language === 'ar' ? 'وفر 33%' : 'Save 33%'}
                        </span>
                      </div>

                      <div className={`text-3xl font-black mb-2 ${
                        theme === 'light' ? 'text-gray-900' : 'text-gray-50'
                      }`}>
                        $40
                      </div>
                      <p className={`text-xs mb-4 ${
                        theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                      }`}>
                        {language === 'ar' ? 'سنوياً' : '/year'}
                      </p>

                      <div className={`text-sm mb-4 p-2 rounded-lg ${
                        theme === 'light' ? 'bg-gray-100' : 'bg-gray-800'
                      }`}>
                        {language === 'ar' ? 'أو' : 'or'} {YEARLY_COINS} {language === 'ar' ? 'عملة' : 'coins'}
                      </div>

                      <button
                        onClick={handleSubscribeYearly}
                        disabled={isProcessing || coins < YEARLY_COINS}
                        className={`w-full px-6 py-3 rounded-xl font-medium transition-all ${
                          isProcessing || coins < YEARLY_COINS
                            ? 'opacity-50 cursor-not-allowed' 
                            : 'hover:scale-105 active:scale-95'
                        }`}
                        style={{
                          background: isProcessing || coins < YEARLY_COINS
                            ? 'transparent' 
                            : `linear-gradient(135deg, #FFD700, #FFA500)`,
                          color: isProcessing || coins < YEARLY_COINS ? customTheme.colors.text : '#ffffff',
                          border: isProcessing || coins < YEARLY_COINS ? `2px solid ${customTheme.colors.border}30` : 'none',
                          boxShadow: isProcessing || coins < YEARLY_COINS ? 'none' : `0 8px 32px #FFD70040`
                        }}
                      >
                        {isProcessing 
                          ? (language === 'ar' ? 'جاري المعالجة...' : 'Processing...')
                          : (language === 'ar' ? 'اشتراك سنوي' : 'Subscribe Yearly')
                        }
                      </button>
                    </div>

                    <ul className={`space-y-2 text-sm ml-8 ${
                      theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                    }`}>
                      <li className="flex items-center gap-2">
                        <span>✓</span>
                        {language === 'ar' ? 'جميع ميزات الشهري' : 'All monthly features'}
                      </li>
                      <li className="flex items-center gap-2">
                        <span>✓</span>
                        {language === 'ar' ? 'توفير 33%' : 'Save 33%'}
                      </li>
                      <li className="flex items-center gap-2">
                        <span>✓</span>
                        {language === 'ar' ? 'ميزات حصرية' : 'Exclusive features'}
                      </li>
                      <li className="flex items-center gap-2">
                        <span>✓</span>
                        {language === 'ar' ? 'دعم VIP' : 'VIP support'}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
