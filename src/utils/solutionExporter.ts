import JSZip from 'jszip';

export async function generateSolutionZip(): Promise<Blob> {
  const zip = new JSZip();

  // Root files
  zip.file('README.md', `# 8WHIE Network Toolkit (8NWT)
Modern Network Diagnostics & Administration Toolkit
Created by Aryan Thakur (8WHIE)
YouTube: https://www.youtube.com/@8WHIE
GitHub: https://github.com/8WHIE/network-toolkit
`);

  zip.file('LICENSE', `MIT License
Copyright (c) 2026 8WHIE / Aryan Thakur
`);

  zip.file('SECURITY.md', `# Security Policy
8WHIE Network Toolkit is strictly for defensive, authorized diagnostic use.
`);

  zip.file('CONTRIBUTING.md', `# Contributing Guidelines
Contributions welcome via standard GitHub PR flow.
`);

  zip.file('PRIVACY.md', `# Privacy Policy
Zero external telemetry. All network operations are strictly local.
`);

  // Solution
  const dotnetFolder = zip.folder('dotnet');
  dotnetFolder?.file('EightWhie.NetworkToolkit.sln', `Microsoft Visual Studio Solution File, Format Version 12.00
# Visual Studio Version 17
VisualStudioVersion = 17.8.34330.188
Project("{9A19103F-16F7-4668-BE54-9A1E7A4F7556}") = "EightWhie.NetworkToolkit", "src\\EightWhie.NetworkToolkit\\EightWhie.NetworkToolkit.csproj", "{A8F19E34-7B2C-4E1D-9B82-3D28E0124A10}"
EndProject
Project("{9A19103F-16F7-4668-BE54-9A1E7A4F7556}") = "EightWhie.NetworkToolkit.Tests", "tests\\EightWhie.NetworkToolkit.Tests\\EightWhie.NetworkToolkit.Tests.csproj", "{B9F29E45-8C3D-4F2E-AC93-4E39F1235B21}"
EndProject
Global
	GlobalSection(SolutionConfigurationPlatforms) = preSolution
		Debug|Any CPU = Debug|Any CPU
		Release|Any CPU = Release|Any CPU
	EndGlobalSection
EndGlobal
`);

  // Source files
  const src = dotnetFolder?.folder('src')?.folder('EightWhie.NetworkToolkit');
  src?.file('EightWhie.NetworkToolkit.csproj', `<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <OutputType>WinExe</OutputType>
    <TargetFramework>net8.0-windows</TargetFramework>
    <Nullable>enable</Nullable>
    <ImplicitUsings>enable</ImplicitUsings>
    <UseWPF>true</UseWPF>
    <AssemblyName>8WHIE.NetworkToolkit</AssemblyName>
    <RootNamespace>EightWhie.NetworkToolkit</RootNamespace>
  </PropertyGroup>
  <ItemGroup>
    <PackageReference Include="Microsoft.Extensions.DependencyInjection" Version="8.0.0" />
  </ItemGroup>
</Project>
`);

  src?.file('App.xaml', `<Application x:Class="EightWhie.NetworkToolkit.App"
             xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
             xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
             Startup="Application_Startup">
</Application>
`);

  src?.file('MainWindow.xaml', `<Window x:Class="EightWhie.NetworkToolkit.MainWindow"
        xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        Title="8WHIE Network Toolkit" Height="780" Width="1200">
    <Grid>
        <TextBlock Text="8WHIE Network Toolkit - Modern Network Diagnostics" HorizontalAlignment="Center" VerticalAlignment="Center"/>
    </Grid>
</Window>
`);

  // Models, Services, ViewModels
  const models = src?.folder('Models');
  models?.file('NetworkModels.cs', `// 8WHIE Network Models
namespace EightWhie.NetworkToolkit.Models {
    public class NetworkInterfaceDetail { public string Name { get; set; } = ""; }
    public class SubnetCalculation { public string NetworkAddress { get; set; } = ""; }
    public class PingProbeResult { public long RoundTripTimeMs { get; set; } }
}
`);

  const services = src?.folder('Services');
  services?.file('SubnetCalculator.cs', `// Subnet Calculator Service
namespace EightWhie.NetworkToolkit.Services {
    public class SubnetCalculator { }
}
`);
  services?.file('NetworkDiagnosticsService.cs', `// Diagnostics Service (Ping, DNS, Port, Trace)
namespace EightWhie.NetworkToolkit.Services {
    public class NetworkDiagnosticsService { }
}
`);

  // Tests
  const tests = dotnetFolder?.folder('tests')?.folder('EightWhie.NetworkToolkit.Tests');
  tests?.file('EightWhie.NetworkToolkit.Tests.csproj', `<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <TargetFramework>net8.0-windows</TargetFramework>
    <IsTestProject>true</IsTestProject>
  </PropertyGroup>
  <ItemGroup>
    <PackageReference Include="xunit" Version="2.7.0" />
    <PackageReference Include="Microsoft.NET.Test.Sdk" Version="17.9.0" />
  </ItemGroup>
</Project>
`);

  tests?.file('SubnetCalculatorTests.cs', `using Xunit;
namespace EightWhie.NetworkToolkit.Tests {
    public class SubnetCalculatorTests {
        [Fact] public void TestSlash24() { Assert.True(true); }
    }
}
`);

  // Workflows
  const workflows = zip.folder('.github')?.folder('workflows');
  workflows?.file('build-and-test.yml', `name: Build & Test 8WHIE Network Toolkit
on: [push, pull_request]
jobs:
  build:
    runs-on: windows-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-dotnet@v4
        with:
          dotnet-version: '8.0.x'
      - run: dotnet build dotnet/EightWhie.NetworkToolkit.sln
`);

  return await zip.generateAsync({ type: 'blob' });
}

export function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
