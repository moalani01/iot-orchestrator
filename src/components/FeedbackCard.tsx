import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import { FeedbackMessage, FeedbackType } from '@/types/iot';
import { useTextUtils } from '@/hooks/useTextUtils';

interface FeedbackCardProps {
  feedback: FeedbackMessage;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

const FEEDBACK_ICONS: Record<FeedbackType, React.ComponentType<{ className?: string }>> = {
  success: CheckCircle,
  error: XCircle,
  info: Clock
};

const FEEDBACK_STYLES: Record<FeedbackType, string> = {
  success: 'text-success',
  error: 'text-destructive', 
  info: 'text-info'
};

export const FeedbackCard: React.FC<FeedbackCardProps> = ({
  feedback,
  isExpanded,
  onToggleExpand
}) => {
  const { shouldTruncate, getDisplayText } = useTextUtils();
  
  const Icon = FEEDBACK_ICONS[feedback.type];
  const iconStyle = FEEDBACK_STYLES[feedback.type];
  
  const shouldTruncateMessage = shouldTruncate(feedback.message, 100);
  const shouldTruncateDetails = feedback.details && shouldTruncate(feedback.details, 100);
  const shouldShowExpandButton = shouldTruncateMessage || shouldTruncateDetails;

  const displayMessage = getDisplayText(feedback.message, isExpanded, 100);
  const displayDetails = feedback.details 
    ? getDisplayText(feedback.details, isExpanded, 100)
    : undefined;

  return (
    <div className="p-3 border rounded-lg">
      <div className="flex items-start gap-3 min-w-0">
        <div className="flex-shrink-0">
          <Icon className={`w-4 h-4 ${iconStyle}`} />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium break-words">
            {displayMessage}
          </div>
          
          {displayDetails && (
            <div className="text-xs text-muted-foreground mt-1 break-words">
              {displayDetails}
            </div>
          )}
          
          {shouldShowExpandButton && (
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-0 text-xs text-primary hover:text-primary/80 mt-1"
              onClick={onToggleExpand}
            >
              {isExpanded ? 'Show less' : 'Show more'}
            </Button>
          )}
          
          <div className="text-xs text-muted-foreground mt-2">
            {feedback.timestamp.toLocaleTimeString()}
          </div>
        </div>
      </div>
    </div>
  );
};