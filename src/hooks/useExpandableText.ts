import { useState } from 'react';

export function useExpandableText() {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleExpansion = (itemId: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const isExpanded = (itemId: string) => expandedItems.has(itemId);

  return { isExpanded, toggleExpansion };
}

export const shouldTruncateText = (text: string, maxLength: number = 60): boolean => {
  return text.length > maxLength;
};

export const getTruncatedText = (text: string, maxLength: number = 100): string => {
  return text.substring(0, maxLength) + '...';
};