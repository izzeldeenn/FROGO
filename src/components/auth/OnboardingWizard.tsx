'use client';

import { useState } from 'react';
import { DEFAULT_PRESETS, UserPreset, applyPreset, getDefaultPreset } from '@/constants/defaultPresets';
import { useTheme } from '@/contexts/ThemeContext';
import { useCustomThemeClasses } from '@/hooks/useCustomThemeClasses';
import { useUser } from '@/contexts/UserContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { ReferralInput } from '@/components/referral/ReferralInput';

interface OnboardingWizardProps {
  onComplete?: () => void;
  isOpen: boolean;
}

export function OnboardingWizard({ onComplete, isOpen }: OnboardingWizardProps) {
  const { theme } = useTheme();
  const customTheme = useCustomThemeClasses();
  const { updateUserName, updateUserAvatar, getCurrentUser } = useUser();
  const { language, t } = useLanguage();
  const [step, setStep] = useState(0);
  const [selectedPreset, setSelectedPreset] = useState<UserPreset>(getDefaultPreset());
  const [username, setUsername] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('');

  const avatarOptions = [
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Zack',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Lilly',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Max',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Leo',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma'
  ];

  const steps = [
    { title: t.onboardingWelcome, description: t.onboardingWelcomeDesc },
    { title: t.onboardingChooseStyle, description: t.onboardingChooseStyleDesc },
    { title: t.onboardingYourName, description: t.onboardingYourNameDesc },
    { title: t.onboardingReferral, description: t.onboardingReferralDesc },
    { title: t.onboardingCoins, description: t.onboardingCoinsDesc },
    { title: t.onboardingRankings, description: t.onboardingRankingsDesc },
    { title: t.onboardingTimer, description: t.onboardingTimerDesc },
    { title: t.onboardingReady, description: t.onboardingReadyDesc }
  ];

  const handleNext = () => {
    // Save username and avatar when leaving step 2
    if (step === 2) {
      if (username.trim()) {
        updateUserName(username.trim());
      }
      if (selectedAvatar) {
        updateUserAvatar(selectedAvatar);
      }
    }
    
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleComplete = () => {
    // Apply selected preset
    applyPreset(selectedPreset);
    
    // Save username if provided
    if (username.trim()) {
      updateUserName(username.trim());
    }
    
    // Save avatar if selected
    if (selectedAvatar) {
      updateUserAvatar(selectedAvatar);
    }
    
    // Mark onboarding as complete
    localStorage.setItem('onboardingComplete', 'true');
    
    onComplete?.();
  };

  const handleSkip = () => {
    localStorage.setItem('onboardingComplete', 'true');
    onComplete?.();
  };

  if (!isOpen) return null;

  // Modal with same dimensions as Settings component
  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998] transition-opacity duration-300" onClick={onComplete} />
      <div
        className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-11/12 md:w-11/12 lg:w-10/12 xl:w-9/12 max-w-7xl max-h-[95vh] shadow-2xl rounded-3xl transition-all duration-300 ease-in-out z-[9999] overflow-hidden ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
        style={{
          backgroundColor: theme === 'light' ? '#ffffff' : '#000000',
          border: `2px solid ${customTheme.colors.border}20`
        }}
      >
        <div className="flex h-[85vh] flex-col overflow-hidden">
          {/* Header */}
          <div 
            className="flex-shrink-0 p-6 border-b"
            style={{ borderColor: customTheme.colors.border + '20' }}
          >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 
                className="text-2xl font-bold mb-2"
                style={{ color: theme === 'light' ? '#1f2937' : '#f9fafb' }}
              >
                {steps[step].title}
              </h2>
              <p 
                className="text-sm opacity-75"
                style={{ color: theme === 'light' ? '#6b7280' : '#d1d5db' }}
              >
                {steps[step].description}
              </p>
            </div>
            <button
              onClick={handleSkip}
              className="text-sm opacity-60 hover:opacity-100 transition-opacity"
              style={{ color: customTheme.colors.text }}
            >
              {t.onboardingSkip}
            </button>
          </div>
          
          {/* Progress */}
          <div className="flex gap-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className="flex-1 h-2 rounded-full transition-all duration-300"
                style={{
                  backgroundColor: index <= step ? customTheme.colors.primary : customTheme.colors.border + '30'
                }}
              />
            ))}
          </div>
        </div>

          {/* Content */}
          <div className="flex-1 overflow-auto p-6">
          {step === 0 && (
            <div className="flex items-center justify-center h-full py-8">
              <div className="text-center max-w-lg">
                <div 
                  className="w-24 h-24 rounded-2xl mx-auto mb-8 flex items-center justify-center text-5xl animate-bounce"
                  style={{
                    background: `linear-gradient(135deg, ${customTheme.colors.primary}, ${customTheme.colors.accent})`,
                    boxShadow: `0 12px 40px ${customTheme.colors.primary}50`
                  }}
                >
                  🎉
                </div>
                <h3 
                  className="text-3xl font-bold mb-4"
                  style={{ color: theme === 'light' ? '#1f2937' : '#f9fafb' }}
                >
                  {language === 'ar' ? 'أهلاً بك في تطبيقك!' : 'Welcome to your app!'}
                </h3>
                <p 
                  className="text-lg opacity-75 mb-8"
                  style={{ color: theme === 'light' ? '#6b7280' : '#d1d5db' }}
                >
                  {language === 'ar' ? 'سأقوم بإعداد التطبيق بشكل مثالي لك. لنستغرق فقط دقيقة واحدة لتخصيص تجربتك.' : 'I will set up the app perfectly for you. Let\'s take just a minute to customize your experience.'}
                </p>
                <div 
                  className="p-6 rounded-2xl"
                  style={{
                    background: `linear-gradient(135deg, ${customTheme.colors.primary}10, ${customTheme.colors.accent}10)`,
                    border: `2px solid ${customTheme.colors.border}30`
                  }}
                >
                  <p 
                    className="text-sm font-medium"
                    style={{ color: customTheme.colors.primary }}
                  >
                    {t.onboardingLetsStart}
                  </p>
                </div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="py-4">
              <div className="text-center mb-8">
                <h3 
                  className="text-2xl font-bold mb-2"
                  style={{ color: theme === 'light' ? '#1f2937' : '#f9fafb' }}
                >
                  {t.onboardingChooseStyle}
                </h3>
                <p 
                  className="text-sm opacity-60"
                  style={{ color: theme === 'light' ? '#6b7280' : '#d1d5db' }}
                >
                  {t.onboardingChoosePresets}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {DEFAULT_PRESETS.map((preset) => (
                  <div
                    key={preset.id}
                    className={`p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 hover:scale-105 ${
                      selectedPreset.id === preset.id ? 'shadow-xl' : 'hover:shadow-lg'
                    }`}
                    style={{
                      borderColor: selectedPreset.id === preset.id ? customTheme.colors.primary : customTheme.colors.border + '30',
                      backgroundColor: theme === 'light' ? '#f9fafb' : '#374151',
                      boxShadow: selectedPreset.id === preset.id ? `0 0 0 4px ${customTheme.colors.primary}30` : 'none'
                    }}
                    onClick={() => setSelectedPreset(preset)}
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div
                        className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                        style={{
                          background: `linear-gradient(135deg, ${customTheme.colors.primary}, ${customTheme.colors.accent})`,
                          boxShadow: `0 4px 16px ${customTheme.colors.primary}40`
                        }}
                      >
                        {preset.icon}
                      </div>
                      <div>
                        <h4 
                          className="text-lg font-bold"
                          style={{ color: theme === 'light' ? '#1f2937' : '#f9fafb' }}
                        >
                          {preset.name}
                        </h4>
                        <p 
                          className="text-xs opacity-70"
                          style={{ color: theme === 'light' ? '#6b7280' : '#d1d5db' }}
                        >
                          {preset.description}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 text-xs">
                      <div 
                        className="w-6 h-6 rounded-full border-2"
                        style={{ 
                          borderColor: theme === 'light' ? '#e5e7eb' : '#4b5563',
                          backgroundColor: preset.settings.timer.color
                        }}
                        title="لون المؤقت"
                      />
                      <div 
                        className="w-6 h-6 rounded-full border-2"
                        style={{ 
                          borderColor: theme === 'light' ? '#e5e7eb' : '#4b5563',
                          backgroundColor: preset.settings.theme === 'light' ? '#ffffff' : '#1f2937'
                        }}
                        title="الوضع"
                      />
                      <span 
                        className="px-3 py-1 rounded-full font-medium"
                        style={{ 
                          backgroundColor: customTheme.colors.primary + '20',
                          color: customTheme.colors.primary
                        }}
                      >
                        {preset.settings.background === 'default' ? t.onboardingSimple : t.onboardingImage}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="flex items-center justify-center h-full py-8">
              <div className="w-full max-w-lg">
                <div className="text-center mb-8">
                  <div 
                    className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center text-3xl"
                    style={{
                      background: `linear-gradient(135deg, ${customTheme.colors.primary}, ${customTheme.colors.accent})`,
                      boxShadow: `0 8px 24px ${customTheme.colors.primary}40`
                    }}
                  >
                    👤
                  </div>
                  <h3 
                    className="text-2xl font-bold mb-2"
                    style={{ color: theme === 'light' ? '#1f2937' : '#f9fafb' }}
                  >
                    {t.onboardingYourName}
                  </h3>
                  <p 
                    className="text-sm opacity-60"
                    style={{ color: theme === 'light' ? '#6b7280' : '#d1d5db' }}
                  >
                    {t.onboardingYourNameDesc}
                  </p>
                </div>
                
                {/* Avatar Selection */}
                <div className="mb-6">
                  <p 
                    className="text-sm font-medium mb-4 text-center"
                    style={{ color: theme === 'light' ? '#6b7280' : '#d1d5db' }}
                  >
                    {language === 'ar' ? 'اختر الأفاتار الخاص بك' : 'Choose your avatar'}
                  </p>
                  <div className="grid grid-cols-4 gap-4">
                    {avatarOptions.map((avatar) => (
                      <button
                        key={avatar}
                        onClick={() => setSelectedAvatar(avatar)}
                        className={`rounded-full p-1 transition-all duration-300 ${
                          selectedAvatar === avatar 
                            ? 'ring-4 ring-offset-2' 
                            : 'hover:scale-110'
                        }`}
                        style={{
                          '--tw-ring-color': selectedAvatar === avatar ? customTheme.colors.primary : 'transparent',
                          '--tw-ring-offset-color': theme === 'light' ? '#ffffff' : '#000000'
                        } as React.CSSProperties}
                      >
                        <img 
                          src={avatar} 
                          alt="avatar option" 
                          className={`w-16 h-16 rounded-full ${
                            selectedAvatar === avatar 
                              ? 'ring-4' 
                              : ''
                          }`}
                          style={{
                            borderColor: selectedAvatar === avatar ? customTheme.colors.primary : 'transparent',
                            borderWidth: selectedAvatar === avatar ? '3px' : '0'
                          }}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-6 rounded-2xl" style={{
                  background: `linear-gradient(135deg, ${customTheme.colors.surface}40, ${customTheme.colors.surface}20)`,
                  border: `2px solid ${customTheme.colors.border}30`
                }}>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder={t.onboardingNamePlaceholder}
                    className="w-full px-6 py-4 rounded-xl focus:outline-none transition-all duration-300 text-center text-lg font-medium"
                    style={{
                      backgroundColor: theme === 'light' ? '#ffffff' : '#1f2937',
                      color: customTheme.colors.text,
                      border: `2px solid ${customTheme.colors.border}30`
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = customTheme.colors.primary;
                      e.currentTarget.style.boxShadow = `0 0 0 4px ${customTheme.colors.primary}30`;
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = customTheme.colors.border + '30';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  />
                  <p 
                    className="text-xs opacity-50 text-center mt-4"
                    style={{ color: theme === 'light' ? '#6b7280' : '#d1d5db' }}
                  >
                    {t.onboardingNameHelp}
                  </p>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="flex items-center justify-center h-full py-8">
              <div className="w-full max-w-md">
                <div className="text-center mb-8">
                  <div 
                    className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center text-3xl"
                    style={{
                      background: `linear-gradient(135deg, ${customTheme.colors.primary}, ${customTheme.colors.accent})`,
                      boxShadow: `0 8px 24px ${customTheme.colors.primary}40`
                    }}
                  >
                    🎁
                  </div>
                  <h3 
                    className="text-2xl font-bold mb-2"
                    style={{ color: theme === 'light' ? '#1f2937' : '#f9fafb' }}
                  >
                    {t.onboardingReferral}
                  </h3>
                  <p 
                    className="text-sm opacity-60"
                    style={{ color: theme === 'light' ? '#6b7280' : '#d1d5db' }}
                  >
                    {t.onboardingReferralHelp}
                  </p>
                </div>
                <ReferralInput />
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="py-4">
              <div className="text-center mb-8">
                <h3 
                  className="text-2xl font-bold mb-2"
                  style={{ color: theme === 'light' ? '#1f2937' : '#f9fafb' }}
                >
                  {t.onboardingCoins}
                </h3>
                <p 
                  className="text-sm opacity-60"
                  style={{ color: theme === 'light' ? '#6b7280' : '#d1d5db' }}
                >
                  {t.onboardingDiscoverCoins}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                <div className="p-6 rounded-2xl" style={{
                  background: `linear-gradient(135deg, ${customTheme.colors.surface}40, ${customTheme.colors.surface}20)`,
                  border: `2px solid ${customTheme.colors.border}30`
                }}>
                  <div 
                    className="w-14 h-14 rounded-xl mx-auto mb-4 flex items-center justify-center text-2xl"
                    style={{
                      background: `linear-gradient(135deg, ${customTheme.colors.primary}, ${customTheme.colors.accent})`,
                      boxShadow: `0 4px 16px ${customTheme.colors.primary}40`
                    }}
                  >
                    🪙
                  </div>
                  <h4 
                    className="text-lg font-bold mb-2 text-center"
                    style={{ color: theme === 'light' ? '#1f2937' : '#f9fafb' }}
                  >
                    {t.onboardingGoldCoins}
                  </h4>
                  <p 
                    className="text-sm opacity-75 text-center"
                    style={{ color: theme === 'light' ? '#6b7280' : '#d1d5db' }}
                  >
                    {t.onboardingCoinsRate}
                  </p>
                </div>

                <div className="p-6 rounded-2xl" style={{
                  background: `linear-gradient(135deg, ${customTheme.colors.surface}40, ${customTheme.colors.surface}20)`,
                  border: `2px solid ${customTheme.colors.border}30`
                }}>
                  <div 
                    className="w-14 h-14 rounded-xl mx-auto mb-4 flex items-center justify-center text-2xl"
                    style={{
                      background: `linear-gradient(135deg, ${customTheme.colors.primary}, ${customTheme.colors.accent})`,
                      boxShadow: `0 4px 16px ${customTheme.colors.primary}40`
                    }}
                  >
                    🎯
                  </div>
                  <h4 
                    className="text-lg font-bold mb-2 text-center"
                    style={{ color: theme === 'light' ? '#1f2937' : '#f9fafb' }}
                  >
                    {t.onboardingLevels}
                  </h4>
                  <p 
                    className="text-sm opacity-75 text-center"
                    style={{ color: theme === 'light' ? '#6b7280' : '#d1d5db' }}
                  >
                    {t.onboardingLevelsRate}
                  </p>
                </div>

                <div className="p-6 rounded-2xl" style={{
                  background: `linear-gradient(135deg, ${customTheme.colors.surface}40, ${customTheme.colors.surface}20)`,
                  border: `2px solid ${customTheme.colors.border}30`
                }}>
                  <div 
                    className="w-14 h-14 rounded-xl mx-auto mb-4 flex items-center justify-center text-2xl"
                    style={{
                      background: `linear-gradient(135deg, ${customTheme.colors.primary}, ${customTheme.colors.accent})`,
                      boxShadow: `0 4px 16px ${customTheme.colors.primary}40`
                    }}
                  >
                    ⚡
                  </div>
                  <h4 
                    className="text-lg font-bold mb-2 text-center"
                    style={{ color: theme === 'light' ? '#1f2937' : '#f9fafb' }}
                  >
                    {t.onboardingDailyChallenges}
                  </h4>
                  <p 
                    className="text-sm opacity-75 text-center"
                    style={{ color: theme === 'light' ? '#6b7280' : '#d1d5db' }}
                  >
                    {t.onboardingStreakBonus}
                  </p>
                </div>
              </div>

              <div className={`mt-8 p-6 rounded-2xl text-center max-w-2xl mx-auto ${
                theme === 'light' ? 'bg-yellow-50' : 'bg-yellow-900/20'
              }`} style={{ border: '2px solid', borderColor: theme === 'light' ? '#fbbf24' : '#f59e0b' }}>
                <p 
                  className="text-base font-bold"
                  style={{ color: theme === 'light' ? '#d97706' : '#fbbf24' }}
                >
                  {t.onboardingStudyTip}
                </p>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="py-4">
              <div className="text-center mb-8">
                <h3 
                  className="text-2xl font-bold mb-2"
                  style={{ color: theme === 'light' ? '#1f2937' : '#f9fafb' }}
                >
                  {t.onboardingRankings}
                </h3>
                <p 
                  className="text-sm opacity-60"
                  style={{ color: theme === 'light' ? '#6b7280' : '#d1d5db' }}
                >
                  {t.onboardingTrackProgress}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                <div className="p-6 rounded-2xl" style={{
                  background: `linear-gradient(135deg, ${customTheme.colors.surface}40, ${customTheme.colors.surface}20)`,
                  border: `2px solid ${customTheme.colors.border}30`
                }}>
                  <div 
                    className="w-14 h-14 rounded-xl mx-auto mb-4 flex items-center justify-center text-2xl"
                    style={{
                      background: `linear-gradient(135deg, ${customTheme.colors.primary}, ${customTheme.colors.accent})`,
                      boxShadow: `0 4px 16px ${customTheme.colors.primary}40`
                    }}
                  >
                    🏆
                  </div>
                  <h4 
                    className="text-lg font-bold mb-2 text-center"
                    style={{ color: theme === 'light' ? '#1f2937' : '#f9fafb' }}
                  >
                    {t.onboardingLeaderboard}
                  </h4>
                  <p 
                    className="text-sm opacity-75 text-center"
                    style={{ color: theme === 'light' ? '#6b7280' : '#d1d5db' }}
                  >
                    {t.onboardingCompeteUsers}
                  </p>
                </div>

                <div className="p-6 rounded-2xl" style={{
                  background: `linear-gradient(135deg, ${customTheme.colors.surface}40, ${customTheme.colors.surface}20)`,
                  border: `2px solid ${customTheme.colors.border}30`
                }}>
                  <div 
                    className="w-14 h-14 rounded-xl mx-auto mb-4 flex items-center justify-center text-2xl"
                    style={{
                      background: `linear-gradient(135deg, ${customTheme.colors.primary}, ${customTheme.colors.accent})`,
                      boxShadow: `0 4px 16px ${customTheme.colors.primary}40`
                    }}
                  >
                    📊
                  </div>
                  <h4 
                    className="text-lg font-bold mb-2 text-center"
                    style={{ color: theme === 'light' ? '#1f2937' : '#f9fafb' }}
                  >
                    {t.onboardingDetailedStats}
                  </h4>
                  <p 
                    className="text-sm opacity-75 text-center"
                    style={{ color: theme === 'light' ? '#6b7280' : '#d1d5db' }}
                  >
                    {t.onboardingInteractiveCharts}
                  </p>
                </div>

                <div className="p-6 rounded-2xl" style={{
                  background: `linear-gradient(135deg, ${customTheme.colors.surface}40, ${customTheme.colors.surface}20)`,
                  border: `2px solid ${customTheme.colors.border}30`
                }}>
                  <div 
                    className="w-14 h-14 rounded-xl mx-auto mb-4 flex items-center justify-center text-2xl"
                    style={{
                      background: `linear-gradient(135deg, ${customTheme.colors.primary}, ${customTheme.colors.accent})`,
                      boxShadow: `0 4px 16px ${customTheme.colors.primary}40`
                    }}
                  >
                    🔥
                  </div>
                  <h4 
                    className="text-lg font-bold mb-2 text-center"
                    style={{ color: theme === 'light' ? '#1f2937' : '#f9fafb' }}
                  >
                    {t.onboardingStreakDays}
                  </h4>
                  <p 
                    className="text-sm opacity-75 text-center"
                    style={{ color: theme === 'light' ? '#6b7280' : '#d1d5db' }}
                  >
                    {t.onboardingContinuityBonus}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-8 max-w-2xl mx-auto">
                <div className={`p-4 rounded-xl text-center ${
                  theme === 'light' ? 'bg-blue-50' : 'bg-blue-900/20'
                }`} style={{ border: '2px solid', borderColor: theme === 'light' ? '#3b82f6' : '#1d4ed8' }}>
                  <div className="text-3xl mb-2">🥇</div>
                  <div 
                    className="text-sm font-bold"
                    style={{ color: theme === 'light' ? '#1e40af' : '#60a5fa' }}
                  >
                    {t.onboardingFirstPlace}
                  </div>
                </div>
                <div className={`p-4 rounded-xl text-center ${
                  theme === 'light' ? 'bg-purple-50' : 'bg-purple-900/20'
                }`} style={{ border: '2px solid', borderColor: theme === 'light' ? '#8b5cf6' : '#6d28d9' }}>
                  <div className="text-3xl mb-2">📈</div>
                  <div 
                    className="text-sm font-bold"
                    style={{ color: theme === 'light' ? '#7c3aed' : '#a78bfa' }}
                  >
                    {t.onboardingPerformanceGrowth}
                  </div>
                </div>
                <div className={`p-4 rounded-xl text-center ${
                  theme === 'light' ? 'bg-green-50' : 'bg-green-900/20'
                }`} style={{ border: '2px solid', borderColor: theme === 'light' ? '#10b981' : '#059669' }}>
                  <div className="text-3xl mb-2">🎯</div>
                  <div 
                    className="text-sm font-bold"
                    style={{ color: theme === 'light' ? '#059669' : '#34d399' }}
                  >
                    {t.onboardingDailyGoals}
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 6 && (
            <div className="py-4">
              <div className="text-center mb-8">
                <h3 
                  className="text-2xl font-bold mb-2"
                  style={{ color: theme === 'light' ? '#1f2937' : '#f9fafb' }}
                >
                  {t.onboardingTimer}
                </h3>
                <p 
                  className="text-sm opacity-60"
                  style={{ color: theme === 'light' ? '#6b7280' : '#d1d5db' }}
                >
                  {t.onboardingUseStudyTools}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                <div className="p-6 rounded-2xl" style={{
                  background: `linear-gradient(135deg, ${customTheme.colors.surface}40, ${customTheme.colors.surface}20)`,
                  border: `2px solid ${customTheme.colors.border}30`
                }}>
                  <div 
                    className="w-14 h-14 rounded-xl mx-auto mb-4 flex items-center justify-center text-2xl"
                    style={{
                      background: `linear-gradient(135deg, ${customTheme.colors.primary}, ${customTheme.colors.accent})`,
                      boxShadow: `0 4px 16px ${customTheme.colors.primary}40`
                    }}
                  >
                    ⏱️
                  </div>
                  <h4 
                    className="text-lg font-bold mb-2 text-center"
                    style={{ color: theme === 'light' ? '#1f2937' : '#f9fafb' }}
                  >
                    {t.onboardingPomodoro}
                  </h4>
                  <p 
                    className="text-sm opacity-75 text-center"
                    style={{ color: theme === 'light' ? '#6b7280' : '#d1d5db' }}
                  >
                    {t.onboardingPomodoroDesc}
                  </p>
                </div>

                <div className="p-6 rounded-2xl" style={{
                  background: `linear-gradient(135deg, ${customTheme.colors.surface}40, ${customTheme.colors.surface}20)`,
                  border: `2px solid ${customTheme.colors.border}30`
                }}>
                  <div 
                    className="w-14 h-14 rounded-xl mx-auto mb-4 flex items-center justify-center text-2xl"
                    style={{
                      background: `linear-gradient(135deg, ${customTheme.colors.primary}, ${customTheme.colors.accent})`,
                      boxShadow: `0 4px 16px ${customTheme.colors.primary}40`
                    }}
                  >
                    🎵
                  </div>
                  <h4 
                    className="text-lg font-bold mb-2 text-center"
                    style={{ color: theme === 'light' ? '#1f2937' : '#f9fafb' }}
                  >
                    {t.onboardingFocusMusic}
                  </h4>
                  <p 
                    className="text-sm opacity-75 text-center"
                    style={{ color: theme === 'light' ? '#6b7280' : '#d1d5db' }}
                  >
                    {t.onboardingMusicPlaylists}
                  </p>
                </div>

                <div className="p-6 rounded-2xl" style={{
                  background: `linear-gradient(135deg, ${customTheme.colors.surface}40, ${customTheme.colors.surface}20)`,
                  border: `2px solid ${customTheme.colors.border}30`
                }}>
                  <div 
                    className="w-14 h-14 rounded-xl mx-auto mb-4 flex items-center justify-center text-2xl"
                    style={{
                      background: `linear-gradient(135deg, ${customTheme.colors.primary}, ${customTheme.colors.accent})`,
                      boxShadow: `0 4px 16px ${customTheme.colors.primary}40`
                    }}
                  >
                    📝
                  </div>
                  <h4 
                    className="text-lg font-bold mb-2 text-center"
                    style={{ color: theme === 'light' ? '#1f2937' : '#f9fafb' }}
                  >
                    {t.onboardingQuickNotes}
                  </h4>
                  <p 
                    className="text-sm opacity-75 text-center"
                    style={{ color: theme === 'light' ? '#6b7280' : '#d1d5db' }}
                  >
                    {t.onboardingStickyNotes}
                  </p>
                </div>

                <div className="p-6 rounded-2xl" style={{
                  background: `linear-gradient(135deg, ${customTheme.colors.surface}40, ${customTheme.colors.surface}20)`,
                  border: `2px solid ${customTheme.colors.border}30`
                }}>
                  <div 
                    className="w-14 h-14 rounded-xl mx-auto mb-4 flex items-center justify-center text-2xl"
                    style={{
                      background: `linear-gradient(135deg, ${customTheme.colors.primary}, ${customTheme.colors.accent})`,
                      boxShadow: `0 4px 16px ${customTheme.colors.primary}40`
                    }}
                  >
                    🌙
                  </div>
                  <h4 
                    className="text-lg font-bold mb-2 text-center"
                    style={{ color: theme === 'light' ? '#1f2937' : '#f9fafb' }}
                  >
                    {t.onboardingFullscreen}
                  </h4>
                  <p 
                    className="text-sm opacity-75 text-center"
                    style={{ color: theme === 'light' ? '#6b7280' : '#d1d5db' }}
                  >
                    {t.onboardingDistractionFree}
                  </p>
                </div>
              </div>

              <div className={`mt-8 p-6 rounded-2xl text-center max-w-2xl mx-auto ${
                theme === 'light' ? 'bg-blue-50' : 'bg-blue-900/20'
              }`} style={{ border: '2px solid', borderColor: theme === 'light' ? '#3b82f6' : '#1d4ed8' }}>
                <p 
                  className="text-base font-bold"
                  style={{ color: theme === 'light' ? '#1e40af' : '#60a5fa' }}
                >
                  {t.onboardingSuccessTip}
                </p>
              </div>
            </div>
          )}

          {step === 7 && (
            <div className="flex items-center justify-center h-full py-8">
              <div className="text-center max-w-lg">
                <div 
                  className="w-24 h-24 rounded-2xl mx-auto mb-8 flex items-center justify-center text-5xl animate-bounce"
                  style={{
                    background: `linear-gradient(135deg, ${customTheme.colors.primary}, ${customTheme.colors.accent})`,
                    boxShadow: `0 12px 40px ${customTheme.colors.primary}50`
                  }}
                >
                  🚀
                </div>
                <h3 
                  className="text-3xl font-bold mb-4"
                  style={{ color: theme === 'light' ? '#1f2937' : '#f9fafb' }}
                >
                  {t.onboardingReadyToStart}
                </h3>
                
                <div className="space-y-3 mb-8 text-right">
                  <p 
                    className="text-base opacity-75"
                    style={{ color: theme === 'light' ? '#6b7280' : '#d1d5db' }}
                  >
                    {t.onboardingSettingsApplied} <span className="font-bold">{selectedPreset.name}</span>
                  </p>
                  {username && (
                    <p 
                      className="text-base opacity-75"
                      style={{ color: theme === 'light' ? '#6b7280' : '#d1d5db' }}
                    >
                      {t.onboardingWelcomeUser} <span className="font-bold">{username}</span>
                    </p>
                  )}
                  <p 
                    className="text-base opacity-75"
                    style={{ color: theme === 'light' ? '#6b7280' : '#d1d5db' }}
                  >
                    {t.onboardingCoinsEnabled}
                  </p>
                  <p 
                    className="text-base opacity-75"
                    style={{ color: theme === 'light' ? '#6b7280' : '#d1d5db' }}
                  >
                    {t.onboardingRankingsReady}
                  </p>
                  <p 
                    className="text-base opacity-75"
                    style={{ color: theme === 'light' ? '#6b7280' : '#d1d5db' }}
                  >
                    {t.onboardingStudyToolsAvailable}
                  </p>
                </div>

                <div className={`p-6 rounded-2xl mb-8 ${
                  theme === 'light' ? 'bg-gradient-to-r from-blue-50 to-purple-50' : 'bg-gradient-to-r from-blue-900/20 to-purple-900/20'
                }`} style={{ border: `2px solid ${customTheme.colors.border}30` }}>
                  <h4 
                    className="font-bold mb-3"
                    style={{ color: theme === 'light' ? '#1f2937' : '#f9fafb' }}
                  >
                    {t.onboardingStartTips}
                  </h4>
                  <div className="text-sm space-y-2 text-right" style={{ color: theme === 'light' ? '#6b7280' : '#d1d5db' }}>
                    <p>{t.onboardingTip1}</p>
                    <p>{t.onboardingTip2}</p>
                    <p>{t.onboardingTip3}</p>
                    <p>{t.onboardingTip4}</p>
                  </div>
                </div>

                <p 
                  className="text-2xl font-bold bg-gradient-to-r bg-clip-text text-transparent"
                  style={{ 
                    backgroundImage: `linear-gradient(135deg, ${customTheme.colors.primary}, ${customTheme.colors.accent})` 
                  }}
                >
                  {t.onboardingLetsAchieve}
                </p>
              </div>
            </div>
          )}
        </div>

          {/* Footer */}
          <div 
            className="flex-shrink-0 p-6 border-t flex justify-between"
            style={{ borderColor: customTheme.colors.border + '20' }}
          >
          <button
            onClick={handlePrevious}
            disabled={step === 0}
            className="px-6 py-2 rounded-xl font-medium transition-all duration-200 disabled:opacity-50"
            style={{
              backgroundColor: customTheme.colors.surface + '40',
              color: customTheme.colors.text,
              border: `1px solid ${customTheme.colors.border}30`
            }}
          >
            {t.onboardingPrevious}
          </button>
          
          <button
            onClick={handleNext}
            className="px-6 py-2 rounded-xl font-medium transition-all duration-200"
            style={{
              background: `linear-gradient(135deg, ${customTheme.colors.primary}, ${customTheme.colors.accent})`,
              color: '#ffffff',
              boxShadow: `0 4px 16px ${customTheme.colors.primary}40`
            }}
          >
            {step === steps.length - 1 ? t.onboardingStart : t.onboardingNext}
          </button>
        </div>
        </div>
      </div>
    </>
  );
}
