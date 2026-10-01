// <copyright file="ProfileAndExportServices.cs" company="8WHIE">
// Copyright (c) 2026 8WHIE / Aryan Thakur. All rights reserved.
// Licensed under the MIT License.
// </copyright>

using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using EightWhie.NetworkToolkit.Models;

namespace EightWhie.NetworkToolkit.Services
{
    public interface IProfileManagerService
    {
        List<HostProfile> GetProfiles();
        void SaveProfile(HostProfile profile);
        void DeleteProfile(Guid id);
        Task ExportProfilesAsync(string filePath);
        Task ImportProfilesAsync(string filePath);
    }

    public class ProfileManagerService : IProfileManagerService
    {
        private readonly List<HostProfile> _profiles = new();
        private readonly string _storagePath;

        public ProfileManagerService()
        {
            var appData = Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData);
            var folder = Path.Combine(appData, "8WHIE", "NetworkToolkit");
            Directory.CreateDirectory(folder);
            _storagePath = Path.Combine(folder, "profiles.json");
            LoadProfiles();
        }

        private void LoadProfiles()
        {
            if (File.Exists(_storagePath))
            {
                try
                {
                    var json = File.ReadAllText(_storagePath);
                    var items = JsonSerializer.Deserialize<List<HostProfile>>(json);
                    if (items != null)
                    {
                        _profiles.Clear();
                        _profiles.AddRange(items);
                        return;
                    }
                }
                catch
                {
                    // Fall back to default seeded profiles
                }
            }

            // Seed default friendly educational profiles
            _profiles.Add(new HostProfile
            {
                Name = "Cloudflare Public DNS",
                HostnameOrIp = "1.1.1.1",
                EnvironmentTag = "Public",
                MonitoredPorts = new List<int> { 53, 853, 443 },
                Notes = "Primary privacy-focused resolver."
            });

            _profiles.Add(new HostProfile
            {
                Name = "Google Public DNS",
                HostnameOrIp = "8.8.8.8",
                EnvironmentTag = "Public",
                MonitoredPorts = new List<int> { 53, 443 },
                Notes = "Secondary diagnostic resolver."
            });

            _profiles.Add(new HostProfile
            {
                Name = "Local Default Gateway",
                HostnameOrIp = "192.168.1.1",
                EnvironmentTag = "HomeLab",
                MonitoredPorts = new List<int> { 80, 443, 22 },
                Notes = "Router and administration interface."
            });
        }

        public List<HostProfile> GetProfiles() => _profiles.ToList();

        public void SaveProfile(HostProfile profile)
        {
            var existingIndex = _profiles.FindIndex(p => p.Id == profile.Id);
            if (existingIndex >= 0)
            {
                _profiles[existingIndex] = profile;
            }
            else
            {
                _profiles.Add(profile);
            }

            Persist();
        }

        public void DeleteProfile(Guid id)
        {
            _profiles.RemoveAll(p => p.Id == id);
            Persist();
        }

        public async Task ExportProfilesAsync(string filePath)
        {
            var json = JsonSerializer.Serialize(_profiles, new JsonSerializerOptions { WriteIndented = true });
            await File.WriteAllTextAsync(filePath, json);
        }

        public async Task ImportProfilesAsync(string filePath)
        {
            var json = await File.ReadAllTextAsync(filePath);
            var items = JsonSerializer.Deserialize<List<HostProfile>>(json);
            if (items != null)
            {
                foreach (var item in items)
                {
                    if (_profiles.All(p => p.Id != item.Id))
                        _profiles.Add(item);
                }
                Persist();
            }
        }

        private void Persist()
        {
            try
            {
                var json = JsonSerializer.Serialize(_profiles, new JsonSerializerOptions { WriteIndented = true });
                File.WriteAllText(_storagePath, json);
            }
            catch
            {
                // Silently avoid breaking UI
            }
        }
    }

    public interface IExportService
    {
        string ToCsv<T>(IEnumerable<T> items);
        string ToJson<T>(IEnumerable<T> items);
        string ToTextSummary(string title, IEnumerable<KeyValuePair<string, string>> keyValues);
    }

    public class ExportService : IExportService
    {
        public string ToCsv<T>(IEnumerable<T> items)
        {
            var sb = new StringBuilder();
            var props = typeof(T).GetProperties();

            sb.AppendLine(string.Join(",", props.Select(p => EscapeCsv(p.Name))));

            foreach (var item in items)
            {
                var values = props.Select(p =>
                {
                    var val = p.GetValue(item);
                    return EscapeCsv(val?.ToString() ?? string.Empty);
                });
                sb.AppendLine(string.Join(",", values));
            }

            return sb.ToString();
        }

        public string ToJson<T>(IEnumerable<T> items)
        {
            return JsonSerializer.Serialize(items, new JsonSerializerOptions { WriteIndented = true });
        }

        public string ToTextSummary(string title, IEnumerable<KeyValuePair<string, string>> keyValues)
        {
            var sb = new StringBuilder();
            sb.AppendLine("==================================================");
            sb.AppendLine($" 8WHIE NETWORK TOOLKIT - {title.ToUpperInvariant()}");
            sb.AppendLine($" Generated: {DateTime.UtcNow:yyyy-MM-dd HH:mm:ss} UTC");
            sb.AppendLine("==================================================");
            sb.AppendLine();

            foreach (var kvp in keyValues)
            {
                sb.AppendLine($"{kvp.Key.PadRight(28)}: {kvp.Value}");
            }

            sb.AppendLine();
            sb.AppendLine("--------------------------------------------------");
            sb.AppendLine(" Creator: Aryan Thakur (8WHIE)");
            sb.AppendLine(" YouTube: https://www.youtube.com/@8WHIE");
            sb.AppendLine("==================================================");

            return sb.ToString();
        }

        private static string EscapeCsv(string value)
        {
            if (value.Contains(',') || value.Contains('"') || value.Contains('\n'))
            {
                return $"\"{value.Replace("\"", "\"\"")}\"";
            }
            return value;
        }
    }

    public interface IAppLoggingService
    {
        void Log(DiagnosticLogLevel level, string component, string message);
        List<DiagnosticLogEntry> GetRecentLogs(int limit = 200);
        void ClearLogs();
    }

    public class AppLoggingService : IAppLoggingService
    {
        private readonly List<DiagnosticLogEntry> _logs = new();
        private readonly object _lock = new();

        public void Log(DiagnosticLogLevel level, string component, string message)
        {
            lock (_lock)
            {
                _logs.Add(new DiagnosticLogEntry
                {
                    Timestamp = DateTime.UtcNow,
                    Level = level,
                    Component = component,
                    Message = message
                });

                if (_logs.Count > 1000)
                {
                    _logs.RemoveRange(0, 200);
                }
            }
        }

        public List<DiagnosticLogEntry> GetRecentLogs(int limit = 200)
        {
            lock (_lock)
            {
                return _logs.TakeLast(limit).ToList();
            }
        }

        public void ClearLogs()
        {
            lock (_lock)
            {
                _logs.Clear();
            }
        }
    }
}
