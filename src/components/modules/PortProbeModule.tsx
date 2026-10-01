import React, { useState } from 'react';
import {
  ShieldCheck,
  Play,
  Download,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  HelpCircle,
  Shield
} from 'lucide-react';
import { PortProbeResult } from '../../types/network';

const COMMON_PRESETS = [
  { name: 'Web Services', ports: '80, 443, 8080, 8443' },
  { name: 'Remote Access', ports: '22, 3389, 5900, 23' },
  { name: 'Databases', ports: '3306, 5432, 1433, 27017, 6379' },
  { name: 'Mail Services', ports: '25, 465, 587, 110, 993, 995' },
  { name: 'Infrastructure', ports: '53, 123, 445, 853, 389' }
];

const KNOWN_SERVICES: Record<number, string> = {
  20: 'FTP Data',
  21: 'FTP Control',
  22: 'SSH (Secure Shell)',
  23: 'Telnet',
  25: 'SMTP (Mail Transfer)',
  53: 'DNS (Domain Name System)',
  80: 'HTTP (Web Server)',
  110: 'POP3',
  123: 'NTP (Network Time)',
  143: 'IMAP',
  389: 'LDAP',
  443: 'HTTPS (TLS Web Server)',
  445: 'SMB (File Sharing)',
  465: 'SMTPS',
  587: 'SMTP Submission',
  993: 'IMAPS',
  995: 'POP3S',
  1433: 'MS SQL Server',
  1521: 'Oracle Database',
  3306: 'MySQL Database',
  3389: 'RDP (Remote Desktop)',
  5432: 'PostgreSQL Database',
  5900: 'VNC Remote Display',
  6379: 'Redis Key-Value',
  8080: 'HTTP Alternate',
  8443: 'HTTPS Alternate',
  27017: 'MongoDB Database'
};

export const PortProbeModule: React.FC = () => {
  const [host, setHost] = useState('1.1.1.1');
  const [portsInput, setPortsInput] = useState('80, 443, 53, 853, 22, 3389');
  const [timeoutMs, setTimeoutMs] = useState(2000);
  const [isProbing, setIsProbing] = useState(false);
  const [results, setResults] = useState<PortProbeResult[]>([]);

  const handleStartProbe = async () => {
    if (!host.trim()) return;

    const rawPorts = portsInput
      .split(/[,;\s]+/)
      .map((p) => parseInt(p.trim(), 10))
      .filter((p) => !isNaN(p) && p > 0 && p <= 65535);

    const uniquePorts = Array.from(new Set(rawPorts));
    if (!uniquePorts.length) return;

    setIsProbing(true);
    setResults([]);

    const cleanHost = host.trim();

    for (const port of uniquePorts) {
      try {
        const res = await fetch('/api/diagnostics/port', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ host: cleanHost, port, timeoutMs })
        });
        const data = await res.json();

        setResults((prev) => [
          ...prev,
          {
            host: cleanHost,
            port,
            service: KNOWN_SERVICES[port] || 'Unknown Service',
            status: data.status || 'closed',
            durationMs: data.durationMs || 0,
            message: data.error || (data.status === 'open' ? 'TCP Handshake completed' : 'No connection established')
          }
        ]);
      } catch (err: any) {
        setResults((prev) => [
          ...prev,
          {
            host: cleanHost,
            port,
            service: KNOWN_SERVICES[port] || 'Unknown Service',
            status: 'error',
            durationMs: 0,
            message: err.message || 'Request failed'
          }
        ]);
      }
    }

    setIsProbing(false);
  };

  const handleExport = () => {
    if (!results.length) return;
    const header = 'Host,Port,Service,Status,DurationMs,Message\n';
    const rows = results
      .map((r) => `"${r.host}",${r.port},"${r.service}","${r.status}",${r.durationMs},"${r.message.replace(/"/g, '""')}"`)
      .join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `8WHIE_PortCheck_${host}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-cyan-400" />
          <span>Safe TCP Port Connectivity Check</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Defensive verification of TCP socket reachability, firewall rules, and service readiness for hosts you own or are authorized to test.
        </p>
      </div>

      {/* Defensive Authorization Notice */}
      <div className="p-3.5 rounded-xl bg-indigo-950/30 border border-indigo-800/40 text-xs text-indigo-300 flex items-start gap-2.5">
        <Shield className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-slate-200">Ethical Diagnostic Disclaimer:</span> This utility performs standard, non-stealth TCP handshakes for legitimate troubleshooting. You must only probe endpoints and networks you own or have explicit authorization to administer.
        </div>
      </div>

      {/* Control Box */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          <div className="col-span-2">
            <label className="text-[11px] font-semibold text-slate-400 block mb-1">Target Host / IP</label>
            <input
              type="text"
              value={host}
              onChange={(e) => setHost(e.target.value)}
              placeholder="e.g. 1.1.1.1 or 192.168.1.1"
              disabled={isProbing}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-500 disabled:opacity-50"
            />
          </div>

          <div className="col-span-2">
            <label className="text-[11px] font-semibold text-slate-400 block mb-1">Ports to Test (Comma separated)</label>
            <input
              type="text"
              value={portsInput}
              onChange={(e) => setPortsInput(e.target.value)}
              placeholder="e.g. 80, 443, 22, 3389"
              disabled={isProbing}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-500 disabled:opacity-50"
            />
          </div>
        </div>

        {/* Common Presets */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800 text-xs">
          <span className="text-slate-500 text-[11px]">Port Presets:</span>
          {COMMON_PRESETS.map((p) => (
            <button
              key={p.name}
              onClick={() => setPortsInput(p.ports)}
              disabled={isProbing}
              className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 text-[11px] transition"
            >
              {p.name}
            </button>
          ))}

          <div className="ml-auto flex items-center gap-2">
            {results.length > 0 && (
              <button
                onClick={handleExport}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 font-semibold transition"
              >
                <Download className="w-3.5 h-3.5 text-cyan-400" />
                <span>Export CSV</span>
              </button>
            )}

            <button
              onClick={handleStartProbe}
              disabled={isProbing || !host.trim()}
              className="flex items-center gap-2 px-5 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-bold text-xs shadow-md transition disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isProbing ? 'Probing Sockets...' : 'Start Port Check'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Results Table */}
      {results.length > 0 && (
        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Connectivity Results ({results.length})
            </h3>
            <div className="flex items-center gap-4 text-xs font-mono">
              <span className="text-emerald-400">
                {results.filter((r) => r.status === 'open').length} Open
              </span>
              <span className="text-slate-400">
                {results.filter((r) => r.status !== 'open').length} Closed/Filtered
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-950 text-slate-400 uppercase font-mono text-[10px]">
                <tr>
                  <th className="p-3">Port</th>
                  <th className="p-3">Common Service</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Timing</th>
                  <th className="p-3">Diagnostic Message</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-slate-300">
                {results.map((r, i) => (
                  <tr key={i} className="hover:bg-slate-950/40">
                    <td className="p-3 font-mono font-bold text-cyan-400">{r.port}</td>
                    <td className="p-3 font-medium text-slate-200">{r.service}</td>
                    <td className="p-3">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-bold uppercase ${
                          r.status === 'open'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/60'
                            : r.status === 'closed'
                            ? 'bg-slate-800 text-slate-300 border border-slate-700'
                            : r.status === 'filtered'
                            ? 'bg-amber-950 text-amber-400 border border-amber-800/60'
                            : 'bg-red-950 text-red-400 border border-red-800/60'
                        }`}
                      >
                        {r.status === 'open' && <CheckCircle2 className="w-3 h-3" />}
                        {r.status === 'closed' && <XCircle className="w-3 h-3" />}
                        {r.status}
                      </span>
                    </td>
                    <td className="p-3 font-mono text-slate-400">{r.durationMs} ms</td>
                    <td className="p-3 text-slate-400 font-mono text-[11px] truncate max-w-xs">
                      {r.message}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
