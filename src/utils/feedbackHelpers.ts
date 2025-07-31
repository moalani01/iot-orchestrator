import { FeedbackMessage, FeedbackType } from '@/types/iot';

export const createFeedbackMessage = (
  type: FeedbackType,
  message: string,
  details?: string
): FeedbackMessage => ({
  id: Date.now().toString(),
  timestamp: new Date(),
  type,
  message,
  details
});

export const createErrorMessage = (message: string, details?: string): FeedbackMessage =>
  createFeedbackMessage('error', message, details);

export const createSuccessMessage = (message: string, details?: string): FeedbackMessage =>
  createFeedbackMessage('success', message, details);

export const createInfoMessage = (message: string, details?: string): FeedbackMessage =>
  createFeedbackMessage('info', message, details);

export const limitFeedbackMessages = (
  messages: FeedbackMessage[],
  maxCount: number
): FeedbackMessage[] => {
  return messages.slice(0, maxCount);
};