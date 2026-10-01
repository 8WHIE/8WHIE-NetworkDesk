# Windows Network Troubleshooting Guide

This guide is curated by **Aryan Thakur (8WHIE)** to provide practical, systematic troubleshooting procedures using **8WHIE Network Toolkit (8NWT)** and native Windows commands.

---

## 1. Quick Triage: "No Internet Connection"

When a Windows endpoint reports "No Internet", perform diagnostic triage in this order:

### Step 1: Validate Physical Link & IP Configuration
1. Open **8WHIE Network Toolkit** -> **Dashboard** or **Network Info**.
2. Verify:
   - Is the link status `Up`?
   - Is DHCP enabled, or is there an APIPA address (`169.254.x.x`)?
   - If you see `169.254.x.x`, the DHCP server did not respond. Verify Ethernet cabling, switch port VLANs, or Wi-Fi authentication.

### Step 2: Check Gateway Reachability
1. In **Ping Diagnostics**, input the default gateway address (e.g. `192.168.1.1` or `10.0.0.1`).
2. Run a 4-packet ping test:
   - **Success (0% loss, <5ms)**: Local connection between your machine and router is healthy.
   - **Timed Out**: Cable unplugged, IP address conflict, or router interface down.

### Step 3: Test Internet IP Connectivity (Bypass DNS)
1. Ping a high-reliability public anycast IP such as `1.1.1.1` or `8.8.8.8`.
   - **Success**: Internet routing is functioning properly. The problem is DNS.
   - **Failure**: WAN connection on your router or ISP uplink is down.

### Step 4: Validate DNS Resolution
1. Open **DNS Toolkit** in 8WHIE Network Toolkit.
2. Query `A` record for `google.com` or `cloudflare.com`.
   - If public IP ping succeeds but DNS fails, change the adapter DNS resolver to `1.1.1.1` or `8.8.8.8`, or flush DNS cache:
     ```cmd
     ipconfig /flushdns
     ```

---

## 2. Resolving High Latency & Jitter

When experiencing packet drops or lag during gaming, streaming, or video calls:
1. Open **Ping Diagnostics** in 8NWT.
2. Set packet count to `20` and timeout to `2000ms`.
3. Test three targets:
   - **Target 1**: Your local gateway (`192.168.1.1`). Latency should be `<2ms` over Ethernet, `<10ms` over Wi-Fi.
   - **Target 2**: Your ISP upstream gateway.
   - **Target 3**: Public CDN (`1.1.1.1`).
4. If high jitter occurs at Target 1, inspect local Wi-Fi interference or bad Ethernet cables.
5. If jitter occurs only between Target 2 and Target 3, the bottleneck is upstream with your ISP.

---

## 3. Investigating Rogue Sockets & Port Conflicts

When a local service fails to start because port 80, 443, 3306, or 8080 is already in use:
1. Open **Active Connections** in 8NWT.
2. Filter state to `LISTENING`.
3. Filter port to the conflicting port number.
4. Note the Process ID (PID) and terminate or reconfigure the conflicting application.

---

## 4. Useful Administrative Commands Reference

| Utility | Command Line | 8NWT Equivalent Module |
| :--- | :--- | :--- |
| DNS Flush | `ipconfig /flushdns` | Network Info / Adapter Actions |
| Renew DHCP | `ipconfig /renew` | Adapter Management |
| Routing Table | `route print` | Routing Table View |
| TCP Sockets | `netstat -ano` | Active Connections View |
| Ping Test | `ping -n 4 target` | Ping Diagnostics Module |
| Route Trace | `tracert -d target` | Traceroute Module |

---
*Authored by Aryan Thakur (8WHIE) • [YouTube @8WHIE](https://www.youtube.com/@8WHIE)*
