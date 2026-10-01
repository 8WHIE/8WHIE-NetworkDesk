import React, { useState } from 'react';
import { Terminal, Copy, Check, RefreshCw, Zap, ShieldAlert, Cpu } from 'lucide-react';

export const AdapterManagementModule: React.FC = () => {
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const handleCopy = (cmd: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedCmd(cmd);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  const handleFlushDnsSimulation = () => {
    setActionNotice('DNS Resolver Cache flushed successfully (simulated/ready for admin execution).');
    setTimeout(() => setActionNotice(null), 4000);
  };

  const commands = [
    {
      title: 'Flush DNS Resolver Cache',
      cmd: 'ipconfig /flushdns',
      desc: 'Clears stale or poisoned DNS name lookup cache in Windows.'
    },
    {
      title: 'Release DHCP IPv4 Lease',
      cmd: 'ipconfig /release',
      desc: 'Discards current dynamic IP address assignment from DHCP server.'
    },
    {
      title: 'Renew DHCP IPv4 Lease',
      cmd: 'ipconfig /renew',
      desc: 'Requests a fresh IP lease and subnet parameters from the local router.'
    },
    {
      title: 'Reset TCP/IP Network Stack',
      cmd: 'netsh int ip reset',
      desc: 'Restores TCP/IP protocol registry keys back to factory defaults.'
    },
    {
      title: 'Reset Winsock Catalog',
      cmd: 'netsh winsock reset',
      desc: 'Recovers Windows socket layer from corrupted LSP or third-party proxy hooks.'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <Terminal className="w-5 h-5 text-cyan-400" />
          <span>Network Adapter Administration &amp; Maintenance</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Perform safe Windows networking operations and generate standard elevated command-line recovery recipes.
        </p>
      </div>

      {actionNotice && (
        <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-800/60 text-cyan-300 text-xs font-semibold">
          {actionNotice}
        </div>
      )}

      {/* Quick Action Button Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-cyan-400 font-semibold text-xs">
            <Zap className="w-4 h-4" />
            <span>Flush DNS Cache</span>
          </div>
          <p className="text-xs text-slate-400">
            Purges cached domain name resolutions to resolve outdated server IP mappings.
          </p>
          <button
            onClick={handleFlushDnsSimulation}
            className="w-full py-2 px-3 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 font-semibold text-xs transition"
          >
            Execute DNS Flush
          </button>
        </div>

        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs">
            <RefreshCw className="w-4 h-4" />
            <span>Renew DHCP Lease</span>
          </div>
          <p className="text-xs text-slate-400">
            Re-negotiate network address lease with local gateway router.
          </p>
          <button
            onClick={() => handleCopy('ipconfig /renew')}
            className="w-full py-2 px-3 rounded-lg bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-500/30 text-indigo-300 font-semibold text-xs transition"
          >
            Copy Renew Command
          </button>
        </div>

        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs">
            <ShieldAlert className="w-4 h-4" />
            <span>Winsock Stack Reset</span>
          </div>
          <p className="text-xs text-slate-400">
            Fix corrupted socket layers after malware removal or VPN uninstallations.
          </p>
          <button
            onClick={() => handleCopy('netsh winsock reset')}
            className="w-full py-2 px-3 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 font-semibold text-xs transition"
          >
            Copy Winsock Command
          </button>
        </div>
      </div>

      {/* Commands Library */}
      <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
          Elevated Windows Maintenance Commands
        </h3>

        <div className="space-y-3">
          {commands.map((c) => (
            <div
              key={c.cmd}
              className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="text-xs font-bold text-slate-200">{c.title}</div>
                <div className="text-[11px] text-slate-400">{c.desc}</div>
                <div className="font-mono text-xs text-cyan-400 font-bold bg-slate-900/80 px-2.5 py-1 rounded inline-block border border-slate-800">
                  {c.cmd}
                </div>
              </div>

              <button
                onClick={() => handleCopy(c.cmd)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition shrink-0"
              >
                {copiedCmd === c.cmd ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
