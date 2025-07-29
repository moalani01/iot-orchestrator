import { Settings, Wifi, Battery, Cpu } from "lucide-react"
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
import { cn } from "@/lib/utils"
import { ThemeToggle } from "./ThemeToggle"

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

interface AppSidebarProps {
  messageTypes: MessageType[]
  selectedMessageType: string | null
  onMessageTypeSelect: (id: string) => void
  connectionStatus: boolean
}

const iconMap = {
  "sensor-config": Settings,
  "communication": Wifi,
  "power": Battery,
  default: Cpu
}

export function AppSidebar({ 
  messageTypes, 
  selectedMessageType, 
  onMessageTypeSelect,
  connectionStatus 
}: AppSidebarProps) {
  const { state } = useSidebar()
  const collapsed = state === "collapsed"

  return (
    <Sidebar className={cn(collapsed ? "w-14" : "w-56")} collapsible="icon">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <SidebarTrigger />
        <ThemeToggle />
      </div>
      
      <SidebarContent>
        {/* Connection Status */}
        <div className={cn(
          "flex items-center gap-2 p-4 border-b border-border",
          collapsed && "justify-center p-2"
        )}>
          <div className={cn(
            "w-2 h-2 rounded-full", 
            connectionStatus ? "bg-success animate-pulse" : "bg-destructive"
          )} />
          {!collapsed && (
            <span className="text-sm font-medium">
              {connectionStatus ? "Connected" : "Disconnected"}
            </span>
          )}
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>Configuration Types</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {messageTypes.map((type) => {
                const IconComponent = iconMap[type.id as keyof typeof iconMap] || iconMap.default
                const isActive = selectedMessageType === type.id
                
                return (
                  <SidebarMenuItem key={type.id}>
                    <SidebarMenuButton
                      onClick={() => onMessageTypeSelect(type.id)}
                      className={cn(
                        "w-full justify-start transition-all duration-200 py-3 px-3",
                        isActive && "bg-primary text-primary-foreground"
                      )}
                      isActive={isActive}
                    >
                      <IconComponent className="h-4 w-4" />
                      {!collapsed && (
                        <div className="flex flex-col items-start ml-3">
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
      </SidebarContent>
    </Sidebar>
  )
}