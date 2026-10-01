import React, { useState, useMemo } from 'react';
import { ScrollText, Search, Download, Trash2, ShieldCheck, Check } from 'lucide-react';
import { DiagnosticLog } from '../../types/network';

export const LogsModule: React.FC = () => {
  const [levelFilter, setLevelFilter] = useState<string>('ALL');
  const [search, setSearch] = useState('');
  const [logs, setLogs] = useState<DiagnosticLog[]>([
    { id: '1', timestamp: '2026-10-01 12:00:01', level: 'INFO', component: 'Core.Engine', message: '8WHIE Network Toolkit initialized successfully.' },
    { id: '2', timestamp: '2026-10-01 12:00:02', level: 'INFO', component: 'AdapterManager', message: 'Active network adapter identified: Ethernet (Intel I219-V, 1000 Mbps).' },
    { id: '3', timestamp: '2026-10-01 12:00:05', level: 'INFO', component: 'SubnetEngine', message: 'Subnet table compiled: 192.168.1.0/24 with 254 usable addresses.' },
    { id: '4', timestamp: '2026-10-01 12:01:20', level: 'INFO', component: 'DnsResolver', message: 'Resolved domain google.com to 142.250.190.46 via 1.1.1.1 (12ms).' },
    { id: '5', timestamp: '2026-10-01 12:02:15', level: 'DEBUG', component: 'PortScanner', message: 'TCP handshake probe completed for 1.1.1.1:443 (OPEN, 14ms).' },
    { id: '6', timestamp: '2026-10-01 12:03:00', level: 'WARNING', component: 'Traceroute', message: 'Hop #4 response delayed over threshold (>150ms). Route re-probed.' }
  ]);

  const filteredLogs = useMemo(() => {
    return logs.filter((l) => {
      const matchLevel = levelFilter === 'ALL' || l.level === levelFilter;
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        l.message.toLowerCase().includes(q) ||
        l.component.toLowerCase().includes(q);

      return matchLevel && matchSearch;
    });
  }, [logs, levelFilter, search]);

  const handleClear = () => {
    setLogs([]);
  };

  const handleExport = () => {
    const text = filteredLogs
      .map((l) => `[${l.timestamp}] [${l.level.padEnd(7)}] [${l.component}] ${l.message}`)
      .join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `8WHIE_Diagnostic_Logs.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <ScrollText className="w-5 h-5 text-cyan-400" />
            <span>Structured Diagnostic Logs</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Chronological audit log of networking tests, resolver events, and interface operations. No credentials or keys are ever logged.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleClear}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-400 hover:text-red-400 transition"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Logs</span>
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 transition"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Download Log (.TXT)</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search logs by message or component..."
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          {['ALL', 'INFO', 'WARNING', 'ERROR', 'DEBUG'].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setLevelFilter(lvl)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                levelFilter === lvl
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-400'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Logs Table */}
      <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Entries ({filteredLogs.length})
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-950 text-slate-400 uppercase font-mono text-[10px]">
              <tr>
                <th className="p-3">Timestamp</th>
                <th className="p-3">Level</th>
                <th className="p-3">Component</th>
                <th className="p-3">Log Message</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300 font-mono">
              {filteredLogs.map((l) => (
                <tr key={l.id} className="hover:bg-slate-950/40">
                  <td className="p-3 text-slate-500 text-[11px] whitespace-nowrap">{l.timestamp}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        l.level === 'INFO'
                          ? 'bg-cyan-950 text-cyan-400 border border-cyan-800/60'
                          : l.level === 'WARNING'
                          ? 'bg-amber-950 text-amber-400 border border-amber-800/60'
                          : l.level === 'ERROR'
                          ? 'bg-red-950 text-red-400 border border-red-800/60'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {l.level}
                    </span>
                  </td>
                  <td className="p-3 text-indigo-300 text-xs font-semibold whitespace-nowrap">{l.component}</td>
                  <td className="p-3 text-slate-200 text-xs">{l.message}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
