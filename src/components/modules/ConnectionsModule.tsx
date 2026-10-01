import React, { useState, useMemo } from 'react';
import { Radio, Search, Filter, Download, RefreshCw } from 'lucide-react';
import { SocketConnection } from '../../types/network';

export const ConnectionsModule: React.FC = () => {
  const [filterState, setFilterState] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const [connections, setConnections] = useState<SocketConnection[]>([
    { protocol: 'TCP', localAddress: '192.168.1.100', localPort: 52140, remoteAddress: '1.1.1.1', remotePort: 443, state: 'ESTABLISHED', pid: 4892, processName: 'chrome.exe' },
    { protocol: 'TCP', localAddress: '192.168.1.100', localPort: 53112, remoteAddress: '140.82.121.4', remotePort: 443, state: 'ESTABLISHED', pid: 10240, processName: 'Code.exe' },
    { protocol: 'TCP', localAddress: '0.0.0.0', localPort: 135, remoteAddress: '0.0.0.0', remotePort: 0, state: 'LISTENING', pid: 980, processName: 'svchost.exe' },
    { protocol: 'TCP', localAddress: '0.0.0.0', localPort: 445, remoteAddress: '0.0.0.0', remotePort: 0, state: 'LISTENING', pid: 4, processName: 'System' },
    { protocol: 'TCP', localAddress: '127.0.0.1', localPort: 3000, remoteAddress: '0.0.0.0', remotePort: 0, state: 'LISTENING', pid: 14220, processName: 'node.exe' },
    { protocol: 'TCP', localAddress: '192.168.1.100', localPort: 54100, remoteAddress: '104.244.42.1', remotePort: 443, state: 'TIME_WAIT', pid: 0, processName: 'System' },
    { protocol: 'TCP', localAddress: '192.168.1.100', localPort: 55210, remoteAddress: '52.96.166.18', remotePort: 443, state: 'ESTABLISHED', pid: 12048, processName: 'ms-teams.exe' },
    { protocol: 'TCP', localAddress: '0.0.0.0', localPort: 3389, remoteAddress: '0.0.0.0', remotePort: 0, state: 'LISTENING', pid: 1450, processName: 'TermService' }
  ]);

  const filtered = useMemo(() => {
    return connections.filter((c) => {
      const matchesState = filterState === 'ALL' || c.state === filterState;
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        c.localAddress.toLowerCase().includes(q) ||
        String(c.localPort).includes(q) ||
        c.remoteAddress.toLowerCase().includes(q) ||
        String(c.remotePort).includes(q) ||
        c.processName.toLowerCase().includes(q) ||
        String(c.pid).includes(q);

      return matchesState && matchesSearch;
    });
  }, [connections, filterState, searchQuery]);

  const handleExport = () => {
    const header = 'Protocol,LocalAddress,LocalPort,RemoteAddress,RemotePort,State,PID,ProcessName\n';
    const rows = filtered
      .map((c) => `${c.protocol},"${c.localAddress}",${c.localPort},"${c.remoteAddress}",${c.remotePort},"${c.state}",${c.pid},"${c.processName}"`)
      .join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `8WHIE_ActiveConnections.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Radio className="w-5 h-5 text-cyan-400" />
            <span>Active Network Sockets &amp; Connections</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time inspection of open ports, established TCP streams, and owning Windows processes.
          </p>
        </div>

        <button
          onClick={handleExport}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 transition"
        >
          <Download className="w-3.5 h-3.5 text-cyan-400" />
          <span>Export Table (CSV)</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search IP, port, process name, or PID..."
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          {['ALL', 'ESTABLISHED', 'LISTENING', 'TIME_WAIT'].map((s) => (
            <button
              key={s}
              onClick={() => setFilterState(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                filterState === s
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-400'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Connections Table */}
      <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Socket Entries ({filtered.length})
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-950 text-slate-400 uppercase font-mono text-[10px]">
              <tr>
                <th className="p-3">Protocol</th>
                <th className="p-3">Local Address &amp; Port</th>
                <th className="p-3">Remote Endpoint</th>
                <th className="p-3">Socket State</th>
                <th className="p-3">PID</th>
                <th className="p-3">Process</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              {filtered.map((c, i) => (
                <tr key={i} className="hover:bg-slate-950/40">
                  <td className="p-3 font-mono font-bold text-indigo-400">{c.protocol}</td>
                  <td className="p-3 font-mono">
                    <span className="text-slate-300">{c.localAddress}:</span>
                    <span className="text-cyan-400 font-bold">{c.localPort}</span>
                  </td>
                  <td className="p-3 font-mono">
                    <span className="text-slate-400">{c.remoteAddress}:</span>
                    <span className="text-slate-300">{c.remotePort}</span>
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        c.state === 'ESTABLISHED'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/60'
                          : c.state === 'LISTENING'
                          ? 'bg-cyan-950 text-cyan-400 border border-cyan-800/60'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {c.state}
                    </span>
                  </td>
                  <td className="p-3 font-mono text-slate-400">{c.pid || '-'}</td>
                  <td className="p-3 font-medium text-slate-200">{c.processName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
