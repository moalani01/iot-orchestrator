import React from 'react';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/theme-toggle';
import { Settings, Activity } from 'lucide-react';

interface DashboardHeaderProps {
  isConnected: boolean;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ isConnected }) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex-shrink-0">
          <Settings className="w-8 h-8 text-primary" />
        </div>
        <div className="min-w-0">
          <h1 className="text-3xl font-bold text-foreground break-words">
            IoT Device Configuration
          </h1>
          <p className="text-muted-foreground break-words">
            Configure and manage your IoT device settings
          </p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Activity className={`w-5 h-5 ${isConnected ? 'text-success' : 'text-destructive'}`} />
          <Badge variant={isConnected ? 'default' : 'destructive'}>
            {isConnected ? 'Connected' : 'Disconnected'}
          </Badge>
        </div>
        <ThemeToggle />
      </div>
    </div>
  );
};