import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageType } from '@/types/iot';
import { shouldTruncateText, getTruncatedText } from '@/hooks/useExpandableText';

interface MessageTypeCardProps {
  messageType: MessageType;
  isSelected: boolean;
  isExpanded: boolean;
  onSelect: () => void;
  onToggleExpand: () => void;
}

export const MessageTypeCard: React.FC<MessageTypeCardProps> = ({ 
  messageType, 
  isSelected, 
  isExpanded, 
  onSelect, 
  onToggleExpand 
}) => {
  const hasLongDescription = shouldTruncateText(messageType.description);

  return (
    <div className="space-y-2">
      <Button
        variant={isSelected ? 'default' : 'outline'}
        className="w-full justify-start text-left h-auto p-4 overflow-hidden"
        onClick={onSelect}
      >
        <div className="min-w-0 w-full overflow-hidden">
          <div className="font-medium truncate w-full">{messageType.name}</div>
          <div className={`text-sm text-muted-foreground mt-1 ${
            isExpanded ? 'break-words' : 'truncate'
          }`}>
            {isExpanded || !hasLongDescription 
              ? messageType.description 
              : getTruncatedText(messageType.description)
            }
          </div>
        </div>
      </Button>
      {hasLongDescription && (
        <Button
          variant="ghost"
          size="sm"
          className="h-auto p-1 text-xs text-primary hover:text-primary/80 ml-4"
          onClick={onToggleExpand}
        >
          {isExpanded ? 'Show less' : 'Show more'}
        </Button>
      )}
    </div>
  );
};