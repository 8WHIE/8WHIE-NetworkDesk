import React, { useState } from 'react';
import { Radar, Play, Download, AlertTriangle, HardDrive, Laptop, Server, Wifi } from 'lucide-react';
import { DiscoveredDevice } from '../../types/network';

export const DiscoveryModule: React.FC = () => {
  const [subnetInput, setSubnetInput] = useState('192.168.1.0/24');
  const [isScanning, setIsScanning] = useState(false);
  const [devices, setDevices] = useState<DiscoveredDevice[]>([
    {
      ip: '192.168.1.1',
      hostname: 'gateway.lan',
      mac: 'E4:8D:8C:1A:2B:3C',
      vendor: 'Ubiquiti Networks',
      latencyMs: 1,
      isOnline: true
    },
    {
      ip: '192.168.1.10',
      hostname: 'nas-storage.lan',
      mac: '00:11:32:4D:5E:6F',
      vendor: 'Synology Inc.',
      latencyMs: 3,
      isOnline: true
    },
    {
      ip: '192.168.1.25',
      hostname: 'printer-office.lan',
      mac: '18:5E:0F:7A:8B:9C',
      vendor: 'HP Inc.',
      latencyMs: 12,
      isOnline: true
    },
    {
      ip: '192.168.1.100',
      hostname: 'desktop-host.lan',
      mac: '48:21:0B:AA:BB:CC',
      vendor: 'Dell Technologies',
      latencyMs: 0,
      isOnline: true
    }
  ]);

  const handleStartScan = async () => {
    setIsScanning(true);
    setDevices([]);

    // Progressive discover simulation on local subnet
    const mockList: DiscoveredDevice[] = [
      { ip: '192.168.1.1', hostname: 'gateway.lan', mac: 'E4:8D:8C:1A:2B:3C', vendor: 'Ubiquiti Networks', latencyMs: 2, isOnline: true },
      { ip: '192.168.1.5', hostname: 'switch-core.lan', mac: 'F0:9F:C2:11:22:33', vendor: 'Cisco Systems', latencyMs: 3, isOnline: true },
      { ip: '192.168.1.10', hostname: 'nas-storage.lan', mac: '00:11:32:4D:5E:6F', vendor: 'Synology Inc.', latencyMs: 4, isOnline: true },
      { ip: '192.168.1.25', hostname: 'printer-office.lan', mac: '18:5E:0F:7A:8B:9C', vendor: 'HP Inc.', latencyMs: 9, isOnline: true },
      { ip: '192.168.1.50', hostname: 'lab-hypervisor.lan', mac: '00:50:56:C0:00:08', vendor: 'VMware Inc.', latencyMs: 1, isOnline: true },
      { ip: '192.168.1.100', hostname: 'workstation.lan', mac: '48:21:0B:AA:BB:CC', vendor: 'Dell Technologies', latencyMs: 0, isOnline: true }
    ];

    for (let i = 0; i < mockList.length; i++) {
      await new Promise((r) => setTimeout(r, 350));
      setDevices((prev) => [...prev, mockList[i]]);
    }

    setIsScanning(false);
  };

  const handleExport = () => {
    if (!devices.length) return;
    const header = 'IP Address,Hostname,MAC Address,Vendor,LatencyMs,Status\n';
    const rows = devices.map((d) => `"${d.ip}","${d.hostname}","${d.mac}","${d.vendor}",${d.latencyMs},"${d.isOnline ? 'Online' : 'Offline'}"`).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `8WHIE_NetworkDiscovery.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <Radar className="w-5 h-5 text-cyan-400" />
          <span>Local Network Discovery</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Perform safe ARP and ICMP discovery across authorized local broadcast domains.
        </p>
      </div>

      {/* Authorization Warning */}
      <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-800/40 text-xs text-amber-300 flex items-start gap-2.5">
        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-slate-200">Authorized Scanning Policy:</span> Only scan local subnets and devices you own or have explicit administrative permission to inventory.
        </div>
      </div>

      {/* Control Box */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex-1 w-full">
          <label className="text-[11px] font-semibold text-slate-400 block mb-1">Target Subnet (CIDR)</label>
          <input
            type="text"
            value={subnetInput}
            onChange={(e) => setSubnetInput(e.target.value)}
            disabled={isScanning}
            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-500 disabled:opacity-50"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto self-end">
          {devices.length > 0 && (
            <button
              onClick={handleExport}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 font-semibold transition"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>Export CSV</span>
            </button>
          )}

          <button
            onClick={handleStartScan}
            disabled={isScanning}
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-bold text-xs shadow-md transition disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{isScanning ? 'Scanning Subnet...' : 'Scan Subnet'}</span>
          </button>
        </div>
      </div>

      {/* Devices List Table */}
      <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Discovered Devices ({devices.length})
          </h3>
          <span className="text-xs text-emerald-400 font-mono">
            {devices.filter((d) => d.isOnline).length} Active Hosts
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-950 text-slate-400 uppercase font-mono text-[10px]">
              <tr>
                <th className="p-3">IP Address</th>
                <th className="p-3">Hostname</th>
                <th className="p-3">MAC Address</th>
                <th className="p-3">Hardware Vendor</th>
                <th className="p-3">Latency</th>
                <th className="p-3">State</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              {devices.map((d, i) => (
                <tr key={i} className="hover:bg-slate-950/40">
                  <td className="p-3 font-mono font-bold text-cyan-400">{d.ip}</td>
                  <td className="p-3 font-mono text-slate-200">{d.hostname}</td>
                  <td className="p-3 font-mono text-slate-400 uppercase">{d.mac}</td>
                  <td className="p-3 font-medium text-slate-300">{d.vendor}</td>
                  <td className="p-3 font-mono text-emerald-400">{d.latencyMs} ms</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800/60">
                      Online
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
