// <copyright file="App.xaml.cs" company="8WHIE">
// Copyright (c) 2026 8WHIE / Aryan Thakur. All rights reserved.
// Licensed under the MIT License.
// </copyright>

using System;
using System.Windows;
using Microsoft.Extensions.DependencyInjection;
using EightWhie.NetworkToolkit.Services;
using EightWhie.NetworkToolkit.ViewModels;

namespace EightWhie.NetworkToolkit
{
    public partial class App : Application
    {
        private ServiceProvider? _serviceProvider;

        public static new App Current => (App)Application.Current;
        public IServiceProvider Services => _serviceProvider ?? throw new InvalidOperationException("Services not initialized.");

        private void Application_Startup(object sender, StartupEventArgs e)
        {
            var services = new ServiceCollection();
            ConfigureServices(services);
            _serviceProvider = services.BuildServiceProvider();

            var mainWindow = _serviceProvider.GetRequiredService<MainWindow>();
            mainWindow.Show();
        }

        private static void ConfigureServices(IServiceCollection services)
        {
            // Core Services
            services.AddSingleton<ISubnetCalculator, SubnetCalculator>();
            services.AddSingleton<INetworkDiagnosticsService, NetworkDiagnosticsService>();
            services.AddSingleton<IWindowsNetworkingService, WindowsNetworkingService>();
            services.AddSingleton<IProfileManagerService, ProfileManagerService>();
            services.AddSingleton<IExportService, ExportService>();
            services.AddSingleton<IAppLoggingService, AppLoggingService>();

            // ViewModels
            services.AddSingleton<MainViewModel>();
            services.AddTransient<PingViewModel>();
            services.AddTransient<SubnetViewModel>();
            services.AddTransient<PortScanViewModel>();

            // Views
            services.AddSingleton<MainWindow>();
        }
    }
}
