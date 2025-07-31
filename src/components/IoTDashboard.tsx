import React, { useState, useCallback } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useConnectionStatus } from '@/hooks/useConnectionStatus';
import { useFeedback } from '@/hooks/useFeedback';
import { useMessageSender } from '@/hooks/useMessageSender';
import { MESSAGE_TYPES } from '@/constants/messageTypes';
import { FeedbackMessage } from '@/types/iot';
import { createFeedbackMessage } from '@/utils/feedbackHelpers';
import { CONFIG } from '@/config/constants';

import { DashboardHeader } from './DashboardHeader';
import { MessageTypeList } from './MessageTypeList';
import { ConfigurationForm } from './ConfigurationForm';
import { FeedbackDisplay } from './FeedbackDisplay';

const IoTDashboard: React.FC = () => {
  // State Management
  const [selectedMessageType, setSelectedMessageType] = useState<string>('');
  const [formData, setFormData] = useLocalStorage<Record<string, any>>(
    CONFIG.STORAGE_KEYS.IOT_CONFIG_DATA, 
    {}
  );

  // Custom Hooks
  const isConnected = useConnectionStatus();
  const { messages: feedbackMessages, addMessage: addFeedbackMessage } = useFeedback();

  // Derived State
  const currentMessageType = MESSAGE_TYPES.find(mt => mt.id === selectedMessageType);

  // Event Handlers
  const handleFieldChange = useCallback((fieldName: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
  }, [setFormData]);

  const handleSuccessResponse = useCallback((response: any) => {
    const feedbackMessage = createFeedbackMessage(
      response.type,
      response.message,
      response.details
    );
    addFeedbackMessage(feedbackMessage);
  }, [addFeedbackMessage]);

  const handleErrorResponse = useCallback((errorMessage: FeedbackMessage) => {
    addFeedbackMessage(errorMessage);
  }, [addFeedbackMessage]);

  // Message Sender Hook
  const { sendMessage } = useMessageSender(handleSuccessResponse, handleErrorResponse);

  const handleSendMessage = useCallback(async () => {
    if (!currentMessageType) return;
    await sendMessage(currentMessageType, formData);
  }, [currentMessageType, formData, sendMessage]);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <DashboardHeader isConnected={isConnected} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <MessageTypeList
            messageTypes={MESSAGE_TYPES}
            selectedMessageType={selectedMessageType}
            onSelectMessageType={setSelectedMessageType}
          />

          <ConfigurationForm
            currentMessageType={currentMessageType}
            formData={formData}
            isConnected={isConnected}
            onFieldChange={handleFieldChange}
            onSendMessage={handleSendMessage}
          />

          <FeedbackDisplay
            feedbackMessages={feedbackMessages}
          />
        </div>
      </div>
    </div>
  );
};

export default IoTDashboard;