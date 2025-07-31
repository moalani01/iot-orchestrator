import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageType } from '@/types/iot';
import { MessageTypeCard } from './MessageTypeCard';
import { useExpandableText } from '@/hooks/useExpandableText';

interface MessageTypeListProps {
  messageTypes: MessageType[];
  selectedMessageType: string;
  onSelectMessageType: (id: string) => void;
}

export const MessageTypeList: React.FC<MessageTypeListProps> = ({
  messageTypes,
  selectedMessageType,
  onSelectMessageType
}) => {
  const { isExpanded, toggleExpansion } = useExpandableText();

  return (
    <Card className="lg:col-span-1 h-[600px] flex flex-col overflow-hidden">
      <CardHeader>
        <CardTitle>Message Types</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="space-y-3 pr-4">
            {messageTypes.map(messageType => (
              <MessageTypeCard
                key={messageType.id}
                messageType={messageType}
                isSelected={selectedMessageType === messageType.id}
                isExpanded={isExpanded(messageType.id)}
                onSelect={() => onSelectMessageType(messageType.id)}
                onToggleExpand={() => toggleExpansion(messageType.id)}
              />
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};