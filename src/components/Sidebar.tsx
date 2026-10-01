import React from 'react';
import {
  LayoutDashboard,
  Network,
  Activity,
  GitCommitHorizontal,
  Search,
  Calculator,
  ShieldCheck,
  Radar,
  Radio,
  Wifi,
  SlidersHorizontal,
  Terminal,
  Bookmark,
  ScrollText,
  Settings,
  Info,
  BookOpen,
  Download
} from 'lucide-react';
import { ModuleId } from '../types/network';

interface SidebarProps {
  activeModule: ModuleId;
  setActiveModule: (id: ModuleId) => void;
  onDownloadSolution: () => void;
  isDownloading: boolean;
}

interface NavItem {
  id: ModuleId;
  label: string;
  icon: React.ReactNode;
  badge?: string;
  category?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeModule,
  setActiveModule,
  onDownloadSolution,
  isDownloading
}) => {
  const items: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'network-info', label: 'Network Info', icon: <Network className="w-4 h-4" /> },
    { id: 'ping', label: 'Ping Diagnostics', icon: <Activity className="w-4 h-4" />, badge: 'Live' },
    { id: 'traceroute', label: 'Traceroute', icon: <GitCommitHorizontal className="w-4 h-4" /> },
    { id: 'dns', label: 'DNS Toolkit', icon: <Search className="w-4 h-4" /> },
    { id: 'subnet', label: 'IP & Subnet Calc', icon: <Calculator className="w-4 h-4" /> },
    { id: 'port-probe', label: 'Port Connectivity', icon: <ShieldCheck className="w-4 h-4" />, badge: 'Safe' },
    { id: 'discovery', label: 'Local Discovery', icon: <Radar className="w-4 h-4" /> },
    { id: 'connections', label: 'Active Sockets', icon: <Radio className="w-4 h-4" /> },
    { id: 'routing', label: 'Routing Table', icon: <SlidersHorizontal className="w-4 h-4" /> },
    { id: 'wifi', label: 'Wi-Fi Details', icon: <Wifi className="w-4 h-4" /> },
    { id: 'adapter-mgmt', label: 'Adapter Control', icon: <Terminal className="w-4 h-4" /> },
    { id: 'remote-tools', label: 'Remote Tools Hub', icon: <Terminal className="w-4 h-4" /> },
    { id: 'profiles', label: 'Saved Profiles', icon: <Bookmark className="w-4 h-4" /> },
    { id: 'logs', label: 'Diagnostic Logs', icon: <ScrollText className="w-4 h-4" /> },
    { id: 'docs', label: 'Docs & Guides', icon: <BookOpen className="w-4 h-4" />, badge: 'Handbook' },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
    { id: 'about', label: 'About 8WHIE', icon: <Info className="w-4 h-4" /> }
  ];

  return (
    <aside className="w-64 bg-slate-950/95 border-r border-slate-800/80 flex flex-col h-screen select-none shrink-0">
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 text-slate-950 font-black tracking-wider text-base">
            8W
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-100 tracking-tight text-sm">8WHIE</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/60 font-semibold">
                8NWT
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">Network Toolkit</p>
          </div>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-0.5 custom-scrollbar">
        <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          Diagnostics & Tools
        </div>
        {items.map((item) => {
          const isActive = activeModule === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveModule(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500/15 to-indigo-500/10 text-cyan-300 border border-cyan-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className={isActive ? 'text-cyan-400' : 'text-slate-500'}>{item.icon}</span>
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-semibold ${
                    item.badge === 'Live'
                      ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/60'
                      : item.badge === 'Safe'
                      ? 'bg-indigo-950/80 text-indigo-400 border border-indigo-800/60'
                      : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Download Solution Action Card */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-900/40">
        <button
          onClick={onDownloadSolution}
          disabled={isDownloading}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-bold text-xs shadow-md transition-all active:scale-[0.98] disabled:opacity-50"
        >
          <Download className="w-3.5 h-3.5" />
          <span>{isDownloading ? 'Packaging Solution...' : 'Download .NET C# Source'}</span>
        </button>

        <div className="mt-2 text-center text-[10px] text-slate-400">
          Created by <span className="text-slate-300 font-semibold">Aryan Thakur</span>
        </div>
      </div>
    </aside>
  );
};
