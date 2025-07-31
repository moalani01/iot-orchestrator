import { useState, useCallback } from 'react';
import { FeedbackMessage } from '@/types/iot';
import { CONFIG } from '@/config/constants';
import { limitFeedbackMessages } from '@/utils/feedbackHelpers';

export interface UseFeedbackReturn {
  messages: FeedbackMessage[];
  addMessage: (message: FeedbackMessage) => void;
  clearMessages: () => void;
  messageCount: number;
}

export function useFeedback(): UseFeedbackReturn {
  const [messages, setMessages] = useState<FeedbackMessage[]>([]);

  const addMessage = useCallback((message: FeedbackMessage) => {
    setMessages(prev => limitFeedbackMessages(
      [message, ...prev], 
      CONFIG.SIMULATION.MAX_FEEDBACK_MESSAGES
    ));
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    addMessage,
    clearMessages,
    messageCount: messages.length
  };
}