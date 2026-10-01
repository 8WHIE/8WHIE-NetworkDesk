// <copyright file="NetworkDiagnosticsService.cs" company="8WHIE">
// Copyright (c) 2026 8WHIE / Aryan Thakur. All rights reserved.
// Licensed under the MIT License.
// </copyright>

using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Net;
using System.Net.NetworkInformation;
using System.Net.Sockets;
using System.Threading;
using System.Threading.Tasks;
using EightWhie.NetworkToolkit.Models;

namespace EightWhie.NetworkToolkit.Services
{
    public interface INetworkDiagnosticsService
    {
        Task<PingSessionSummary> RunPingAsync(string host, int count, int timeoutMs, CancellationToken token, Action<PingProbeResult>? onProbeReceived = null);
        Task<List<TracerouteHop>> RunTracerouteAsync(string target, int maxHops, int timeoutMs, bool resolveDns, CancellationToken token, Action<TracerouteHop>? onHopDiscovered = null);
        Task<List<DnsRecordItem>> QueryDnsAsync(string hostname, string recordType, string? customServer = null);
        Task<PortProbeResult> ProbePortAsync(string host, int port, int timeoutMs, CancellationToken token);
    }

    public class NetworkDiagnosticsService : INetworkDiagnosticsService
    {
        private static readonly Dictionary<int, string> KnownPorts = new()
        {
            { 20, "FTP Data" },
            { 21, "FTP Control" },
            { 22, "SSH" },
            { 23, "Telnet" },
            { 25, "SMTP" },
            { 53, "DNS" },
            { 80, "HTTP" },
            { 110, "POP3" },
            { 123, "NTP" },
            { 143, "IMAP" },
            { 443, "HTTPS" },
            { 445, "SMB" },
            { 993, "IMAPS" },
            { 995, "POP3S" },
            { 1433, "MSSQL" },
            { 1521, "Oracle DB" },
            { 3306, "MySQL" },
            { 3389, "RDP" },
            { 5432, "PostgreSQL" },
            { 5900, "VNC" },
            { 8080, "HTTP-Alt" },
            { 8443, "HTTPS-Alt" }
        };

        public async Task<PingSessionSummary> RunPingAsync(
            string host,
            int count,
            int timeoutMs,
            CancellationToken token,
            Action<PingProbeResult>? onProbeReceived = null)
        {
            var summary = new PingSessionSummary
            {
                TargetHost = host,
                PacketsSent = 0,
                PacketsReceived = 0,
                MinLatencyMs = long.MaxValue,
                MaxLatencyMs = 0
            };

            using var ping = new Ping();
            byte[] buffer = new byte[32];
            new Random().NextBytes(buffer);

            for (int i = 1; i <= count; i++)
            {
                if (token.IsCancellationRequested) break;

                summary.PacketsSent++;
                PingProbeResult probe;

                try
                {
                    var reply = await ping.SendPingAsync(host, timeoutMs, buffer, new PingOptions(64, true));
                    probe = new PingProbeResult
                    {
                        Sequence = i,
                        Status = reply.Status,
                        Destination = reply.Address,
                        RoundTripTimeMs = reply.Status == IPStatus.Success ? reply.RoundtripTime : -1,
                        Ttl = reply.Options?.Ttl ?? 0,
                        BufferSize = reply.Buffer?.Length ?? 0
                    };

                    if (reply.Status == IPStatus.Success)
                    {
                        summary.PacketsReceived++;
                        summary.MinLatencyMs = Math.Min(summary.MinLatencyMs, reply.RoundtripTime);
                        summary.MaxLatencyMs = Math.Max(summary.MaxLatencyMs, reply.RoundtripTime);
                    }
                }
                catch (Exception ex)
                {
                    probe = new PingProbeResult
                    {
                        Sequence = i,
                        Status = IPStatus.Unknown,
                        RoundTripTimeMs = -1
                    };
                }

                summary.Probes.Add(probe);
                onProbeReceived?.Invoke(probe);

                if (i < count && !token.IsCancellationRequested)
                {
                    await Task.Delay(400, token).ConfigureAwait(false);
                }
            }

            if (summary.PacketsReceived > 0)
            {
                var successList = summary.Probes.Where(p => p.Status == IPStatus.Success).ToList();
                summary.AvgLatencyMs = Math.Round(successList.Average(p => p.RoundTripTimeMs), 1);
            }
            else
            {
                summary.MinLatencyMs = 0;
                summary.AvgLatencyMs = 0;
            }

            return summary;
        }

        public async Task<List<TracerouteHop>> RunTracerouteAsync(
            string target,
            int maxHops,
            int timeoutMs,
            bool resolveDns,
            CancellationToken token,
            Action<TracerouteHop>? onHopDiscovered = null)
        {
            var hops = new List<TracerouteHop>();
            using var ping = new Ping();
            byte[] buffer = new byte[32];

            IPAddress destinationIp;
            try
            {
                var hostAddresses = await Dns.GetHostAddressesAsync(target);
                destinationIp = hostAddresses.First(a => a.AddressFamily == AddressFamily.InterNetwork);
            }
            catch
            {
                if (!IPAddress.TryParse(target, out destinationIp!))
                    throw new ArgumentException($"Cannot resolve destination host: {target}");
            }

            for (int ttl = 1; ttl <= maxHops; ttl++)
            {
                if (token.IsCancellationRequested) break;

                var options = new PingOptions(ttl, true);
                var hop = new TracerouteHop { HopNumber = ttl };

                try
                {
                    var reply = await ping.SendPingAsync(destinationIp, timeoutMs, buffer, options);

                    hop.Status = reply.Status;
                    if (reply.Status == IPStatus.TtlExpired || reply.Status == IPStatus.Success)
                    {
                        hop.IpAddress = reply.Address?.ToString() ?? "*";
                        hop.LatencyMs = reply.RoundtripTime;

                        if (resolveDns && reply.Address != null)
                        {
                            try
                            {
                                var entry = await Dns.GetHostEntryAsync(reply.Address);
                                hop.Hostname = entry.HostName;
                            }
                            catch
                            {
                                hop.Hostname = hop.IpAddress;
                            }
                        }

                        if (reply.Status == IPStatus.Success || reply.Address?.Equals(destinationIp) == true)
                        {
                            hop.IsDestinationReached = true;
                        }
                    }
                }
                catch
                {
                    hop.Status = IPStatus.TimedOut;
                    hop.LatencyMs = -1;
                }

                hops.Add(hop);
                onHopDiscovered?.Invoke(hop);

                if (hop.IsDestinationReached) break;
            }

            return hops;
        }

        public async Task<List<DnsRecordItem>> QueryDnsAsync(string hostname, string recordType, string? customServer = null)
        {
            var results = new List<DnsRecordItem>();
            var sw = Stopwatch.StartNew();

            try
            {
                var cleanHost = hostname.Trim().Replace("http://", "").Replace("https://", "").Split('/')[0];
                var hostEntry = await Dns.GetHostEntryAsync(cleanHost);
                sw.Stop();

                foreach (var address in hostEntry.AddressList)
                {
                    string recType = address.AddressFamily == AddressFamily.InterNetwork ? "A" : "AAAA";
                    if (string.Equals(recordType, "ANY", StringComparison.OrdinalIgnoreCase) ||
                        string.Equals(recordType, recType, StringComparison.OrdinalIgnoreCase))
                    {
                        results.Add(new DnsRecordItem
                        {
                            QueryName = cleanHost,
                            RecordType = recType,
                            Value = address.ToString(),
                            Ttl = 300,
                            ResponseTimeMs = sw.ElapsedMilliseconds,
                            ServerUsed = customServer ?? "System DNS"
                        });
                    }
                }

                if (!string.IsNullOrEmpty(hostEntry.HostName) && hostEntry.HostName != cleanHost)
                {
                    results.Add(new DnsRecordItem
                    {
                        QueryName = cleanHost,
                        RecordType = "CNAME",
                        Value = hostEntry.HostName,
                        Ttl = 300,
                        ResponseTimeMs = sw.ElapsedMilliseconds,
                        ServerUsed = customServer ?? "System DNS"
                    });
                }
            }
            catch (Exception ex)
            {
                sw.Stop();
                results.Add(new DnsRecordItem
                {
                    QueryName = hostname,
                    RecordType = recordType,
                    Value = $"Lookup failed: {ex.Message}",
                    Ttl = 0,
                    ResponseTimeMs = sw.ElapsedMilliseconds,
                    ServerUsed = customServer ?? "System DNS"
                });
            }

            return results;
        }

        public async Task<PortProbeResult> ProbePortAsync(string host, int port, int timeoutMs, CancellationToken token)
        {
            var sw = Stopwatch.StartNew();
            var serviceName = KnownPorts.TryGetValue(port, out var name) ? name : "Unknown/Custom";

            using var tcpClient = new TcpClient();
            using var timeoutCts = new CancellationTokenSource(timeoutMs);
            using var linkedCts = CancellationTokenSource.CreateLinkedTokenSource(token, timeoutCts.Token);

            try
            {
                var connectTask = tcpClient.ConnectAsync(host, port, linkedCts.Token).AsTask();
                await connectTask.ConfigureAwait(false);
                sw.Stop();

                return new PortProbeResult
                {
                    Host = host,
                    Port = port,
                    CommonServiceName = serviceName,
                    Status = PortProbeStatus.Open,
                    ResponseTimeMs = sw.ElapsedMilliseconds,
                    DiagnosticMessage = "Connection succeeded (TCP handshake completed)."
                };
            }
            catch (OperationCanceledException)
            {
                sw.Stop();
                bool isUserCancel = token.IsCancellationRequested;
                return new PortProbeResult
                {
                    Host = host,
                    Port = port,
                    CommonServiceName = serviceName,
                    Status = isUserCancel ? PortProbeStatus.Error : PortProbeStatus.Timeout,
                    ResponseTimeMs = sw.ElapsedMilliseconds,
                    DiagnosticMessage = isUserCancel ? "Canceled by user." : $"Timed out after {timeoutMs}ms (Filtered/Silent)."
                };
            }
            catch (SocketException sockEx)
            {
                sw.Stop();
                var status = sockEx.SocketErrorCode switch
                {
                    SocketError.ConnectionRefused => PortProbeStatus.Closed,
                    SocketError.TimedOut => PortProbeStatus.Timeout,
                    SocketError.HostUnreachable or SocketError.NetworkUnreachable => PortProbeStatus.Filtered,
                    _ => PortProbeStatus.Closed
                };

                return new PortProbeResult
                {
                    Host = host,
                    Port = port,
                    CommonServiceName = serviceName,
                    Status = status,
                    ResponseTimeMs = sw.ElapsedMilliseconds,
                    DiagnosticMessage = sockEx.Message
                };
            }
            catch (Exception ex)
            {
                sw.Stop();
                return new PortProbeResult
                {
                    Host = host,
                    Port = port,
                    CommonServiceName = serviceName,
                    Status = PortProbeStatus.Error,
                    ResponseTimeMs = sw.ElapsedMilliseconds,
                    DiagnosticMessage = ex.Message
                };
            }
        }
    }
}
