// Free music tracks for focus timer - all royalty-free
export interface MusicTrack {
  id: string;
  name: string;
  artist: string;
  category: 'lofi' | 'ambient' | 'nature' | 'classical' | 'piano' | 'radio';
  duration: string; // in seconds, or 'live' for radio streams
  url: string;
  thumbnail: string;
  mood: 'focus' | 'relax' | 'energetic' | 'calm';
  isLive?: boolean; // for radio streams
}

export const MUSIC_TRACKS: MusicTrack[] = [
  // Quran Radio - Primary Track
  {
    id: 'quran-cairo-primary',
    name: 'إذاعة القرآن الكريم من القاهرة',
    artist: 'Abdulbasit Abdusamad',
    category: 'radio',
    duration: '1350', // 22.5 minutes
    url: 'https://dn710109.ca.archive.org/0/items/Mobasher-Ezaa/%D8%A7%D9%84%D8%B9%D9%84%D9%82%20%D8%A7%D9%84%D9%89%20%D8%AE%D8%AA%D8%A7%D9%85%20%D8%A7%D9%84%D9%82%D8%B1%D8%A7%D9%86%20%D9%85%D8%B9%20%D8%A7%D9%84%D8%AF%D8%B9%D8%A7%D8%A1%20%D8%B9%D8%A8%D8%AF%20%D8%A7%D9%84%D8%A8%D8%A7%D8%B3%D8%B7_kena.mp3',
    thumbnail: '/music/thumbnails/quran-radio.png',
    mood: 'calm',
    isLive: true
  },
  {
    id: 'quran-cairo-2022',
    name: 'إذاعة القرآن الكريم - تسجيل 2022',
    artist: 'Quran Radio Cairo',
    category: 'radio',
    duration: '2400', // 40 minutes
    url: 'https://dn710109.ca.archive.org/0/items/Mobasher-Ezaa/2022-Original-New-15-3-22.MP3',
    thumbnail: '/music/thumbnails/quran-radio.png',
    mood: 'calm',
    isLive: true
  },
  {
    id: 'quran-cairo-manshawi',
    name: 'إذاعة القرآن الكريم - المنشاوي',
    artist: 'Al-Manshawi',
    category: 'radio',
    duration: '1800', // 30 minutes
    url: 'https://ia601705.us.archive.org/28/items/Mobasher-Ezaa/%D8%A7%D9%84%D9%85%D9%86%D8%B4%D8%A7%D9%88%D9%89%20%D8%A7%D9%84%D8%A7%D8%AD%D8%B2%D8%A7%D8%A8%20%D9%85%D9%86%2021%20%D8%A7%D9%84%D9%89%2027_kena.mp3',
    thumbnail: '/music/thumbnails/quran-radio.png',
    mood: 'calm',
    isLive: true
  },

  // Radio Stations - Quran MP3 Files
  {
    id: 'quran-cairo',
    name: 'إذاعة القرآن الكريم من القاهرة',
    artist: 'Abdulbasit Abdusamad',
    category: 'radio',
    duration: '600', // 10 minutes
    url: 'https://dn710109.ca.archive.org/0/items/Mobasher-Ezaa/002-%D8%A7%D9%84%D8%A8%D9%82%D8%B1%D8%A9%20%D9%85%D9%86%20278%20%D8%A7%D9%84%D9%89%20282%20%D8%A7%D9%84%D8%A7%D8%B0%D8%A7%D8%B9%D8%A9%20%D8%A7%D9%84%D9%85%D8%B5%D8%B1%D9%8A%D8%A9%20%D8%A7%D9%84%D8%B3%D8%AA%D9%8A%D9%86%D9%8A%D8%A7%D8%AA.mp3',
    thumbnail: '/music/thumbnails/quran-radio.png',
    mood: 'calm',
    isLive: true
  },
  {
    id: 'quran-cairo-maher',
    name: 'قرآن من القاهرة',
    artist: 'Maher Al-Muaiqly',
    category: 'radio',
    duration: '2668', // 44.5 minutes
    url: 'https://dn710109.ca.archive.org/0/items/Mobasher-Ezaa/12-Yusuf-1-34-High-Quality.mp3',
    thumbnail: '/music/thumbnails/quran-radio.png',
    mood: 'calm',
    isLive: true
  },
  // HoliznaCC0 Lo-fi Tracks - CC0 Licensed
  {
    id: 'holizna-bubbles',
    name: 'Bubbles',
    artist: 'HoliznaCC0',
    category: 'lofi',
    duration: '120', // 2 minutes
    url: '/music/HoliznaCC0 - Bubbles ( Lofi , Bright , Relaxed ).mp3',
    thumbnail: '/music/thumbnails/lofi-study.jpg',
    mood: 'focus'
  },
  {
    id: 'holizna-canon',
    name: 'Canon Event',
    artist: 'HoliznaCC0',
    category: 'lofi',
    duration: '180', // 3 minutes
    url: '/music/HoliznaCC0 - Canon Event ( Lofi , Sad , Reflection ).mp3',
    thumbnail: '/music/thumbnails/lofi-chill.jpg',
    mood: 'relax'
  },
  {
    id: 'holizna-france',
    name: 'One Night In France',
    artist: 'HoliznaCC0',
    category: 'lofi',
    duration: '240', // 4 minutes
    url: '/music/HoliznaCC0 - One Night In France ( Lofi, Nostalgic, Chill ).mp3',
    thumbnail: '/music/thumbnails/lofi-study.jpg',
    mood: 'focus'
  },
  {
    id: 'holizna-still-life',
    name: 'Still Life',
    artist: 'HoliznaCC0',
    category: 'lofi',
    duration: '200', // 3.3 minutes
    url: '/music/HoliznaCC0 - Still Life ( Lofi , Chill , Nostalgic ).mp3',
    thumbnail: '/music/thumbnails/lofi-chill.jpg',
    mood: 'calm'
  },
  {
    id: 'holizna-theta',
    name: 'Theta Frequency',
    artist: 'HoliznaCC0',
    category: 'ambient',
    duration: '160', // 2.7 minutes
    url: '/music/HoliznaCC0 - Theta Frequency ( Lofi , Chill , Calm ).mp3',
    thumbnail: '/music/thumbnails/ambient-focus.jpg',
    mood: 'focus'
  },
  {
    id: 'holizna-tokyo',
    name: 'Tokyo Sunset',
    artist: 'HoliznaCC0',
    category: 'ambient',
    duration: '190', // 3.2 minutes
    url: '/music/HoliznaCC0 - Tokyo Sunset ( Lofi , Peaceful , Soft ).mp3',
    thumbnail: '/music/thumbnails/ambient-space.jpg',
    mood: 'relax'
  },
  {
    id: 'holizna-tranquil',
    name: 'Tranquil Mindscape',
    artist: 'HoliznaCC0',
    category: 'ambient',
    duration: '220', // 3.7 minutes
    url: '/music/HoliznaCC0 - Tranquil Mindscape ( Lofi , Happy , Reflection ).mp3',
    thumbnail: '/music/thumbnails/ambient-focus.jpg',
    mood: 'calm'
  },
  {
    id: 'holizna-darling',
    name: 'When Time Called Me Darling',
    artist: 'HoliznaCC0',
    category: 'piano',
    duration: '320', // 5.3 minutes
    url: '/music/HoliznaCC0 - When Time Called Me Darling ( Lofi, Relaxing, Chill).mp3',
    thumbnail: '/music/thumbnails/piano-meditation.jpg',
    mood: 'relax'
  },
  // New Additional Tracks
  {
    id: 'gentle-rain',
    name: 'Gentle Rain',
    artist: 'Dragon Studio',
    category: 'nature',
    duration: '180', // 3 minutes
    url: '/music/dragon-studio-gentle-rain-07-437321.mp3',
    thumbnail: '/music/thumbnails/nature-rain.jpg',
    mood: 'calm'
  },
  {
    id: 'relaxing-rain',
    name: 'Relaxing Rain',
    artist: 'Dragon Studio',
    category: 'nature',
    duration: '600', // 10 minutes
    url: '/music/dragon-studio-relaxing-rain-444802.mp3',
    thumbnail: '/music/thumbnails/nature-rain.jpg',
    mood: 'relax'
  },
  {
    id: 'calming-rain',
    name: 'Calming Rain',
    artist: 'Liecio',
    category: 'nature',
    duration: '240', // 4 minutes
    url: '/music/liecio-calming-rain-257596.mp3',
    thumbnail: '/music/thumbnails/nature-rain.jpg',
    mood: 'calm'
  }
];

// Music categories with icons
export const MUSIC_CATEGORIES = [
  { id: 'lofi', name: 'Lo-fi', icon: '🎧', description: 'هادئ ومناسب للدراسة' },
  { id: 'ambient', name: 'Ambient', icon: '🌌', description: 'موسيقى بيئية للتركيز' },
  { id: 'nature', name: 'Nature', icon: '🌿', description: 'أصوات الطبيعة المريحة' },
  { id: 'classical', name: 'Classical', icon: '🎼', description: 'موسيقى كلاسيكية هادئة' },
  { id: 'piano', name: 'Piano', icon: '🎹', description: 'بيانو منفرد للتركيز' },
  { id: 'radio', name: 'Radio', icon: '📻', description: 'إذاعات مباشرة' }
];

// Mood filters
export const MUSIC_MOODS = [
  { id: 'focus', name: 'تركيز', icon: '🎯' },
  { id: 'relax', name: 'استرخاء', icon: '😌' },
  { id: 'energetic', name: 'نشاط', icon: '⚡' },
  { id: 'calm', name: 'هدوء', icon: '🕊️' }
];

// Default music settings
export const DEFAULT_MUSIC_SETTINGS = {
  volume: 0.5, // 50% volume
  autoPlay: false,
  loop: true,
  fadeIn: true,
  fadeOut: true
};
