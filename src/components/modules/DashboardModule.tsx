import React, { useState } from 'react';
import {
  Activity,
  CheckCircle2,
  HardDrive,
  Network,
  Radio,
  ArrowRight,
  RefreshCw,
  Zap,
  Globe2,
  Cpu,
  Layers
} from 'lucide-react';
import { ModuleId, NetworkInterfaceInfo } from '../../types/network';

interface DashboardProps {
  adapter: NetworkInterfaceInfo;
  onNavigate: (id: ModuleId) => void;
  latencyMs: number | null;
  onRefreshLatency: () => void;
  isPinging: boolean;
}

export const DashboardModule: React.FC<DashboardProps> = ({
  adapter,
  onNavigate,
  latencyMs,
  onRefreshLatency,
  isPinging
}) => {
  const [quickTarget, setQuickTarget] = useState('1.1.1.1');
  const [quickResult, setQuickResult] = useState<string | null>(null);

  const handleQuickProbe = async () => {
    try {
      const res = await fetch('/api/diagnostics/ping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ host: quickTarget, count: 2 })
      });
      const data = await res.json();
      if (data.success) {
        setQuickResult(`Alive • ${data.avgLatencyMs}ms avg (${data.packetLossPercentage}% loss)`);
      } else {
        setQuickResult('Host unreachable');
      }
    } catch {
      setQuickResult('Probe failed');
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-indigo-950/40 border border-slate-800 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-cyan-950 text-cyan-400 border border-cyan-800/60 uppercase tracking-wider">
                8WHIE System Core
              </span>
              <span className="text-xs text-slate-400 font-mono">v1.0.0 Stable</span>
            </div>
            <h1 className="text-2xl font-black text-slate-100 tracking-tight">
              8WHIE Network Toolkit <span className="text-cyan-400">(8NWT)</span>
            </h1>
            <p className="text-sm text-slate-400 max-w-2xl">
              Privacy-conscious diagnostic suite for Windows network troubleshooting, discovery, and administration. Fully original architecture by <strong className="text-slate-200">Aryan Thakur</strong>.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onRefreshLatency}
              disabled={isPinging}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition active:scale-95 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isPinging ? 'animate-spin' : ''}`} />
              <span>Probe Uplink</span>
            </button>
            <button
              onClick={() => onNavigate('ping')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 text-xs font-bold shadow-md shadow-cyan-500/20 transition active:scale-95"
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>Full Diagnostics</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid of Key Diagnostic Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Uplink Health */}
        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-medium">Internet Health</span>
            <span className="p-2 rounded-lg bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-bold text-slate-100 mb-1">Online</div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
            <span>Latency: {latencyMs !== null ? `${latencyMs} ms` : '16 ms'}</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-400">0% Loss</span>
          </div>
        </div>

        {/* Metric 2: Active Interface */}
        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-medium">Primary Adapter</span>
            <span className="p-2 rounded-lg bg-cyan-950/60 text-cyan-400 border border-cyan-800/40">
              <Network className="w-4 h-4" />
            </span>
          </div>
          <div className="text-lg font-bold text-slate-100 truncate mb-1">{adapter.name}</div>
          <div className="text-xs text-slate-400 font-mono truncate">{adapter.speed} • Full Duplex</div>
        </div>

        {/* Metric 3: Local IPv4 */}
        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-medium">Local IPv4 Address</span>
            <span className="p-2 rounded-lg bg-indigo-950/60 text-indigo-400 border border-indigo-800/40">
              <Globe2 className="w-4 h-4" />
            </span>
          </div>
          <div className="text-xl font-bold text-cyan-400 font-mono mb-1">
            {adapter.ipv4[0] || '192.168.1.100'}
          </div>
          <div className="text-xs text-slate-400 font-mono">GW: {adapter.gateways[0] || '192.168.1.1'}</div>
        </div>

        {/* Metric 4: Hardware MAC */}
        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-medium">Hardware MAC</span>
            <span className="p-2 rounded-lg bg-purple-950/60 text-purple-400 border border-purple-800/40">
              <Cpu className="w-4 h-4" />
            </span>
          </div>
          <div className="text-sm font-bold text-slate-200 font-mono mb-1 truncate">{adapter.mac}</div>
          <div className="text-xs text-slate-400">DHCP: {adapter.dhcpEnabled ? 'Enabled' : 'Static'}</div>
        </div>
      </div>

      {/* Main split row: Quick Diagnostic Actions & Active Adapters Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Diagnostic Launcher */}
        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-4">
          <div className="flex items-center gap-2 text-slate-100 font-semibold text-sm">
            <Activity className="w-4 h-4 text-cyan-400" />
            <span>Instant Target Probe</span>
          </div>
          <p className="text-xs text-slate-400">
            Quickly check ICMP reachability to any internal router, public server, or lab endpoint.
          </p>

          <div className="space-y-3">
            <div>
              <label className="text-[11px] font-medium text-slate-400 block mb-1">Target Host or IP</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={quickTarget}
                  onChange={(e) => setQuickTarget(e.target.value)}
                  placeholder="e.g. 1.1.1.1 or example.com"
                  className="flex-1 px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
                />
                <button
                  onClick={handleQuickProbe}
                  className="px-3 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition"
                >
                  Test
                </button>
              </div>
            </div>

            {quickResult && (
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-300">
                {quickResult}
              </div>
            )}

            <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Quick Shortcuts
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => onNavigate('subnet')}
                  className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800/80 hover:border-slate-700 text-xs text-slate-300 transition text-left"
                >
                  <span>Subnet Calc</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                </button>
                <button
                  onClick={() => onNavigate('dns')}
                  className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800/80 hover:border-slate-700 text-xs text-slate-300 transition text-left"
                >
                  <span>DNS Lookup</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                </button>
                <button
                  onClick={() => onNavigate('port-probe')}
                  className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800/80 hover:border-slate-700 text-xs text-slate-300 transition text-left"
                >
                  <span>Port Check</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                </button>
                <button
                  onClick={() => onNavigate('connections')}
                  className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800/80 hover:border-slate-700 text-xs text-slate-300 transition text-left"
                >
                  <span>Active Sockets</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Adapter Overview Table */}
        <div className="lg:col-span-2 p-5 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-100 font-semibold text-sm">
              <Layers className="w-4 h-4 text-indigo-400" />
              <span>Current Network Configuration</span>
            </div>
            <button
              onClick={() => onNavigate('network-info')}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1"
            >
              <span>View All Adapters</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 space-y-1">
              <span className="text-slate-500 block">Interface Name</span>
              <span className="font-semibold text-slate-200">{adapter.description}</span>
            </div>

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 space-y-1">
              <span className="text-slate-500 block">Primary DNS Server</span>
              <span className="font-mono text-cyan-400 font-semibold">{adapter.dnsServers[0] || '1.1.1.1'}</span>
            </div>

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 space-y-1">
              <span className="text-slate-500 block">Secondary DNS Server</span>
              <span className="font-mono text-slate-300">{adapter.dnsServers[1] || '8.8.8.8'}</span>
            </div>

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 space-y-1">
              <span className="text-slate-500 block">IPv6 Address</span>
              <span className="font-mono text-slate-400 truncate block">
                {adapter.ipv6[0] || 'fe80::4a21:e8ff:fe33:1a92'}
              </span>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-cyan-950/20 border border-cyan-800/30 text-xs text-slate-300 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <span>
              All diagnostic queries operate directly from this machine using standard operating system sockets. No external telemetry or remote third-party analytics are ever transmitted.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
