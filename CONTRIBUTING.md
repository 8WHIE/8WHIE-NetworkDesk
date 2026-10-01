# Contributing to 8WHIE Network Toolkit

Thank you for your interest in contributing to **8WHIE Network Toolkit**! We welcome community contributions from developers, network administrators, and technical educators.

## Code of Conduct

All contributors and participants agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md).

## Development Setup

### Prerequisites
- [.NET 8.0 SDK](https://dotnet.microsoft.com/download/dotnet/8.0) or higher
- Visual Studio 2022 (with .NET desktop development workload) or Visual Studio Code with C# Dev Kit
- Windows 10/11 operating system

### Workflow
1. **Fork the Repository**: Create your personal fork on GitHub.
2. **Create a Feature Branch**:
   ```bash
   git checkout -b feature/awesome-diagnostic-tool
   ```
3. **Write Clean, Strongly-Typed Code**:
   - Follow standard C# and .NET naming guidelines (PascalCase for classes/methods, camelCase with underscore for private fields).
   - Ensure all network operations are asynchronous and accept `CancellationToken`.
   - Implement user-facing error handling without unhandled exceptions or crashes.
4. **Add Unit Tests**:
   - Write unit tests under `tests/EightWhie.NetworkToolkit.Tests` for any new computational or validation logic.
   - Run tests:
     ```bash
     dotnet test tests/EightWhie.NetworkToolkit.Tests
     ```
5. **Commit & Push**:
   - Write clear, imperative commit messages (e.g., `Add CIDR /31 point-to-point calculation support`).
6. **Submit a Pull Request**:
   - Provide a concise description of your changes, motivation, and test verification.

## Architecture Guidelines
- **MVVM Pattern**: Keep Views (XAML) decoupled from domain logic via ViewModels.
- **Service Interfaces**: Register services through `Microsoft.Extensions.DependencyInjection` in `App.xaml.cs`.
- **Zero Telemetry**: Do not introduce any third-party tracking, analytics, or unsolicited outbound network pings.

## Community & Questions
Reach out directly via:
- YouTube: [8WHIE Channel](https://www.youtube.com/@8WHIE)
- Telegram: [@arnxkt](https://t.me/arnxkt)
