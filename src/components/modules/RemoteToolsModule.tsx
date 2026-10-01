import React, { useState } from 'react';
import { Terminal, Copy, Check, ExternalLink, Monitor, Shield, Server, Laptop } from 'lucide-react';

export const RemoteToolsModule: React.FC = () => {
  const [targetHost, setTargetHost] = useState('192.168.1.50');
  const [port, setPort] = useState(22);
  const [username, setUsername] = useState('admin');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const rdpCmd = `mstsc.exe /v:${targetHost}${port !== 3389 ? `:${port}` : ''}`;
  const sshCmd = `ssh ${username ? `${username}@` : ''}${targetHost}${port !== 22 ? ` -p ${port}` : ''}`;
  const pssessionCmd = `Enter-PSSession -ComputerName "${targetHost}"`;
  const testNetCmd = `Test-NetConnection -ComputerName "${targetHost}" -Port ${port}`;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <Terminal className="w-5 h-5 text-cyan-400" />
          <span>Remote Administrative Tools Hub</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Quick launcher and syntax generator for legitimate system administration protocols (RDP, SSH, PowerShell Remoting).
        </p>
      </div>

      {/* Target configuration box */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Session Target Parameters</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-[11px] font-semibold text-slate-400 block mb-1">Target Host / IP</label>
            <input
              type="text"
              value={targetHost}
              onChange={(e) => setTargetHost(e.target.value)}
              placeholder="e.g. 192.168.1.50"
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-400 block mb-1">Port</label>
            <input
              type="number"
              value={port}
              onChange={(e) => setPort(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-400 block mb-1">Username (Optional)</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. administrator"
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>
      </div>

      {/* Generated Commands and Launchers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* RDP Card */}
        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-cyan-400 font-semibold text-xs">
              <Monitor className="w-4 h-4" />
              <span>Remote Desktop (mstsc)</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
              Port 3389
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Launch native Windows Remote Desktop Connection client for graphical desktop sessions.
          </p>
          <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-cyan-300 flex items-center justify-between">
            <span className="truncate mr-2">{rdpCmd}</span>
            <button
              onClick={() => handleCopy(rdpCmd, 'rdp')}
              className="text-slate-400 hover:text-cyan-400 shrink-0"
            >
              {copiedKey === 'rdp' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* SSH Card */}
        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs">
              <Terminal className="w-4 h-4" />
              <span>Secure Shell (SSH)</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
              Port 22
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Encrypted terminal connection for Linux, router, or Windows OpenSSH servers.
          </p>
          <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-indigo-300 flex items-center justify-between">
            <span className="truncate mr-2">{sshCmd}</span>
            <button
              onClick={() => handleCopy(sshCmd, 'ssh')}
              className="text-slate-400 hover:text-indigo-400 shrink-0"
            >
              {copiedKey === 'ssh' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* PowerShell Test-NetConnection */}
        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs">
              <Server className="w-4 h-4" />
              <span>PowerShell Port Test</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
              Test-NetConnection
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Native Windows PowerShell network route, ping, and TCP socket diagnostic cmdlet.
          </p>
          <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-emerald-300 flex items-center justify-between">
            <span className="truncate mr-2">{testNetCmd}</span>
            <button
              onClick={() => handleCopy(testNetCmd, 'testnet')}
              className="text-slate-400 hover:text-emerald-400 shrink-0"
            >
              {copiedKey === 'testnet' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* PowerShell Remoting */}
        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-purple-400 font-semibold text-xs">
              <Laptop className="w-4 h-4" />
              <span>WinRM PowerShell Remoting</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
              Enter-PSSession
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Interactive PowerShell remoting session via Windows Remote Management (WinRM).
          </p>
          <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-purple-300 flex items-center justify-between">
            <span className="truncate mr-2">{pssessionCmd}</span>
            <button
              onClick={() => handleCopy(pssessionCmd, 'pssession')}
              className="text-slate-400 hover:text-purple-400 shrink-0"
            >
              {copiedKey === 'pssession' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
