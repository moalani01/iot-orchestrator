import { SimulationResponse, MessagePayload } from '@/types/iot';

interface SimulationScenario {
  type: 'success' | 'error' | 'info';
  message: string;
  details?: string;
  probability: number;
}

const SIMULATION_SCENARIOS: SimulationScenario[] = [
  { type: 'success', message: 'Configuration applied successfully', probability: 0.4 },
  { 
    type: 'success', 
    message: 'Advanced configuration profile activated successfully', 
    details: 'The new configuration has been applied to all connected sensors. The system has automatically optimized power consumption settings, updated communication protocols to use the latest security standards, and synchronized all device clocks. All subsystems are now operating at peak efficiency with enhanced monitoring capabilities enabled.', 
    probability: 0.2 
  },
  { type: 'error', message: 'Failed to apply configuration', details: 'Invalid sensor type for current firmware', probability: 0.1 },
  { 
    type: 'error', 
    message: 'Critical configuration error detected', 
    details: 'The configuration could not be applied due to multiple compatibility issues. The selected communication protocol is not supported by the current firmware version (v2.1.3). Additionally, the power management settings conflict with the hardware specifications of the connected sensors. Please update the firmware to version 2.2.0 or higher, verify sensor compatibility, and ensure all network requirements are met before attempting to apply this configuration again.', 
    probability: 0.1 
  },
  { type: 'info', message: 'Configuration queued for processing', details: 'Device is currently busy, will apply when available', probability: 0.1 },
  { 
    type: 'info', 
    message: 'Partial configuration applied with warnings', 
    details: 'The configuration has been partially applied to your IoT device network. While most settings were successfully updated, some advanced features could not be activated due to current system limitations. The temperature sensors have been configured with the new sampling rate, communication protocols have been updated, and power management is now optimized. However, the redundancy backup system and advanced encryption features are pending due to insufficient memory allocation. These features will be automatically enabled once the next system maintenance cycle completes, which is scheduled for the next 24-hour period.', 
    probability: 0.1 
  }
];

export const simulateZmqCommunication = async (payload: MessagePayload): Promise<SimulationResponse> => {
  // Simulate network delay
  const delay = 1000 + Math.random() * 2000;
  await new Promise(resolve => setTimeout(resolve, delay));
  
  const random = Math.random();
  let cumulative = 0;
  
  for (const scenario of SIMULATION_SCENARIOS) {
    cumulative += scenario.probability;
    if (random <= cumulative) {
      return {
        type: scenario.type,
        message: scenario.message,
        details: scenario.details
      };
    }
  }

  return SIMULATION_SCENARIOS[0]; // fallback
};

export const createMessagePayload = (messageType: string, formData: Record<string, any>, messageTypeConfig: any): MessagePayload => ({
  messageType,
  timestamp: new Date().toISOString(),
  data: messageTypeConfig.fields.reduce((acc: Record<string, any>, field: any) => ({
    ...acc,
    [field.name]: formData[field.name] ?? field.defaultValue
  }), {})
});