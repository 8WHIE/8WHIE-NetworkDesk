// <copyright file="MainWindow.xaml.cs" company="8WHIE">
// Copyright (c) 2026 8WHIE / Aryan Thakur. All rights reserved.
// Licensed under the MIT License.
// </copyright>

using System.Windows;
using EightWhie.NetworkToolkit.ViewModels;

namespace EightWhie.NetworkToolkit
{
    public partial class MainWindow : Window
    {
        public MainWindow(MainViewModel viewModel)
        {
            InitializeComponent();
            DataContext = viewModel;
        }
    }
}
