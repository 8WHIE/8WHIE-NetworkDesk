// <copyright file="SubnetCalculator.cs" company="8WHIE">
// Copyright (c) 2026 8WHIE / Aryan Thakur. All rights reserved.
// Licensed under the MIT License.
// </copyright>

using System;
using System.Net;
using EightWhie.NetworkToolkit.Models;

namespace EightWhie.NetworkToolkit.Services
{
    public interface ISubnetCalculator
    {
        SubnetCalculation Calculate(string ipOrCidr, int? prefixOverride = null);
        bool IsValidIPv4(string address);
    }

    /// <summary>
    /// Pure, deterministic IPv4 subnet and CIDR calculation engine.
    /// </summary>
    public class SubnetCalculator : ISubnetCalculator
    {
        public bool IsValidIPv4(string address)
        {
            if (string.IsNullOrWhiteSpace(address)) return false;
            var parts = address.Trim().Split('.');
            if (parts.Length != 4) return false;

            foreach (var part in parts)
            {
                if (!byte.TryParse(part, out _))
                    return false;
            }

            return true;
        }

        public SubnetCalculation Calculate(string ipOrCidr, int? prefixOverride = null)
        {
            if (string.IsNullOrWhiteSpace(ipOrCidr))
                throw new ArgumentException("IP address cannot be empty.", nameof(ipOrCidr));

            string ipString;
            int prefix = 24;

            if (ipOrCidr.Contains('/'))
            {
                var parts = ipOrCidr.Split('/');
                ipString = parts[0].Trim();
                if (int.TryParse(parts[1].Trim(), out var parsedPrefix))
                {
                    prefix = parsedPrefix;
                }
            }
            else
            {
                ipString = ipOrCidr.Trim();
                if (prefixOverride.HasValue)
                {
                    prefix = prefixOverride.Value;
                }
            }

            if (prefix < 0 || prefix > 32)
                throw new ArgumentOutOfRangeException(nameof(prefixOverride), "CIDR prefix must be between 0 and 32.");

            if (!IPAddress.TryParse(ipString, out var parsedIp) || parsedIp.AddressFamily != System.Net.Sockets.AddressFamily.InterNetwork)
                throw new FormatException($"Invalid IPv4 address: '{ipString}'");

            uint ipBytes = ToUint(parsedIp);
            uint mask = prefix == 0 ? 0 : uint.MaxValue << (32 - prefix);
            uint wildcard = ~mask;

            uint network = ipBytes & mask;
            uint broadcast = network | wildcard;

            long totalAddresses = 1L << (32 - prefix);
            long usableHosts;
            uint firstUsable;
            uint lastUsable;

            if (prefix == 32)
            {
                usableHosts = 1;
                firstUsable = network;
                lastUsable = network;
            }
            else if (prefix == 31)
            {
                // RFC 3021 point-to-point
                usableHosts = 2;
                firstUsable = network;
                lastUsable = broadcast;
            }
            else
            {
                usableHosts = Math.Max(0, totalAddresses - 2);
                firstUsable = network + 1;
                lastUsable = broadcast - 1;
            }

            var netIp = FromUint(network);
            var bcastIp = FromUint(broadcast);
            var maskIp = FromUint(mask);
            var wildcardIp = FromUint(wildcard);
            var firstIp = FromUint(firstUsable);
            var lastIp = FromUint(lastUsable);

            byte firstOctet = (byte)(ipBytes >> 24);
            string ipClass = firstOctet switch
            {
                <= 127 => "A",
                <= 191 => "B",
                <= 223 => "C",
                <= 239 => "D (Multicast)",
                _ => "E (Experimental)"
            };

            bool isPrivate = (firstOctet == 10) ||
                             (firstOctet == 172 && ((byte)(ipBytes >> 16) >= 16 && (byte)(ipBytes >> 16) <= 31)) ||
                             (firstOctet == 192 && (byte)(ipBytes >> 16) == 168);

            return new SubnetCalculation
            {
                InputAddress = ipString,
                CidrPrefix = prefix,
                NetworkAddress = netIp.ToString(),
                BroadcastAddress = bcastIp.ToString(),
                FirstUsableAddress = firstIp.ToString(),
                LastUsableAddress = lastIp.ToString(),
                TotalAddresses = totalAddresses,
                UsableHostsCount = usableHosts,
                SubnetMask = maskIp.ToString(),
                WildcardMask = wildcardIp.ToString(),
                BinaryIpAddress = ToBinaryDotted(ipBytes),
                BinarySubnetMask = ToBinaryDotted(mask),
                IpClass = ipClass,
                IsPrivateSubnet = isPrivate
            };
        }

        private static uint ToUint(IPAddress ip)
        {
            var bytes = ip.GetAddressBytes();
            if (BitConverter.IsLittleEndian)
                Array.Reverse(bytes);
            return BitConverter.ToUInt32(bytes, 0);
        }

        private static IPAddress FromUint(uint value)
        {
            var bytes = BitConverter.GetBytes(value);
            if (BitConverter.IsLittleEndian)
                Array.Reverse(bytes);
            return new IPAddress(bytes);
        }

        private static string ToBinaryDotted(uint value)
        {
            byte b1 = (byte)(value >> 24);
            byte b2 = (byte)(value >> 16);
            byte b3 = (byte)(value >> 8);
            byte b4 = (byte)value;
            return $"{Convert.ToString(b1, 2).PadLeft(8, '0')}.{Convert.ToString(b2, 2).PadLeft(8, '0')}.{Convert.ToString(b3, 2).PadLeft(8, '0')}.{Convert.ToString(b4, 2).PadLeft(8, '0')}";
        }
    }
}
