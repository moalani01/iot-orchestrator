import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { CONFIG } from '@/config/constants';
import { MessageType } from '@/types/iot';
import { ValidationResult, validateFormData } from '@/utils/validation';
import { simulateZmqCommunication, createMessagePayload } from '@/utils/messageSimulation';
import { createErrorMessage } from '@/utils/feedbackHelpers';

export interface UseMessageSenderReturn {
  sendMessage: (
    messageType: MessageType,
    formData: Record<string, any>
  ) => Promise<void>;
  isValidForm: (
    messageType: MessageType,
    formData: Record<string, any>
  ) => ValidationResult;
}

export function useMessageSender(
  onSuccess: (response: any) => void,
  onError: (error: any) => void
): UseMessageSenderReturn {
  const { toast } = useToast();

  const isValidForm = useCallback((
    messageType: MessageType,
    formData: Record<string, any>
  ): ValidationResult => {
    return validateFormData(messageType.fields, formData);
  }, []);

  const sendMessage = useCallback(async (
    messageType: MessageType,
    formData: Record<string, any>
  ) => {
    const validation = isValidForm(messageType, formData);
    
    if (!validation.isValid) {
      toast({
        variant: "destructive",
        title: CONFIG.VALIDATION.REQUIRED_FIELD_ERROR,
        description: `Please fill in: ${validation.missingFields.join(', ')}`
      });
      return;
    }

    const payload = createMessagePayload(messageType.id, formData, messageType);

    toast({
      title: CONFIG.VALIDATION.SENDING_TITLE,
      description: CONFIG.VALIDATION.SENDING_DESCRIPTION,
    });

    try {
      const response = await simulateZmqCommunication(payload);
      onSuccess(response);

      toast({
        variant: response.type === 'error' ? 'destructive' : response.type === 'success' ? 'success' : 'info',
        title: response.type === 'success' ? 'Success' : response.type === 'error' ? 'Error' : 'Info',
        description: response.message
      });

    } catch (error) {
      const errorMessage = createErrorMessage(
        'Communication failed',
        'Unable to reach IoT device'
      );
      
      onError(errorMessage);
      
      toast({
        variant: "destructive",
        title: CONFIG.VALIDATION.COMMUNICATION_ERROR,
        description: "Failed to send configuration to device"
      });
    }
  }, [toast, onSuccess, onError, isValidForm]);

  return { sendMessage, isValidForm };
}