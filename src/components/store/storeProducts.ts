export interface StoreItem {
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

export const defaultStoreItems: StoreItem[] = [
  // Themes
  {
    id: 'theme-ocean',
    name: 'Ocean Breeze',
    nameAr: 'Ocean Breeze',
    description: 'Cool blue theme inspired by the ocean',
    descriptionAr: 'Cool blue theme inspired by the ocean',
    price: 150,
    category: 'themes',
    icon: 'ð',
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
    nameAr: 'Sunset Glow',
    description: 'Warm orange and pink sunset theme',
    descriptionAr: 'Warm orange and pink sunset theme',
    price: 200,
    category: 'themes',
    icon: 'ð',
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
    nameAr: 'Galaxy Night',
    description: 'Dark purple and blue cosmic theme',
    descriptionAr: 'Dark purple and blue cosmic theme',
    price: 300,
    category: 'themes',
    icon: 'ð',
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
    nameAr: 'Forest Green',
    description: 'Natural green theme inspired by nature',
    descriptionAr: 'Natural green theme inspired by nature',
    price: 250,
    category: 'themes',
    icon: 'ð',
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
    nameAr: 'Wizard Hat',
    description: 'Magical wizard avatar',
    descriptionAr: 'Magical wizard avatar',
    price: 100,
    category: 'avatars',
    icon: 'ð§',
    rarity: 'common',
    purchased: false,
    data: { avatarUrl: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=wizard' }
  },
  {
    id: 'avatar-ninja',
    name: 'Ninja Warrior',
    nameAr: 'Ninja Warrior',
    description: 'Stealthy ninja avatar',
    descriptionAr: 'Stealthy ninja avatar',
    price: 250,
    category: 'avatars',
    icon: 'ð¥·',
    rarity: 'rare',
    purchased: false,
    data: { avatarUrl: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=ninja' }
  },
  {
    id: 'avatar-dragon',
    name: 'Dragon Master',
    nameAr: 'Dragon Master',
    description: 'Legendary dragon avatar',
    descriptionAr: 'Legendary dragon avatar',
    price: 500,
    category: 'avatars',
    icon: 'ð',
    rarity: 'legendary',
    purchased: false,
    data: { avatarUrl: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=dragon' }
  },
  {
    id: 'avatar-robot',
    name: 'Robot Friend',
    nameAr: 'Robot Friend',
    description: 'Friendly robot avatar',
    descriptionAr: 'Friendly robot avatar',
    price: 180,
    category: 'avatars',
    icon: 'ð¤',
    rarity: 'common',
    purchased: false,
    data: { avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=robot' }
  },
  // Backgrounds
  {
    id: 'bg-space',
    name: 'Space Station',
    nameAr: 'Space Station',
    description: 'Futuristic space background',
    descriptionAr: 'Futuristic space background',
    price: 180,
    category: 'backgrounds',
    icon: 'ðº',
    rarity: 'common',
    purchased: false,
    data: { backgroundUrl: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06' }
  },
  {
    id: 'bg-forest',
    name: 'Enchanted Forest',
    nameAr: 'Enchanted Forest',
    description: 'Mystical forest background',
    descriptionAr: 'Mystical forest background',
    price: 220,
    category: 'backgrounds',
    icon: 'ð',
    rarity: 'rare',
    purchased: false,
    data: { backgroundUrl: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86' }
  },
  {
    id: 'bg-ocean',
    name: 'Ocean Waves',
    nameAr: 'Ocean Waves',
    description: 'Calming ocean waves background',
    descriptionAr: 'Calming ocean waves background',
    price: 200,
    category: 'backgrounds',
    icon: 'ð',
    rarity: 'common',
    purchased: false,
    data: { backgroundUrl: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0' }
  },
  {
    id: 'bg-mountain',
    name: 'Mountain Peak',
    nameAr: 'Mountain Peak',
    description: 'Majestic mountain background',
    descriptionAr: 'Majestic mountain background',
    price: 280,
    category: 'backgrounds',
    icon: 'â°ï¸',
    rarity: 'rare',
    purchased: false,
    data: { backgroundUrl: 'https://images.unsplash.com/photo-1464822759844-d150baec0494' }
  },
  // Badges
  {
    id: 'badge-champion',
    name: 'Champion Badge',
    nameAr: 'Champion Badge',
    description: 'Show off your champion status',
    descriptionAr: 'Show off your champion status',
    price: 300,
    category: 'badges',
    icon: 'ð',
    rarity: 'epic',
    purchased: false
  },
  {
    id: 'badge-legend',
    name: 'Legend Badge',
    nameAr: 'Legend Badge',
    description: 'Prove you are a true legend',
    descriptionAr: 'Prove you are a true legend',
    price: 500,
    category: 'badges',
    icon: 'â¤',
    rarity: 'legendary',
    purchased: false
  },
  {
    id: 'badge-star',
    name: 'Star Badge',
    nameAr: 'Star Badge',
    description: 'Shine bright like a star',
    descriptionAr: 'Shine bright like a star',
    price: 150,
    category: 'badges',
    icon: 'â¨',
    rarity: 'common',
    purchased: false
  },
  {
    id: 'badge-fire',
    name: 'Fire Badge',
    nameAr: 'Fire Badge',
    description: 'Burn with passion and determination',
    descriptionAr: 'Burn with passion and determination',
    price: 200,
    category: 'badges',
    icon: 'ð¥',
    rarity: 'rare',
    purchased: false
  },
  // Effects
  {
    id: 'effect-rainbow',
    name: 'Rainbow Trail',
    nameAr: 'Rainbow Trail',
    description: 'Colorful rainbow effect',
    descriptionAr: 'Colorful rainbow effect',
    price: 350,
    category: 'effects',
    icon: 'ð',
    rarity: 'epic',
    purchased: false,
    data: {
      effect: 'rainbow-trail',
      duration: 5000,
      colors: ['#ff0000', '#ff7f00', '#ffff00', '#00ff00', '#0000ff', '#4b0082', '#9400d3']
    }
  },
  {
    id: 'effect-sparkle',
    name: 'Sparkle Dust',
    nameAr: 'Sparkle Dust',
    description: 'Magical sparkle effect',
    descriptionAr: 'Magical sparkle effect',
    price: 250,
    category: 'effects',
    icon: 'â¨',
    rarity: 'rare',
    purchased: false,
    data: {
      effect: 'sparkle-dust',
      duration: 3000,
      particleCount: 20
    }
  },
  {
    id: 'effect-glow',
    name: 'Golden Glow',
    nameAr: 'Golden Glow',
    description: 'Shimmering golden aura',
    descriptionAr: 'Shimmering golden aura',
    price: 180,
    category: 'effects',
    icon: 'â¨',
    rarity: 'common',
    purchased: false,
    data: {
      effect: 'golden-glow',
      duration: 4000,
      intensity: 0.8
    }
  }
];

export const specialOfferItems = ['badge-legend', 'theme-galaxy', 'effect-rainbow'];
