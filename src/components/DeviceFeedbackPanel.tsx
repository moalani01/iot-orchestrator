import { useState } from "react"
import { CheckCircle, XCircle, AlertCircle, Info, ChevronDown, ChevronUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface FeedbackMessage {
  id: string
  timestamp: Date
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
  details?: string
  configType?: string
  configName?: string
}

interface DeviceFeedbackPanelProps {
  feedbackMessages: FeedbackMessage[]
}

const getFeedbackIcon = (type: FeedbackMessage['type']) => {
  switch (type) {
    case 'success':
      return <CheckCircle className="h-4 w-4 text-success" />
    case 'error':
      return <XCircle className="h-4 w-4 text-destructive" />
    case 'warning':
      return <AlertCircle className="h-4 w-4 text-warning" />
    case 'info':
      return <Info className="h-4 w-4 text-info" />
    default:
      return <Info className="h-4 w-4 text-muted-foreground" />
  }
}

const getFeedbackBorderColor = (type: FeedbackMessage['type']) => {
  switch (type) {
    case 'success':
      return 'border-l-success'
    case 'error':
      return 'border-l-destructive'
    case 'warning':
      return 'border-l-warning'
    case 'info':
      return 'border-l-info'
    default:
      return 'border-l-muted'
  }
}

export function DeviceFeedbackPanel({ feedbackMessages }: DeviceFeedbackPanelProps) {
  const [expandedMessages, setExpandedMessages] = useState<Set<string>>(new Set())

  const toggleExpanded = (messageId: string) => {
    const newExpanded = new Set(expandedMessages)
    if (newExpanded.has(messageId)) {
      newExpanded.delete(messageId)
    } else {
      newExpanded.add(messageId)
    }
    setExpandedMessages(newExpanded)
  }

  const truncateText = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + "..."
  }
  return (
    <div className="w-80 border-l border-border bg-gradient-to-b from-card to-background">
      <div className="p-4 border-b border-border">
        <h3 className="font-semibold text-lg">Device Feedback</h3>
        <p className="text-sm text-muted-foreground">Real-time device responses</p>
      </div>
      
      <ScrollArea className="h-[calc(100vh-8rem)]">
        <div className="p-4 space-y-4">
          {feedbackMessages.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground bg-card/30 rounded-lg border border-dashed border-border">
              <Info className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No messages yet</p>
              <p className="text-xs">Device responses will appear here</p>
            </div>
          ) : (
            feedbackMessages.map((message) => {
              const isExpanded = expandedMessages.has(message.id)
              const hasLongContent = message.message.length > 100 || (message.details && message.details.length > 100)
              
              return (
                <div
                  key={message.id}
                  className={cn(
                    "p-4 rounded-lg border-2 border-l-4 bg-card shadow-card backdrop-blur-sm transition-all duration-200 hover:shadow-section hover:scale-[1.02]",
                    getFeedbackBorderColor(message.type),
                    isExpanded && "ring-2 ring-border/50 shadow-lg"
                  )}
                >
                  <div className="flex items-start gap-3 mb-2">
                    <div className="mt-0.5">
                      {getFeedbackIcon(message.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      {message.configName && (
                        <div className="text-xs font-semibold text-primary mb-2 bg-primary/15 px-3 py-1.5 rounded-full border border-primary/20">
                          {message.configName}
                        </div>
                      )}
                      <p className="text-sm font-semibold leading-relaxed text-foreground">
                        {isExpanded ? message.message : truncateText(message.message)}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2 font-medium">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                    {hasLongContent && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 ml-2 opacity-70 hover:opacity-100 hover:bg-accent/80 border border-border/50"
                        onClick={() => toggleExpanded(message.id)}
                      >
                        {isExpanded ? (
                          <ChevronUp className="h-3 w-3" />
                        ) : (
                          <ChevronDown className="h-3 w-3" />
                        )}
                      </Button>
                    )}
                  </div>
                  {message.details && (
                    <div className="mt-3 pt-3 border-t border-border/30">
                      <div className={cn(
                        "text-xs text-muted-foreground leading-relaxed transition-all duration-200 bg-muted/30 p-3 rounded-md",
                        isExpanded ? "opacity-100" : "opacity-80"
                      )}>
                        {isExpanded ? message.details : truncateText(message.details, 80)}
                      </div>
                    </div>
                  )}
                </div>
              )
            })
          )}
        </div>
      </ScrollArea>
    </div>
  )
}