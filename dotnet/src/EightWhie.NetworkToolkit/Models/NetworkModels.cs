// <copyright file="NetworkModels.cs" company="8WHIE">
// Copyright (c) 2026 8WHIE / Aryan Thakur. All rights reserved.
// Licensed under the MIT License.
// </copyright>

using System;
using System.Collections.Generic;
using System.Net;
using System.Net.NetworkInformation;

namespace EightWhie.NetworkToolkit.Models
{
    /// <summary>
    /// Represents physical and logical attributes of a local network interface adapter.
    /// </summary>
    public class NetworkInterfaceDetail
    {
        public string Id { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public NetworkInterfaceType InterfaceType { get; set; }
        public OperationalStatus Status { get; set; }
        public long SpeedBitsPerSecond { get; set; }
        public string MacAddress { get; set; } = string.Empty;
        public bool IsDhcpEnabled { get; set; }
        public List<string> IPv4Addresses { get; set; } = new();
        public List<string> IPv6Addresses { get; set; } = new();
        public List<string> Gateways { get; set; } = new();
        public List<string> DnsServers { get; set; } = new();
        public bool IsActiveGateway { get; set; }

        public string SpeedFormatted => SpeedBitsPerSecond switch
        {
            >= 1_000_000_000 => $"{SpeedBitsPerSecond / 1_000_000_000.0:F1} Gbps",
            >= 1_000_000 => $"{SpeedBitsPerSecond / 1_000_000.0:F0} Mbps",
            > 0 => $"{SpeedBitsPerSecond / 1_000.0:F0} Kbps",
            _ => "Unknown"
        };
    }

    /// <summary>
    /// Individual probe response in a Ping diagnostic session.
    /// </summary>
    public class PingProbeResult
    {
        public int Sequence { get; set; }
        public IPStatus Status { get; set; }
        public IPAddress? Destination { get; set; }
        public long RoundTripTimeMs { get; set; }
        public int Ttl { get; set; }
        public int BufferSize { get; set; }
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    }

    /// <summary>
    /// Aggregate summary metrics of a completed Ping sequence.
    /// </summary>
    public class PingSessionSummary
    {
        public string TargetHost { get; set; } = string.Empty;
        public int PacketsSent { get; set; }
        public int PacketsReceived { get; set; }
        public double PacketLossPercent => PacketsSent == 0 ? 0 : Math.Round(((PacketsSent - PacketsReceived) / (double)PacketsSent) * 100.0, 1);
        public long MinLatencyMs { get; set; }
        public long MaxLatencyMs { get; set; }
        public double AvgLatencyMs { get; set; }
        public List<PingProbeResult> Probes { get; set; } = new();
    }

    /// <summary>
    /// Represents one route hop along an ICMP traceroute path.
    /// </summary>
    public class TracerouteHop
    {
        public int HopNumber { get; set; }
        public string IpAddress { get; set; } = "*";
        public string Hostname { get; set; } = string.Empty;
        public long LatencyMs { get; set; } = -1;
        public IPStatus Status { get; set; }
        public bool IsDestinationReached { get; set; }
    }

    /// <summary>
    /// DNS Resource Record representation.
    /// </summary>
    public class DnsRecordItem
    {
        public string QueryName { get; set; } = string.Empty;
        public string RecordType { get; set; } = "A";
        public string Value { get; set; } = string.Empty;
        public int Ttl { get; set; }
        public long ResponseTimeMs { get; set; }
        public string ServerUsed { get; set; } = string.Empty;
    }

    /// <summary>
    /// Comprehensive subnet and CIDR calculation breakdown.
    /// </summary>
    public class SubnetCalculation
    {
        public string InputAddress { get; set; } = string.Empty;
        public int CidrPrefix { get; set; }
        public string NetworkAddress { get; set; } = string.Empty;
        public string BroadcastAddress { get; set; } = string.Empty;
        public string FirstUsableAddress { get; set; } = string.Empty;
        public string LastUsableAddress { get; set; } = string.Empty;
        public long TotalAddresses { get; set; }
        public long UsableHostsCount { get; set; }
        public string SubnetMask { get; set; } = string.Empty;
        public string WildcardMask { get; set; } = string.Empty;
        public string BinaryIpAddress { get; set; } = string.Empty;
        public string BinarySubnetMask { get; set; } = string.Empty;
        public string IpClass { get; set; } = string.Empty;
        public bool IsPrivateSubnet { get; set; }
    }

    /// <summary>
    /// Status determination of a defensive TCP port probe.
    /// </summary>
    public enum PortProbeStatus
    {
        Open,
        Closed,
        Filtered,
        Timeout,
        Error
    }

    public class PortProbeResult
    {
        public string Host { get; set; } = string.Empty;
        public int Port { get; set; }
        public string CommonServiceName { get; set; } = string.Empty;
        public PortProbeStatus Status { get; set; }
        public long ResponseTimeMs { get; set; }
        public string DiagnosticMessage { get; set; } = string.Empty;
    }

    /// <summary>
    /// Local network discovered host item.
    /// </summary>
    public class DiscoveredHost
    {
        public string IpAddress { get; set; } = string.Empty;
        public string Hostname { get; set; } = string.Empty;
        public string MacAddress { get; set; } = string.Empty;
        public string Vendor { get; set; } = string.Empty;
        public long LatencyMs { get; set; }
        public bool IsOnline { get; set; }
        public DateTime FirstSeen { get; set; } = DateTime.UtcNow;
    }

    /// <summary>
    /// Active local TCP or UDP connection entry from Windows IP table.
    /// </summary>
    public class ActiveSocketConnection
    {
        public string Protocol { get; set; } = "TCP";
        public string LocalAddress { get; set; } = string.Empty;
        public int LocalPort { get; set; }
        public string RemoteAddress { get; set; } = string.Empty;
        public int RemotePort { get; set; }
        public TcpState State { get; set; }
        public int ProcessId { get; set; }
        public string ProcessName { get; set; } = string.Empty;
    }

    /// <summary>
    /// Windows routing table entry.
    /// </summary>
    public class RouteTableItem
    {
        public string Destination { get; set; } = string.Empty;
        public string Netmask { get; set; } = string.Empty;
        public string Gateway { get; set; } = string.Empty;
        public string Interface { get; set; } = string.Empty;
        public int Metric { get; set; }
        public string Protocol { get; set; } = "Local";
    }

    /// <summary>
    /// Wi-Fi connection and signal information.
    /// </summary>
    public class WifiProfileDetail
    {
        public string Ssid { get; set; } = string.Empty;
        public string Bssid { get; set; } = string.Empty;
        public int SignalQualityPercent { get; set; }
        public int RssiDbm { get; set; }
        public string Channel { get; set; } = string.Empty;
        public string FrequencyBand { get; set; } = string.Empty;
        public string SecurityType { get; set; } = string.Empty;
        public string RadioType { get; set; } = string.Empty;
        public bool IsConnected { get; set; }
    }

    /// <summary>
    /// User-saved target profile for administrative presets.
    /// </summary>
    public class HostProfile
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string Name { get; set; } = string.Empty;
        public string HostnameOrIp { get; set; } = string.Empty;
        public string EnvironmentTag { get; set; } = "HomeLab"; // Production, Staging, HomeLab, Cloud
        public List<int> MonitoredPorts { get; set; } = new();
        public string Notes { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? LastCheckedAt { get; set; }
    }

    /// <summary>
    /// Structured diagnostic application log.
    /// </summary>
    public enum DiagnosticLogLevel
    {
        Debug,
        Info,
        Warning,
        Error
    }

    public class DiagnosticLogEntry
    {
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
        public DiagnosticLogLevel Level { get; set; } = DiagnosticLogLevel.Info;
        public string Component { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
    }

    /// <summary>
    /// Application preferences and privacy configuration.
    /// </summary>
    public class ToolkitConfiguration
    {
        public string ThemeMode { get; set; } = "Dark"; // Dark, Light, System
        public string AccentColor { get; set; } = "Cyan";
        public int DefaultPingCount { get; set; } = 4;
        public int DefaultTimeoutMs { get; set; } = 2500;
        public bool ReverseDnsInTraceroute { get; set; } = true;
        public bool PrivacyOfflineMode { get; set; } = false;
        public bool LogToDisk { get; set; } = true;
        public string PreferredDnsServer { get; set; } = "1.1.1.1";
    }
}
