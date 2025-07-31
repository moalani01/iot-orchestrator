export const CONFIG = {
  STORAGE_KEYS: {
    IOT_CONFIG_DATA: 'iot-config-data',
    UI_PREFERENCES: 'ui-preferences'
  },
  
  SIMULATION: {
    MIN_DELAY: 1000,
    MAX_DELAY: 3000,
    CONNECTION_CHECK_INTERVAL: 5000,
    CONNECTION_SUCCESS_RATE: 0.9,
    MAX_FEEDBACK_MESSAGES: 10
  },
  
  TEXT: {
    MAX_DESCRIPTION_LENGTH: 60,
    MAX_TRUNCATE_LENGTH: 100
  },
  
  VALIDATION: {
    REQUIRED_FIELD_ERROR: 'Missing Required Fields',
    COMMUNICATION_ERROR: 'Communication Error',
    SENDING_TITLE: 'Sending Configuration',
    SENDING_DESCRIPTION: 'Processing your request...'
  }
} as const;