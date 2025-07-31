import { MessageType } from '@/types/iot';

export const MESSAGE_TYPES: MessageType[] = [
  {
    id: 'sensor_config',
    name: 'Sensor Configuration',
    description: 'Configure sensor parameters and sampling rates',
    fields: [
      { name: 'sensor_type', label: 'Sensor Type', type: 'dropdown', options: ['Temperature', 'Humidity', 'Pressure', 'Light'], required: true },
      { name: 'sample_rate', label: 'Sample Rate (Hz)', type: 'number', required: true, defaultValue: 1 },
      { name: 'enabled', label: 'Sensor Enabled', type: 'boolean', defaultValue: true },
      { name: 'calibration_mode', label: 'Calibration Mode', type: 'radio', options: ['Auto', 'Manual', 'Factory'], defaultValue: 'Auto' }
    ]
  },
  {
    id: 'communication',
    name: 'Communication Settings',
    description: 'Configure network and communication parameters',
    fields: [
      { name: 'protocol', label: 'Protocol', type: 'dropdown', options: ['WiFi', 'Bluetooth', 'LoRa', 'Ethernet'], required: true },
      { name: 'network_name', label: 'Network Name', type: 'text', required: true },
      { name: 'network_password', label: 'Network Password', type: 'text', required: false },
      { name: 'encryption', label: 'Encryption Enabled', type: 'boolean', defaultValue: true },
      { name: 'encryption_type', label: 'Encryption Type', type: 'dropdown', options: ['WPA2', 'WPA3', 'WEP', 'Open'], defaultValue: 'WPA2' },
      { name: 'retry_attempts', label: 'Retry Attempts', type: 'number', defaultValue: 3 },
      { name: 'timeout_duration', label: 'Timeout Duration (seconds)', type: 'number', defaultValue: 30 },
      { name: 'keep_alive_interval', label: 'Keep Alive Interval (seconds)', type: 'number', defaultValue: 60 },
      { name: 'auto_reconnect', label: 'Auto Reconnect', type: 'boolean', defaultValue: true },
      { name: 'connection_priority', label: 'Connection Priority', type: 'radio', options: ['High', 'Medium', 'Low'], defaultValue: 'Medium' },
      { name: 'data_compression', label: 'Data Compression', type: 'boolean', defaultValue: false },
      { name: 'compression_level', label: 'Compression Level', type: 'dropdown', options: ['None', 'Low', 'Medium', 'High'], defaultValue: 'None' },
      { name: 'buffer_size', label: 'Buffer Size (KB)', type: 'number', defaultValue: 1024 },
      { name: 'max_packet_size', label: 'Max Packet Size (bytes)', type: 'number', defaultValue: 1500 },
      { name: 'bandwidth_limit', label: 'Bandwidth Limit (Mbps)', type: 'number', defaultValue: 100 },
      { name: 'quality_of_service', label: 'Quality of Service', type: 'dropdown', options: ['Best Effort', 'Assured Forwarding', 'Expedited Forwarding'], defaultValue: 'Best Effort' },
      { name: 'error_correction', label: 'Error Correction', type: 'boolean', defaultValue: true },
      { name: 'redundancy_enabled', label: 'Redundancy Enabled', type: 'boolean', defaultValue: false },
      { name: 'backup_protocol', label: 'Backup Protocol', type: 'dropdown', options: ['None', 'Cellular', 'Satellite', 'LoRa'], defaultValue: 'None' },
      { name: 'firewall_enabled', label: 'Firewall Enabled', type: 'boolean', defaultValue: true },
      { name: 'port_range_start', label: 'Port Range Start', type: 'number', defaultValue: 1024 },
      { name: 'port_range_end', label: 'Port Range End', type: 'number', defaultValue: 65535 },
      { name: 'security_level', label: 'Security Level', type: 'radio', options: ['Basic', 'Enhanced', 'Maximum'], defaultValue: 'Enhanced' }
    ]
  },
  {
    id: 'power_management',
    name: 'Power Management',
    description: 'Configure power saving and battery settings',
    fields: [
      { name: 'power_mode', label: 'Power Mode', type: 'radio', options: ['Performance', 'Balanced', 'Power Save'], defaultValue: 'Balanced' },
      { name: 'sleep_timeout', label: 'Sleep Timeout (minutes)', type: 'number', defaultValue: 10 },
      { name: 'wake_on_motion', label: 'Wake on Motion', type: 'boolean', defaultValue: false },
      { name: 'battery_threshold', label: 'Low Battery Threshold (%)', type: 'number', defaultValue: 20 }
    ]
  }
];