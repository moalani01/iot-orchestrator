import { useState, useCallback } from 'react';

export interface UseSetReturn<T> {
  items: Set<T>;
  add: (item: T) => void;
  remove: (item: T) => void;
  toggle: (item: T) => void;
  has: (item: T) => boolean;
  clear: () => void;
  size: number;
}

export function useSet<T>(initialItems: T[] = []): UseSetReturn<T> {
  const [items, setItems] = useState<Set<T>>(new Set(initialItems));

  const add = useCallback((item: T) => {
    setItems(prev => new Set(prev).add(item));
  }, []);

  const remove = useCallback((item: T) => {
    setItems(prev => {
      const newSet = new Set(prev);
      newSet.delete(item);
      return newSet;
    });
  }, []);

  const toggle = useCallback((item: T) => {
    setItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(item)) {
        newSet.delete(item);
      } else {
        newSet.add(item);
      }
      return newSet;
    });
  }, []);

  const has = useCallback((item: T) => items.has(item), [items]);

  const clear = useCallback(() => setItems(new Set()), []);

  return { items, add, remove, toggle, has, clear, size: items.size };
}