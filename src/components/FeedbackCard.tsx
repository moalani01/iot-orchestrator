import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import { FeedbackMessage, FeedbackType } from '@/types/iot';
import { shouldTruncateText, getTruncatedText } from '@/hooks/useExpandableText';

interface FeedbackCardProps {
  feedback: FeedbackMessage;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

const getFeedbackIcon = (type: FeedbackType) => {
  const iconProps = { className: "w-4 h-4" };
  
  switch (type) {
    case 'success':
      return <CheckCircle {...iconProps} className="w-4 h-4 text-success" />;
    case 'error':
      return <XCircle {...iconProps} className="w-4 h-4 text-destructive" />;
    case 'info':
      return <Clock {...iconProps} className="w-4 h-4 text-info" />;
  }
};

export const FeedbackCard: React.FC<FeedbackCardProps> = ({
  feedback,
  isExpanded,
  onToggleExpand
}) => {
  const shouldTruncateMessage = shouldTruncateText(feedback.message, 100);
  const shouldTruncateDetails = feedback.details && shouldTruncateText(feedback.details, 100);
  const shouldShowExpandButton = shouldTruncateMessage || shouldTruncateDetails;

  return (
    <div className="p-3 border rounded-lg">
      <div className="flex items-start gap-3 min-w-0">
        <div className="flex-shrink-0">
          {getFeedbackIcon(feedback.type)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium break-words">
            {isExpanded || !shouldTruncateMessage 
              ? feedback.message 
              : getTruncatedText(feedback.message, 100)
            }
          </div>
          {feedback.details && (
            <div className="text-xs text-muted-foreground mt-1 break-words">
              {isExpanded || !shouldTruncateDetails
                ? feedback.details
                : getTruncatedText(feedback.details, 100)
              }
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