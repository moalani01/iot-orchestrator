import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { useToast } from '@/hooks/use-toast';
import { Settings, Send } from 'lucide-react';
import { AppSidebar } from './AppSidebar';
import { DeviceFeedbackPanel } from './DeviceFeedbackPanel';
import { ThemeToggle } from './ThemeToggle';

interface MessageField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'dropdown' | 'boolean' | 'radio';
  options?: string[];
  required?: boolean;
  defaultValue?: any;
}

interface MessageType {
  id: string;
  name: string;
  description: string;
  fields: MessageField[];
}

interface FeedbackMessage {
  id: string;
  timestamp: Date;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  details?: string;
  configType?: string;
  configName?: string;
}

const messageTypes: MessageType[] = [
  {
    id: 'sensor-config',
    name: 'Sensor Configuration',
    description: 'Configure sensor parameters and sampling rates',
    fields: [
      { name: 'sensor_type', label: 'Sensor Type', type: 'dropdown', options: ['Temperature', 'Humidity', 'Pressure', 'Light', 'Motion', 'Sound', 'Air Quality'], required: true },
      { name: 'sample_rate', label: 'Sample Rate (Hz)', type: 'number', required: true, defaultValue: 1 },
      { name: 'enabled', label: 'Sensor Enabled', type: 'boolean', defaultValue: true },
      { name: 'calibration_mode', label: 'Calibration Mode', type: 'radio', options: ['Auto', 'Manual', 'Factory'], defaultValue: 'Auto' },
      { name: 'precision', label: 'Precision Level', type: 'dropdown', options: ['Low', 'Medium', 'High', 'Ultra'], defaultValue: 'Medium' },
      { name: 'threshold_min', label: 'Minimum Threshold', type: 'number', defaultValue: 0 },
      { name: 'threshold_max', label: 'Maximum Threshold', type: 'number', defaultValue: 100 },
      { name: 'data_format', label: 'Data Format', type: 'radio', options: ['JSON', 'CSV', 'Binary', 'XML'], defaultValue: 'JSON' },
      { name: 'compression', label: 'Enable Data Compression', type: 'boolean', defaultValue: false },
      { name: 'buffer_size', label: 'Buffer Size (KB)', type: 'number', defaultValue: 64 },
      { name: 'auto_scaling', label: 'Auto Scaling', type: 'boolean', defaultValue: true },
      { name: 'filter_type', label: 'Signal Filter', type: 'dropdown', options: ['None', 'Low Pass', 'High Pass', 'Band Pass', 'Notch'], defaultValue: 'Low Pass' },
      { name: 'alert_enabled', label: 'Enable Alerts', type: 'boolean', defaultValue: true },
      { name: 'alert_email', label: 'Alert Email', type: 'text', defaultValue: '' },
      { name: 'logging_level', label: 'Logging Level', type: 'radio', options: ['Debug', 'Info', 'Warning', 'Error'], defaultValue: 'Info' }
    ]
  },
  {
    id: 'communication',
    name: 'Communication Settings',
    description: 'Configure network and communication parameters',
    fields: [
      { name: 'protocol', label: 'Protocol', type: 'dropdown', options: ['WiFi', 'Bluetooth', 'LoRa', 'Ethernet'], required: true },
      { name: 'network_name', label: 'Network Name', type: 'text', required: true },
      { name: 'encryption', label: 'Encryption Enabled', type: 'boolean', defaultValue: true },
      { name: 'retry_attempts', label: 'Retry Attempts', type: 'number', defaultValue: 3 }
    ]
  },
  {
    id: 'power',
    name: 'Power Management',
    description: 'Configure power saving and battery settings',
    fields: [
      { name: 'power_mode', label: 'Power Mode', type: 'radio', options: ['Performance', 'Balanced', 'Power Save'], defaultValue: 'Balanced' },
      { name: 'sleep_timeout', label: 'Sleep Timeout (minutes)', type: 'number', defaultValue: 10 },
      { name: 'wake_on_motion', label: 'Wake on Motion', type: 'boolean', defaultValue: false },
      { name: 'battery_threshold', label: 'Low Battery Threshold (%)', type: 'number', defaultValue: 20 }
    ]
  }
];

const IoTDashboard: React.FC = () => {
  const [selectedMessageType, setSelectedMessageType] = useState<string>('');
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [feedbackMessages, setFeedbackMessages] = useState<FeedbackMessage[]>([]);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const { toast } = useToast();

  // Load saved data from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('iot-config-data');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setFormData(parsed);
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    }

    // Simulate connection status
    const connectionTimer = setInterval(() => {
      setIsConnected(Math.random() > 0.1); // 90% connection rate
    }, 5000);

    return () => clearInterval(connectionTimer);
  }, []);

  // Save data to localStorage whenever formData changes
  useEffect(() => {
    localStorage.setItem('iot-config-data', JSON.stringify(formData));
  }, [formData]);

  const currentMessageType = messageTypes.find(mt => mt.id === selectedMessageType);

  const handleFieldChange = (fieldName: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  const simulateZmqCommunication = async (data: any) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    // Simulate various response scenarios
    const scenarios = [
      { type: 'success', message: 'Configuration applied successfully', probability: 0.7 },
      { type: 'error', message: 'Failed to apply configuration', details: 'Invalid sensor type for current firmware', probability: 0.2 },
      { type: 'info', message: 'Configuration queued for processing', details: 'Device is currently busy, will apply when available', probability: 0.1 }
    ];

    const random = Math.random();
    let cumulative = 0;
    
    for (const scenario of scenarios) {
      cumulative += scenario.probability;
      if (random <= cumulative) {
        return {
          type: scenario.type as 'success' | 'error' | 'info',
          message: scenario.message,
          details: scenario.details
        };
      }
    }

    return scenarios[0]; // fallback
  };

  const handleSendMessage = async () => {
    if (!currentMessageType) return;

    const requiredFields = currentMessageType.fields.filter(field => field.required);
    const missingFields = requiredFields.filter(field => !formData[field.name]);

    if (missingFields.length > 0) {
      toast({
        variant: "destructive",
        title: "Missing Required Fields",
        description: `Please fill in: ${missingFields.map(f => f.label).join(', ')}`
      });
      return;
    }

    // Create message payload
    const payload = {
      messageType: selectedMessageType,
      timestamp: new Date().toISOString(),
      data: currentMessageType.fields.reduce((acc, field) => ({
        ...acc,
        [field.name]: formData[field.name] ?? field.defaultValue
      }), {})
    };

    toast({
      title: "Sending Configuration",
      description: "Processing your request...",
    });

    try {
      const response = await simulateZmqCommunication(payload);
      
      const feedbackMessage: FeedbackMessage = {
        id: Date.now().toString(),
        timestamp: new Date(),
        type: response.type as 'success' | 'error' | 'info',
        message: response.message,
        details: response.details,
        configType: selectedMessageType,
        configName: currentMessageType?.name
      };

      setFeedbackMessages(prev => [feedbackMessage, ...prev.slice(0, 9)]); // Keep last 10 messages

      toast({
        variant: response.type === 'error' ? 'destructive' : 'default',
        title: response.type === 'success' ? 'Success' : response.type === 'error' ? 'Error' : 'Info',
        description: response.message
      });

    } catch (error) {
      const errorMessage: FeedbackMessage = {
        id: Date.now().toString(),
        timestamp: new Date(),
        type: 'error',
        message: 'Communication failed',
        details: 'Unable to reach IoT device',
        configType: selectedMessageType,
        configName: currentMessageType?.name
      };

      setFeedbackMessages(prev => [errorMessage, ...prev.slice(0, 9)]);
      
      toast({
        variant: "destructive",
        title: "Communication Error",
        description: "Failed to send configuration to device"
      });
    }
  };

  const renderField = (field: MessageField) => {
    const value = formData[field.name] ?? field.defaultValue;

    switch (field.type) {
      case 'text':
        return (
          <Input
            value={value || ''}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            placeholder={`Enter ${field.label.toLowerCase()}`}
          />
        );

      case 'number':
        return (
          <Input
            type="number"
            value={value || ''}
            onChange={(e) => handleFieldChange(field.name, parseFloat(e.target.value) || 0)}
            placeholder={`Enter ${field.label.toLowerCase()}`}
          />
        );

      case 'dropdown':
        return (
          <Select value={value || ''} onValueChange={(val) => handleFieldChange(field.name, val)}>
            <SelectTrigger>
              <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map(option => (
                <SelectItem key={option} value={option}>{option}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'boolean':
        return (
          <Switch
            checked={value || false}
            onCheckedChange={(checked) => handleFieldChange(field.name, checked)}
          />
        );

      case 'radio':
        return (
          <RadioGroup
            value={value || field.defaultValue}
            onValueChange={(val) => handleFieldChange(field.name, val)}
          >
            {field.options?.map(option => (
              <div key={option} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`${field.name}-${option}`} />
                <Label htmlFor={`${field.name}-${option}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        );

      default:
        return null;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar 
          messageTypes={messageTypes}
          selectedMessageType={selectedMessageType}
          onMessageTypeSelect={setSelectedMessageType}
          connectionStatus={isConnected}
        />
        
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="h-16 border-b border-border bg-gradient-to-r from-background to-card/50 backdrop-blur-sm">
            <div className="flex items-center justify-between h-full px-6">
              <div className="flex items-center gap-3">
                <SidebarTrigger />
                <Settings className="w-6 h-6 text-primary" />
                <div>
                  <h1 className="text-xl font-bold text-foreground">IoT Device Configuration</h1>
                </div>
              </div>
              <ThemeToggle />
            </div>
          </header>

          <div className="flex-1 flex">
            {/* Main Configuration Area */}
            <main className="flex-1 p-6 overflow-auto">
              <div className="max-w-2xl mx-auto">
                {currentMessageType ? (
                  <Card className="shadow-card">
                    <CardHeader className="pb-6">
                      <CardTitle className="text-2xl text-center">
                        {currentMessageType.name}
                      </CardTitle>
                      <p className="text-muted-foreground text-center">
                        {currentMessageType.description}
                      </p>
                    </CardHeader>
                    <CardContent className="space-y-6 max-h-[calc(100vh-16rem)] overflow-y-auto">
                      {currentMessageType.fields.map(field => (
                        <div key={field.name} className="space-y-3">
                          <Label className="text-sm font-semibold text-foreground">
                            {field.label}
                            {field.required && <span className="text-destructive ml-1">*</span>}
                          </Label>
                          <div className="bg-card/50 p-3 rounded-md border border-border">
                            {renderField(field)}
                          </div>
                        </div>
                      ))}
                      
                      <Separator className="my-8" />
                      
                      <div className="flex justify-center pb-6">
                        <Button 
                          onClick={handleSendMessage}
                          className="px-8 py-3 text-base font-medium shadow-glow"
                          disabled={!isConnected}
                          size="lg"
                        >
                          <Send className="w-5 h-5 mr-2" />
                          Send Configuration
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="shadow-card">
                    <CardContent className="py-16">
                      <div className="text-center space-y-4">
                        <Settings className="w-16 h-16 text-muted-foreground mx-auto opacity-50" />
                        <h3 className="text-xl font-semibold text-foreground">
                          Select Configuration Type
                        </h3>
                        <p className="text-muted-foreground max-w-md mx-auto">
                          Choose a configuration type from the sidebar to start configuring your IoT device settings.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </main>

            {/* Device Feedback Panel */}
            <DeviceFeedbackPanel feedbackMessages={feedbackMessages} />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default IoTDashboard;