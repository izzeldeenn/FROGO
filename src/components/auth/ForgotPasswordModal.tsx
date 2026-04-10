'use client';

import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useCustomThemeClasses } from '@/hooks/useCustomThemeClasses';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (email: string) => Promise<{ success: boolean; error?: string }>;
}

export function ForgotPasswordModal({ isOpen, onClose, onSubmit }: ForgotPasswordModalProps) {
  const { language, t } = useLanguage();
  const { theme } = useTheme();
  const customTheme = useCustomThemeClasses();
  
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const result = await onSubmit(email);
      
      if (result.success) {
        setSuccess(true);
        // Reset form after 3 seconds and close modal
        setTimeout(() => {
          setEmail('');
          setSuccess(false);
          onClose();
        }, 3000);
      } else {
        setError(result.error || 'فشل إرسال بريد إعادة التعيين');
      }
    } catch (err) {
      setError('حدث خطأ غير متوقع');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setEmail('');
      setError('');
      setSuccess(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[9999] p-4">
      <div className={`w-full max-w-md rounded-3xl shadow-2xl ${
        theme === 'light' ? 'bg-white' : 'bg-gray-900'
      }`}
      style={{ border: `2px solid ${customTheme.colors.border}` }}
      >
        <div 
          className="p-6 border-b"
          style={{
            background: `linear-gradient(to right, ${customTheme.colors.surface}, ${customTheme.colors.background})`,
            borderColor: customTheme.colors.border
          }}
        >
          <div className="flex items-center justify-between">
            <h3 className={`text-2xl font-bold ${
              theme === 'light' ? 'text-gray-800' : 'text-gray-100'
            }`}>
              نسيت كلمة المرور
            </h3>
            <button
              onClick={handleClose}
              disabled={loading}
              className="w-10 h-10 rounded-full flex items-center justify-center transition-colors disabled:opacity-50"
              style={{
                backgroundColor: 'transparent',
                color: customTheme.colors.text
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.backgroundColor = customTheme.colors.primary;
                  e.currentTarget.style.color = '#ffffff';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = customTheme.colors.text;
              }}
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-6">
          {success ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h4 className={`text-lg font-semibold mb-2 ${
                theme === 'light' ? 'text-gray-800' : 'text-gray-100'
              }`}>
                تم الإرسال بنجاح!
              </h4>
              <p className={`text-sm ${
                theme === 'light' ? 'text-gray-600' : 'text-gray-400'
              }`}>
                تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-xl text-red-600 text-sm" 
                     style={{ backgroundColor: '#fee2e2', border: '1px solid #fecaca' }}>
                  {error}
                </div>
              )}

              <div>
                <label className={`block mb-2 text-sm font-medium ${
                  theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                }`}>
                  البريد الإلكتروني
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@email.com"
                  required
                  disabled={loading}
                  className="w-full px-4 py-3 rounded-xl focus:outline-none transition-all disabled:opacity-50"
                  style={{
                    backgroundColor: customTheme.colors.surface,
                    borderColor: customTheme.colors.border,
                    color: customTheme.colors.text
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = customTheme.colors.primary;
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = customTheme.colors.border;
                  }}
                />
              </div>

              <div className={`text-sm p-3 rounded-xl ${
                theme === 'light' ? 'bg-blue-50 text-blue-700' : 'bg-blue-900/20 text-blue-300'
              }`}>
                <p className="font-medium mb-1">ملاحظات:</p>
                <ul className="text-xs space-y-1">
                  <li>• سيتم إرسال رابط إعادة التعيين إلى بريدك الإلكتروني</li>
                  <li>• الرابط صالح لمدة 15 دقيقة فقط</li>
                  <li>• تأكد من فحص البريد الإلكتروني غير المرغوب فيه</li>
                </ul>
              </div>

              <button
                type="submit"
                disabled={loading || !email}
                className="w-full py-3 px-4 rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: loading || !email ? '#ccc' : customTheme.colors.primary,
                  color: '#ffffff'
                }}
                onMouseEnter={(e) => {
                  if (!loading && email) {
                    e.currentTarget.style.opacity = '0.9';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = '1';
                }}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    جاري الإرسال...
                  </div>
                ) : (
                  'إرسال رابط إعادة التعيين'
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
