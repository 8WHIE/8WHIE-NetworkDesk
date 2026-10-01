// <copyright file="SubnetCalculatorTests.cs" company="8WHIE">
// Copyright (c) 2026 8WHIE / Aryan Thakur. All rights reserved.
// Licensed under the MIT License.
// </copyright>

using System;
using EightWhie.NetworkToolkit.Services;
using Xunit;

namespace EightWhie.NetworkToolkit.Tests
{
    public class SubnetCalculatorTests
    {
        private readonly SubnetCalculator _calculator = new();

        [Fact]
        public void Calculate_StandardSlash24_ReturnsCorrectSubnetDetails()
        {
            // Arrange
            var input = "192.168.1.100/24";

            // Act
            var result = _calculator.Calculate(input);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("192.168.1.0", result.NetworkAddress);
            Assert.Equal("192.168.1.255", result.BroadcastAddress);
            Assert.Equal("192.168.1.1", result.FirstUsableAddress);
            Assert.Equal("192.168.1.254", result.LastUsableAddress);
            Assert.Equal("255.255.255.0", result.SubnetMask);
            Assert.Equal("0.0.0.255", result.WildcardMask);
            Assert.Equal(256, result.TotalAddresses);
            Assert.Equal(254, result.UsableHostsCount);
            Assert.True(result.IsPrivateSubnet);
            Assert.Equal("C", result.IpClass);
        }

        [Fact]
        public void Calculate_Slash30PointToPoint_ReturnsCorrectHostCount()
        {
            // Arrange
            var input = "10.0.0.1/30";

            // Act
            var result = _calculator.Calculate(input);

            // Assert
            Assert.Equal("10.0.0.0", result.NetworkAddress);
            Assert.Equal("10.0.0.3", result.BroadcastAddress);
            Assert.Equal("10.0.0.1", result.FirstUsableAddress);
            Assert.Equal("10.0.0.2", result.LastUsableAddress);
            Assert.Equal(2, result.UsableHostsCount);
            Assert.Equal("255.255.255.252", result.SubnetMask);
            Assert.True(result.IsPrivateSubnet);
        }

        [Fact]
        public void Calculate_Slash32SingleHost_ReturnsOneUsableHost()
        {
            // Arrange
            var input = "1.1.1.1/32";

            // Act
            var result = _calculator.Calculate(input);

            // Assert
            Assert.Equal("1.1.1.1", result.NetworkAddress);
            Assert.Equal("1.1.1.1", result.BroadcastAddress);
            Assert.Equal("1.1.1.1", result.FirstUsableAddress);
            Assert.Equal("1.1.1.1", result.LastUsableAddress);
            Assert.Equal(1, result.UsableHostsCount);
            Assert.Equal("255.255.255.255", result.SubnetMask);
            Assert.False(result.IsPrivateSubnet);
        }

        [Theory]
        [InlineData("192.168.1.1", true)]
        [InlineData("10.0.0.1", true)]
        [InlineData("8.8.8.8", true)]
        [InlineData("256.0.0.1", false)]
        [InlineData("192.168.1", false)]
        [InlineData("invalid-ip", false)]
        [InlineData("", false)]
        public void IsValidIPv4_ValidatesCorrectly(string candidate, bool expected)
        {
            var actual = _calculator.IsValidIPv4(candidate);
            Assert.Equal(expected, actual);
        }

        [Fact]
        public void Calculate_InvalidPrefix_ThrowsArgumentOutOfRangeException()
        {
            Assert.Throws<ArgumentOutOfRangeException>(() => _calculator.Calculate("192.168.1.1/33"));
        }

        [Fact]
        public void Calculate_InvalidIp_ThrowsFormatException()
        {
            Assert.Throws<FormatException>(() => _calculator.Calculate("999.999.999.999/24"));
        }
    }
}
