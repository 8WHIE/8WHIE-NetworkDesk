import React, { useState } from 'react';
import { SlidersHorizontal, Download, RefreshCw } from 'lucide-react';
import { RouteEntry } from '../../types/network';

export const RoutingTableModule: React.FC = () => {
  const [routes] = useState<RouteEntry[]>([
    { destination: '0.0.0.0', netmask: '0.0.0.0', gateway: '192.168.1.1', interface: '192.168.1.100', metric: 25, type: 'Default Gateway' },
    { destination: '127.0.0.0', netmask: '255.0.0.0', gateway: 'On-Link', interface: '127.0.0.1', metric: 331, type: 'Loopback' },
    { destination: '127.0.0.1', netmask: '255.255.255.255', gateway: 'On-Link', interface: '127.0.0.1', metric: 331, type: 'Loopback Host' },
    { destination: '192.168.1.0', netmask: '255.255.255.0', gateway: 'On-Link', interface: '192.168.1.100', metric: 281, type: 'Local Subnet' },
    { destination: '192.168.1.100', netmask: '255.255.255.255', gateway: 'On-Link', interface: '192.168.1.100', metric: 281, type: 'Local Interface' },
    { destination: '192.168.1.255', netmask: '255.255.255.255', gateway: 'On-Link', interface: '192.168.1.100', metric: 281, type: 'Subnet Broadcast' },
    { destination: '224.0.0.0', netmask: '240.0.0.0', gateway: 'On-Link', interface: '192.168.1.100', metric: 281, type: 'Multicast' },
    { destination: '255.255.255.255', netmask: '255.255.255.255', gateway: 'On-Link', interface: '192.168.1.100', metric: 281, type: 'Limited Broadcast' }
  ]);

  const handleExport = () => {
    const header = 'Destination,Netmask,Gateway,Interface,Metric,Type\n';
    const rows = routes.map((r) => `"${r.destination}","${r.netmask}","${r.gateway}","${r.interface}",${r.metric},"${r.type}"`).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `8WHIE_RoutingTable.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-cyan-400" />
            <span>Windows IPv4 Routing Table</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Display system IP forwarding decisions, default gateways, and local on-link route metrics.
          </p>
        </div>

        <button
          onClick={handleExport}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 transition"
        >
          <Download className="w-3.5 h-3.5 text-cyan-400" />
          <span>Export Routes (CSV)</span>
        </button>
      </div>

      <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
          Active Forwarding Table ({routes.length} Rules)
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-950 text-slate-400 uppercase font-mono text-[10px]">
              <tr>
                <th className="p-3">Network Destination</th>
                <th className="p-3">Netmask</th>
                <th className="p-3">Gateway Next-Hop</th>
                <th className="p-3">Interface</th>
                <th className="p-3">Metric</th>
                <th className="p-3">Route Classification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              {routes.map((r, i) => (
                <tr key={i} className="hover:bg-slate-950/40">
                  <td className="p-3 font-mono font-bold text-cyan-400">{r.destination}</td>
                  <td className="p-3 font-mono text-slate-400">{r.netmask}</td>
                  <td className="p-3 font-mono text-indigo-400">{r.gateway}</td>
                  <td className="p-3 font-mono text-slate-300">{r.interface}</td>
                  <td className="p-3 font-mono text-slate-400">{r.metric}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-950 text-slate-300 border border-slate-800">
                      {r.type}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
