'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useCustomThemeClasses } from '@/hooks/useCustomThemeClasses';
import { validatePasswordStrength } from '@/utils/password';
import { ForgotPasswordModal } from './ForgotPasswordModal';
import { landingTexts } from '@/constants/landingTexts';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'upgrade';
}

export function AuthModal({ isOpen, onClose, initialMode = 'login' }: AuthModalProps) {
  const { login, register, isLoggedIn, getCurrentUser, requestPasswordReset } = useUser();
  const { language, t } = useLanguage();
  const { theme } = useTheme();
  const customTheme = useCustomThemeClasses();
  const texts = landingTexts[language];

  const [isLogin, setIsLogin] = useState(initialMode === 'login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [passwordValidation, setPasswordValidation] = useState<{ isValid: boolean; errors: string[] } | null>(null);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  // Validate password as user types (only for registration)
  useEffect(() => {
    if (!isLogin && password) {
      const validation = validatePasswordStrength(password);
      setPasswordValidation(validation);
    } else {
      setPasswordValidation(null);
    }
  }, [password, isLogin]);

  // Reset mode when modal opens
  useEffect(() => {
    if (isOpen) {
      setIsLogin(initialMode === 'login');
      setError('');
      setEmail('');
      setPassword('');
      setUsername('');
    }
  }, [isOpen, initialMode]);

  // Handle forgot password
  const handleForgotPassword = async (email: string) => {
    const result = await requestPasswordReset(email);
    return result;
  };

  // If user is already logged in, don't show the modal
  if (isLoggedIn || !isOpen) return null;

  // Show forgot password modal instead of auth modal
  if (showForgotPassword) {
    return (
      <ForgotPasswordModal
        isOpen={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
        onSubmit={handleForgotPassword}
      />
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let result;
      if (isLogin) {
        result = await login(email, password);
      } else {
        // For account upgrade, use current username and only ask for email and password
        const currentUser = getCurrentUser();
        const currentUsername = currentUser?.username || 'مستخدم';
        result = await register(email, password, currentUsername);
      }

      if (result.success) {
        onClose();
        // Reset form
        setEmail('');
        setPassword('');
        setUsername('');
      } else {
        setError(result.error || (isLogin ? 'Login failed' : 'Account upgrade failed'));
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setEmail('');
    setPassword('');
    setUsername('');
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[9999] p-4">
      <div 
        className={`w-11/12 md:w-10/12 lg:w-9/12 xl:w-8/12 max-w-7xl max-h-[95vh] shadow-2xl rounded-3xl overflow-hidden flex flex-col md:flex-row ${
          theme === 'light' ? 'bg-white' : 'bg-black'
        }`}
        style={{ border: `2px solid ${customTheme.colors.border}` }}
      >
        {/* Left Section - Branding */}
        <div 
          className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center items-center"
          style={{
            background: theme === 'light' 
              ? `linear-gradient(135deg, ${customTheme.colors.surface}60, ${customTheme.colors.background}20)`
              : `linear-gradient(135deg, #1a1a1a, #0a0a0a)`,
            borderLeft: `1px solid ${customTheme.colors.border}40`
          }}
        >
          <div className="text-center">
            <div 
              className="w-24 h-24 mx-auto mb-6 rounded-2xl flex items-center justify-center overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${customTheme.colors.primary}, ${customTheme.colors.accent})`,
                boxShadow: `0 8px 32px ${customTheme.colors.primary}40`
              }}
            >
              <img src="/goat.png" alt="Goatly Logo" className="w-full h-full object-cover" />
            </div>
            <h1 className={`text-4xl md:text-5xl font-black mb-4 ${
              theme === 'light' ? 'text-gray-900' : 'text-white'
            }`}>
              {texts.appName}
            </h1>
            <p className={`text-lg md:text-xl mb-6 ${
              theme === 'light' ? 'text-gray-600' : 'text-gray-300'
            }`}>
              {isLogin ? texts.welcomeBack : texts.createAccountNow}
            </p>
            <div className={`text-sm ${
              theme === 'light' ? 'text-gray-500' : 'text-gray-400'
            }`}>
              <p className="mb-2">{texts.studySmart}</p>
              <p>{texts.joinThousands}</p>
            </div>
          </div>
        </div>

        {/* Right Section - Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 overflow-y-auto">
          <div className="flex items-center justify-between mb-8">
            <h3 className={`text-2xl md:text-3xl font-bold ${
              theme === 'light' ? 'text-gray-800' : 'text-white'
            }`}>
              {isLogin ? texts.login : texts.accountUpgrade}
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

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 rounded-xl text-red-600 text-sm" 
                   style={{ backgroundColor: '#fee2e2', border: '1px solid #fecaca' }}>
                {error}
              </div>
            )}

            <div>
              <label className={`block mb-3 text-sm font-bold uppercase tracking-wider ${
                theme === 'light' ? 'text-gray-700' : 'text-white'
              }`}>
                {texts.email}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                required
                className="w-full px-5 py-4 rounded-2xl focus:outline-none transition-all text-lg"
                style={{
                  backgroundColor: customTheme.colors.surface,
                  borderColor: customTheme.colors.border,
                  color: customTheme.colors.text,
                  border: `2px solid ${customTheme.colors.border}30`
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = customTheme.colors.primary;
                  e.currentTarget.style.boxShadow = `0 0 0 4px ${customTheme.colors.primary}20`;
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = customTheme.colors.border + '30';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
            </div>

            {!isLogin && (
              <div className="p-4 rounded-2xl"
                   style={{ backgroundColor: customTheme.colors.surface + '30', border: `1px solid ${customTheme.colors.border}40` }}>
                <div className={`text-sm font-medium mb-2 ${
                  theme === 'light' ? 'text-gray-600' : 'text-gray-300'
                }`}>
                  {texts.currentUsernamePreserved}
                </div>
                <div className={`text-lg font-bold ${
                  theme === 'light' ? 'text-gray-800' : 'text-white'
                }`}>
                  {getCurrentUser()?.username || texts.user}
                </div>
              </div>
            )}

            {!isLogin && (
              <div className="p-4 rounded-2xl text-sm"
                   style={{ 
                     backgroundColor: passwordValidation?.isValid ? '#dcfce7' : '#fee2e2',
                     border: `1px solid ${passwordValidation?.isValid ? '#bbf7d0' : '#fecaca'}`,
                     color: passwordValidation?.isValid ? '#166534' : '#dc2626'
                   }}>
                <div className="font-bold mb-2">
                  {texts.passwordRequirements}
                </div>
                <ul className="space-y-1">
                  <li className={password?.length >= 8 ? 'line-through opacity-50' : ''}>
                    • {texts.atLeast8Chars}
                  </li>
                  <li className={/[A-Z]/.test(password) ? 'line-through opacity-50' : ''}>
                    • {texts.atLeast1Uppercase}
                  </li>
                  <li className={/[a-z]/.test(password) ? 'line-through opacity-50' : ''}>
                    • {texts.atLeast1Lowercase}
                  </li>
                  <li className={/\d/.test(password) ? 'line-through opacity-50' : ''}>
                    • {texts.atLeast1Number}
                  </li>
                  <li className={/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/\?]/.test(password) ? 'line-through opacity-50' : ''}>
                    • {texts.atLeast1Special}
                  </li>
                </ul>
                {passwordValidation && passwordValidation.errors.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-current/20">
                    {passwordValidation.errors.map((error, index) => (
                      <div key={index} className="text-xs">• {error}</div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div>
              <label className={`block mb-3 text-sm font-bold uppercase tracking-wider ${
                theme === 'light' ? 'text-gray-700' : 'text-white'
              }`}>
                {texts.password}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={texts.enterPassword}
                required
                minLength={8}
                maxLength={128}
                className="w-full px-5 py-4 rounded-2xl focus:outline-none transition-all text-lg"
                style={{
                  backgroundColor: customTheme.colors.surface,
                  borderColor: passwordValidation && !passwordValidation.isValid ? '#dc2626' : customTheme.colors.border,
                  color: customTheme.colors.text,
                  border: `2px solid ${passwordValidation && !passwordValidation.isValid ? '#dc2626' : customTheme.colors.border}30`
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = customTheme.colors.primary;
                  e.currentTarget.style.boxShadow = `0 0 0 4px ${customTheme.colors.primary}20`;
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = passwordValidation && !passwordValidation.isValid ? '#dc2626' : customTheme.colors.border + '30';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
            </div>

            <div className="flex space-x-4 space-x-reverse pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-4 rounded-2xl font-bold transition-all text-lg"
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
                {texts.cancel}
              </button>
              
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-4 rounded-2xl font-bold transition-all disabled:opacity-50 text-lg"
                style={{
                  background: `linear-gradient(to right, ${customTheme.colors.primary}, ${customTheme.colors.secondary})`,
                  color: '#ffffff',
                  border: `2px solid ${customTheme.colors.primary}`
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.currentTarget.style.background = `linear-gradient(to right, ${customTheme.colors.accent}, ${customTheme.colors.primary})`;
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = `linear-gradient(to right, ${customTheme.colors.primary}, ${customTheme.colors.secondary})`;
                }}
              >
                {loading ? texts.processing : (isLogin ? texts.login : texts.accountUpgrade)}
              </button>
            </div>

            {isLogin && (
              <div className="text-center pb-2">
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-sm font-bold transition-colors"
                  style={{ color: customTheme.colors.primary }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.textDecoration = 'underline';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.textDecoration = 'none';
                  }}
                >
                  {texts.forgotPassword}
                </button>
              </div>
            )}

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={switchMode}
                className="text-sm font-bold transition-colors"
                style={{ color: customTheme.colors.primary }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.textDecoration = 'underline';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.textDecoration = 'none';
                }}
              >
                {isLogin ? texts.upgradeCurrentAccount : texts.alreadyHaveAccount}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
