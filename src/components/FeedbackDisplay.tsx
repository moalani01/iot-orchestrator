import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FeedbackMessage } from '@/types/iot';
import { FeedbackCard } from './FeedbackCard';
import { useExpandable } from '@/hooks/useExpandable';

interface FeedbackDisplayProps {
  feedbackMessages: FeedbackMessage[];
}

const EmptyState: React.FC = () => (
  <div className="flex-1 flex items-center justify-center text-muted-foreground h-full">
    No feedback messages yet. Send a configuration to see device responses.
  </div>
);

export const FeedbackDisplay: React.FC<FeedbackDisplayProps> = ({
  feedbackMessages
}) => {
  const { isExpanded, toggleExpansion } = useExpandable();

  const hasMessages = feedbackMessages.length > 0;

  return (
    <Card className="lg:col-span-1 h-[600px] flex flex-col overflow-hidden">
      <CardHeader>
        <CardTitle>Device Feedback</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          {hasMessages ? (
            <div className="space-y-3 pr-4">
              {feedbackMessages.map(feedback => (
                <FeedbackCard
                  key={feedback.id}
                  feedback={feedback}
                  isExpanded={isExpanded(feedback.id)}
                  onToggleExpand={() => toggleExpansion(feedback.id)}
                />
              ))}
            </div>
          ) : (
            <EmptyState />
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};