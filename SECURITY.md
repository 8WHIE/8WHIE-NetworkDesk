# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Defensive Architecture & Safe Networking

**8WHIE Network Toolkit** is built strictly for defensive administrative diagnostics, IT education, and authorized troubleshooting. 

The software explicitly adheres to the following principles:
1. **No Weaponization or Exploits**: The application does not contain port scanner evasion, stealth fragmentation, SYN flooding, password bruteforcing, or vulnerability exploits.
2. **Safe Socket Handling**: Port connectivity checks utilize standard, graceful TCP handshakes via standard operating system network stacks with deterministic timeouts.
3. **No Credential Harvesting**: The toolkit does not extract stored Windows Wi-Fi passwords, browser cookies, SAM database entries, or LSA secrets.
4. **Command Execution Safety**: Administrative launcher commands (RDP, SSH, PowerShell) strictly sanitize hostnames and parameters against shell metacharacters and argument injection.

## Responsible Disclosure

If you believe you have discovered a security vulnerability in 8WHIE Network Toolkit, please report it privately:

- **Security Contact**: Aryan Thakur (8WHIE)
- **Email**: iaryan9905@gmail.com
- **Telegram**: [@arnxkt](https://t.me/arnxkt)

Please include:
- A description of the issue and potential impact
- Detailed steps to reproduce or proof-of-concept
- Any affected platforms or configurations

We kindly request that you do not publicly disclose the issue until our team has had an opportunity to address and release a patch.
