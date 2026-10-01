import React, { useState } from 'react';
import { Search, Globe, Clock, Download, AlertCircle, Server, Check } from 'lucide-react';
import { DnsRecord } from '../../types/network';

export const DnsModule: React.FC = () => {
  const [domain, setDomain] = useState('google.com');
  const [recordType, setRecordType] = useState('A');
  const [customServer, setCustomServer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [records, setRecords] = useState<DnsRecord[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleQuery = async () => {
    if (!domain.trim()) return;
    setIsLoading(true);
    setErrorMsg(null);
    setRecords([]);

    try {
      const res = await fetch('/api/diagnostics/dns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hostname: domain.trim(),
          recordType,
          dnsServer: customServer.trim() || undefined
        })
      });

      const data = await res.json();
      if (!data.success) {
        setErrorMsg(data.error || 'DNS query failed');
        return;
      }

      const formatted: DnsRecord[] = (data.records || []).map((r: any) => {
        let valStr = '';
        if (typeof r === 'string') {
          valStr = r;
        } else if (Array.isArray(r)) {
          valStr = r.join(' ');
        } else if (typeof r === 'object') {
          if (r.address) valStr = r.address;
          else if (r.exchange) valStr = `${r.exchange} (Priority: ${r.priority})`;
          else if (r.nsname) valStr = r.nsname;
          else valStr = JSON.stringify(r);
        } else {
          valStr = String(r);
        }

        return {
          queryName: data.hostname,
          recordType: data.recordType,
          value: valStr,
          ttl: r.ttl || 300,
          elapsedMs: data.elapsedMs || 12,
          server: data.dnsServerUsed || 'System Default'
        };
      });

      setRecords(formatted);
    } catch (err: any) {
      setErrorMsg(err.message || 'DNS resolution network error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = () => {
    if (!records.length) return;
    const header = 'QueryName,RecordType,Value,TTL,ResponseMs,DnsServer\n';
    const rows = records.map((r) => `"${r.queryName}",${r.recordType},"${r.value.replace(/"/g, '""')}",${r.ttl},${r.elapsedMs},"${r.server}"`).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `8WHIE_DNS_${domain}_${recordType}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <Search className="w-5 h-5 text-cyan-400" />
          <span>DNS Resolution Toolkit</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Perform live DNS queries for standard resource records using system or custom recursive nameservers.
        </p>
      </div>

      {/* Query Bar */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          <div className="col-span-2">
            <label className="text-[11px] font-semibold text-slate-400 block mb-1">Domain or Hostname</label>
            <input
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="e.g. google.com or github.com"
              disabled={isLoading}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-500 disabled:opacity-50"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-400 block mb-1">Record Type</label>
            <select
              value={recordType}
              onChange={(e) => setRecordType(e.target.value)}
              disabled={isLoading}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono disabled:opacity-50"
            >
              <option value="A">A (IPv4 Host)</option>
              <option value="AAAA">AAAA (IPv6 Host)</option>
              <option value="MX">MX (Mail Exchange)</option>
              <option value="TXT">TXT (SPF / Verification)</option>
              <option value="NS">NS (Name Server)</option>
              <option value="CNAME">CNAME (Alias)</option>
              <option value="SOA">SOA (Authority Zone)</option>
              <option value="PTR">PTR (Reverse IP)</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-400 block mb-1">Resolver (Optional)</label>
            <input
              type="text"
              value={customServer}
              onChange={(e) => setCustomServer(e.target.value)}
              placeholder="e.g. 1.1.1.1 or 8.8.8.8"
              disabled={isLoading}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-500 disabled:opacity-50"
            />
          </div>
        </div>

        {/* Quick Presets for DNS Servers */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800 text-xs">
          <span className="text-slate-500 text-[11px]">Popular Resolvers:</span>
          <button
            onClick={() => setCustomServer('1.1.1.1')}
            className="px-2 py-0.5 rounded bg-slate-950 hover:bg-slate-800 border border-slate-800 text-[11px] text-cyan-400 font-mono"
          >
            Cloudflare (1.1.1.1)
          </button>
          <button
            onClick={() => setCustomServer('8.8.8.8')}
            className="px-2 py-0.5 rounded bg-slate-950 hover:bg-slate-800 border border-slate-800 text-[11px] text-indigo-400 font-mono"
          >
            Google (8.8.8.8)
          </button>
          <button
            onClick={() => setCustomServer('9.9.9.9')}
            className="px-2 py-0.5 rounded bg-slate-950 hover:bg-slate-800 border border-slate-800 text-[11px] text-emerald-400 font-mono"
          >
            Quad9 (9.9.9.9)
          </button>
          <button
            onClick={() => setCustomServer('')}
            className="px-2 py-0.5 rounded bg-slate-950 hover:bg-slate-800 border border-slate-800 text-[11px] text-slate-400 font-mono"
          >
            System Default
          </button>

          <div className="ml-auto flex items-center gap-2">
            {records.length > 0 && (
              <button
                onClick={handleExport}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 font-semibold transition"
              >
                <Download className="w-3.5 h-3.5 text-cyan-400" />
                <span>Export CSV</span>
              </button>
            )}

            <button
              onClick={handleQuery}
              disabled={isLoading || !domain.trim()}
              className="flex items-center gap-2 px-5 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-bold text-xs shadow-md transition disabled:opacity-50"
            >
              <Search className="w-3.5 h-3.5" />
              <span>{isLoading ? 'Querying...' : 'Query DNS'}</span>
            </button>
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="p-3 rounded-xl bg-red-950/30 border border-red-800/40 text-red-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Results Table */}
      {records.length > 0 && (
        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Discovered Records ({records.length})
            </h3>
            <span className="text-xs font-mono text-cyan-400">
              Resolved in {records[0]?.elapsedMs} ms via {records[0]?.server}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-950 text-slate-400 uppercase font-mono text-[10px]">
                <tr>
                  <th className="p-3">Type</th>
                  <th className="p-3">Query Name</th>
                  <th className="p-3">Resolved Value</th>
                  <th className="p-3">TTL</th>
                  <th className="p-3">Resolver</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-slate-300">
                {records.map((r, i) => (
                  <tr key={i} className="hover:bg-slate-950/40">
                    <td className="p-3 font-mono font-bold text-cyan-400">
                      <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/60">
                        {r.recordType}
                      </span>
                    </td>
                    <td className="p-3 font-mono">{r.queryName}</td>
                    <td className="p-3 font-mono font-bold text-slate-100 break-all">{r.value}</td>
                    <td className="p-3 font-mono text-slate-400">{r.ttl}s</td>
                    <td className="p-3 font-mono text-slate-500">{r.server}</td>
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
