import React, { useState } from 'react';
import {
  Info,
  Youtube,
  Instagram,
  Send,
  Github,
  Code2,
  Download,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  FolderTree,
  FileCode,
  FileText
} from 'lucide-react';

interface AboutProps {
  onDownloadSolution: () => void;
  isDownloading: boolean;
}

export const AboutModule: React.FC<AboutProps> = ({ onDownloadSolution, isDownloading }) => {
  const [selectedFile, setSelectedFile] = useState<string>('EightWhie.NetworkToolkit.csproj');

  const fileCodeSnippets: Record<string, string> = {
    'EightWhie.NetworkToolkit.csproj': `<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <OutputType>WinExe</OutputType>
    <TargetFramework>net8.0-windows</TargetFramework>
    <Nullable>enable</Nullable>
    <ImplicitUsings>enable</ImplicitUsings>
    <UseWPF>true</UseWPF>
    <AssemblyName>8WHIE.NetworkToolkit</AssemblyName>
    <RootNamespace>EightWhie.NetworkToolkit</RootNamespace>
    <Authors>Aryan Thakur (8WHIE)</Authors>
    <Company>8WHIE</Company>
    <Product>8WHIE Network Toolkit</Product>
    <Description>Modern Network Diagnostics &amp; Administration Toolkit</Description>
    <Copyright>Copyright © 2026 8WHIE / Aryan Thakur</Copyright>
    <Version>1.0.0</Version>
  </PropertyGroup>

  <ItemGroup>
    <PackageReference Include="Microsoft.Extensions.DependencyInjection" Version="8.0.0" />
    <PackageReference Include="Microsoft.Extensions.Hosting" Version="8.0.0" />
    <PackageReference Include="System.Text.Json" Version="8.0.5" />
  </ItemGroup>
</Project>`,

    'SubnetCalculator.cs': `// SubnetCalculator.cs - Pure, Deterministic IPv4 Engine
namespace EightWhie.NetworkToolkit.Services
{
    public class SubnetCalculator : ISubnetCalculator
    {
        public SubnetCalculation Calculate(string ipOrCidr, int? prefixOverride = null)
        {
            // Parses IP and CIDR prefix
            // Computes Network Address, Broadcast, Usable Range, Wildcard, Binary Masks
            // RFC 3021 /31 point-to-point support
            // Validates RFC 1918 Private ranges & IPv4 Classes
        }
    }
}`,

    'NetworkDiagnosticsService.cs': `// NetworkDiagnosticsService.cs - Async ICMP Ping & TCP Port Probing
namespace EightWhie.NetworkToolkit.Services
{
    public class NetworkDiagnosticsService : INetworkDiagnosticsService
    {
        public async Task<PingSessionSummary> RunPingAsync(string host, int count, int timeoutMs, CancellationToken token)
        {
            // Dispatches asynchronous ICMP probes with jitter and loss tracking
        }

        public async Task<PortProbeResult> ProbePortAsync(string host, int port, int timeoutMs, CancellationToken token)
        {
            // Performs standard defensive TCP handshake without evasion or stealth
        }
    }
}`,

    'SubnetCalculatorTests.cs': `// SubnetCalculatorTests.cs - xUnit Unit Tests
using Xunit;
using EightWhie.NetworkToolkit.Services;

namespace EightWhie.NetworkToolkit.Tests
{
    public class SubnetCalculatorTests
    {
        private readonly SubnetCalculator _calc = new();

        [Fact]
        public void Calculate_StandardSlash24_ReturnsCorrectSubnetDetails()
        {
            var res = _calc.Calculate("192.168.1.100/24");
            Assert.Equal("192.168.1.0", res.NetworkAddress);
            Assert.Equal("192.168.1.255", res.BroadcastAddress);
            Assert.Equal(254, res.UsableHostsCount);
            Assert.True(res.IsPrivateSubnet);
        }
    }
}`
  };

  return (
    <div className="space-y-6">
      {/* Brand Hero */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center text-slate-950 font-black text-2xl shadow-xl shadow-cyan-500/20">
              8W
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-slate-100 tracking-tight">8WHIE Network Toolkit</h1>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800 font-bold">
                  8NWT v1.0.0
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Modern Network Diagnostics &amp; Administration Toolkit for Windows
              </p>
            </div>
          </div>

          <button
            onClick={onDownloadSolution}
            disabled={isDownloading}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition active:scale-95 disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>{isDownloading ? 'Bundling .ZIP...' : 'Download Full .NET Solution (.ZIP)'}</span>
          </button>
        </div>

        {/* Creator Attribution */}
        <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="text-slate-300">
            Created by <strong className="text-slate-100 font-bold">Aryan Thakur</strong> • Brand:{' '}
            <span className="text-cyan-400 font-bold">8WHIE</span>
          </div>

          {/* Social Links */}
          <div className="flex flex-wrap items-center gap-2">
            <a
              href="https://www.youtube.com/@8WHIE"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-950/60 border border-red-800/60 text-red-400 hover:bg-red-900/60 transition font-medium"
            >
              <Youtube className="w-3.5 h-3.5" />
              <span>YouTube @8WHIE</span>
            </a>
            <a
              href="https://instagram.com/imarykt"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-pink-950/60 border border-pink-800/60 text-pink-400 hover:bg-pink-900/60 transition font-medium"
            >
              <Instagram className="w-3.5 h-3.5" />
              <span>@imarykt</span>
            </a>
            <a
              href="https://t.me/arnxkt"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-950/60 border border-sky-800/60 text-sky-400 hover:bg-sky-900/60 transition font-medium"
            >
              <Send className="w-3.5 h-3.5" />
              <span>@arnxkt</span>
            </a>
            <a
              href="https://github.com/8WHIE"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:bg-slate-800 transition font-medium"
            >
              <Github className="w-3.5 h-3.5 text-cyan-400" />
              <span>GitHub / 8WHIE</span>
            </a>
          </div>
        </div>
      </div>

      {/* Originality & Defensive Statement */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs">
            <Code2 className="w-4 h-4" />
            <span>100% Original Clean-Room Architecture</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            8WHIE Network Toolkit is independently engineered with original source code, naming conventions, and clean MVVM design patterns. It does not copy, fork, or mechanically rebrand any existing projects. All algorithms, ViewModels, and services are custom-written.
          </p>
        </div>

        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
            <ShieldCheck className="w-4 h-4" />
            <span>Defensive &amp; Ethical Networking</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Constructed strictly for IT students, systems engineers, and authorized cybersecurity learners. The tool contains zero weaponized exploits, zero stealth scanning, and zero password extraction mechanisms.
          </p>
        </div>
      </div>

      {/* Interactive C# .NET Code Viewer */}
      <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-200 font-bold text-xs uppercase tracking-wider">
            <FolderTree className="w-4 h-4 text-cyan-400" />
            <span>Built-in C# .NET Solution Code Explorer</span>
          </div>

          <span className="text-[11px] text-slate-500 font-mono">
            dotnet/src/EightWhie.NetworkToolkit
          </span>
        </div>

        {/* File selector buttons */}
        <div className="flex flex-wrap gap-2">
          {Object.keys(fileCodeSnippets).map((fn) => (
            <button
              key={fn}
              onClick={() => setSelectedFile(fn)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition ${
                selectedFile === fn
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-400'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>{fn}</span>
            </button>
          ))}
        </div>

        {/* Code view display */}
        <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 text-xs font-mono text-cyan-300 overflow-x-auto leading-relaxed max-h-96">
          <code>{fileCodeSnippets[selectedFile]}</code>
        </pre>
      </div>
    </div>
  );
};
