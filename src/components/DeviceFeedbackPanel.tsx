import { useState } from "react"
import { CheckCircle, XCircle, AlertCircle, Info, ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from "lucide-react"
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
  collapsed: boolean
  onToggleCollapse: () => void
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

export function DeviceFeedbackPanel({ feedbackMessages, collapsed, onToggleCollapse }: DeviceFeedbackPanelProps) {
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
    <div className={cn(
      "border-l border-border bg-gradient-to-b from-card to-background transition-all duration-500 ease-in-out",
      collapsed ? "w-16" : "w-80"
    )}>
      <div className="p-4 border-b border-border flex items-center justify-between transition-all duration-500">
        <div className={cn(
          "transition-all duration-500 ease-in-out",
          collapsed ? "opacity-0 scale-90 pointer-events-none" : "opacity-100 scale-100"
        )}>
          <h3 className="font-semibold text-lg">Device Feedback</h3>
          <p className="text-sm text-muted-foreground">Real-time device responses</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleCollapse}
          className="h-8 w-8 transition-transform duration-300 hover:scale-110"
        >
          <div className="transition-transform duration-500 ease-in-out">
            {collapsed ? (
              <ChevronLeft className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </div>
        </Button>
      </div>
      
      <ScrollArea className="h-[calc(100vh-8rem)] overflow-hidden">
        <div className="relative">
          {/* Collapsed View */}
          <div className={cn(
            "absolute inset-0 transition-all duration-500 ease-in-out",
            collapsed ? "opacity-100 translate-x-0" : "opacity-0 translate-x-full pointer-events-none"
          )}>
            <div className="p-2 space-y-1">
              {feedbackMessages.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground animate-fade-in">
                  <Info className="h-6 w-6 mx-auto opacity-50 transition-transform duration-300 hover:scale-110" />
                </div>
              ) : (
                feedbackMessages.slice(0, 10).map((message, index) => (
                  <div
                    key={`collapsed-${message.id}`}
                    className={cn(
                      "p-1 rounded border-l-2 bg-card/60 hover:bg-card transition-all duration-300 transform hover:scale-105",
                      getFeedbackBorderColor(message.type)
                    )}
                    title={`${message.configName || 'Unknown'}: ${message.message}`}
                    style={{
                      animationDelay: `${index * 50}ms`,
                      animation: collapsed ? 'slideInRight 0.3s ease-out forwards' : 'none'
                    }}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <div className="transition-transform duration-200 hover:scale-125">
                        {getFeedbackIcon(message.type)}
                      </div>
                      <div className="text-xs text-muted-foreground text-center transition-opacity duration-200">
                        {message.timestamp.toLocaleTimeString().slice(0, 5)}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Expanded View */}
          <div className={cn(
            "transition-all duration-500 ease-in-out",
            collapsed ? "opacity-0 translate-x-full pointer-events-none" : "opacity-100 translate-x-0"
          )}>
            <div className="p-4 space-y-2">
              {feedbackMessages.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground bg-card/20 rounded border border-dashed border-border/50 animate-fade-in">
                  <Info className="h-8 w-8 mx-auto mb-2 opacity-50 transition-transform duration-300 hover:scale-110" />
                  <p className="text-sm">No messages yet</p>
                  <p className="text-xs">Device responses will appear here</p>
                </div>
              ) : (
                feedbackMessages.map((message, index) => {
                  const isExpanded = expandedMessages.has(message.id)
                  const hasLongContent = message.message.length > 100 || (message.details && message.details.length > 100)
                  
                  return (
                    <div
                      key={`expanded-${message.id}`}
                      className={cn(
                        "p-2 rounded border border-l-2 bg-card/80 backdrop-blur-sm transition-all duration-500 ease-out hover:bg-card hover:border-l-4 hover:scale-[1.02] hover:shadow-md transform",
                        getFeedbackBorderColor(message.type),
                        isExpanded && "bg-card border-l-4 shadow-sm scale-[1.01]"
                      )}
                      style={{
                        animationDelay: `${index * 100}ms`,
                        animation: !collapsed ? 'slideInLeft 0.4s ease-out forwards' : 'none'
                      }}
                    >
                      <div className="flex items-start gap-2">
                        <div className="transition-transform duration-200 hover:scale-125">
                          {getFeedbackIcon(message.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          {message.configName && (
                            <div className="text-xs font-medium text-primary mb-1 bg-primary/10 px-1.5 py-0.5 rounded-md inline-block transition-all duration-200 hover:bg-primary/20">
                              {message.configName}
                            </div>
                          )}
                          <p className="text-sm font-medium leading-snug text-foreground transition-all duration-300">
                            {isExpanded ? message.message : truncateText(message.message)}
                          </p>
                          <p className="text-xs text-muted-foreground transition-opacity duration-200">
                            {message.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                        {hasLongContent && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-5 w-5 opacity-60 hover:opacity-100 transition-all duration-200 hover:scale-110"
                            onClick={() => toggleExpanded(message.id)}
                          >
                            <div className="transition-transform duration-200">
                              {isExpanded ? (
                                <ChevronUp className="h-3 w-3" />
                              ) : (
                                <ChevronDown className="h-3 w-3" />
                              )}
                            </div>
                          </Button>
                        )}
                      </div>
                      {message.details && isExpanded && (
                        <div className="mt-2 pt-2 border-t border-border/20 animate-fade-in">
                          <div className="text-xs text-muted-foreground leading-relaxed bg-muted/20 p-2 rounded transition-all duration-300 hover:bg-muted/30">
                            {message.details}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}