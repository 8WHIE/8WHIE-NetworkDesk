# DNS Diagnostics & Record Types Guide

The Domain Name System (DNS) translates human-readable hostnames into IP addresses. 8WHIE Network Toolkit allows querying authoritative and recursive resolvers for all major record types.

## Standard DNS Record Types

| Record Type | Description | Common Diagnostic Purpose |
| :--- | :--- | :--- |
| **A** | Address record (IPv4) | Verify hostname maps to expected public/private IPv4 server. |
| **AAAA** | IPv6 Address record | Verify dual-stack IPv6 reachability. |
| **MX** | Mail Exchange | Discover priority mail servers responsible for receiving domain emails. |
| **TXT** | Text record | Verify SPF (`v=spf1`), DKIM, DMARC (`_dmarc`), and domain ownership verification tokens. |
| **NS** | Name Server | Check which authoritative nameservers hold authority for the domain zone. |
| **CNAME** | Canonical Name | Verify hostname aliases (e.g. `www.example.com` -> `example.com`). |
| **SOA** | Start of Authority | Inspect zone serial numbers, primary master nameserver, and TTL refresh intervals. |
| **PTR** | Pointer (Reverse DNS) | Map an IP address back to its fully qualified domain name (FQDN). |

---

# Safe Defensive TCP Port Analysis Guide

## Defensive vs Offensive Scanning

**8WHIE Network Toolkit** implements strict, ethical defensive connectivity checking. It is designed for:
- Verifying whether your newly deployed web server or database is accepting connections.
- Validating firewall rule deployments (e.g., verifying port 3389 is closed to the public internet).
- Troubleshooting service health and TCP socket availability.

### Determining Port States:
- **OPEN**: The destination host responded with a TCP `SYN-ACK`. The handshake succeeded and the service is accepting connections.
- **CLOSED**: The destination host responded with a TCP `RST` (Reset). The host is reachable, but no process is actively listening on that port.
- **FILTERED / TIMEOUT**: No packet was returned within the timeout threshold. A network firewall, security group, or NAT gateway silently dropped the packet.

### Common Administrative Port Presets
- Web: `80` (HTTP), `443` (HTTPS)
- Remote Admin: `22` (SSH), `3389` (RDP), `5985/5986` (WinRM)
- Databases: `3306` (MySQL), `5432` (PostgreSQL), `1433` (MS SQL Server), `27017` (MongoDB)
- Infrastructure: `53` (DNS), `123` (NTP), `445` (SMB)

---
*Created by Aryan Thakur (8WHIE) • [YouTube @8WHIE](https://www.youtube.com/@8WHIE)*
