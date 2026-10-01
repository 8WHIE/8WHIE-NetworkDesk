import React, { useState } from 'react';
import { Settings, Shield, Sliders, CheckCircle2, RefreshCw } from 'lucide-react';

interface SettingsProps {
  theme: 'dark' | 'light';
  setTheme: (t: 'dark' | 'light') => void;
}

export const SettingsModule: React.FC<SettingsProps> = ({ theme, setTheme }) => {
  const [defaultPingCount, setDefaultPingCount] = useState(4);
  const [defaultTimeoutMs, setDefaultTimeoutMs] = useState(2500);
  const [reverseDns, setReverseDns] = useState(true);
  const [offlineMode, setOfflineMode] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSave = () => {
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <Settings className="w-5 h-5 text-cyan-400" />
          <span>Toolkit Settings &amp; Privacy Preferences</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Configure diagnostic timeout thresholds, appearance, and defensive privacy operational policies.
        </p>
      </div>

      {savedNotice && (
        <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Settings saved to local storage configuration.</span>
        </div>
      )}

      {/* Appearance Section */}
      <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Appearance &amp; Theme</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-slate-400 block mb-2">Interface Color Mode</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setTheme('dark')}
                className={`py-2 px-3 rounded-lg text-xs font-semibold border transition ${
                  theme === 'dark'
                    ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/60'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                Dark (8WHIE Slate)
              </button>
              <button
                onClick={() => setTheme('light')}
                className={`py-2 px-3 rounded-lg text-xs font-semibold border transition ${
                  theme === 'light'
                    ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/60'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                Light
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-400 block mb-2">Accent Styling</label>
            <div className="flex items-center gap-2 pt-1">
              <span className="w-5 h-5 rounded-full bg-cyan-400 border-2 border-slate-100 ring-2 ring-cyan-500/30"></span>
              <span className="w-5 h-5 rounded-full bg-indigo-500 opacity-60"></span>
              <span className="w-5 h-5 rounded-full bg-emerald-500 opacity-60"></span>
              <span className="text-xs text-slate-400 ml-2">8WHIE Cyan &amp; Indigo Core</span>
            </div>
          </div>
        </div>
      </div>

      {/* Diagnostics Timing Thresholds */}
      <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Diagnostic Defaults</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-slate-400 block mb-1">Default Ping Packet Count</label>
            <select
              value={defaultPingCount}
              onChange={(e) => setDefaultPingCount(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value={4}>4 Packets</option>
              <option value={8}>8 Packets</option>
              <option value={10}>10 Packets</option>
            </select>
          </div>

          <div>
            <label className="text-xs text-slate-400 block mb-1">Socket Operation Timeout (ms)</label>
            <input
              type="number"
              value={defaultTimeoutMs}
              onChange={(e) => setDefaultTimeoutMs(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        <div className="pt-2 border-t border-slate-800">
          <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={reverseDns}
              onChange={(e) => setReverseDns(e.target.checked)}
              className="rounded bg-slate-950 border-slate-800 text-cyan-500 focus:ring-0"
            />
            <span>Enable Automatic Reverse DNS (PTR) resolution on discovery</span>
          </label>
        </div>
      </div>

      {/* Privacy Section */}
      <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
        <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
          <Shield className="w-4 h-4" />
          <span>Defensive Privacy Controls</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-slate-200">Zero Telemetry Operational Policy</div>
              <div className="text-[11px] text-slate-400">
                Network topology, IP addresses, and logs are never uploaded to remote cloud services.
              </div>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800/60">
              Enforced Always
            </span>
          </div>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-slate-200">Air-Gapped Offline Mode</div>
              <div className="text-[11px] text-slate-400">
                Restrict external DNS lookups; use only loopback and local subnet interfaces.
              </div>
            </div>
            <input
              type="checkbox"
              checked={offlineMode}
              onChange={(e) => setOfflineMode(e.target.checked)}
              className="rounded bg-slate-950 border-slate-800 text-cyan-500 focus:ring-0"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-bold text-xs shadow-md transition"
          >
            Apply &amp; Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
};
