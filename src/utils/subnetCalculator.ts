import { SubnetResult } from '../types/network';

export function calculateSubnet(input: string, prefixOverride?: number): SubnetResult {
  let ipStr = input.trim();
  let cidr = 24;

  if (ipStr.includes('/')) {
    const parts = ipStr.split('/');
    ipStr = parts[0].trim();
    const parsedCidr = parseInt(parts[1].trim(), 10);
    if (!isNaN(parsedCidr)) {
      cidr = parsedCidr;
    }
  } else if (prefixOverride !== undefined) {
    cidr = prefixOverride;
  }

  if (cidr < 0 || cidr > 32) {
    throw new Error('CIDR prefix must be between 0 and 32');
  }

  const octets = ipStr.split('.').map(Number);
  if (octets.length !== 4 || octets.some(o => isNaN(o) || o < 0 || o > 255)) {
    throw new Error('Invalid IPv4 address format');
  }

  const ipNum = ((octets[0] << 24) >>> 0) + (octets[1] << 16) + (octets[2] << 8) + octets[3];
  const maskNum = cidr === 0 ? 0 : (((0xffffffff << (32 - cidr)) >>> 0));
  const wildcardNum = (~maskNum) >>> 0;

  const netNum = (ipNum & maskNum) >>> 0;
  const bcastNum = (netNum | wildcardNum) >>> 0;

  const totalAddresses = Math.pow(2, 32 - cidr);
  let usableHosts: number;
  let firstUsableNum: number;
  let lastUsableNum: number;

  if (cidr === 32) {
    usableHosts = 1;
    firstUsableNum = netNum;
    lastUsableNum = netNum;
  } else if (cidr === 31) {
    usableHosts = 2;
    firstUsableNum = netNum;
    lastUsableNum = bcastNum;
  } else {
    usableHosts = Math.max(0, totalAddresses - 2);
    firstUsableNum = netNum + 1;
    lastUsableNum = bcastNum - 1;
  }

  const numToIp = (n: number) => [
    (n >>> 24) & 255,
    (n >>> 16) & 255,
    (n >>> 8) & 255,
    n & 255,
  ].join('.');

  const numToBinary = (n: number) => [
    ((n >>> 24) & 255).toString(2).padStart(8, '0'),
    ((n >>> 16) & 255).toString(2).padStart(8, '0'),
    ((n >>> 8) & 255).toString(2).padStart(8, '0'),
    (n & 255).toString(2).padStart(8, '0'),
  ].join('.');

  const firstOctet = octets[0];
  let ipClass = 'A';
  if (firstOctet >= 128 && firstOctet <= 191) ipClass = 'B';
  else if (firstOctet >= 192 && firstOctet <= 223) ipClass = 'C';
  else if (firstOctet >= 224 && firstOctet <= 239) ipClass = 'D (Multicast)';
  else if (firstOctet >= 240) ipClass = 'E (Experimental)';

  const isPrivate =
    firstOctet === 10 ||
    (firstOctet === 172 && octets[1] >= 16 && octets[1] <= 31) ||
    (firstOctet === 192 && octets[1] === 168);

  return {
    input: ipStr,
    cidr,
    networkAddress: numToIp(netNum),
    broadcastAddress: numToIp(bcastNum),
    firstUsable: numToIp(firstUsableNum),
    lastUsable: numToIp(lastUsableNum),
    totalAddresses,
    usableHosts,
    subnetMask: numToIp(maskNum),
    wildcardMask: numToIp(wildcardNum),
    binaryIp: numToBinary(ipNum),
    binaryMask: numToBinary(maskNum),
    ipClass,
    isPrivate,
  };
}
