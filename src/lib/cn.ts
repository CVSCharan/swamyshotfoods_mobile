import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function to merge class names with tailwind-merge
 * Similar to shadcn/ui's cn utility
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
