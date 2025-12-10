import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, formatDistanceToNow, parseISO } from 'date-fns';

// ============================================
// CLASSNAME UTILITIES
// ============================================

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ============================================
// FORMATTING UTILITIES
// ============================================

/**
 * Format currency
 */
export function formatCurrency(
  amount: number | string,
  currency: string = 'USD'
): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
}

/**
 * Format percentage
 */
export function formatPercent(value: number | string, decimals: number = 1): string {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  // If value is already a decimal (e.g., 0.20), multiply by 100
  const percent = num <= 1 ? num * 100 : num;
  return `${percent.toFixed(decimals)}%`;
}

/**
 * Format large numbers with K/M/B suffixes
 */
export function formatNumber(num: number): string {
  if (num >= 1_000_000_000) {
    return `${(num / 1_000_000_000).toFixed(1)}B`;
  }
  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(1)}M`;
  }
  if (num >= 1_000) {
    return `${(num / 1_000).toFixed(1)}K`;
  }
  return num.toString();
}

/**
 * Format date
 */
export function formatDate(date: Date | string, formatStr: string = 'MMM d, yyyy'): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, formatStr);
}

/**
 * Format relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return formatDistanceToNow(d, { addSuffix: true });
}

// ============================================
// COMMISSION UTILITIES
// ============================================

/**
 * Calculate bonus commission rate
 */
export function calculateBonusRate(aaRate: number, openCollabRate: number): number {
  return Math.max(0, aaRate - openCollabRate);
}

/**
 * Calculate commission amount
 */
export function calculateCommission(orderAmount: number, commissionRate: number): number {
  return orderAmount * commissionRate;
}

/**
 * Get commission tier label
 */
export function getCommissionTier(bonusRate: number): {
  label: string;
  color: string;
} {
  if (bonusRate >= 0.08) {
    return { label: 'Premium', color: 'text-aa-gold' };
  }
  if (bonusRate >= 0.05) {
    return { label: 'High', color: 'text-aa-success' };
  }
  if (bonusRate >= 0.03) {
    return { label: 'Standard', color: 'text-aa-orange' };
  }
  return { label: 'Basic', color: 'text-white/60' };
}

// ============================================
// VALIDATION UTILITIES
// ============================================

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate TikTok username
 */
export function isValidTikTokUsername(username: string): boolean {
  // TikTok usernames: 2-24 characters, alphanumeric, underscores, periods
  const usernameRegex = /^[a-zA-Z0-9_.]{2,24}$/;
  return usernameRegex.test(username);
}

// ============================================
// DEEP LINK UTILITIES
// ============================================

/**
 * Generate TikTok Shop product deep link
 */
export function generateProductDeepLink(productId: string): string {
  return `snssdk1233://product/detail?product_id=${productId}`;
}

/**
 * Generate TikTok Shop add to showcase URL
 */
export function generateAddToShowcaseUrl(productId: string): string {
  // This opens the product in TikTok where creators can add to showcase
  return `https://www.tiktok.com/view/product/${productId}`;
}

// ============================================
// STRING UTILITIES
// ============================================

/**
 * Truncate string with ellipsis
 */
export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
}

/**
 * Generate random string (for state tokens, etc.)
 */
export function generateRandomString(length: number = 32): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Generate secure random hex string
 */
export function generateSecureToken(bytes: number = 32): string {
  if (typeof window === 'undefined') {
    // Server-side
    const crypto = require('crypto');
    return crypto.randomBytes(bytes).toString('hex');
  } else {
    // Client-side
    const array = new Uint8Array(bytes);
    crypto.getRandomValues(array);
    return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
  }
}

// ============================================
// ARRAY UTILITIES
// ============================================

/**
 * Chunk array into smaller arrays
 */
export function chunkArray<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

/**
 * Remove duplicates from array by key
 */
export function uniqueBy<T>(array: T[], key: keyof T): T[] {
  const seen = new Set();
  return array.filter((item) => {
    const k = item[key];
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

// ============================================
// API RESPONSE UTILITIES
// ============================================

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export function successResponse<T>(data: T, message?: string): ApiResponse<T> {
  return {
    success: true,
    data,
    message,
  };
}

export function errorResponse(error: string): ApiResponse {
  return {
    success: false,
    error,
  };
}

// ============================================
// RATE LIMITING UTILITIES
// ============================================

/**
 * Simple sleep function for rate limiting
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Retry with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: Error | undefined;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (attempt < maxRetries - 1) {
        const delay = baseDelay * Math.pow(2, attempt);
        await sleep(delay);
      }
    }
  }
  
  throw lastError;
}
