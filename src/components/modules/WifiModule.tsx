import React from 'react';
import { Wifi, Radio, Shield, Signal, CheckCircle2, Lock } from 'lucide-react';
import { WifiInfo } from '../../types/network';

export const WifiModule: React.FC = () => {
  const wifi: WifiInfo = {
    ssid: '8WHIE-Lab-Secure',
    bssid: 'E4:8D:8C:3B:7A:10',
    signalPercent: 94,
    rssiDbm: -48,
    channel: '36 (5.180 GHz)',
    band: '5 GHz (802.11ax / Wi-Fi 6)',
    security: 'WPA3-Personal (SAE)',
    standard: 'Wi-Fi 6 (802.11ax)',
    connected: true
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <Wifi className="w-5 h-5 text-cyan-400" />
          <span>Wi-Fi &amp; Wireless Adapter Details</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Detailed telemetry for connected wireless access points, frequency bands, and signal link quality.
        </p>
      </div>

      {/* Privacy Guarantee Banner */}
      <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 flex items-start gap-2.5">
        <Lock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-slate-200">Security &amp; Privacy Policy:</span> 8WHIE Network Toolkit only reads standard wireless link statistics provided by the operating system. It never extracts or stores Wi-Fi passwords, credentials, or encryption keys.
        </div>
      </div>

      {/* Main Signal Quality Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/30 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs uppercase font-mono text-emerald-400 font-bold">Connected Access Point</span>
          </div>
          <h3 className="text-3xl font-black text-slate-100 tracking-tight">{wifi.ssid}</h3>
          <p className="text-xs font-mono text-slate-400">BSSID: {wifi.bssid} • Radio: {wifi.standard}</p>
        </div>

        {/* Signal Meter */}
        <div className="flex items-center gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
          <Signal className="w-8 h-8 text-cyan-400" />
          <div>
            <div className="text-2xl font-bold font-mono text-cyan-400">{wifi.signalPercent}%</div>
            <div className="text-xs text-slate-400 font-mono">RSSI: {wifi.rssiDbm} dBm (Excellent)</div>
          </div>
        </div>
      </div>

      {/* Wireless Properties Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400">Frequency Channel</span>
          <div className="text-base font-bold text-slate-100 font-mono">{wifi.channel}</div>
          <span className="text-[10px] text-slate-500">Uncongested 5 GHz spectrum</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400">Wireless Standard</span>
          <div className="text-base font-bold text-indigo-400">{wifi.standard}</div>
          <span className="text-[10px] text-slate-500">OFDMA &amp; MU-MIMO enabled</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400">Security Encryption</span>
          <div className="text-base font-bold text-emerald-400">{wifi.security}</div>
          <span className="text-[10px] text-slate-500">Simultaneous Authentication of Equals</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400">Link Speed (PHY)</span>
          <div className="text-base font-bold text-cyan-400 font-mono">1,201 Mbps / 1,201 Mbps</div>
          <span className="text-[10px] text-slate-500">Tx / Rx negotiated rate</span>
        </div>
      </div>
    </div>
  );
};
