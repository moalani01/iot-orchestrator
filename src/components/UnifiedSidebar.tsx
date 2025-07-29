
import { useState } from "react"
import { Settings, Wifi, Battery, Cpu, CheckCircle, XCircle, AlertCircle, Info, ChevronDown, ChevronUp, Moon, Sun, Monitor } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"

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

interface UnifiedSidebarProps {
  messageTypes: MessageType[]
  selectedMessageType: string | null
  onMessageTypeSelect: (id: string) => void
  connectionStatus: boolean
  feedbackMessages: FeedbackMessage[]
}

const iconMap = {
  "sensor-config": Settings,
  "communication": Wifi,
  "power": Battery,
  default: Cpu
}

const getFeedbackIcon = (type: FeedbackMessage['type']) => {
  switch (type) {
    case 'success':
      return <CheckCircle className="h-3 w-3 text-success" />
    case 'error':
      return <XCircle className="h-3 w-3 text-destructive" />
    case 'warning':
      return <AlertCircle className="h-3 w-3 text-warning" />
    case 'info':
      return <Info className="h-3 w-3 text-info" />
    default:
      return <Info className="h-3 w-3 text-muted-foreground" />
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

export function UnifiedSidebar({ 
  messageTypes, 
  selectedMessageType, 
  onMessageTypeSelect,
  connectionStatus,
  feedbackMessages
}: UnifiedSidebarProps) {
  const { state } = useSidebar()
  const { theme, setTheme } = useTheme()
  const [expandedMessages, setExpandedMessages] = useState<Set<string>>(new Set())
  const collapsed = state === "collapsed"

  const toggleExpanded = (messageId: string) => {
    const newExpanded = new Set(expandedMessages)
    if (newExpanded.has(messageId)) {
      newExpanded.delete(messageId)
    } else {
      newExpanded.add(messageId)
    }
    setExpandedMessages(newExpanded)
  }

  const truncateText = (text: string, maxLength: number = 80) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + "..."
  }

  const cycleTheme = () => {
    if (theme === "light") setTheme("dark")
    else if (theme === "dark") setTheme("system")
    else setTheme("light")
  }

  const getThemeIcon = () => {
    if (theme === "light") return <Sun className="h-4 w-4" />
    if (theme === "dark") return <Moon className="h-4 w-4" />
    return <Monitor className="h-4 w-4" />
  }

  return (
    <Sidebar className={cn(collapsed ? "w-14" : "w-80")} collapsible="icon">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <SidebarTrigger />
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className={cn(
              "w-2 h-2 rounded-full", 
              connectionStatus ? "bg-success animate-pulse" : "bg-destructive"
            )} />
            <span className="text-sm font-medium">
              {connectionStatus ? "Connected" : "Disconnected"}
            </span>
          </div>
        )}
      </div>
      
      <SidebarContent>
        {/* Configuration Types */}
        <SidebarGroup>
          <SidebarGroupLabel>Configuration Types</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {messageTypes.map((type) => {
                const IconComponent = iconMap[type.id as keyof typeof iconMap] || iconMap.default
                const isActive = selectedMessageType === type.id
                
                return (
                  <SidebarMenuItem key={type.id}>
                    <SidebarMenuButton
                      onClick={() => onMessageTypeSelect(type.id)}
                      className={cn(
                        "w-full justify-start transition-all duration-200",
                        isActive && "bg-primary text-primary-foreground shadow-glow"
                      )}
                      isActive={isActive}
                    >
                      <IconComponent className="h-4 w-4" />
                      {!collapsed && (
                        <div className="flex flex-col items-start">
                          <span className="font-medium">{type.name}</span>
                          <span className="text-xs opacity-70 truncate max-w-32">
                            {type.description}
                          </span>
                        </div>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Device Feedback */}
        <SidebarGroup>
          <SidebarGroupLabel>Device Feedback</SidebarGroupLabel>
          <SidebarGroupContent>
            <ScrollArea className="h-48">
              {collapsed ? (
                <div className="p-2 space-y-1">
                  {feedbackMessages.length === 0 ? (
                    <div className="text-center py-2 text-muted-foreground">
                      <Info className="h-4 w-4 mx-auto opacity-50" />
                    </div>
                  ) : (
                    feedbackMessages.slice(0, 8).map((message) => (
                      <div
                        key={`collapsed-${message.id}`}
                        className={cn(
                          "p-1 rounded border-l-2 bg-card/60 hover:bg-card transition-all duration-200",
                          getFeedbackBorderColor(message.type)
                        )}
                        title={`${message.configName || 'Unknown'}: ${message.message}`}
                      >
                        <div className="flex flex-col items-center gap-1">
                          {getFeedbackIcon(message.type)}
                          <div className="text-xs text-muted-foreground text-center">
                            {message.timestamp.toLocaleTimeString().slice(0, 5)}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              ) : (
                <div className="p-2 space-y-2">
                  {feedbackMessages.length === 0 ? (
                    <div className="text-center py-4 text-muted-foreground bg-card/20 rounded border border-dashed">
                      <Info className="h-6 w-6 mx-auto mb-2 opacity-50" />
                      <p className="text-xs">No messages yet</p>
                    </div>
                  ) : (
                    feedbackMessages.slice(0, 10).map((message) => {
                      const isExpanded = expandedMessages.has(message.id)
                      const hasLongContent = message.message.length > 80 || (message.details && message.details.length > 80)
                      
                      return (
                        <div
                          key={`expanded-${message.id}`}
                          className={cn(
                            "p-2 rounded border border-l-2 bg-card/80 transition-all duration-200 hover:bg-card",
                            getFeedbackBorderColor(message.type)
                          )}
                        >
                          <div className="flex items-start gap-2">
                            {getFeedbackIcon(message.type)}
                            <div className="flex-1 min-w-0">
                              {message.configName && (
                                <div className="text-xs font-medium text-primary mb-1 bg-primary/10 px-1 py-0.5 rounded inline-block">
                                  {message.configName}
                                </div>
                              )}
                              <p className="text-xs font-medium leading-tight">
                                {isExpanded ? message.message : truncateText(message.message)}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {message.timestamp.toLocaleTimeString()}
                              </p>
                            </div>
                            {hasLongContent && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-4 w-4 opacity-60 hover:opacity-100"
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
                          {message.details && isExpanded && (
                            <div className="mt-2 pt-2 border-t border-border/20">
                              <div className="text-xs text-muted-foreground bg-muted/20 p-2 rounded">
                                {message.details}
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    })
                  )}
                </div>
              )}
            </ScrollArea>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Settings */}
        <SidebarGroup>
          <SidebarGroupLabel>Settings</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={cycleTheme}>
                  {getThemeIcon()}
                  {!collapsed && <span>Theme: {theme}</span>}
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
