'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCustomThemeClasses } from '@/hooks/useCustomThemeClasses';
import { usePoints } from '@/contexts/PointsContext';
import { Store } from '@/components/store/Store';
import { NotesComponent } from '@/components/chat/NotesComponent';
import { StickyNotes } from '@/components/chat/StickyNotes';

export function ActionButtons() {
  const { theme } = useTheme();
  const { language, t } = useLanguage();
  const customTheme = useCustomThemeClasses();
  const { addCoins } = usePoints();
  const [showStore, setShowStore] = useState(false);
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [notes, setNotes] = useState<string>('');
  const [canClaimDailyGift, setCanClaimDailyGift] = useState(false);
  const [showGiftAnimation, setShowGiftAnimation] = useState(false);
  const [giftReward, setGiftReward] = useState(0);
  const [enabledServices, setEnabledServices] = useState<Record<string, boolean>>({
    store: true,
    challenge: true,
    rooms: true,
    notes: true
  });

  // Load slides from localStorage for indicator
  useEffect(() => {
    const loadSlides = () => {
      if (typeof window !== 'undefined') {
        const savedSlides = localStorage.getItem('userSlides');
        if (savedSlides) {
          try {
            const parsedSlides = JSON.parse(savedSlides);
            setNotes(parsedSlides.length > 0 ? 'hasSlides' : '');
          } catch (error) {
            console.error('Failed to load slides:', error);
          }
        }
      }
    };

    loadSlides();

    // Listen for custom events when new notes are published
    const handleStickyNotePublished = (e: CustomEvent) => {
      loadSlides(); // Reload to update indicator
    };

    window.addEventListener('stickyNotePublished', handleStickyNotePublished as EventListener);

    return () => {
      window.removeEventListener('stickyNotePublished', handleStickyNotePublished as EventListener);
    };
  }, []);

  // Check if user can claim daily gift
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const lastGiftDate = localStorage.getItem('last_daily_gift_date');
      const today = new Date().toDateString();

      if (!lastGiftDate || lastGiftDate !== today) {
        setCanClaimDailyGift(true);
      } else {
        setCanClaimDailyGift(false);
      }
    }
  }, []);

  // Load enabled services from localStorage and listen for updates
  useEffect(() => {
    const loadEnabledServices = () => {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('enabled_services');
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            setEnabledServices(prev => ({
              ...prev,
              store: parsed.store ?? true,
              challenge: parsed.challenge ?? true,
              rooms: parsed.rooms ?? true,
              notes: parsed.notes ?? true
            }));
          } catch (error) {
            console.error('Failed to load enabled services:', error);
          }
        }
      }
    };

    // Load initially
    loadEnabledServices();

    // Listen for custom event
    const handleServicesUpdated = (e: CustomEvent) => {
      const updated = e.detail;
      setEnabledServices(prev => ({
        ...prev,
        store: updated.store ?? prev.store,
        challenge: updated.challenge ?? prev.challenge,
        rooms: updated.rooms ?? prev.rooms,
        notes: updated.notes ?? prev.notes
      }));
    };

    window.addEventListener('servicesUpdated', handleServicesUpdated as EventListener);

    return () => {
      window.removeEventListener('servicesUpdated', handleServicesUpdated as EventListener);
    };
  }, []);

  // Claim daily gift
  const claimDailyGift = () => {
    const reward = Math.floor(Math.random() * 16) + 5; // Random between 5 and 20
    setGiftReward(reward);
    setShowGiftAnimation(true);
    addCoins(reward);

    // Save today's date as last gift date
    if (typeof window !== 'undefined') {
      localStorage.setItem('last_daily_gift_date', new Date().toDateString());
    }

    setCanClaimDailyGift(false);

    // Hide animation after 3 seconds
    setTimeout(() => {
      setShowGiftAnimation(false);
    }, 3000);
  };

  const renderStoreButton = () => (
    <button
      onClick={() => setShowStore(!showStore)}
      className="group relative w-10 h-10 rounded-xl transition-all duration-200 hover:scale-110 focus:outline-none inline-flex items-center justify-center"
      style={{
        background: showStore
          ? `linear-gradient(135deg, #8b5cf6, #7c3aed)`
          : `linear-gradient(135deg, #7c3aed, #8b5cf6)`,
        boxShadow: showStore
          ? `0 4px 20px rgba(139, 92, 246, 0.4)`
          : `0 2px 10px rgba(124, 58, 237, 0.2)`,
        color: '#ffffff'
      }}
      aria-label={language === 'ar' ? 'المتجر' : 'Store'}
      title={language === 'ar' ? 'المتجر' : 'Store'}
    >
      <span className="text-xl transition-transform duration-200 group-hover:rotate-12">
        🏪
      </span>
    </button>
  );

  const renderRealTimeChallengeButton = () => (
    <button
      onClick={() => window.location.href = '/challenge'}
      className="group relative w-10 h-10 rounded-xl transition-all duration-200 hover:scale-110 focus:outline-none inline-flex items-center justify-center"
      style={{
        background: `linear-gradient(135deg, #ef4444, #dc2626)`,
        boxShadow: `0 2px 10px rgba(239, 68, 68, 0.3)`,
        color: '#ffffff'
      }}
      aria-label={language === 'ar' ? 'تحدي فوري' : 'Real-time Challenge'}
      title={language === 'ar' ? 'تحدي فوري مع لاعبين حقيقيين' : 'Real-time challenge with live players'}
    >
      <span className="text-xl transition-transform duration-200 group-hover:rotate-12">
        ⚔️
      </span>
    </button>
  );

  const renderRoomsButton = () => (
    <button
      onClick={() => window.location.href = '/rooms'}
      className="group relative w-10 h-10 rounded-xl transition-all duration-200 hover:scale-110 focus:outline-none inline-flex items-center justify-center"
      style={{
        background: `linear-gradient(135deg, #6366f1, #4f46e5)`,
        boxShadow: `0 2px 10px rgba(99, 102, 241, 0.3)`,
        color: '#ffffff'
      }}
      aria-label={language === 'ar' ? 'غرف الدراسة' : 'Study Rooms'}
      title={language === 'ar' ? 'غرف الدراسة' : 'Study Rooms'}
    >
      <img
        src="/icons/icons8-team-48.png"
        alt="Study Rooms"
        className="w-6 h-6 transition-transform duration-200 group-hover:rotate-12"
      />
    </button>
  );

  const renderNotesButton = () => (
    <button
      onClick={() => setIsNotesOpen(!isNotesOpen)}
      className="group relative w-10 h-10 rounded-xl transition-all duration-200 hover:scale-110 focus:outline-none inline-flex items-center justify-center"
      style={{
        background: isNotesOpen
          ? `linear-gradient(135deg, #10b981, #059669)`
          : `linear-gradient(135deg, #059669, #10b981)`,
        boxShadow: isNotesOpen
          ? `0 4px 20px rgba(16, 185, 129, 0.4)`
          : `0 2px 10px rgba(5, 150, 105, 0.2)`,
        color: '#ffffff'
      }}
      aria-label={language === 'ar' ? 'ملاحظات' : 'Notes'}
      title={language === 'ar' ? 'الملاحظات' : 'Notes'}
    >
      <span className="text-xl transition-transform duration-200 group-hover:rotate-12">
        📝
      </span>
      {notes === 'hasSlides' && (
        <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-green-400 rounded-full animate-pulse" />
      )}
    </button>
  );

  const renderDailyGiftButton = () => {
    if (!canClaimDailyGift) return null;

    return (
      <button
        onClick={claimDailyGift}
        className="group relative w-10 h-10 rounded-xl transition-all duration-200 hover:scale-110 focus:outline-none inline-flex items-center justify-center"
        style={{
          background: `linear-gradient(135deg, #f59e0b, #d97706)`,
          boxShadow: `0 2px 10px rgba(245, 158, 11, 0.3)`,
          color: '#ffffff'
        }}
        aria-label={language === 'ar' ? 'الهدية اليومية' : 'Daily Gift'}
        title={language === 'ar' ? 'الهدية اليومية' : 'Daily Gift'}
      >
        <span className="text-xl transition-transform duration-200 group-hover:rotate-12 animate-bounce">
          🎁
        </span>
        <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-yellow-400 rounded-full animate-ping" />
      </button>
    );
  };

  return (
    <div className="flex flex-col gap-3">
      {renderDailyGiftButton()}
      {enabledServices.rooms && renderRoomsButton()}
      {enabledServices.store && renderStoreButton()}
      {enabledServices.challenge && renderRealTimeChallengeButton()}
      {enabledServices.notes && renderNotesButton()}
      <Store
        isOpen={showStore}
        onClose={() => setShowStore(false)}
      />
      <NotesComponent
        isOpen={isNotesOpen}
        onClose={() => setIsNotesOpen(false)}
      />
      <StickyNotes />

      {/* Gift Animation */}
      {showGiftAnimation && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="text-center animate-bounce">
            <div className="text-8xl mb-4">🎉</div>
            <div className="text-4xl font-bold text-white mb-2">
              {language === 'ar' ? 'مبروك!' : 'Congratulations!'}
            </div>
            <div className="text-2xl text-yellow-400">
              {language === 'ar' ? `+${giftReward} عملة` : `+${giftReward} coins`}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
