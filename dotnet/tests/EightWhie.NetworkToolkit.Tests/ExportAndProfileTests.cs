// <copyright file="ExportAndProfileTests.cs" company="8WHIE">
// Copyright (c) 2026 8WHIE / Aryan Thakur. All rights reserved.
// Licensed under the MIT License.
// </copyright>

using System;
using System.Collections.Generic;
using System.Text.Json;
using EightWhie.NetworkToolkit.Models;
using EightWhie.NetworkToolkit.Services;
using Xunit;

namespace EightWhie.NetworkToolkit.Tests
{
    public class ExportAndProfileTests
    {
        [Fact]
        public void ToCsv_EscapesSpecialCharactersCorrectly()
        {
            var exporter = new ExportService();
            var items = new List<TestRecord>
            {
                new() { Name = "Router, Core", Ip = "192.168.1.1", Note = "Main \"Edge\" Router" }
            };

            var csv = exporter.ToCsv(items);

            Assert.Contains("\"Router, Core\"", csv);
            Assert.Contains("\"Main \"\"Edge\"\" Router\"", csv);
        }

        [Fact]
        public void HostProfile_SerializesAndDeserializesRoundTrip()
        {
            var profile = new HostProfile
            {
                Name = "Core Lab Server",
                HostnameOrIp = "10.0.0.50",
                EnvironmentTag = "Staging",
                MonitoredPorts = new List<int> { 22, 443, 8080 },
                Notes = "Primary test cluster host"
            };

            var json = JsonSerializer.Serialize(profile);
            var deserialized = JsonSerializer.Deserialize<HostProfile>(json);

            Assert.NotNull(deserialized);
            Assert.Equal(profile.Name, deserialized.Name);
            Assert.Equal(profile.HostnameOrIp, deserialized.HostnameOrIp);
            Assert.Equal(3, deserialized.MonitoredPorts.Count);
        }

        private class TestRecord
        {
            public string Name { get; set; } = string.Empty;
            public string Ip { get; set; } = string.Empty;
            public string Note { get; set; } = string.Empty;
        }
    }
}
