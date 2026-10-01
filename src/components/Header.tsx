import React from 'react';
import { Globe, ArrowUpRight, ShieldCheck, Sun, Moon } from 'lucide-react';

interface HeaderProps {
  activeAdapterName: string;
  primaryIp: string;
  gateway: string;
  latencyMs: number | null;
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;
  onQuickPing: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeAdapterName,
  primaryIp,
  gateway,
  latencyMs,
  theme,
  setTheme,
  onQuickPing
}) => {
  return (
    <header className="h-14 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md px-6 flex items-center justify-between shrink-0">
      {/* Network Interface Metrics */}
      <div className="flex items-center gap-6 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-slate-400 font-medium">Adapter:</span>
          <span className="font-semibold text-slate-100">{activeAdapterName || 'Ethernet'}</span>
        </div>

        <div className="hidden md:flex items-center gap-2">
          <span className="text-slate-400 font-medium">IPv4:</span>
          <span className="font-mono text-cyan-400 font-semibold">{primaryIp || '192.168.1.100'}</span>
        </div>

        <div className="hidden lg:flex items-center gap-2">
          <span className="text-slate-400 font-medium">Gateway:</span>
          <span className="font-mono text-indigo-400">{gateway || '192.168.1.1'}</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-medium">Latency:</span>
          <button
            onClick={onQuickPing}
            title="Click to re-probe latency"
            className="flex items-center gap-1 font-mono text-emerald-400 hover:text-emerald-300 font-semibold transition"
          >
            <span>{latencyMs !== null ? `${latencyMs}ms` : '18ms'}</span>
            <ArrowUpRight className="w-3 h-3 text-slate-500" />
          </button>
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
          <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
          <span>Zero Telemetry Policy</span>
        </div>

        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-900 transition"
          title="Toggle UI mode"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
        </button>

        <a
          href="https://www.youtube.com/@8WHIE"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-950/40 border border-red-800/40 text-red-400 hover:bg-red-900/40 text-xs font-semibold transition"
        >
          <Globe className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">YouTube</span>
        </a>
      </div>
    </header>
  );
};
