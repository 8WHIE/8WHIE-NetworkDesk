import React, { useState, useEffect } from 'react';
import { Calculator, Copy, Check, Info, Shield, Layers, HelpCircle } from 'lucide-react';
import { calculateSubnet } from '../../utils/subnetCalculator';
import { SubnetResult } from '../../types/network';

export const SubnetModule: React.FC = () => {
  const [ipInput, setIpInput] = useState('192.168.1.100');
  const [cidr, setCidr] = useState(24);
  const [result, setResult] = useState<SubnetResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    try {
      const res = calculateSubnet(ipInput, cidr);
      setResult(res);
      setErrorMsg(null);
    } catch (err: any) {
      setErrorMsg(err.message);
      setResult(null);
    }
  }, [ipInput, cidr]);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleDirectInput = (val: string) => {
    setIpInput(val);
    if (val.includes('/')) {
      const parts = val.split('/');
      const parsed = parseInt(parts[1], 10);
      if (!isNaN(parsed) && parsed >= 0 && parsed <= 32) {
        setCidr(parsed);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <Calculator className="w-5 h-5 text-cyan-400" />
          <span>IP &amp; Subnet Calculator</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Perform instantaneous, deterministic IPv4 bitmasking, CIDR calculations, and network segmentation breakdown.
        </p>
      </div>

      {/* Input Section */}
      <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="text-[11px] font-semibold text-slate-400 block mb-1">
              IP Address with optional CIDR
            </label>
            <input
              type="text"
              value={ipInput}
              onChange={(e) => handleDirectInput(e.target.value)}
              placeholder="e.g. 192.168.1.100 or 10.0.0.1/16"
              className="w-full px-3 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-semibold text-slate-400">CIDR Prefix</label>
              <span className="text-xs font-mono font-bold text-cyan-400">/{cidr}</span>
            </div>
            <input
              type="range"
              min={0}
              max={32}
              value={cidr}
              onChange={(e) => setCidr(Number(e.target.value))}
              className="w-full accent-cyan-500 h-2 bg-slate-950 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        {/* Quick CIDR buttons */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-800">
          <span className="text-[11px] text-slate-500 mr-1">Common Subnets:</span>
          {[8, 16, 22, 24, 26, 28, 29, 30, 31, 32].map((c) => (
            <button
              key={c}
              onClick={() => setCidr(c)}
              className={`px-2 py-0.5 rounded text-[11px] font-mono transition ${
                cidr === c
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-400'
              }`}
            >
              /{c}
            </button>
          ))}
        </div>
      </div>

      {errorMsg && (
        <div className="p-3 rounded-xl bg-red-950/30 border border-red-800/40 text-red-300 text-xs">
          {errorMsg}
        </div>
      )}

      {/* Main Results Grid */}
      {result && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Network IP */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Network Address</span>
              <button
                onClick={() => handleCopy(result.networkAddress, 'net')}
                className="text-slate-500 hover:text-cyan-400 transition"
              >
                {copiedKey === 'net' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <div className="text-lg font-mono font-bold text-cyan-400">{result.networkAddress}</div>
            <span className="text-[10px] text-slate-500">Route prefix identifier</span>
          </div>

          {/* Broadcast Address */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Broadcast Address</span>
              <button
                onClick={() => handleCopy(result.broadcastAddress, 'bcast')}
                className="text-slate-500 hover:text-indigo-400 transition"
              >
                {copiedKey === 'bcast' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <div className="text-lg font-mono font-bold text-indigo-400">{result.broadcastAddress}</div>
            <span className="text-[10px] text-slate-500">Subnet-wide broadcast destination</span>
          </div>

          {/* Subnet Mask */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Subnet Mask</span>
              <button
                onClick={() => handleCopy(result.subnetMask, 'mask')}
                className="text-slate-500 hover:text-purple-400 transition"
              >
                {copiedKey === 'mask' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <div className="text-lg font-mono font-bold text-purple-400">{result.subnetMask}</div>
            <span className="text-[10px] text-slate-500">Wildcard: {result.wildcardMask}</span>
          </div>

          {/* Usable Hosts Count */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
            <span className="text-xs text-slate-400 block">Usable Hosts</span>
            <div className="text-xl font-mono font-bold text-emerald-400">
              {result.usableHosts.toLocaleString()}
            </div>
            <span className="text-[10px] text-slate-500">Total addresses: {result.totalAddresses.toLocaleString()}</span>
          </div>
        </div>
      )}

      {/* Detailed Address Range & Binary Breakdown */}
      {result && (
        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Usable Host Range &amp; Bitmask Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">First Usable Host</span>
                <span className="font-mono text-cyan-400 font-bold">{result.firstUsable}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Last Usable Host</span>
                <span className="font-mono text-indigo-400 font-bold">{result.lastUsable}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">IPv4 Address Class</span>
                <span className="font-semibold text-slate-200">Class {result.ipClass}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Subnet Scope</span>
                <span
                  className={`px-2 py-0.5 rounded font-semibold text-[10px] ${
                    result.isPrivate
                      ? 'bg-amber-950 text-amber-400 border border-amber-800/60'
                      : 'bg-emerald-950 text-emerald-400 border border-emerald-800/60'
                  }`}
                >
                  {result.isPrivate ? 'RFC 1918 Private' : 'Public Internet'}
                </span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-3">
              <div>
                <span className="text-slate-500 text-[10px] uppercase font-mono block mb-1">
                  Binary IP Address (32 Bits)
                </span>
                <div className="font-mono text-[11px] text-cyan-300 bg-slate-900/80 p-2 rounded border border-slate-800 tracking-wider">
                  {result.binaryIp}
                </div>
              </div>

              <div>
                <span className="text-slate-500 text-[10px] uppercase font-mono block mb-1">
                  Binary Subnet Mask ({result.cidr} Network Bits)
                </span>
                <div className="font-mono text-[11px] text-indigo-300 bg-slate-900/80 p-2 rounded border border-slate-800 tracking-wider">
                  {result.binaryMask}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
