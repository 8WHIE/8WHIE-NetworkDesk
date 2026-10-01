export type ModuleId =
  | 'dashboard'
  | 'network-info'
  | 'ping'
  | 'traceroute'
  | 'dns'
  | 'subnet'
  | 'port-probe'
  | 'discovery'
  | 'connections'
  | 'routing'
  | 'wifi'
  | 'adapter-mgmt'
  | 'remote-tools'
  | 'profiles'
  | 'logs'
  | 'settings'
  | 'about'
  | 'docs';

export interface NetworkInterfaceInfo {
  id: string;
  name: string;
  description: string;
  type: string;
  status: 'Up' | 'Down';
  speed: string;
  mac: string;
  dhcpEnabled: boolean;
  ipv4: string[];
  ipv6: string[];
  gateways: string[];
  dnsServers: string[];
  isActive: boolean;
}

export interface PingProbe {
  sequence: number;
  latencyMs: number;
  status: string;
  timestamp: string;
}

export interface PingSession {
  target: string;
  sent: number;
  received: number;
  lossPercent: number;
  minMs: number;
  maxMs: number;
  avgMs: number;
  probes: PingProbe[];
}

export interface TracerouteHop {
  hop: number;
  ip: string;
  hostname: string;
  latencyMs: number;
  status: 'reached' | 'hop' | 'timeout';
}

export interface DnsRecord {
  queryName: string;
  recordType: string;
  value: string;
  ttl: number;
  elapsedMs: number;
  server: string;
}

export interface SubnetResult {
  input: string;
  cidr: number;
  networkAddress: string;
  broadcastAddress: string;
  firstUsable: string;
  lastUsable: string;
  totalAddresses: number;
  usableHosts: number;
  subnetMask: string;
  wildcardMask: string;
  binaryIp: string;
  binaryMask: string;
  ipClass: string;
  isPrivate: boolean;
}

export interface PortProbeResult {
  host: string;
  port: number;
  service: string;
  status: 'open' | 'closed' | 'filtered' | 'timeout' | 'error';
  durationMs: number;
  message: string;
}

export interface DiscoveredDevice {
  ip: string;
  hostname: string;
  mac: string;
  vendor: string;
  latencyMs: number;
  isOnline: boolean;
}

export interface SocketConnection {
  protocol: 'TCP' | 'UDP';
  localAddress: string;
  localPort: number;
  remoteAddress: string;
  remotePort: number;
  state: 'ESTABLISHED' | 'LISTENING' | 'TIME_WAIT' | 'CLOSE_WAIT' | 'SYN_SENT';
  pid: number;
  processName: string;
}

export interface RouteEntry {
  destination: string;
  netmask: string;
  gateway: string;
  interface: string;
  metric: number;
  type: string;
}

export interface WifiInfo {
  ssid: string;
  bssid: string;
  signalPercent: number;
  rssiDbm: number;
  channel: string;
  band: string;
  security: string;
  standard: string;
  connected: boolean;
}

export interface SavedHostProfile {
  id: string;
  name: string;
  host: string;
  environment: 'Production' | 'Staging' | 'HomeLab' | 'Cloud';
  ports: number[];
  notes: string;
  createdAt: string;
}

export interface DiagnosticLog {
  id: string;
  timestamp: string;
  level: 'DEBUG' | 'INFO' | 'WARNING' | 'ERROR';
  component: string;
  message: string;
}
