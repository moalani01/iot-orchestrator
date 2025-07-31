import { useState, useCallback } from 'react';

export interface UseToggleReturn {
  isOn: boolean;
  toggle: () => void;
  turnOn: () => void;
  turnOff: () => void;
  setToggle: (value: boolean) => void;
}

export function useToggle(initialValue: boolean = false): UseToggleReturn {
  const [isOn, setIsOn] = useState(initialValue);

  const toggle = useCallback(() => setIsOn(prev => !prev), []);
  const turnOn = useCallback(() => setIsOn(true), []);
  const turnOff = useCallback(() => setIsOn(false), []);
  const setToggle = useCallback((value: boolean) => setIsOn(value), []);

  return { isOn, toggle, turnOn, turnOff, setToggle };
}