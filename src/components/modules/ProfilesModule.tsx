import React, { useState } from 'react';
import { Bookmark, Plus, Trash2, Download, Upload, Shield, Tag } from 'lucide-react';
import { SavedHostProfile } from '../../types/network';

export const ProfilesModule: React.FC = () => {
  const [profiles, setProfiles] = useState<SavedHostProfile[]>([
    {
      id: '1',
      name: 'Cloudflare Public DNS',
      host: '1.1.1.1',
      environment: 'Cloud',
      ports: [53, 853, 443],
      notes: 'Primary recursive fast resolver with DNS-over-HTTPS.',
      createdAt: '2026-09-15'
    },
    {
      id: '2',
      name: 'Core Edge Router',
      host: '192.168.1.1',
      environment: 'HomeLab',
      ports: [80, 443, 22],
      notes: 'Primary gateway and DHCP server.',
      createdAt: '2026-09-18'
    },
    {
      id: '3',
      name: 'Production Web Node 01',
      host: '10.0.10.25',
      environment: 'Production',
      ports: [80, 443, 22, 9100],
      notes: 'Nginx reverse proxy cluster node.',
      createdAt: '2026-09-20'
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newHost, setNewHost] = useState('');
  const [newEnv, setNewEnv] = useState<'Production' | 'Staging' | 'HomeLab' | 'Cloud'>('HomeLab');
  const [newPorts, setNewPorts] = useState('80, 443, 22');
  const [newNotes, setNewNotes] = useState('');

  const handleAddProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newHost.trim()) return;

    const parsedPorts = newPorts
      .split(/[,;\s]+/)
      .map((p) => parseInt(p.trim(), 10))
      .filter((p) => !isNaN(p) && p > 0);

    const item: SavedHostProfile = {
      id: Date.now().toString(),
      name: newName.trim(),
      host: newHost.trim(),
      environment: newEnv,
      ports: parsedPorts,
      notes: newNotes.trim(),
      createdAt: new Date().toISOString().split('T')[0]
    };

    setProfiles((prev) => [...prev, item]);
    setShowAddModal(false);
    setNewName('');
    setNewHost('');
    setNewNotes('');
  };

  const handleDelete = (id: string) => {
    setProfiles((prev) => prev.filter((p) => p.id !== id));
  };

  const handleExport = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(profiles, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute('href', dataStr);
    dlAnchor.setAttribute('download', '8WHIE_Profiles.json');
    dlAnchor.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-cyan-400" />
            <span>Target Profiles &amp; Device Inventory</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Store frequently diagnosed hostnames, IP addresses, custom port lists, and environment notes securely on your local system.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 transition"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Export JSON</span>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-bold text-xs shadow-md transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Profile</span>
          </button>
        </div>
      </div>

      {/* Profiles Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {profiles.map((p) => (
          <div
            key={p.id}
            className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between space-y-4 hover:border-slate-700 transition"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    p.environment === 'Production'
                      ? 'bg-red-950 text-red-400 border border-red-800/60'
                      : p.environment === 'Staging'
                      ? 'bg-amber-950 text-amber-400 border border-amber-800/60'
                      : p.environment === 'HomeLab'
                      ? 'bg-cyan-950 text-cyan-400 border border-cyan-800/60'
                      : 'bg-indigo-950 text-indigo-400 border border-indigo-800/60'
                  }`}
                >
                  {p.environment}
                </span>

                <button
                  onClick={() => handleDelete(p.id)}
                  className="text-slate-500 hover:text-red-400 transition"
                  title="Delete Profile"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-100">{p.name}</h3>
                <div className="text-xs font-mono text-cyan-400 font-semibold mt-0.5">{p.host}</div>
              </div>

              <div className="flex flex-wrap gap-1 pt-1">
                {p.ports.map((port) => (
                  <span
                    key={port}
                    className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-950 text-slate-400 border border-slate-800"
                  >
                    :{port}
                  </span>
                ))}
              </div>

              {p.notes && <p className="text-xs text-slate-400 leading-relaxed pt-1">{p.notes}</p>}
            </div>

            <div className="pt-3 border-t border-slate-800/80 text-[10px] text-slate-500 flex justify-between">
              <span>Saved locally</span>
              <span>{p.createdAt}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-100">Create Target Profile</h3>

            <form onSubmit={handleAddProfile} className="space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">Friendly Name</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Core Switch 01"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">Hostname or IP</label>
                <input
                  type="text"
                  required
                  value={newHost}
                  onChange={(e) => setNewHost(e.target.value)}
                  placeholder="e.g. 192.168.1.1 or internal-db.lan"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">Environment</label>
                  <select
                    value={newEnv}
                    onChange={(e: any) => setNewEnv(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="HomeLab">HomeLab</option>
                    <option value="Production">Production</option>
                    <option value="Staging">Staging</option>
                    <option value="Cloud">Cloud</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">Ports (Comma sep)</label>
                  <input
                    type="text"
                    value={newPorts}
                    onChange={(e) => setNewPorts(e.target.value)}
                    placeholder="80, 443, 22"
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">Notes</label>
                <textarea
                  rows={2}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="Administration purpose, VLAN notes, or rack location..."
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 text-xs font-bold transition shadow-md"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
