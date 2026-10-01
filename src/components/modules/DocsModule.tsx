import React, { useState } from 'react';
import { BookOpen, HelpCircle, Terminal, Shield, Calculator, Search, Sliders, CheckCircle2 } from 'lucide-react';

export const DocsModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'getting-started' | 'troubleshooting' | 'subnet' | 'dns' | 'security' | 'cicd'>('getting-started');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-cyan-400" />
          <span>Documentation &amp; Engineering Handbook</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Comprehensive technical documentation, troubleshooting recipes, and CIDR engineering guides for Windows network administrators.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-2">
        {[
          { id: 'getting-started', label: '🚀 Getting Started' },
          { id: 'troubleshooting', label: '🛠️ Windows Troubleshooting' },
          { id: 'subnet', label: '🔢 Subnet & CIDR Guide' },
          { id: 'dns', label: '🔍 DNS Diagnostics' },
          { id: 'security', label: '🛡️ Security & Privacy Policy' },
          { id: 'cicd', label: '⚙️ Build & GitHub Actions' }
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`px-3 py-2 rounded-lg text-xs font-semibold transition ${
              activeTab === t.id
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Content panes */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-6 text-xs text-slate-300 leading-relaxed">
        {activeTab === 'getting-started' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-100">Getting Started with 8WHIE Network Toolkit</h3>
            <p>
              8WHIE Network Toolkit (8NWT) brings commonly needed network diagnostics, troubleshooting, discovery, and administration utilities into one modern desktop interface.
            </p>

            <h4 className="text-sm font-bold text-cyan-400 pt-2">System Requirements</h4>
            <ul className="list-disc list-inside space-y-1 text-slate-400">
              <li>Windows 10 (version 1809 or later), Windows 11, or Windows Server 2019/2022.</li>
              <li>.NET 8.0 Desktop Runtime or .NET 9.0 SDK installed.</li>
              <li>Administrative privileges required only for elevated adapter operations (Winsock reset, DHCP renewal).</li>
            </ul>

            <h4 className="text-sm font-bold text-cyan-400 pt-2">Building from Source</h4>
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 font-mono text-[11px] text-cyan-300 space-y-1">
              <div>git clone https://github.com/8WHIE/network-toolkit.git</div>
              <div>cd network-toolkit/dotnet</div>
              <div>dotnet restore EightWhie.NetworkToolkit.sln</div>
              <div>dotnet build EightWhie.NetworkToolkit.sln -c Release</div>
              <div>dotnet test tests/EightWhie.NetworkToolkit.Tests</div>
            </div>
          </div>
        )}

        {activeTab === 'troubleshooting' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-100">Windows Network Troubleshooting Workflow</h3>
            <p>
              When diagnosing an unresponsive or disconnected Windows endpoint, always test through Layer 1 (Physical), Layer 2 (Data Link), Layer 3 (Network IP), Layer 4 (Transport TCP/UDP), and Layer 7 (Application DNS).
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="font-bold text-cyan-400">1. Physical &amp; Local IP Link</span>
                <p className="text-slate-400">
                  Verify the active adapter status in <strong>Network Info</strong>. Ensure you have not been assigned an APIPA address (<code>169.254.x.x</code>), which indicates DHCP failure.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="font-bold text-indigo-400">2. Gateway Reachability</span>
                <p className="text-slate-400">
                  Run a 4-packet probe in <strong>Ping Diagnostics</strong> to your default gateway (e.g. <code>192.168.1.1</code>). Latency should be &lt;2ms on Ethernet or &lt;10ms on Wi-Fi.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="font-bold text-emerald-400">3. Internet Routing</span>
                <p className="text-slate-400">
                  Ping an external public IP like <code>1.1.1.1</code>. If this works but websites fail to load, your internet connection is healthy, and the failure is purely DNS.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="font-bold text-purple-400">4. DNS Resolution</span>
                <p className="text-slate-400">
                  In <strong>DNS Toolkit</strong>, query an A record for <code>google.com</code>. If it fails, flush your resolver cache with <code>ipconfig /flushdns</code> or switch to <code>1.1.1.1</code>.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'subnet' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-100">Subnetting &amp; CIDR Engineering Reference</h3>
            <p>
              Subnetting allows system engineers to partition large IP networks into smaller, isolated broadcast domains.
            </p>

            <table className="w-full text-left font-mono text-[11px] pt-2">
              <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="p-2">CIDR Prefix</th>
                  <th className="p-2">Subnet Mask</th>
                  <th className="p-2">Total Addresses</th>
                  <th className="p-2">Usable Hosts</th>
                  <th className="p-2">Common Application</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-slate-300">
                <tr>
                  <td className="p-2 text-cyan-400 font-bold">/32</td>
                  <td className="p-2">255.255.255.255</td>
                  <td className="p-2">1</td>
                  <td className="p-2">1</td>
                  <td className="p-2 text-slate-400">Single Host / Loopback</td>
                </tr>
                <tr>
                  <td className="p-2 text-cyan-400 font-bold">/31</td>
                  <td className="p-2">255.255.255.254</td>
                  <td className="p-2">2</td>
                  <td className="p-2">2</td>
                  <td className="p-2 text-slate-400">Point-to-Point Router Link (RFC 3021)</td>
                </tr>
                <tr>
                  <td className="p-2 text-cyan-400 font-bold">/30</td>
                  <td className="p-2">255.255.255.252</td>
                  <td className="p-2">4</td>
                  <td className="p-2">2</td>
                  <td className="p-2 text-slate-400">Legacy P2P Link</td>
                </tr>
                <tr>
                  <td className="p-2 text-cyan-400 font-bold">/28</td>
                  <td className="p-2">255.255.255.240</td>
                  <td className="p-2">16</td>
                  <td className="p-2">14</td>
                  <td className="p-2 text-slate-400">Small Server DMZ</td>
                </tr>
                <tr>
                  <td className="p-2 text-cyan-400 font-bold">/24</td>
                  <td className="p-2">255.255.255.0</td>
                  <td className="p-2">256</td>
                  <td className="p-2">254</td>
                  <td className="p-2 text-slate-400">Standard Office / Home LAN</td>
                </tr>
                <tr>
                  <td className="p-2 text-cyan-400 font-bold">/16</td>
                  <td className="p-2">255.255.0.0</td>
                  <td className="p-2">65,536</td>
                  <td className="p-2">65,534</td>
                  <td className="p-2 text-slate-400">Enterprise Site Supernet</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'dns' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-100">DNS Diagnostics Reference</h3>
            <p>
              DNS maps hostnames into machine-routable IP addresses and validates domain authenticity through cryptographic records.
            </p>

            <ul className="space-y-2 text-slate-400">
              <li><strong className="text-cyan-400 font-mono">A Record:</strong> Maps an FQDN to a 32-bit IPv4 address.</li>
              <li><strong className="text-cyan-400 font-mono">AAAA Record:</strong> Maps an FQDN to a 128-bit IPv6 address.</li>
              <li><strong className="text-cyan-400 font-mono">MX Record:</strong> Identifies mail transfer agent servers and priority numbers.</li>
              <li><strong className="text-cyan-400 font-mono">TXT Record:</strong> Carries arbitrary text, commonly SPF (Sender Policy Framework), DKIM, and DMARC anti-spoofing policies.</li>
              <li><strong className="text-cyan-400 font-mono">CNAME:</strong> An alias that forwards queries to an alternative canonical domain.</li>
              <li><strong className="text-cyan-400 font-mono">PTR:</strong> Reverse DNS lookup mapping an IP back into a verified hostname.</li>
            </ul>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-100">Security &amp; Privacy Policy</h3>
            <p>
              8WHIE Network Toolkit is strictly built as a defensive, ethical diagnostic utility. It guarantees:
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-400">
              <li>Zero telemetry, zero analytics tracking, and zero advertising SDKs.</li>
              <li>No Wi-Fi password extraction, memory credential dumping, or password bruteforcing.</li>
              <li>All socket calls use graceful, non-stealth TCP handshakes with strict timeouts.</li>
              <li>Local machine data stays strictly on your computer.</li>
            </ul>
          </div>
        )}

        {activeTab === 'cicd' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-100">Continuous Integration &amp; GitHub Actions</h3>
            <p>
              The repository includes automated CI/CD workflows under <code>.github/workflows/build-and-test.yml</code> configured to restore NuGet packages, compile under .NET 8 on Windows runners, execute the xUnit test suite, and upload signed release binaries.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
