
import { useState, useEffect } from "react"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { UnifiedSidebar } from "./UnifiedSidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

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
  id: string
  timestamp: Date
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
  details?: string
  configType?: string
  configName?: string
}

const messageTypes: MessageType[] = [
  {
    id: "sensor-config",
    name: "Sensor Configuration",
    description: "Configure sensor parameters and thresholds",
    fields: [
      { name: "sensorId", label: "Sensor ID", type: "text", required: true, defaultValue: "TEMP_01" },
      { name: "threshold", label: "Threshold", type: "number", required: true, defaultValue: 25 },
      { name: "unit", label: "Unit", type: "dropdown", options: ["Celsius", "Fahrenheit"], required: true, defaultValue: "Celsius" },
      { name: "enabled", label: "Enabled", type: "boolean", defaultValue: true },
      { name: "alertLevel", label: "Alert Level", type: "radio", options: ["Low", "Medium", "High"], defaultValue: "Medium" }
    ]
  },
  {
    id: "communication",
    name: "Communication Settings",
    description: "Configure network and communication parameters",
    fields: [
      { name: "protocol", label: "Protocol", type: "dropdown", options: ["MQTT", "HTTP", "CoAP"], required: true, defaultValue: "MQTT" },
      { name: "endpoint", label: "Endpoint", type: "text", required: true, defaultValue: "broker.example.com" },
      { name: "port", label: "Port", type: "number", required: true, defaultValue: 1883 },
      { name: "encryption", label: "Enable Encryption", type: "boolean", defaultValue: true }
    ]
  },
  {
    id: "power",
    name: "Power Management",
    description: "Configure power saving and battery settings",
    fields: [
      { name: "mode", label: "Power Mode", type: "radio", options: ["Performance", "Balanced", "Power Saver"], defaultValue: "Balanced" },
      { name: "sleepInterval", label: "Sleep Interval (minutes)", type: "number", defaultValue: 5 },
      { name: "wakeOnMotion", label: "Wake on Motion", type: "boolean", defaultValue: false }
    ]
  }
];

const IoTDashboard = () => {
  const [selectedMessageType, setSelectedMessageType] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [connectionStatus, setConnectionStatus] = useState(true)
  const [feedbackMessages, setFeedbackMessages] = useState<FeedbackMessage[]>([])
  const { toast } = useToast()

  useEffect(() => {
    const interval = setInterval(() => {
      setConnectionStatus(prev => !prev)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const handleMessageTypeSelect = (id: string) => {
    setSelectedMessageType(id)
    const messageType = messageTypes.find(type => type.id === id)
    if (messageType) {
      const initialData: Record<string, any> = {}
      messageType.fields.forEach(field => {
        initialData[field.name] = field.defaultValue
      })
      setFormData(initialData)
    }
  }

  const handleFieldChange = (fieldName: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }))
  }

  const handleSubmit = () => {
    if (!selectedMessageType) return
    
    const messageType = messageTypes.find(type => type.id === selectedMessageType)
    if (!messageType) return

    const newMessage: FeedbackMessage = {
      id: Date.now().toString(),
      timestamp: new Date(),
      type: Math.random() > 0.7 ? 'error' : 'success',
      message: `Configuration for ${messageType.name} has been ${Math.random() > 0.7 ? 'rejected' : 'applied successfully'}`,
      details: `Parameters: ${JSON.stringify(formData, null, 2)}`,
      configType: messageType.id,
      configName: messageType.name
    }

    setFeedbackMessages(prev => [newMessage, ...prev.slice(0, 19)])
    
    toast({
      title: "Configuration Sent",
      description: `${messageType.name} configuration has been sent to the device.`,
      variant: newMessage.type === 'error' ? 'destructive' : 'default'
    })
  }

  const renderField = (field: MessageField) => {
    const value = formData[field.name] || field.defaultValue

    switch (field.type) {
      case 'text':
        return (
          <Input
            value={value || ''}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            placeholder={field.label}
          />
        )
      case 'number':
        return (
          <Input
            type="number"
            value={value || ''}
            onChange={(e) => handleFieldChange(field.name, Number(e.target.value))}
            placeholder={field.label}
          />
        )
      case 'dropdown':
        return (
          <Select value={value} onValueChange={(val) => handleFieldChange(field.name, val)}>
            <SelectTrigger>
              <SelectValue placeholder={`Select ${field.label}`} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map(option => (
                <SelectItem key={option} value={option}>{option}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )
      case 'boolean':
        return (
          <Switch
            checked={value}
            onCheckedChange={(checked) => handleFieldChange(field.name, checked)}
          />
        )
      case 'radio':
        return (
          <RadioGroup value={value} onValueChange={(val) => handleFieldChange(field.name, val)}>
            {field.options?.map(option => (
              <div key={option} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={option} />
                <Label htmlFor={option}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        )
      default:
        return null
    }
  }

  const selectedMessage = messageTypes.find(type => type.id === selectedMessageType)

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gradient-to-br from-background to-muted/20">
        <UnifiedSidebar
          messageTypes={messageTypes}
          selectedMessageType={selectedMessageType}
          onMessageTypeSelect={handleMessageTypeSelect}
          connectionStatus={connectionStatus}
          feedbackMessages={feedbackMessages}
        />
        
        <SidebarInset className="flex-1">
          <main className="p-6">
            {selectedMessage ? (
              <Card className="max-w-2xl mx-auto">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-primary">
                    {selectedMessage.name}
                  </CardTitle>
                  <p className="text-muted-foreground">{selectedMessage.description}</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  {selectedMessage.fields.map(field => (
                    <div key={field.name} className="space-y-2">
                      <Label 
                        htmlFor={field.name}
                        className={cn(
                          "text-sm font-medium",
                          field.required && "after:content-['*'] after:text-destructive after:ml-1"
                        )}
                      >
                        {field.label}
                      </Label>
                      {renderField(field)}
                    </div>
                  ))}
                  
                  <div className="flex gap-4 pt-4">
                    <Button onClick={handleSubmit} className="flex-1">
                      Send Configuration
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        const initialData: Record<string, any> = {}
                        selectedMessage.fields.forEach(field => {
                          initialData[field.name] = field.defaultValue
                        })
                        setFormData(initialData)
                      }}
                    >
                      Reset
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="flex items-center justify-center h-full">
                <Card className="max-w-md mx-auto text-center">
                  <CardContent className="p-8">
                    <h2 className="text-2xl font-bold mb-4">IoT Device Configuration</h2>
                    <p className="text-muted-foreground mb-6">
                      Select a configuration type from the sidebar to get started.
                    </p>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p>📡 Configure sensor parameters</p>
                      <p>🔗 Set up communication protocols</p>
                      <p>🔋 Manage power settings</p>
                      <p>💬 View real-time device feedback</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}

export default IoTDashboard
