import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { ThemeToggle } from '@/components/theme-toggle';
import { Settings, Send, Activity, CheckCircle, XCircle, Clock } from 'lucide-react';

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
  type: 'success' | 'error' | 'info';
  message: string;
  details?: string;
}

const messageTypes: MessageType[] = [
  {
    id: 'sensor_config',
    name: 'Sensor Configuration',
    description: 'Configure sensor parameters and sampling rates',
    fields: [
      { name: 'sensor_type', label: 'Sensor Type', type: 'dropdown', options: ['Temperature', 'Humidity', 'Pressure', 'Light'], required: true },
      { name: 'sample_rate', label: 'Sample Rate (Hz)', type: 'number', required: true, defaultValue: 1 },
      { name: 'enabled', label: 'Sensor Enabled', type: 'boolean', defaultValue: true },
      { name: 'calibration_mode', label: 'Calibration Mode', type: 'radio', options: ['Auto', 'Manual', 'Factory'], defaultValue: 'Auto' }
    ]
  },
  {
    id: 'communication',
    name: 'Communication Settings',
    description: 'Configure network and communication parameters',
    fields: [
      { name: 'protocol', label: 'Protocol', type: 'dropdown', options: ['WiFi', 'Bluetooth', 'LoRa', 'Ethernet'], required: true },
      { name: 'network_name', label: 'Network Name', type: 'text', required: true },
      { name: 'network_password', label: 'Network Password', type: 'text', required: false },
      { name: 'encryption', label: 'Encryption Enabled', type: 'boolean', defaultValue: true },
      { name: 'encryption_type', label: 'Encryption Type', type: 'dropdown', options: ['WPA2', 'WPA3', 'WEP', 'Open'], defaultValue: 'WPA2' },
      { name: 'retry_attempts', label: 'Retry Attempts', type: 'number', defaultValue: 3 },
      { name: 'timeout_duration', label: 'Timeout Duration (seconds)', type: 'number', defaultValue: 30 },
      { name: 'keep_alive_interval', label: 'Keep Alive Interval (seconds)', type: 'number', defaultValue: 60 },
      { name: 'auto_reconnect', label: 'Auto Reconnect', type: 'boolean', defaultValue: true },
      { name: 'connection_priority', label: 'Connection Priority', type: 'radio', options: ['High', 'Medium', 'Low'], defaultValue: 'Medium' },
      { name: 'data_compression', label: 'Data Compression', type: 'boolean', defaultValue: false },
      { name: 'compression_level', label: 'Compression Level', type: 'dropdown', options: ['None', 'Low', 'Medium', 'High'], defaultValue: 'None' },
      { name: 'buffer_size', label: 'Buffer Size (KB)', type: 'number', defaultValue: 1024 },
      { name: 'max_packet_size', label: 'Max Packet Size (bytes)', type: 'number', defaultValue: 1500 },
      { name: 'bandwidth_limit', label: 'Bandwidth Limit (Mbps)', type: 'number', defaultValue: 100 },
      { name: 'quality_of_service', label: 'Quality of Service', type: 'dropdown', options: ['Best Effort', 'Assured Forwarding', 'Expedited Forwarding'], defaultValue: 'Best Effort' },
      { name: 'error_correction', label: 'Error Correction', type: 'boolean', defaultValue: true },
      { name: 'redundancy_enabled', label: 'Redundancy Enabled', type: 'boolean', defaultValue: false },
      { name: 'backup_protocol', label: 'Backup Protocol', type: 'dropdown', options: ['None', 'Cellular', 'Satellite', 'LoRa'], defaultValue: 'None' },
      { name: 'firewall_enabled', label: 'Firewall Enabled', type: 'boolean', defaultValue: true },
      { name: 'port_range_start', label: 'Port Range Start', type: 'number', defaultValue: 1024 },
      { name: 'port_range_end', label: 'Port Range End', type: 'number', defaultValue: 65535 },
      { name: 'security_level', label: 'Security Level', type: 'radio', options: ['Basic', 'Enhanced', 'Maximum'], defaultValue: 'Enhanced' }
    ]
  },
  {
    id: 'power_management',
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
        details: response.details
      };

      setFeedbackMessages(prev => [feedbackMessage, ...prev.slice(0, 9)]); // Keep last 10 messages

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

  const getFeedbackIcon = (type: 'success' | 'error' | 'info') => {
    switch (type) {
      case 'success': return <CheckCircle className="w-4 h-4 text-success" />;
      case 'error': return <XCircle className="w-4 h-4 text-destructive" />;
      case 'info': return <Clock className="w-4 h-4 text-info" />;
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Settings className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold text-foreground">IoT Device Configuration</h1>
              <p className="text-muted-foreground">Configure and manage your IoT device settings</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Activity className={`w-5 h-5 ${isConnected ? 'text-success' : 'text-destructive'}`} />
              <Badge variant={isConnected ? 'default' : 'destructive'}>
                {isConnected ? 'Connected' : 'Disconnected'}
              </Badge>
            </div>
            <ThemeToggle />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Message Type Selection */}
          <Card className="lg:col-span-1 h-[600px] flex flex-col">
            <CardHeader>
              <CardTitle>Message Types</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden">
              <ScrollArea className="h-full">
                <div className="space-y-3 pr-4">
                  {messageTypes.map(messageType => (
                    <Button
                      key={messageType.id}
                      variant={selectedMessageType === messageType.id ? 'default' : 'outline'}
                      className="w-full justify-start text-left h-auto p-4"
                      onClick={() => setSelectedMessageType(messageType.id)}
                    >
                      <div>
                        <div className="font-medium">{messageType.name}</div>
                        <div className="text-sm text-muted-foreground mt-1">
                          {messageType.description}
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Configuration Form */}
          <Card className="lg:col-span-1 h-[600px] flex flex-col">
            <CardHeader>
              <CardTitle>
                {currentMessageType ? currentMessageType.name : 'Select Message Type'}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col overflow-hidden">
              {currentMessageType ? (
                <>
                  {/* Scrollable Fields */}
                  <div className="flex-1 min-h-0">
                    <ScrollArea className="h-full">
                      <div className="space-y-4 pr-4">
                        {currentMessageType.fields.map(field => (
                          <div key={field.name} className="space-y-2">
                            <Label className="text-sm font-medium">
                              {field.label}
                              {field.required && <span className="text-destructive ml-1">*</span>}
                            </Label>
                            {renderField(field)}
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                  
                  {/* Fixed Send Button */}
                  <div className="pt-4 border-t mt-4 flex-shrink-0">
                    <Button 
                      onClick={handleSendMessage}
                      className="w-full"
                      disabled={!isConnected}
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Send Configuration
                    </Button>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-muted-foreground">
                  Please select a message type to configure
                </div>
              )}
            </CardContent>
          </Card>

          {/* Feedback Display */}
          <Card className="lg:col-span-1 h-[600px] flex flex-col">
            <CardHeader>
              <CardTitle>Device Feedback</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden">
              <ScrollArea className="h-full">
                {feedbackMessages.length > 0 ? (
                  <div className="space-y-3 pr-4">
                    {feedbackMessages.map(feedback => (
                      <div key={feedback.id} className="p-3 border rounded-lg">
                        <div className="flex items-start gap-3">
                          {getFeedbackIcon(feedback.type)}
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium">{feedback.message}</div>
                            {feedback.details && (
                              <div className="text-xs text-muted-foreground mt-1">
                                {feedback.details}
                              </div>
                            )}
                            <div className="text-xs text-muted-foreground mt-2">
                              {feedback.timestamp.toLocaleTimeString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-muted-foreground">
                    No feedback messages yet. Send a configuration to see device responses.
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default IoTDashboard;