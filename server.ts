import express from 'express';
import { createServer as createViteServer } from 'vite';
import dns from 'dns';
import net from 'net';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  const isProd = process.env.NODE_ENV === 'production';

  app.use(express.json());

  // API: DNS Lookup
  app.post('/api/diagnostics/dns', async (req, res) => {
    try {
      const { hostname, recordType = 'A', dnsServer } = req.body;
      if (!hostname || typeof hostname !== 'string') {
        res.status(400).json({ error: 'Valid hostname is required' });
        return;
      }

      // Safe clean hostname input
      const sanitizedHost = hostname.trim().replace(/^https?:\/\//i, '').split('/')[0].split(':')[0];
      const resolver = new dns.promises.Resolver();
      if (dnsServer && typeof dnsServer === 'string' && net.isIP(dnsServer.trim())) {
        resolver.setServers([dnsServer.trim()]);
      }

      const startTime = Date.now();
      const type = recordType.toUpperCase();
      let records: any = [];

      try {
        switch (type) {
          case 'A':
            records = await resolver.resolve4(sanitizedHost, { ttl: true });
            break;
          case 'AAAA':
            records = await resolver.resolve6(sanitizedHost, { ttl: true });
            break;
          case 'MX':
            records = await resolver.resolveMx(sanitizedHost);
            break;
          case 'TXT':
            records = await resolver.resolveTxt(sanitizedHost);
            break;
          case 'NS':
            records = await resolver.resolveNs(sanitizedHost);
            break;
          case 'CNAME':
            records = await resolver.resolveCname(sanitizedHost);
            break;
          case 'SOA':
            records = [await resolver.resolveSoa(sanitizedHost)];
            break;
          case 'PTR':
            records = await resolver.resolvePtr(sanitizedHost);
            break;
          default:
            records = await resolver.resolve4(sanitizedHost, { ttl: true });
        }
      } catch (dnsErr: any) {
        // Fallback standard lookup
        if (type === 'A' || type === 'ANY') {
          const lookupResult = await dns.promises.lookup(sanitizedHost, { all: true });
          records = lookupResult.map(r => ({ address: r.address, family: r.family, ttl: 300 }));
        } else {
          throw dnsErr;
        }
      }

      const elapsedMs = Date.now() - startTime;
      const servers = resolver.getServers();

      res.json({
        success: true,
        hostname: sanitizedHost,
        recordType: type,
        elapsedMs,
        dnsServerUsed: servers[0] || 'System Default',
        records: Array.isArray(records) ? records : [records]
      });
    } catch (err: any) {
      res.json({
        success: false,
        error: err.code || err.message || 'DNS resolution failed',
        records: []
      });
    }
  });

  // API: Safe Port Connectivity Test
  app.post('/api/diagnostics/port', async (req, res) => {
    try {
      const { host, port, timeoutMs = 2000 } = req.body;
      if (!host || !port) {
        res.status(400).json({ error: 'Target host and port are required' });
        return;
      }

      const sanitizedHost = String(host).trim().replace(/^https?:\/\//i, '').split('/')[0];
      const targetPort = parseInt(port, 10);

      if (isNaN(targetPort) || targetPort < 1 || targetPort > 65535) {
        res.status(400).json({ error: 'Port must be an integer between 1 and 65535' });
        return;
      }

      const timeout = Math.min(Math.max(Number(timeoutMs) || 2000, 500), 5000);
      const start = Date.now();

      const socket = new net.Socket();
      let resolved = false;

      const finish = (status: 'open' | 'closed' | 'timeout' | 'filtered', errorMsg?: string) => {
        if (resolved) return;
        resolved = true;
        const duration = Date.now() - start;
        socket.destroy();
        res.json({
          success: true,
          host: sanitizedHost,
          port: targetPort,
          status,
          durationMs: duration,
          error: errorMsg || null
        });
      };

      socket.setTimeout(timeout);

      socket.connect(targetPort, sanitizedHost, () => {
        finish('open');
      });

      socket.on('error', (err: any) => {
        if (err.code === 'ECONNREFUSED') {
          finish('closed', 'Connection refused by destination host');
        } else if (err.code === 'ENOTFOUND') {
          finish('filtered', 'Host address not found or unreachable');
        } else if (err.code === 'EHOSTUNREACH' || err.code === 'ENETUNREACH') {
          finish('filtered', 'Host or network unreachable');
        } else {
          finish('closed', err.message);
        }
      });

      socket.on('timeout', () => {
        finish('timeout', `Operation timed out after ${timeout}ms`);
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // API: Ping / Latency Check
  app.post('/api/diagnostics/ping', async (req, res) => {
    try {
      const { host, count = 4 } = req.body;
      if (!host) {
        res.status(400).json({ error: 'Host is required' });
        return;
      }

      const sanitizedHost = String(host).trim().replace(/^https?:\/\//i, '').split('/')[0];
      const samplesCount = Math.min(Math.max(Number(count) || 4, 1), 10);
      const results: { sequence: number; latencyMs: number; status: string }[] = [];

      for (let i = 1; i <= samplesCount; i++) {
        const start = Date.now();
        try {
          await new Promise<void>((resolve, reject) => {
            const socket = new net.Socket();
            socket.setTimeout(2500);

            // Probe on port 80 or 443 for connection latency
            socket.connect(80, sanitizedHost, () => {
              socket.destroy();
              resolve();
            });

            socket.on('error', (err: any) => {
              socket.destroy();
              // If refused, the host is alive and responded!
              if (err.code === 'ECONNREFUSED') {
                resolve();
              } else {
                reject(err);
              }
            });

            socket.on('timeout', () => {
              socket.destroy();
              reject(new Error('Timed out'));
            });
          });

          const time = Date.now() - start;
          results.push({ sequence: i, latencyMs: time, status: 'Success' });
        } catch (err: any) {
          results.push({ sequence: i, latencyMs: -1, status: err.message || 'Request timed out' });
        }

        // Brief delay between samples
        if (i < samplesCount) {
          await new Promise(r => setTimeout(r, 200));
        }
      }

      const validPings = results.filter(r => r.latencyMs >= 0).map(r => r.latencyMs);
      const min = validPings.length ? Math.min(...validPings) : 0;
      const max = validPings.length ? Math.max(...validPings) : 0;
      const avg = validPings.length ? Math.round(validPings.reduce((a, b) => a + b, 0) / validPings.length) : 0;
      const loss = Math.round(((samplesCount - validPings.length) / samplesCount) * 100);

      res.json({
        success: true,
        host: sanitizedHost,
        packetsSent: samplesCount,
        packetsReceived: validPings.length,
        packetLossPercentage: loss,
        minLatencyMs: min,
        maxLatencyMs: max,
        avgLatencyMs: avg,
        samples: results
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // API: Local System Network Interfaces snapshot
  app.get('/api/diagnostics/system-interfaces', (_req, res) => {
    try {
      const ifaces = os.networkInterfaces();
      const list: any[] = [];

      for (const [name, addrs] of Object.entries(ifaces)) {
        if (!addrs) continue;
        for (const addr of addrs) {
          list.push({
            adapterName: name,
            family: addr.family,
            address: addr.address,
            netmask: addr.netmask,
            mac: addr.mac,
            internal: addr.internal,
            cidr: addr.cidr
          });
        }
      }

      res.json({
        success: true,
        hostname: os.hostname(),
        platform: os.platform(),
        release: os.release(),
        uptimeSeconds: os.uptime(),
        interfaces: list
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Vite Integration
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`8WHIE Network Toolkit server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
