'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useUser } from '@/contexts/UserContext';
import { useGamification } from '@/contexts/GamificationContext';
import { useRouter } from 'next/navigation';

interface StoreItem {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  price: number;
  category: 'themes' | 'avatars' | 'backgrounds' | 'badges' | 'effects';
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  purchased: boolean;
  equipped?: boolean;
  data?: any;
}

interface UserInventory {
  coins: number;
  level: number;
  experience: number;
  purchasedItems: string[];
  equippedItems: {
    theme?: string;
    avatar?: string;
    background?: string;
    badge?: string;
  };
}

export function Store() {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const { getCurrentUser } = useUser();
  const { coins, level, addCoins, removeCoins } = useGamification();
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [storeItems, setStoreItems] = useState<StoreItem[]>([]);
  const [mounted, setMounted] = useState(false);
  const [userInventory, setUserInventory] = useState<UserInventory>({
    coins: 0,
    level: 1,
    experience: 0,
    purchasedItems: [],
    equippedItems: {}
  });
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<StoreItem | null>(null);

  const currentUser = getCurrentUser();

  const defaultStoreItems: StoreItem[] = [
    // Themes
    {
      id: 'theme-ocean',
      name: 'Ocean Breeze',
      nameAr: 'نسيم المحيط',
      description: 'Cool blue theme inspired by the ocean',
      descriptionAr: 'ثيم أزرق بارد مستوحى من المحيط',
      price: 150,
      category: 'themes',
      icon: '🌊',
      rarity: 'common',
      purchased: false,
      data: {
        colors: {
          primary: '#0891b2',
          secondary: '#06b6d4',
          accent: '#0e7490',
          background: '#f0f9ff',
          surface: '#e0f2fe',
          text: '#0c4a6e',
          border: '#0ea5e9'
        }
      }
    },
    {
      id: 'theme-sunset',
      name: 'Sunset Glow',
      nameAr: 'وهج الغروب',
      description: 'Warm orange and pink sunset theme',
      descriptionAr: 'ثيم دافئ برتقالي وردي مستوحى من الغروب',
      price: 200,
      category: 'themes',
      icon: '🌅',
      rarity: 'rare',
      purchased: false,
      data: {
        colors: {
          primary: '#f97316',
          secondary: '#fb923c',
          accent: '#ea580c',
          background: '#fff7ed',
          surface: '#fed7aa',
          text: '#7c2d12',
          border: '#fdba74'
        }
      }
    },
    {
      id: 'theme-galaxy',
      name: 'Galaxy Night',
      nameAr: 'ليل المجرة',
      description: 'Dark purple and blue cosmic theme',
      descriptionAr: 'ثيم كوني داكن بالبنفسجي والأزرق',
      price: 300,
      category: 'themes',
      icon: '🌌',
      rarity: 'epic',
      purchased: false,
      data: {
        colors: {
          primary: '#7c3aed',
          secondary: '#8b5cf6',
          accent: '#6d28d9',
          background: '#1e1b4b',
          surface: '#312e81',
          text: '#e9d5ff',
          border: '#8b5cf6'
        }
      }
    },
    {
      id: 'theme-forest',
      name: 'Forest Green',
      nameAr: 'غابة خضراء',
      description: 'Natural green theme inspired by nature',
      descriptionAr: 'ثيم أخضر طبيعي مستوحى من الطبيعة',
      price: 250,
      category: 'themes',
      icon: '🌲',
      rarity: 'rare',
      purchased: false,
      data: {
        colors: {
          primary: '#16a34a',
          secondary: '#22c55e',
          accent: '#15803d',
          background: '#f0fdf4',
          surface: '#dcfce7',
          text: '#14532d',
          border: '#22c55e'
        }
      }
    },
    // Avatars
    {
      id: 'avatar-wizard',
      name: 'Wizard Hat',
      nameAr: 'قبعة الساحر',
      description: 'Magical wizard avatar',
      descriptionAr: 'أفاتار ساحري سحري',
      price: 100,
      category: 'avatars',
      icon: '🧙',
      rarity: 'common',
      purchased: false,
      data: { avatarUrl: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=wizard' }
    },
    {
      id: 'avatar-ninja',
      name: 'Ninja Warrior',
      nameAr: 'محارب النينجا',
      description: 'Stealthy ninja avatar',
      descriptionAr: 'أفاتار نينجا خفي',
      price: 250,
      category: 'avatars',
      icon: '🥷',
      rarity: 'rare',
      purchased: false,
      data: { avatarUrl: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=ninja' }
    },
    {
      id: 'avatar-dragon',
      name: 'Dragon Master',
      nameAr: 'سيد التنين',
      description: 'Legendary dragon avatar',
      descriptionAr: 'أفاتار تنين أسطوري',
      price: 500,
      category: 'avatars',
      icon: '🐉',
      rarity: 'legendary',
      purchased: false,
      data: { avatarUrl: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=dragon' }
    },
    {
      id: 'avatar-robot',
      name: 'Robot Friend',
      nameAr: 'صديق الروبوت',
      description: 'Friendly robot avatar',
      descriptionAr: 'أفاتار روبوت ودود',
      price: 180,
      category: 'avatars',
      icon: '🤖',
      rarity: 'common',
      purchased: false,
      data: { avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=robot' }
    },
    // Backgrounds
    {
      id: 'bg-space',
      name: 'Space Station',
      nameAr: 'محطة الفضاء',
      description: 'Futuristic space background',
      descriptionAr: 'خلفية فضائية مستقبلية',
      price: 180,
      category: 'backgrounds',
      icon: '🚀',
      rarity: 'common',
      purchased: false,
      data: { backgroundUrl: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06' }
    },
    {
      id: 'bg-forest',
      name: 'Enchanted Forest',
      nameAr: 'الغابة السحرية',
      description: 'Mystical forest background',
      descriptionAr: 'خلفية غابة غامضة',
      price: 220,
      category: 'backgrounds',
      icon: '🌲',
      rarity: 'rare',
      purchased: false,
      data: { backgroundUrl: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86' }
    },
    {
      id: 'bg-ocean',
      name: 'Ocean Waves',
      nameAr: 'أمواج المحيط',
      description: 'Calming ocean waves background',
      descriptionAr: 'خلفية أمواج المحيط الهادئة',
      price: 200,
      category: 'backgrounds',
      icon: '🌊',
      rarity: 'common',
      purchased: false,
      data: { backgroundUrl: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0' }
    },
    {
      id: 'bg-mountain',
      name: 'Mountain Peak',
      nameAr: 'قمة الجبل',
      description: 'Majestic mountain background',
      descriptionAr: 'خلفية جبلية مهيبة',
      price: 280,
      category: 'backgrounds',
      icon: '⛰️',
      rarity: 'rare',
      purchased: false,
      data: { backgroundUrl: 'https://images.unsplash.com/photo-1464822759844-d150baec0494' }
    },
    // Badges
    {
      id: 'badge-champion',
      name: 'Champion Badge',
      nameAr: 'شعار البطل',
      description: 'Show off your champion status',
      descriptionAr: 'أظهر مكانتك كبطل',
      price: 300,
      category: 'badges',
      icon: '🏆',
      rarity: 'epic',
      purchased: false
    },
    {
      id: 'badge-legend',
      name: 'Legend Badge',
      nameAr: 'شعار الأسطورة',
      description: 'Only for true legends',
      descriptionAr: 'للأساطير الحقيقية فقط',
      price: 1000,
      category: 'badges',
      icon: '👑',
      rarity: 'legendary',
      purchased: false
    },
    {
      id: 'badge-star',
      name: 'Star Student',
      nameAr: 'طالب النجوم',
      description: 'For dedicated learners',
      descriptionAr: 'للمتعلمين الملتزمين',
      price: 150,
      category: 'badges',
      icon: '⭐',
      rarity: 'common',
      purchased: false
    },
    // Effects
    {
      id: 'effect-sparkle',
      name: 'Sparkle Effect',
      nameAr: 'تأثير اللمعان',
      description: 'Add sparkles to your interface',
      descriptionAr: 'أضف لمعان لواجهتك',
      price: 120,
      category: 'effects',
      icon: '✨',
      rarity: 'common',
      purchased: false
    },
    {
      id: 'effect-fire',
      name: 'Fire Effect',
      nameAr: 'تأثير النار',
      description: 'Burn with motivation',
      descriptionAr: 'احترق بالتحفيز',
      price: 280,
      category: 'effects',
      icon: '🔥',
      rarity: 'rare',
      purchased: false
    },
    {
      id: 'effect-rainbow',
      name: 'Rainbow Effect',
      nameAr: 'تأثير قوس قزح',
      description: 'Colorful rainbow vibes',
      descriptionAr: 'أجواء قوس قزح الملونة',
      price: 350,
      category: 'effects',
      icon: '🌈',
      rarity: 'epic',
      purchased: false
    }
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (currentUser) {
      loadUserInventory();
    }
    setStoreItems(defaultStoreItems);
  }, [currentUser]);

  const loadUserInventory = () => {
    if (!currentUser) return;

    const savedInventory = localStorage.getItem(`userInventory_${currentUser.accountId}`);
    if (savedInventory) {
      try {
        const parsed = JSON.parse(savedInventory);
        setUserInventory(parsed);
        
        setStoreItems(prevItems => 
          prevItems.map(item => ({
            ...item,
            purchased: parsed.purchasedItems.includes(item.id),
            equipped: Object.values(parsed.equippedItems).includes(item.id)
          }))
        );
        
        // Apply equipped items on load
        Object.entries(parsed.equippedItems).forEach(([category, itemId]) => {
          const item = defaultStoreItems.find(item => item.id === itemId);
          if (item) {
            applyItemEffects(item);
          }
        });
      } catch (error) {
        console.error('Failed to load inventory:', error);
      }
    }
  };

  const saveUserInventory = (inventory: UserInventory) => {
    if (!currentUser) return;
    
    localStorage.setItem(`userInventory_${currentUser.accountId}`, JSON.stringify(inventory));
    setUserInventory(inventory);
    
    setStoreItems(prevItems => 
      prevItems.map(item => ({
        ...item,
        purchased: inventory.purchasedItems.includes(item.id),
        equipped: Object.values(inventory.equippedItems).includes(item.id)
      }))
    );
  };

  const purchaseItem = (item: StoreItem) => {
    if (!currentUser) return;
    
    if (coins < item.price) {
      alert('ليس لديك نقاط كافية!');
      return;
    }

    if (userInventory.purchasedItems.includes(item.id)) {
      alert('لقد اشتريت هذا العنصر بالفعل!');
      return;
    }

    setSelectedItem(item);
    setShowPurchaseModal(true);
  };

  const confirmPurchase = () => {
    if (!selectedItem || !currentUser) return;

    removeCoins(selectedItem.price);

    const updatedInventory = {
      ...userInventory,
      purchasedItems: [...userInventory.purchasedItems, selectedItem.id]
    };

    saveUserInventory(updatedInventory);
    setShowPurchaseModal(false);
    setSelectedItem(null);

    applyItemEffects(selectedItem);
  };

  const applyItemEffects = (item: StoreItem) => {
    switch (item.category) {
      case 'themes':
        if (item.data?.colors) {
          // Apply custom theme
          localStorage.setItem('customTheme', JSON.stringify(item.data.colors));
          window.dispatchEvent(new CustomEvent('customThemeChange', { detail: item.data.colors }));
          
          // Also update timer settings to match the theme
          const timerSettings = {
            color: item.data.colors.primary || '#ffffff',
            font: 'font-mono',
            design: 'minimal',
            size: 'text-6xl'
          };
          localStorage.setItem('timer_settings', JSON.stringify(timerSettings));
          window.dispatchEvent(new CustomEvent('timerSettingsChanged', { detail: timerSettings }));
        }
        break;
        
      case 'avatars':
        if (item.data?.avatarUrl) {
          // Apply avatar
          localStorage.setItem('userAvatar', item.data.avatarUrl);
          window.dispatchEvent(new CustomEvent('avatarChange', { detail: item.data.avatarUrl }));
        }
        break;
        
      case 'backgrounds':
        if (item.data?.backgroundUrl) {
          // Apply background
          const backgroundId = `custom-${item.id}`;
          localStorage.setItem('selectedBackground', backgroundId);
          localStorage.setItem('customBackgroundValue', item.data.backgroundUrl);
          window.dispatchEvent(new CustomEvent('backgroundChange', { detail: { backgroundId } }));
        }
        break;
        
      case 'badges':
        // Apply badge (stored in user profile)
        localStorage.setItem('equippedBadge', item.id);
        window.dispatchEvent(new CustomEvent('badgeChange', { detail: item.id }));
        break;
        
      case 'effects':
        // Apply visual effect
        localStorage.setItem('activeEffect', item.id);
        window.dispatchEvent(new CustomEvent('effectChange', { detail: item.id }));
        
        // Remove all effect classes first
        document.body.classList.remove('sparkle-effect', 'fire-effect', 'rainbow-effect');
        
        // Add visual effect to body
        if (item.id === 'effect-sparkle') {
          document.body.classList.add('sparkle-effect');
        } else if (item.id === 'effect-fire') {
          document.body.classList.add('fire-effect');
        } else if (item.id === 'effect-rainbow') {
          document.body.classList.add('rainbow-effect');
        }
        break;
    }
  };

  const equipItem = (item: StoreItem) => {
    if (!userInventory.purchasedItems.includes(item.id)) return;

    const updatedInventory = {
      ...userInventory,
      equippedItems: { ...userInventory.equippedItems, [item.category]: item.id }
    };

    saveUserInventory(updatedInventory);
    applyItemEffects(item);
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return '#9ca3af';
      case 'rare': return '#3b82f6';
      case 'epic': return '#8b5cf6';
      case 'legendary': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const filteredItems = storeItems.filter(item => 
    selectedCategory === 'all' || item.category === selectedCategory
  );

  const categories = [
    { id: 'all', name: 'الكل', icon: '🛍️' },
    { id: 'themes', name: 'الثيمات', icon: '🎨' },
    { id: 'avatars', name: 'الأفاتار', icon: '👤' },
    { id: 'badges', name: 'الشعارات', icon: '🏅' }
  ];

  if (!mounted) {
    return (
      <div className={`min-h-screen p-6 ${
        theme === 'light' ? 'bg-gray-50' : 'bg-gray-900'
      }`}>
        <div className="flex items-center justify-center h-64">
          <div className="text-2xl">جاري التحميل...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${
      theme === 'light' ? 'bg-gray-50' : 'bg-gray-900'
    }`}>
      {/* Elegant Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className={`rounded-2xl p-6 shadow-sm border ${
          theme === 'light' ? 'bg-white border-gray-200' : 'bg-gray-800 border-gray-700'
        }`}>
          <div className="flex items-center justify-between">
            {/* Back Button */}
            <button
              onClick={() => router.push('/focus')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                theme === 'light'
                  ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  : 'text-gray-400 hover:text-gray-100 hover:bg-gray-700'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              {t.rank === 'ترتيب' ? 'العودة' : 'Back'}
            </button>

            {/* Frogo Branding */}
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 ${
                theme === 'light' 
                  ? 'bg-gray-100' 
                  : 'bg-gray-700'
              }`}>
                <img 
                  src="/mrfrogo.png" 
                  alt="Frogo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h1 className={`text-2xl font-semibold ${
                  theme === 'light' ? 'text-gray-900' : 'text-white'
                }`}>
                  Frogo Store
                </h1>
                <p className={`text-sm ${
                  theme === 'light' ? 'text-gray-500' : 'text-gray-400'
                }`}>
                  {t.rank === 'ترتيب' ? 'المتجر' : 'Store'}
                </p>
              </div>
            </div>

            {/* Coins Display */}
            <div className={`px-3 py-1.5 rounded-lg font-medium text-sm ${
              theme === 'light' 
                ? 'bg-yellow-50 text-yellow-700 border border-yellow-200' 
                : 'bg-yellow-900/30 text-yellow-400 border border-yellow-800'
            }`}>
              🪙 {coins}
            </div>
          </div>
        </div>
      </div>

      {/* Clean Categories */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-wrap gap-3 justify-center">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedCategory === category.id
                  ? theme === 'light' 
                    ? 'bg-gray-900 text-white' 
                    : 'bg-white text-gray-900'
                  : theme === 'light' 
                    ? 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200' 
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
              }`}
            >
              <span className="text-lg">{category.icon}</span>
              <span>{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Clean Store Items Grid */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredItems.map(item => (
            <div
              key={item.id}
              className={`rounded-xl overflow-hidden transition-shadow duration-200 hover:shadow-lg ${
                theme === 'light' 
                  ? 'bg-white border border-gray-200' 
                  : 'bg-gray-800 border border-gray-700'
              }`}
            >
              {/* Header */}
              <div className={`p-4 border-b ${
                theme === 'light' ? 'border-gray-200' : 'border-gray-700'
              }`}>
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl ${
                    theme === 'light' ? 'bg-gray-100' : 'bg-gray-700'
                  }`}>
                    {item.icon}
                  </div>
                  <div 
                    className="px-2 py-1 rounded text-xs font-medium"
                    style={{ 
                      backgroundColor: getRarityColor(item.rarity) + '20',
                      color: getRarityColor(item.rarity)
                    }}
                  >
                    {item.rarity === 'common' ? 'عادي' : 
                     item.rarity === 'rare' ? 'نادر' : 
                     item.rarity === 'epic' ? 'أسطوري' : 'أسطورة'}
                  </div>
                </div>
                
                <h3 className={`font-semibold text-base mb-1 ${
                  theme === 'light' ? 'text-gray-900' : 'text-white'
                }`}>
                  {t.rank === 'ترتيب' ? item.nameAr : item.name}
                </h3>
                
                <p className={`text-sm line-clamp-2 ${
                  theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                }`}>
                  {t.rank === 'ترتيب' ? item.descriptionAr : item.description}
                </p>
              </div>

              {/* Footer */}
              <div className="p-4">
                <div className={`text-center mb-3 font-semibold text-lg ${
                  theme === 'light' ? 'text-yellow-600' : 'text-yellow-400'
                }`}>
                  🪙 {item.price}
                </div>

                <div className="flex gap-2">
                  {userInventory.purchasedItems.includes(item.id) ? (
                    <button
                      onClick={() => equipItem(item)}
                      className={`flex-1 px-3 py-2 rounded-lg font-medium text-sm transition-colors ${
                        item.equipped
                          ? theme === 'light' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-green-900/30 text-green-400'
                          : theme === 'light'
                            ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                            : 'bg-blue-900/30 text-blue-400 hover:bg-blue-900/50'
                      }`}
                    >
                      {item.equipped ? '✓ مُجهّز' : 'تجهيز'}
                    </button>
                  ) : (
                    <button
                      onClick={() => purchaseItem(item)}
                      disabled={coins < item.price}
                      className={`flex-1 px-3 py-2 rounded-lg font-medium text-sm transition-colors ${
                        coins >= item.price
                          ? theme === 'light'
                            ? 'bg-green-600 text-white hover:bg-green-700'
                            : 'bg-green-700 text-white hover:bg-green-800'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {coins >= item.price ? 'شراء' : 'نقاط غير كافية'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Clean Purchase Modal */}
      {showPurchaseModal && selectedItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
          <div className={`w-full max-w-sm rounded-2xl p-6 shadow-xl ${
            theme === 'light' ? 'bg-white border border-gray-200' : 'bg-gray-800 border border-gray-700'
          }`}>
            {/* Close Button */}
            <button
              onClick={() => setShowPurchaseModal(false)}
              className={`float-right w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                theme === 'light'
                  ? 'hover:bg-gray-100 text-gray-600'
                  : 'hover:bg-gray-700 text-gray-400'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="clear-both">
              {/* Header */}
              <h2 className={`text-xl font-semibold mb-4 text-center ${
                theme === 'light' ? 'text-gray-900' : 'text-white'
              }`}>
                {t.rank === 'ترتيب' ? 'تأكيد الشراء' : 'Confirm Purchase'}
              </h2>
              
              {/* Item Display */}
              <div className="text-center mb-6">
                <div className={`w-16 h-16 rounded-lg flex items-center justify-center text-3xl mx-auto mb-3 ${
                  theme === 'light' ? 'bg-gray-100' : 'bg-gray-700'
                }`}>
                  {selectedItem.icon}
                </div>
                <h3 className={`font-semibold mb-1 ${
                  theme === 'light' ? 'text-gray-900' : 'text-white'
                }`}>
                  {t.rank === 'ترتيب' ? selectedItem.nameAr : selectedItem.name}
                </h3>
                <p className={`text-sm ${
                  theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                }`}>
                  {t.rank === 'ترتيب' ? selectedItem.descriptionAr : selectedItem.description}
                </p>
              </div>

              {/* Price */}
              <div className={`text-center mb-6 p-3 rounded-lg ${
                theme === 'light' ? 'bg-yellow-50' : 'bg-yellow-900/20'
              }`}>
                <div className={`text-2xl font-semibold ${
                  theme === 'light' ? 'text-yellow-700' : 'text-yellow-400'
                }`}>
                  🪙 {selectedItem.price}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowPurchaseModal(false)}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                    theme === 'light' 
                      ? 'bg-gray-200 text-gray-800 hover:bg-gray-300' 
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {t.rank === 'ترتيب' ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  onClick={confirmPurchase}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium text-white transition-colors ${
                    theme === 'light'
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-green-700 hover:bg-green-800'
                  }`}
                >
                  {t.rank === 'ترتيب' ? 'شراء' : 'Buy'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
