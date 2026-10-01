# Privacy Manifesto & Policy

**8WHIE Network Toolkit** is engineered with an uncompromising commitment to user privacy, local autonomy, and transparency.

## Core Privacy Principles

1. **Zero Tracking or Telemetry**:
   The application contains no Google Analytics, no telemetry SDKs, no crash reporting daemons, and no usage analytics beaconing.

2. **No Data Collection or Selling**:
   We do not collect, store, sell, or monetize user data. All scan targets, hostnames, IP addresses, ping metrics, and subnet plans remain strictly on your local computer.

3. **Local Machine Processing**:
   Network interface inspection, active socket queries, and routing table analysis utilize local Windows operating system APIs (`System.Net.NetworkInformation` and Windows IP helper APIs). No network discovery results are ever uploaded anywhere.

4. **Transparent Outbound Connections**:
   The toolkit initiates network requests ONLY when you explicitly execute an action:
   - When you click "Start Ping", ICMP packets are sent to your designated target.
   - When you click "Traceroute", ICMP probes are sent towards your destination.
   - When you click "Query DNS", DNS queries are dispatched to your system resolver or user-specified custom resolver.
   - When you click "Check Port", a TCP connection attempt is made to the specific host and port you requested.

5. **No Password or Credential Collection**:
   The application never requests or stores your Wi-Fi keys, Windows administrator passwords, or SSH private keys.

## Questions & Contact
For privacy inquiries or technical auditing questions:
- Creator: Aryan Thakur (8WHIE)
- Telegram: [@arnxkt](https://t.me/arnxkt)
- YouTube: [8WHIE](https://www.youtube.com/@8WHIE)
