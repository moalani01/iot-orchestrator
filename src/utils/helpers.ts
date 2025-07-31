export const delay = (ms: number): Promise<void> => 
  new Promise(resolve => setTimeout(resolve, ms));

export const randomDelay = (min: number, max: number): Promise<void> =>
  delay(min + Math.random() * (max - min));

export const randomBool = (probability: number = 0.5): boolean =>
  Math.random() < probability;

export const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);

export const generateId = (): string => Date.now().toString();

export const isNonEmptyString = (value: any): value is string =>
  typeof value === 'string' && value.trim().length > 0;