import { CheckCircle, XCircle, AlertCircle, Info } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
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
  return (
    <div className="w-80 border-l border-border bg-gradient-to-b from-card to-background">
      <div className="p-4 border-b border-border">
        <h3 className="font-semibold text-lg">Device Feedback</h3>
        <p className="text-sm text-muted-foreground">Real-time device responses</p>
      </div>
      
      <ScrollArea className="h-[calc(100vh-8rem)]">
        <div className="p-4 space-y-3">
          {feedbackMessages.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Info className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No messages yet</p>
              <p className="text-xs">Device responses will appear here</p>
            </div>
          ) : (
            feedbackMessages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "p-3 rounded-md border-l-4 bg-card/50 backdrop-blur-sm shadow-sm transition-all duration-200 hover:shadow-md",
                  getFeedbackBorderColor(message.type)
                )}
              >
                <div className="flex items-start gap-2 mb-1">
                  {getFeedbackIcon(message.type)}
                  <div className="flex-1 min-w-0">
                    {message.configName && (
                      <div className="text-xs font-medium text-primary mb-1 bg-primary/10 px-2 py-1 rounded-md">
                        {message.configName}
                      </div>
                    )}
                    <p className="text-sm font-medium leading-tight">
                      {message.message}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                {message.details && (
                  <p className="text-xs text-muted-foreground mt-2 pl-6 leading-relaxed">
                    {message.details}
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  )
}