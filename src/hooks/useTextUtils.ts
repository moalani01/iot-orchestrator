import { CONFIG } from '@/config/constants';

export interface TextUtilsReturn {
  shouldTruncate: (text: string, maxLength?: number) => boolean;
  truncateText: (text: string, maxLength?: number) => string;
  getDisplayText: (text: string, isExpanded: boolean, maxLength?: number) => string;
}

export function useTextUtils(): TextUtilsReturn {
  const shouldTruncate = (
    text: string, 
    maxLength: number = CONFIG.TEXT.MAX_DESCRIPTION_LENGTH
  ): boolean => {
    return text.length > maxLength;
  };

  const truncateText = (
    text: string, 
    maxLength: number = CONFIG.TEXT.MAX_TRUNCATE_LENGTH
  ): string => {
    return text.substring(0, maxLength) + '...';
  };

  const getDisplayText = (
    text: string,
    isExpanded: boolean,
    maxLength: number = CONFIG.TEXT.MAX_TRUNCATE_LENGTH
  ): string => {
    if (isExpanded || !shouldTruncate(text, maxLength)) {
      return text;
    }
    return truncateText(text, maxLength);
  };

  return { shouldTruncate, truncateText, getDisplayText };
}