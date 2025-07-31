import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send } from 'lucide-react';
import { MessageType, MessageField } from '@/types/iot';

interface ConfigurationFormProps {
  currentMessageType: MessageType | undefined;
  formData: Record<string, any>;
  isConnected: boolean;
  onFieldChange: (fieldName: string, value: any) => void;
  onSendMessage: () => void;
}

export const ConfigurationForm: React.FC<ConfigurationFormProps> = ({
  currentMessageType,
  formData,
  isConnected,
  onFieldChange,
  onSendMessage
}) => {
  const renderField = (field: MessageField) => {
    const value = formData[field.name] ?? field.defaultValue;

    switch (field.type) {
      case 'text':
        return (
          <Input
            value={value || ''}
            onChange={(e) => onFieldChange(field.name, e.target.value)}
            placeholder={`Enter ${field.label.toLowerCase()}`}
          />
        );

      case 'number':
        return (
          <Input
            type="number"
            value={value || ''}
            onChange={(e) => onFieldChange(field.name, parseFloat(e.target.value) || 0)}
            placeholder={`Enter ${field.label.toLowerCase()}`}
          />
        );

      case 'dropdown':
        return (
          <Select value={value || ''} onValueChange={(val) => onFieldChange(field.name, val)}>
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
            onCheckedChange={(checked) => onFieldChange(field.name, checked)}
          />
        );

      case 'radio':
        return (
          <RadioGroup
            value={value || field.defaultValue}
            onValueChange={(val) => onFieldChange(field.name, val)}
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
    <Card className="lg:col-span-1 h-[600px] flex flex-col overflow-hidden">
      <CardHeader>
        <CardTitle>
          {currentMessageType ? currentMessageType.name : 'Select Message Type'}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col overflow-hidden">
        {currentMessageType ? (
          <>
            <div className="flex-1 min-h-0">
              <ScrollArea className="h-full">
                <div className="space-y-4 pr-4 pl-1">
                  {currentMessageType.fields.map(field => (
                    <div key={field.name} className="space-y-2">
                      <div className="flex items-center justify-between min-w-0">
                        <Label className="text-sm font-medium truncate flex-1 min-w-0">
                          <span className="break-words">{field.label}</span>
                          {field.required && <span className="text-destructive ml-1">*</span>}
                        </Label>
                        {field.type === 'boolean' && (
                          <div className="ml-4 flex-shrink-0">
                            {renderField(field)}
                          </div>
                        )}
                      </div>
                      {field.type !== 'boolean' && (
                        <div className="min-w-0">
                          {renderField(field)}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
            
            <div className="pt-4 border-t mt-4 flex-shrink-0">
              <Button 
                onClick={onSendMessage}
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
  );
};