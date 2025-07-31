import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useConnectionStatus } from '@/hooks/useConnectionStatus';
import { MESSAGE_TYPES } from '@/constants/messageTypes';
import { FeedbackMessage } from '@/types/iot';
import { simulateZmqCommunication, createMessagePayload } from '@/utils/messageSimulation';
import { DashboardHeader } from './DashboardHeader';
import { MessageTypeList } from './MessageTypeList';
import { ConfigurationForm } from './ConfigurationForm';
import { FeedbackDisplay } from './FeedbackDisplay';

const IoTDashboard: React.FC = () => {
  const [selectedMessageType, setSelectedMessageType] = useState<string>('');
  const [formData, setFormData] = useLocalStorage<Record<string, any>>('iot-config-data', {});
  const [feedbackMessages, setFeedbackMessages] = useState<FeedbackMessage[]>([]);
  const isConnected = useConnectionStatus();
  const { toast } = useToast();

  const currentMessageType = MESSAGE_TYPES.find(mt => mt.id === selectedMessageType);

  const handleFieldChange = (fieldName: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  const validateRequiredFields = (): string[] => {
    if (!currentMessageType) return [];
    
    const requiredFields = currentMessageType.fields.filter(field => field.required);
    return requiredFields
      .filter(field => !formData[field.name])
      .map(field => field.label);
  };

  const addFeedbackMessage = (message: FeedbackMessage) => {
    setFeedbackMessages(prev => [message, ...prev.slice(0, 9)]);
  };

  const handleSendMessage = async () => {
    if (!currentMessageType) return;

    const missingFields = validateRequiredFields();
    if (missingFields.length > 0) {
      toast({
        variant: "destructive",
        title: "Missing Required Fields",
        description: `Please fill in: ${missingFields.join(', ')}`
      });
      return;
    }

    const payload = createMessagePayload(selectedMessageType, formData, currentMessageType);

    toast({
      title: "Sending Configuration",
      description: "Processing your request...",
    });

    try {
      const response = await simulateZmqCommunication(payload);
      
      const feedbackMessage: FeedbackMessage = {
        id: Date.now().toString(),
        timestamp: new Date(),
        type: response.type,
        message: response.message,
        details: response.details
      };

      addFeedbackMessage(feedbackMessage);

      toast({
        variant: response.type === 'error' ? 'destructive' : response.type === 'success' ? 'success' : 'info',
        title: response.type === 'success' ? 'Success' : response.type === 'error' ? 'Error' : 'Info',
        description: response.message
      });

    } catch (error) {
      const errorMessage: FeedbackMessage = {
        id: Date.now().toString(),
        timestamp: new Date(),
        type: 'error',
        message: 'Communication failed',
        details: 'Unable to reach IoT device'
      };

      addFeedbackMessage(errorMessage);
      
      toast({
        variant: "destructive",
        title: "Communication Error",
        description: "Failed to send configuration to device"
      });
    }
  };

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