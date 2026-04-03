'use client';

import crypto from 'crypto';

// Generate or retrieve a unique user account ID based on device
export function getAccountId(): string {
  if (typeof window === 'undefined') {
    return 'server-account';
  }
  
  // Try to get from localStorage first
  let accountId = localStorage.getItem('fahman_hub_account_id');
  
  if (!accountId) {
    // Try session storage (for private browsing)
    try {
      accountId = sessionStorage.getItem('fahman_hub_account_id');
    } catch (error) {
      // Session storage not available
    }
  }
  
  if (!accountId) {
    // Generate a new unique account ID with hash key
    accountId = generateAccountId();
    
    // Try to save to localStorage
    try {
      localStorage.setItem('fahman_hub_account_id', accountId);
    } catch (error) {
      // Private browsing mode, try session storage
      try {
        sessionStorage.setItem('fahman_hub_account_id', accountId);
      } catch (sessionError) {
        // Using in-memory account ID for private browsing
      }
    }
  }
  
  return accountId;
}

function generateAccountId(): string {
  try {
    // Create a unique hash based on device fingerprint
    const deviceFingerprint = createDeviceFingerprint();
    
    const hash = crypto.createHash('sha256').update(deviceFingerprint).digest('hex');
    
    // Use a more stable account ID format without timestamp for consistency
    const accountId = `user_${hash.substring(0, 16)}`;
    return accountId;
  } catch (error) {
    // Fallback for private browsing or restricted environments
    // Try to get from sessionStorage first for consistency
    if (typeof window !== 'undefined' && window.sessionStorage) {
      try {
        const existingFallbackId = sessionStorage.getItem('fahman_hub_fallback_account_id');
        if (existingFallbackId) {
          return existingFallbackId;
        }
      } catch (e) {
        // Session storage not accessible
      }
    }
    
    // Generate new fallback ID only if needed
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    const fallbackId = `fallback_${timestamp}_${random}`;
    
    // Save fallback ID to sessionStorage for consistency
    if (typeof window !== 'undefined' && window.sessionStorage) {
      try {
        sessionStorage.setItem('fahman_hub_fallback_account_id', fallbackId);
      } catch (e) {
        // Could not save fallback ID to sessionStorage
      }
    }
    
    return fallbackId;
  }
}

function createDeviceFingerprint(): string {
  if (typeof window === 'undefined') {
    return 'server-fingerprint';
  }

  // Collect device information for fingerprinting
  const fingerprint = [
    navigator.userAgent,
    navigator.language,
    navigator.platform,
    screen.width + 'x' + screen.height,
    screen.colorDepth,
    new Date().getTimezoneOffset(),
    navigator.hardwareConcurrency || 'unknown',
    (navigator as any).deviceMemory || 'unknown'
  ].join('|');

  return fingerprint;
}

// Get account info for user identification
export function getAccountInfo(): {
  accountId: string;
  username: string;
  email: string;
  hashKey: string;
  deviceInfo: any;
  createdAt: string;
  lastLogin: string;
} {
  const accountId = getAccountId();
  const isFallback = accountId.startsWith('fallback_');
  
  // Check if account info exists
  let accountInfo = localStorage.getItem('fahman_hub_account_info');
  
  if (accountInfo) {
    const info = JSON.parse(accountInfo);
    // Update last login time
    info.lastLogin = new Date().toISOString();
    try {
      localStorage.setItem('fahman_hub_account_info', JSON.stringify(info));
    } catch (error) {
      // Failed to update localStorage
    }
    return info;
  }
  
  // Create new account info
  let hashKey, username, email;
  
  if (isFallback) {
    // Fallback account for private browsing
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    hashKey = `fallback_${timestamp}`;
    username = `PrivateUser${random}`;
    email = `private${random}@fahman.local`;
  } else {
    // Regular account
    hashKey = generateHashKey(accountId);
    username = generateUsername(accountId);
    email = `${username}@fahman.local`;
  }
  
  const info = {
    accountId,
    username,
    email,
    hashKey,
    deviceInfo: {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language || 'ar',
      screen: `${screen.width}x${screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    },
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString()
  };
  
  // Try to save to localStorage, but handle private browsing gracefully
  try {
    localStorage.setItem('fahman_hub_account_info', JSON.stringify(info));
  } catch (error) {
    // Fallback to session storage for private browsing
    try {
      sessionStorage.setItem('fahman_hub_account_info', JSON.stringify(info));
    } catch (sessionError) {
      // Using in-memory storage only
    }
  }
  
  return info;
}

function generateHashKey(accountId: string): string {
  // Generate a unique hash key for the account
  const timestamp = Date.now();
  const random = Math.random().toString(36);
  const combined = `${accountId}_${timestamp}_${random}`;
  
  return crypto.createHash('sha256').update(combined).digest('hex').substring(0, 32);
}

function generateUsername(accountId: string): string {
  // Generate a friendly username based on account ID
  const adjectives = ['Smart', 'Creative', 'Focused', 'Dedicated', 'Productive', 'Brilliant', 'Motivated', 'Disciplined'];
  const nouns = ['Learner', 'Student', 'Scholar', 'Master', 'Expert', 'Genius', 'Champion', 'Achiever'];
  
  const randomIndex = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash + str.charCodeAt(i)) & 0xffffffff;
    }
    return Math.abs(hash);
  };
  
  const hash = randomIndex(accountId);
  const adjective = adjectives[hash % adjectives.length];
  const noun = nouns[Math.floor(hash / adjectives.length) % nouns.length];
  const number = (hash % 9999) + 1;
  
  return `${adjective}${noun}${number}`;
}

// Legacy functions for backward compatibility
export function getDeviceId(): string {
  return getAccountId();
}

export function getDeviceInfo() {
  return getAccountInfo();
}
