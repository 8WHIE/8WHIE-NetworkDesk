import React, { useState } from 'react';
import {
  Activity,
  Play,
  Square,
  Download,
  AlertCircle,
  Clock,
  TrendingDown,
  TrendingUp,
  Percent,
  CheckCircle2
} from 'lucide-react';
import { PingProbe, PingSession } from '../../types/network';

export const PingModule: React.FC = () => {
  const [host, setHost] = useState('1.1.1.1');
  const [packetCount, setPacketCount] = useState(4);
  const [timeoutMs, setTimeoutMs] = useState(2000);
  const [isRunning, setIsRunning] = useState(false);
  const [session, setSession] = useState<PingSession | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleStartPing = async () => {
    if (!host.trim()) return;

    setIsRunning(true);
    setErrorMsg(null);
    setSession({
      target: host.trim(),
      sent: 0,
      received: 0,
      lossPercent: 0,
      minMs: 0,
      maxMs: 0,
      avgMs: 0,
      probes: []
    });

    try {
      const res = await fetch('/api/diagnostics/ping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ host: host.trim(), count: packetCount })
      });

      const data = await res.json();
      if (!data.success) {
        setErrorMsg(data.error || 'Diagnostic ping failed');
        return;
      }

      const probes: PingProbe[] = (data.samples || []).map((s: any) => ({
        sequence: s.sequence,
        latencyMs: s.latencyMs,
        status: s.status,
        timestamp: new Date().toLocaleTimeString()
      }));

      setSession({
        target: data.host,
        sent: data.packetsSent,
        received: data.packetsReceived,
        lossPercent: data.packetLossPercentage,
        minMs: data.minLatencyMs,
        maxMs: data.maxLatencyMs,
        avgMs: data.avgLatencyMs,
        probes
      });
    } catch (err: any) {
      setErrorMsg(err.message || 'Network request failed');
    } finally {
      setIsRunning(false);
    }
  };

  const handleExportCsv = () => {
    if (!session || !session.probes.length) return;
    const header = 'Sequence,Host,LatencyMs,Status,Timestamp\n';
    const rows = session.probes
      .map((p) => `${p.sequence},"${session.target}",${p.latencyMs},"${p.status}","${p.timestamp}"`)
      .join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `8WHIE_Ping_${session.target}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <Activity className="w-5 h-5 text-cyan-400" />
          <span>Ping Diagnostic Engine</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Measure round-trip time, packet jitter, and transmission reliability to internal or external hosts.
        </p>
      </div>

      {/* Control Bar */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          <div className="col-span-2">
            <label className="text-[11px] font-semibold text-slate-400 block mb-1">Target Host / IP</label>
            <input
              type="text"
              value={host}
              onChange={(e) => setHost(e.target.value)}
              placeholder="e.g. 1.1.1.1 or google.com"
              disabled={isRunning}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-500 disabled:opacity-50"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-400 block mb-1">Packet Count</label>
            <select
              value={packetCount}
              onChange={(e) => setPacketCount(Number(e.target.value))}
              disabled={isRunning}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 disabled:opacity-50"
            >
              <option value={4}>4 Packets</option>
              <option value={6}>6 Packets</option>
              <option value={8}>8 Packets</option>
              <option value={10}>10 Packets</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-400 block mb-1">Timeout (ms)</label>
            <input
              type="number"
              value={timeoutMs}
              onChange={(e) => setTimeoutMs(Number(e.target.value))}
              disabled={isRunning}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-500 disabled:opacity-50"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
          <div className="flex items-center gap-2">
            <button
              onClick={handleStartPing}
              disabled={isRunning || !host.trim()}
              className="flex items-center gap-2 px-5 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-bold text-xs shadow-md transition disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isRunning ? 'Probing...' : 'Start Ping'}</span>
            </button>
          </div>

          {session && session.probes.length > 0 && (
            <button
              onClick={handleExportCsv}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 font-semibold transition"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>Export CSV</span>
            </button>
          )}
        </div>
      </div>

      {errorMsg && (
        <div className="p-3 rounded-xl bg-red-950/30 border border-red-800/40 text-red-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Latency Visualization & Metrics Cards */}
      {session && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-[11px] text-slate-400 font-medium block mb-1">Average Latency</span>
            <div className="text-2xl font-bold font-mono text-cyan-400">{session.avgMs} ms</div>
            <span className="text-[10px] text-slate-500">Mean round-trip time</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-[11px] text-slate-400 font-medium block mb-1">Packet Loss</span>
            <div className="text-2xl font-bold font-mono text-emerald-400">{session.lossPercent}%</div>
            <span className="text-[10px] text-slate-500">{session.received}/{session.sent} received</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-[11px] text-slate-400 font-medium block mb-1">Minimum Latency</span>
            <div className="text-2xl font-bold font-mono text-indigo-400">{session.minMs} ms</div>
            <span className="text-[10px] text-slate-500">Fastest probe</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-[11px] text-slate-400 font-medium block mb-1">Maximum Latency</span>
            <div className="text-2xl font-bold font-mono text-amber-400">{session.maxMs} ms</div>
            <span className="text-[10px] text-slate-500">Peak round-trip delay</span>
          </div>
        </div>
      )}

      {/* Latency Bar Graph */}
      {session && session.probes.length > 0 && (
        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Latency Response Distribution
          </h3>
          <div className="h-32 flex items-end gap-3 pt-4 px-2 border-b border-slate-800">
            {session.probes.map((p) => {
              const maxScale = Math.max(...session.probes.map((pr) => pr.latencyMs), 40);
              const heightPercent = p.latencyMs >= 0 ? Math.min(100, Math.max(10, (p.latencyMs / maxScale) * 100)) : 5;
              const isFail = p.latencyMs < 0;

              return (
                <div key={p.sequence} className="flex-1 flex flex-col items-center gap-1 group">
                  <span className="text-[10px] font-mono text-slate-400 opacity-80 group-hover:opacity-100">
                    {isFail ? 'Drop' : `${p.latencyMs}ms`}
                  </span>
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className={`w-full rounded-t-md transition-all ${
                      isFail
                        ? 'bg-red-500/60'
                        : 'bg-gradient-to-t from-indigo-600 to-cyan-400 group-hover:brightness-125'
                    }`}
                  />
                  <span className="text-[9px] font-mono text-slate-500 mt-1">#{p.sequence}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Probes Results Table */}
      {session && (
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">Probe Logs</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-950 text-slate-400 uppercase font-mono text-[10px]">
                <tr>
                  <th className="p-2.5">Seq</th>
                  <th className="p-2.5">Target</th>
                  <th className="p-2.5">Status</th>
                  <th className="p-2.5">Round-Trip</th>
                  <th className="p-2.5">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-slate-300">
                {session.probes.map((p) => (
                  <tr key={p.sequence} className="hover:bg-slate-950/40">
                    <td className="p-2.5 font-mono text-cyan-400 font-semibold">#{p.sequence}</td>
                    <td className="p-2.5 font-mono">{session.target}</td>
                    <td className="p-2.5">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold ${
                          p.latencyMs >= 0
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/60'
                            : 'bg-red-950 text-red-400 border border-red-800/60'
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="p-2.5 font-mono font-bold text-slate-100">
                      {p.latencyMs >= 0 ? `${p.latencyMs} ms` : 'Timed Out'}
                    </td>
                    <td className="p-2.5 text-slate-500 font-mono">{p.timestamp}</td>
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
