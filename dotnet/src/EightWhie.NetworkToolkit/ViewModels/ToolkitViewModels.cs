// <copyright file="ToolkitViewModels.cs" company="8WHIE">
// Copyright (c) 2026 8WHIE / Aryan Thakur. All rights reserved.
// Licensed under the MIT License.
// </copyright>

using System;
using System.Collections.ObjectModel;
using System.ComponentModel;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Threading;
using System.Threading.Tasks;
using System.Windows.Input;
using EightWhie.NetworkToolkit.Models;
using EightWhie.NetworkToolkit.Services;

namespace EightWhie.NetworkToolkit.ViewModels
{
    public abstract class ViewModelBase : INotifyPropertyChanged
    {
        public event PropertyChangedEventHandler? PropertyChanged;

        protected virtual void OnPropertyChanged([CallerMemberName] string? propertyName = null)
        {
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
        }

        protected bool SetProperty<T>(ref T storage, T value, [CallerMemberName] string? propertyName = null)
        {
            if (Equals(storage, value)) return false;
            storage = value;
            OnPropertyChanged(propertyName);
            return true;
        }
    }

    public class RelayCommand : ICommand
    {
        private readonly Action<object?> _execute;
        private readonly Predicate<object?>? _canExecute;

        public RelayCommand(Action<object?> execute, Predicate<object?>? canExecute = null)
        {
            _execute = execute ?? throw new ArgumentNullException(nameof(execute));
            _canExecute = canExecute;
        }

        public RelayCommand(Action execute, Func<bool>? canExecute = null)
            : this(_ => execute(), canExecute == null ? null : _ => canExecute())
        {
        }

        public event EventHandler? CanExecuteChanged
        {
            add => CommandManager.RequerySuggested += value;
            remove => CommandManager.RequerySuggested -= value;
        }

        public bool CanExecute(object? parameter) => _canExecute?.Invoke(parameter) ?? true;
        public void Execute(object? parameter) => _execute(parameter);
    }

    /// <summary>
    /// Root ViewModel directing view switching and global header status.
    /// </summary>
    public class MainViewModel : ViewModelBase
    {
        private string _activeView = "Dashboard";
        private string _statusMessage = "Ready";
        private bool _isBusy;
        private readonly IWindowsNetworkingService _networkingService;

        public MainViewModel(IWindowsNetworkingService networkingService)
        {
            _networkingService = networkingService;
            NavigateCommand = new RelayCommand(p => ActiveView = p?.ToString() ?? "Dashboard");
            RefreshOverview();
        }

        public string ActiveView
        {
            get => _activeView;
            set => SetProperty(ref _activeView, value);
        }

        public string StatusMessage
        {
            get => _statusMessage;
            set => SetProperty(ref _statusMessage, value);
        }

        public bool IsBusy
        {
            get => _isBusy;
            set => SetProperty(ref _isBusy, value);
        }

        public string ActiveAdapterName { get; private set; } = "Detecting...";
        public string PrimaryIpAddress { get; private set; } = "127.0.0.1";
        public string GatewayAddress { get; private set; } = "None";

        public ICommand NavigateCommand { get; }

        public void RefreshOverview()
        {
            var adapters = _networkingService.GetNetworkAdapters();
            var active = adapters.FirstOrDefault(a => a.IsActiveGateway) ?? adapters.FirstOrDefault(a => a.IPv4Addresses.Count > 0);
            if (active != null)
            {
                ActiveAdapterName = active.Name;
                PrimaryIpAddress = active.IPv4Addresses.FirstOrDefault() ?? "127.0.0.1";
                GatewayAddress = active.Gateways.FirstOrDefault() ?? "Direct Link";
                OnPropertyChanged(nameof(ActiveAdapterName));
                OnPropertyChanged(nameof(PrimaryIpAddress));
                OnPropertyChanged(nameof(GatewayAddress));
            }
        }
    }

    /// <summary>
    /// Ping tool ViewModel managing live probes and summary statistics.
    /// </summary>
    public class PingViewModel : ViewModelBase
    {
        private readonly INetworkDiagnosticsService _diagnostics;
        private string _targetHost = "1.1.1.1";
        private int _packetCount = 4;
        private int _timeoutMs = 2000;
        private bool _isRunning;
        private CancellationTokenSource? _cts;
        private PingSessionSummary? _summary;

        public PingViewModel(INetworkDiagnosticsService diagnostics)
        {
            _diagnostics = diagnostics;
            Probes = new ObservableCollection<PingProbeResult>();
            StartPingCommand = new RelayCommand(async () => await ExecutePingAsync(), () => !IsRunning && !string.IsNullOrWhiteSpace(TargetHost));
            StopPingCommand = new RelayCommand(() => _cts?.Cancel(), () => IsRunning);
        }

        public string TargetHost
        {
            get => _targetHost;
            set => SetProperty(ref _targetHost, value);
        }

        public int PacketCount
        {
            get => _packetCount;
            set => SetProperty(ref _packetCount, value);
        }

        public int TimeoutMs
        {
            get => _timeoutMs;
            set => SetProperty(ref _timeoutMs, value);
        }

        public bool IsRunning
        {
            get => _isRunning;
            set => SetProperty(ref _isRunning, value);
        }

        public ObservableCollection<PingProbeResult> Probes { get; }

        public PingSessionSummary? Summary
        {
            get => _summary;
            set => SetProperty(ref _summary, value);
        }

        public ICommand StartPingCommand { get; }
        public ICommand StopPingCommand { get; }

        private async Task ExecutePingAsync()
        {
            IsRunning = true;
            Probes.Clear();
            _cts = new CancellationTokenSource();

            try
            {
                Summary = await _diagnostics.RunPingAsync(TargetHost, PacketCount, TimeoutMs, _cts.Token, probe =>
                {
                    App.Current.Dispatcher.Invoke(() => Probes.Add(probe));
                });
            }
            finally
            {
                IsRunning = false;
            }
        }
    }

    /// <summary>
    /// Subnet calculator ViewModel with instant real-time calculation.
    /// </summary>
    public class SubnetViewModel : ViewModelBase
    {
        private readonly ISubnetCalculator _calculator;
        private string _ipInput = "192.168.1.0/24";
        private SubnetCalculation? _result;
        private string? _errorMessage;

        public SubnetViewModel(ISubnetCalculator calculator)
        {
            _calculator = calculator;
            Calculate();
        }

        public string IpInput
        {
            get => _ipInput;
            set
            {
                if (SetProperty(ref _ipInput, value))
                {
                    Calculate();
                }
            }
        }

        public SubnetCalculation? Result
        {
            get => _result;
            set => SetProperty(ref _result, value);
        }

        public string? ErrorMessage
        {
            get => _errorMessage;
            set => SetProperty(ref _errorMessage, value);
        }

        public void Calculate()
        {
            try
            {
                Result = _calculator.Calculate(IpInput);
                ErrorMessage = null;
            }
            catch (Exception ex)
            {
                ErrorMessage = ex.Message;
                Result = null;
            }
        }
    }

    /// <summary>
    /// Defensive port connectivity check ViewModel.
    /// </summary>
    public class PortScanViewModel : ViewModelBase
    {
        private readonly INetworkDiagnosticsService _diagnostics;
        private string _targetHost = "1.1.1.1";
        private string _portsList = "80, 443, 53, 853, 22, 3389";
        private bool _isScanning;
        private CancellationTokenSource? _cts;

        public PortScanViewModel(INetworkDiagnosticsService diagnostics)
        {
            _diagnostics = diagnostics;
            Results = new ObservableCollection<PortProbeResult>();
            StartScanCommand = new RelayCommand(async () => await RunScanAsync(), () => !IsScanning);
            StopScanCommand = new RelayCommand(() => _cts?.Cancel(), () => IsScanning);
        }

        public string TargetHost
        {
            get => _targetHost;
            set => SetProperty(ref _targetHost, value);
        }

        public string PortsList
        {
            get => _portsList;
            set => SetProperty(ref _portsList, value);
        }

        public bool IsScanning
        {
            get => _isScanning;
            set => SetProperty(ref _isScanning, value);
        }

        public ObservableCollection<PortProbeResult> Results { get; }
        public ICommand StartScanCommand { get; }
        public ICommand StopScanCommand { get; }

        private async Task RunScanAsync()
        {
            IsScanning = true;
            Results.Clear();
            _cts = new CancellationTokenSource();

            var ports = PortsList.Split(new[] { ',', ';', ' ' }, StringSplitOptions.RemoveEmptyEntries)
                                 .Select(p => int.TryParse(p.Trim(), out var val) ? val : -1)
                                 .Where(p => p > 0 && p <= 65535)
                                 .Distinct()
                                 .ToList();

            try
            {
                foreach (var port in ports)
                {
                    if (_cts.IsCancellationRequested) break;
                    var res = await _diagnostics.ProbePortAsync(TargetHost, port, 2000, _cts.Token);
                    Results.Add(res);
                }
            }
            finally
            {
                IsScanning = false;
            }
        }
    }
}
