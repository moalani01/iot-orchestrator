import { useCallback } from 'react';
import { useSet } from './useSet';

export interface UseExpandableReturn {
  isExpanded: (id: string) => boolean;
  toggleExpansion: (id: string) => void;
  expandAll: (ids: string[]) => void;
  collapseAll: () => void;
  expandedCount: number;
}

export function useExpandable(): UseExpandableReturn {
  const { items: expandedItems, toggle, clear, has, size } = useSet<string>();

  const isExpanded = useCallback((id: string) => has(id), [has]);

  const toggleExpansion = useCallback((id: string) => toggle(id), [toggle]);

  const expandAll = useCallback((ids: string[]) => {
    ids.forEach(id => toggle(id));
  }, [toggle]);

  const collapseAll = useCallback(() => clear(), [clear]);

  return {
    isExpanded,
    toggleExpansion,
    expandAll,
    collapseAll,
    expandedCount: size
  };
}