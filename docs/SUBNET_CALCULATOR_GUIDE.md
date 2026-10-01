# Subnet Calculator & CIDR Engineering Guide

## IPv4 Subnetting Fundamentals

Subnetting divides a larger IPv4 network block into smaller, isolated broadcast domains. This reduces network congestion, isolates departments or security tiers, and conserves address space.

### CIDR Prefix vs Subnet Mask Quick Reference

| CIDR Prefix | Subnet Mask | Total Addresses | Usable Hosts | Use Case |
| :--- | :--- | :--- | :--- | :--- |
| `/32` | `255.255.255.255` | 1 | 1 | Host route, Loopback interface |
| `/31` | `255.255.255.254` | 2 | 2 | Point-to-point router link (RFC 3021) |
| `/30` | `255.255.255.252` | 4 | 2 | Traditional P2P link (Network + 2 Hosts + Broadcast) |
| `/29` | `255.255.255.248` | 8 | 6 | Small server DMZ or public IP block |
| `/28` | `255.255.255.240` | 16 | 14 | Small branch office or branch VLAN |
| `/27` | `255.255.255.224` | 32 | 30 | Medium department subnet |
| `/26` | `255.255.255.192` | 64 | 62 | Standard office VLAN segment |
| `/25` | `255.255.255.128` | 128 | 126 | Large department or lab tier |
| `/24` | `255.255.255.0` | 256 | 254 | Most common LAN / Wi-Fi subnet |
| `/23` | `255.255.254.0` | 512 | 510 | Enterprise campus user pool |
| `/22` | `255.255.252.0` | 1,024 | 1,022 | High-density guest Wi-Fi |
| `/16` | `255.255.0.0` | 65,536 | 65,534 | Class B private site supernet (`172.16.0.0/16`) |
| `/8` | `255.0.0.0` | 16,777,216 | 16,777,214 | Class A private boundary (`10.0.0.0/8`) |

---

## How 8WHIE Network Toolkit Calculates Subnets

Given an input like `192.168.10.75/26`:

1. **Subnet Mask**: `/26` means 26 ones followed by 6 zeros:
   `11111111.11111111.11111111.11000000` = `255.255.255.192`
2. **Wildcard Mask**: Invert the subnet mask (XOR with `255.255.255.255`):
   `00000000.00000000.00000000.00111111` = `0.0.0.63`
3. **Network Address**: Bitwise AND of IP address and Subnet Mask:
   `192.168.10.75` AND `255.255.255.192` = `192.168.10.64`
4. **Broadcast Address**: Bitwise OR of Network Address and Wildcard Mask:
   `192.168.10.64` OR `0.0.0.63` = `192.168.10.127`
5. **Usable Range**:
   - First Usable Host: `192.168.10.65` (Network + 1)
   - Last Usable Host: `192.168.10.126` (Broadcast - 1)
   - Usable Hosts: $2^{(32 - 26)} - 2 = 64 - 2 = 62$

---
*Created by Aryan Thakur (8WHIE) • [YouTube @8WHIE](https://www.youtube.com/@8WHIE)*
