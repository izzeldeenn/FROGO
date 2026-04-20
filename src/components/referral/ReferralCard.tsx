'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useUser } from '@/contexts/UserContext';
import { referralDB } from '@/lib/supabase';

export function ReferralCard() {
  const { theme } = useTheme();
  const { language, t } = useLanguage();
  const { getCurrentUser } = useUser();
  const [referralCode, setReferralCode] = useState<string>('');
  const [totalReferrals, setTotalReferrals] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadReferralData();
  }, []);

  const loadReferralData = async () => {
    const currentUser = getCurrentUser();
    if (!currentUser?.accountId) return;

    // Get user's referral code from user data
    let code = currentUser.referralCode;

    // If no referral code exists, generate and save one
    if (!code) {
      code = referralDB.generateReferralCode();
      const { userDB } = await import('@/lib/supabase');
      await userDB.updateUserByAccountId(currentUser.accountId, { referral_code: code });
    }

    setReferralCode(code || '');

    // Get total referrals and points
    const referrals = await referralDB.getReferralsByReferrer(currentUser.accountId);
    setTotalReferrals(referrals.length);

    const points = await referralDB.getTotalReferralPoints(currentUser.accountId);
    setTotalPoints(points);
  };

  const copyReferralCode = () => {
    if (referralCode) {
      navigator.clipboard.writeText(referralCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className={`rounded-2xl p-6 ${
      theme === 'light' ? 'bg-white border border-gray-200' : 'bg-gray-800 border border-gray-700'
    }`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-lg font-bold ${
          theme === 'light' ? 'text-gray-900' : 'text-white'
        }`}>
          {language === 'ar' ? 'كود الإحالة' : 'Referral Code'}
        </h3>
        <div className="flex items-center gap-2">
          <span className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
            {language === 'ar' ? 'إحالات' : 'Referrals'}: {totalReferrals}
          </span>
          <span className={`text-sm ${theme === 'light' ? 'text-amber-600' : 'text-amber-400'}`}>
            {language === 'ar' ? 'نقاط' : 'Points'}: +{totalPoints}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className={`flex-1 p-4 rounded-xl border-2 border-dashed ${
          theme === 'light' ? 'border-amber-300 bg-amber-50' : 'border-amber-600 bg-amber-900/20'
        }`}>
          <span className={`text-2xl font-mono font-bold tracking-wider ${
            theme === 'light' ? 'text-amber-700' : 'text-amber-400'
          }`}>
            {referralCode}
          </span>
        </div>
        <button
          onClick={copyReferralCode}
          className={`px-4 py-3 rounded-xl font-medium transition-all ${
            copied
              ? 'bg-green-500 text-white'
              : theme === 'light'
                ? 'bg-amber-500 text-white hover:bg-amber-600'
                : 'bg-amber-600 text-white hover:bg-amber-700'
          }`}
        >
          {copied ? (
            <span>{language === 'ar' ? 'تم النسخ!' : 'Copied!'}</span>
          ) : (
            <span>{language === 'ar' ? 'نسخ' : 'Copy'}</span>
          )}
        </button>
      </div>

      <p className={`mt-4 text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
        {language === 'ar'
          ? 'شارك هذا الكود مع أصدقائك واحصل على 40 نقطة على كل مستخدم يسجل!'
          : 'Share this code with friends and get 40 points for each user who signs up!'}
      </p>
    </div>
  );
}
