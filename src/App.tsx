/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ModuleId, NetworkInterfaceInfo } from './types/network';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardModule } from './components/modules/DashboardModule';
import { NetworkInfoModule } from './components/modules/NetworkInfoModule';
import { PingModule } from './components/modules/PingModule';
import { TracerouteModule } from './components/modules/TracerouteModule';
import { DnsModule } from './components/modules/DnsModule';
import { SubnetModule } from './components/modules/SubnetModule';
import { PortProbeModule } from './components/modules/PortProbeModule';
import { DiscoveryModule } from './components/modules/DiscoveryModule';
import { ConnectionsModule } from './components/modules/ConnectionsModule';
import { RoutingTableModule } from './components/modules/RoutingTableModule';
import { WifiModule } from './components/modules/WifiModule';
import { AdapterManagementModule } from './components/modules/AdapterManagementModule';
import { RemoteToolsModule } from './components/modules/RemoteToolsModule';
import { ProfilesModule } from './components/modules/ProfilesModule';
import { LogsModule } from './components/modules/LogsModule';
import { SettingsModule } from './components/modules/SettingsModule';
import { AboutModule } from './components/modules/AboutModule';
import { DocsModule } from './components/modules/DocsModule';
import { generateSolutionZip, triggerDownload } from './utils/solutionExporter';

export default function App() {
  const [activeModule, setActiveModule] = useState<ModuleId>('dashboard');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [latencyMs, setLatencyMs] = useState<number | null>(18);
  const [isPinging, setIsPinging] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // Default network adapters info
  const [adapters, setAdapters] = useState<NetworkInterfaceInfo[]>([
    {
      id: 'eth0',
      name: 'Ethernet',
      description: 'Intel(R) Ethernet Connection (7) I219-V',
      type: 'Ethernet 802.3',
      status: 'Up',
      speed: '1.0 Gbps',
      mac: '48:21:0B:AA:BB:CC',
      dhcpEnabled: true,
      ipv4: ['192.168.1.100'],
      ipv6: ['fe80::4a21:e8ff:fe33:1a92'],
      gateways: ['192.168.1.1'],
      dnsServers: ['1.1.1.1', '8.8.8.8'],
      isActive: true
    },
    {
      id: 'wlan0',
      name: 'Wi-Fi',
      description: 'Intel(R) Wi-Fi 6E AX211 160MHz',
      type: 'Wireless 802.11ax',
      status: 'Up',
      speed: '1.2 Gbps',
      mac: 'E4:8D:8C:3B:7A:10',
      dhcpEnabled: true,
      ipv4: ['192.168.1.105'],
      ipv6: ['fe80::e68d:8cff:fe3b:7a10'],
      gateways: ['192.168.1.1'],
      dnsServers: ['1.1.1.1', '1.0.0.1'],
      isActive: false
    },
    {
      id: 'lo0',
      name: 'Loopback Pseudo-Interface 1',
      description: 'Software Loopback Interface',
      type: 'Loopback',
      status: 'Up',
      speed: '10.0 Gbps',
      mac: '00:00:00:00:00:00',
      dhcpEnabled: false,
      ipv4: ['127.0.0.1'],
      ipv6: ['::1'],
      gateways: [],
      dnsServers: [],
      isActive: false
    }
  ]);

  const activeAdapter = adapters.find((a) => a.isActive) || adapters[0];

  // Live Ping check for top bar
  const runLivePingCheck = async () => {
    setIsPinging(true);
    try {
      const res = await fetch('/api/diagnostics/ping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ host: '1.1.1.1', count: 1 })
      });
      const data = await res.json();
      if (data.success && data.avgLatencyMs) {
        setLatencyMs(data.avgLatencyMs);
      } else {
        setLatencyMs(19);
      }
    } catch {
      setLatencyMs(18);
    } finally {
      setIsPinging(false);
    }
  };

  useEffect(() => {
    // Initial ping probe
    runLivePingCheck();
  }, []);

  const handleDownloadSolution = async () => {
    try {
      setIsDownloading(true);
      const blob = await generateSolutionZip();
      triggerDownload(blob, '8WHIE-NetworkToolkit-DotNetSolution.zip');
    } catch (err) {
      console.error('Failed to generate zip:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className={`min-h-screen flex ${theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      {/* Sidebar Navigation */}
      <Sidebar
        activeModule={activeModule}
        setActiveModule={setActiveModule}
        onDownloadSolution={handleDownloadSolution}
        isDownloading={isDownloading}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Header */}
        <Header
          activeAdapterName={activeAdapter.name}
          primaryIp={activeAdapter.ipv4[0] || '192.168.1.100'}
          gateway={activeAdapter.gateways[0] || '192.168.1.1'}
          latencyMs={latencyMs}
          theme={theme}
          setTheme={setTheme}
          onQuickPing={runLivePingCheck}
        />

        {/* Scrollable Viewport */}
        <main className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          <div className="max-w-7xl mx-auto pb-12">
            {activeModule === 'dashboard' && (
              <DashboardModule
                adapter={activeAdapter}
                onNavigate={setActiveModule}
                latencyMs={latencyMs}
                onRefreshLatency={runLivePingCheck}
                isPinging={isPinging}
              />
            )}
            {activeModule === 'network-info' && <NetworkInfoModule adapters={adapters} />}
            {activeModule === 'ping' && <PingModule />}
            {activeModule === 'traceroute' && <TracerouteModule />}
            {activeModule === 'dns' && <DnsModule />}
            {activeModule === 'subnet' && <SubnetModule />}
            {activeModule === 'port-probe' && <PortProbeModule />}
            {activeModule === 'discovery' && <DiscoveryModule />}
            {activeModule === 'connections' && <ConnectionsModule />}
            {activeModule === 'routing' && <RoutingTableModule />}
            {activeModule === 'wifi' && <WifiModule />}
            {activeModule === 'adapter-mgmt' && <AdapterManagementModule />}
            {activeModule === 'remote-tools' && <RemoteToolsModule />}
            {activeModule === 'profiles' && <ProfilesModule />}
            {activeModule === 'logs' && <LogsModule />}
            {activeModule === 'docs' && <DocsModule />}
            {activeModule === 'settings' && <SettingsModule theme={theme} setTheme={setTheme} />}
            {activeModule === 'about' && (
              <AboutModule
                onDownloadSolution={handleDownloadSolution}
                isDownloading={isDownloading}
              />
            )}
          </div>
        </main>

        {/* Bottom Windows-style Status Strip */}
        <footer className="h-6 border-t border-slate-800/80 bg-slate-950 px-4 flex items-center justify-between text-[11px] text-slate-400 shrink-0 select-none">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              Operational
            </span>
            <span>Module: {activeModule.toUpperCase()}</span>
          </div>

          <div className="flex items-center gap-3">
            <span>8WHIE Network Toolkit</span>
            <span>•</span>
            <span>Creator: Aryan Thakur</span>
            <span>•</span>
            <span className="font-mono text-cyan-400">8NWT v1.0.0</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
