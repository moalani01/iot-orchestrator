export interface MessageField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'dropdown' | 'boolean' | 'radio';
  options?: string[];
  required?: boolean;
  defaultValue?: any;
}

export interface MessageType {
  id: string;
  name: string;
  description: string;
  fields: MessageField[];
}

export interface FeedbackMessage {
  id: string;
  timestamp: Date;
  type: 'success' | 'error' | 'info';
  message: string;
  details?: string;
}

export type FeedbackType = 'success' | 'error' | 'info';

export interface MessagePayload {
  messageType: string;
  timestamp: string;
  data: Record<string, any>;
}

export interface SimulationResponse {
  type: FeedbackType;
  message: string;
  details?: string;
}