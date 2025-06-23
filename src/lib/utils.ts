import { type ClassValue, clsx } from 'clsx';

// Utility function for combining class names
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}

// Utility function for formatting numbers
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

// Utility function for calculating progress percentage
export function calculateProgress(current: number, total: number): number {
  return Math.min(Math.max((current / total) * 100, 0), 100);
}

// Utility function for getting gradient colors based on progress
export function getProgressColor(progress: number): string {
  if (progress >= 100) return 'from-green-500 to-emerald-500';
  if (progress >= 75) return 'from-blue-500 to-cyan-500';
  if (progress >= 50) return 'from-purple-500 to-blue-500';
  if (progress >= 25) return 'from-orange-500 to-yellow-500';
  return 'from-gray-500 to-gray-600';
}