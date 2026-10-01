import React, { useState } from 'react';
import {
  Network,
  Copy,
  Check,
  Download,
  Share2,
  Cpu,
  Globe,
  Radio,
  FileText
} from 'lucide-react';
import { NetworkInterfaceInfo } from '../../types/network';

interface NetworkInfoProps {
  adapters: NetworkInterfaceInfo[];
}

export const NetworkInfoModule: React.FC<NetworkInfoProps> = ({ adapters }) => {
  const [selectedAdapterId, setSelectedAdapterId] = useState(adapters[0]?.id || 'eth0');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const selected = adapters.find((a) => a.id === selectedAdapterId) || adapters[0];

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(adapters, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute('href', dataStr);
    dlAnchor.setAttribute('download', '8WHIE_NetworkAdapters.json');
    dlAnchor.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Network className="w-5 h-5 text-cyan-400" />
            <span>Network Information &amp; Adapters</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Detailed hardware and configuration metrics for all local physical and virtual network interfaces.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportJson}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 transition"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Export Adapters (JSON)</span>
          </button>
        </div>
      </div>

      {/* Adapter selector tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {adapters.map((a) => (
          <button
            key={a.id}
            onClick={() => setSelectedAdapterId(a.id)}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-2 ${
              selected.id === a.id
                ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/40 shadow-sm'
                : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800/80'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${a.status === 'Up' ? 'bg-emerald-400' : 'bg-slate-600'}`}
            />
            <span>{a.name}</span>
            {a.isActive && (
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 font-mono">
                Active
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Selected Adapter Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* IPv4 Address */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>IPv4 Address</span>
            <button
              onClick={() => handleCopy(selected.ipv4[0] || '', 'ipv4')}
              className="text-slate-500 hover:text-cyan-400 transition"
              title="Copy IPv4"
            >
              {copiedKey === 'ipv4' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
          <div className="text-lg font-mono font-bold text-cyan-400">
            {selected.ipv4[0] || 'Not Assigned'}
          </div>
          <div className="text-[11px] text-slate-500 font-mono">Subnet Mask: 255.255.255.0 (/24)</div>
        </div>

        {/* Default Gateway */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Default Gateway</span>
            <button
              onClick={() => handleCopy(selected.gateways[0] || '', 'gw')}
              className="text-slate-500 hover:text-indigo-400 transition"
              title="Copy Gateway"
            >
              {copiedKey === 'gw' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
          <div className="text-lg font-mono font-bold text-indigo-400">
            {selected.gateways[0] || 'On-Link (Direct)'}
          </div>
          <div className="text-[11px] text-slate-500">Router Next-Hop Reachability</div>
        </div>

        {/* MAC Address */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Physical (MAC) Address</span>
            <button
              onClick={() => handleCopy(selected.mac, 'mac')}
              className="text-slate-500 hover:text-purple-400 transition"
              title="Copy MAC"
            >
              {copiedKey === 'mac' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
          <div className="text-sm font-mono font-bold text-slate-200 uppercase">{selected.mac}</div>
          <div className="text-[11px] text-slate-500">Hardware Layer 2 Identifier</div>
        </div>

        {/* Link Speed */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
          <span className="text-xs text-slate-400 block">Link Speed &amp; State</span>
          <div className="text-lg font-bold text-slate-100">{selected.speed}</div>
          <div className="text-[11px] text-emerald-400 font-medium">Status: {selected.status} (Operational)</div>
        </div>

        {/* DHCP Status */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
          <span className="text-xs text-slate-400 block">DHCP Lease</span>
          <div className="text-lg font-bold text-slate-100">
            {selected.dhcpEnabled ? 'Enabled (Dynamic)' : 'Disabled (Static IP)'}
          </div>
          <div className="text-[11px] text-slate-500">Automatic IPv4 address acquisition</div>
        </div>

        {/* DNS Resolvers */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
          <span className="text-xs text-slate-400 block">Configured DNS Servers</span>
          <div className="text-sm font-mono font-semibold text-slate-200">
            {selected.dnsServers.join(', ') || '1.1.1.1, 8.8.8.8'}
          </div>
          <div className="text-[11px] text-slate-500">Primary and fallback resolvers</div>
        </div>
      </div>

      {/* Comprehensive Raw Details Card */}
      <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-slate-200">Extended Interface Properties</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-950 text-slate-400 uppercase font-mono text-[10px]">
              <tr>
                <th className="p-3">Property</th>
                <th className="p-3">Value</th>
                <th className="p-3">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              <tr>
                <td className="p-3 font-semibold text-slate-400">Adapter Name</td>
                <td className="p-3 font-mono text-cyan-400">{selected.name}</td>
                <td className="p-3 text-slate-500">Operating system designated interface identifier</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-slate-400">Hardware Description</td>
                <td className="p-3 text-slate-200">{selected.description}</td>
                <td className="p-3 text-slate-500">Device driver and chipset product name</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-slate-400">Interface Type</td>
                <td className="p-3 font-mono text-slate-300">{selected.type}</td>
                <td className="p-3 text-slate-500">Ethernet 802.3, Wireless 802.11, or Tunneling</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-slate-400">IPv6 Unicast</td>
                <td className="p-3 font-mono text-slate-300">{selected.ipv6.join(' / ') || 'None'}</td>
                <td className="p-3 text-slate-500">Link-local or global unicast IPv6 address</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
