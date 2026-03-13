'use client';

import crypto from 'crypto';

// Generate or retrieve a unique user account ID based on device
export function getAccountId(): string {
  if (typeof window === 'undefined') {
    return 'server-account';
  }

  // Check if account ID already exists in localStorage
  let accountId = localStorage.getItem('fahman_hub_account_id');
  
  if (!accountId) {
    // Generate a new unique account ID with hash key
    accountId = generateAccountId();
    localStorage.setItem('fahman_hub_account_id', accountId);
  }
  
  return accountId;
}

function generateAccountId(): string {
  // Create a unique hash based on device fingerprint
  const deviceFingerprint = createDeviceFingerprint();
  const hash = crypto.createHash('sha256').update(deviceFingerprint).digest('hex');
  const timestamp = Date.now().toString(36);
  
  return `user_${hash.substring(0, 16)}_${timestamp}`;
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
  if (typeof window === 'undefined') {
    return {
      accountId: 'server-account',
      username: 'Server User',
      email: 'server@fahman-hub.local',
      hashKey: 'server-hash',
      deviceInfo: {},
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    };
  }

  const accountId = getAccountId();
  
  // Check if account info exists
  let accountInfo = localStorage.getItem('fahman_hub_account_info');
  
  if (accountInfo) {
    const info = JSON.parse(accountInfo);
    // Update last login time
    info.lastLogin = new Date().toISOString();
    localStorage.setItem('fahman_hub_account_info', JSON.stringify(info));
    return info;
  }
  
  // Create new account info
  const hashKey = generateHashKey(accountId);
  const username = generateUsername(accountId);
  const email = `${username}@fahman.local`;
  
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
  
  localStorage.setItem('fahman_hub_account_info', JSON.stringify(info));
  
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
