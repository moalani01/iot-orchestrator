import { useState, useEffect } from 'react';

export function useConnectionStatus() {
  const [isConnected, setIsConnected] = useState<boolean>(false);

  useEffect(() => {
    // Simulate connection status with 90% connection rate
    const connectionTimer = setInterval(() => {
      setIsConnected(Math.random() > 0.1);
    }, 5000);

    // Set initial connection status
    setIsConnected(Math.random() > 0.1);

    return () => clearInterval(connectionTimer);
  }, []);

  return isConnected;
}