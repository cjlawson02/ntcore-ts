import { NetworkTables, type RobotPlatform } from '@ntcore-ts/client';

import { logInfo } from './log.js';

export interface ConnectOptions {
  team?: number;
  host?: string;
  port?: number;
  platform?: RobotPlatform;
  timeoutMs?: number;
}

export interface ConnectionInfo {
  connected: boolean;
  connecting: boolean;
  uri: string | null;
  port: number | null;
  rttMs: number;
}

export class NtSession {
  private nt: NetworkTables | null = null;

  get client(): NetworkTables | null {
    return this.nt;
  }

  getConnectionInfo(): ConnectionInfo {
    if (!this.nt) {
      return { connected: false, connecting: false, uri: null, port: null, rttMs: -1 };
    }
    return {
      connected: this.nt.isRobotConnected(),
      connecting: this.nt.isRobotConnecting(),
      uri: this.nt.getURI(),
      port: this.nt.getPort(),
      rttMs: this.nt.getRttMs(),
    };
  }

  async connect(options: ConnectOptions): Promise<ConnectionInfo> {
    const port = options.port ?? 5810;
    const timeoutMs = options.timeoutMs ?? 10_000;

    if (options.team == null && !options.host) {
      throw new Error('Provide either team or host to connect.');
    }
    if (options.team != null && options.host) {
      throw new Error('Provide either team or host, not both.');
    }

    this.disconnect();

    if (options.team != null) {
      this.nt = NetworkTables.getInstanceByTeam(options.team, port, options.platform ?? 'roborio');
      logInfo('Connecting by team', { team: options.team, port, platform: options.platform ?? 'roborio' });
    } else {
      this.nt = NetworkTables.getInstanceByURI(options.host!, port);
      logInfo('Connecting by host', { host: options.host, port });
    }

    await this.waitUntilConnected(timeoutMs);
    return this.getConnectionInfo();
  }

  disconnect(): void {
    if (this.nt) {
      logInfo('Disconnecting', { uri: this.nt.getURI(), port: this.nt.getPort() });
      try {
        this.nt.close();
      } catch {
        // ignore teardown races
      }
      this.nt = null;
    }
  }

  requireClient(): NetworkTables {
    if (!this.nt) {
      throw new Error('Not connected. Call nt_connect first (team or host/port).');
    }
    return this.nt;
  }

  waitUntilConnected(timeoutMs = 10_000): Promise<void> {
    const nt = this.requireClient();
    return new Promise((resolve, reject) => {
      if (nt.isRobotConnected()) {
        resolve();
        return;
      }
      const timer = setTimeout(() => {
        remove();
        reject(new Error(`Connection timeout after ${timeoutMs}ms`));
      }, timeoutMs);
      const remove = nt.addRobotConnectionListener((connected) => {
        if (connected) {
          clearTimeout(timer);
          remove();
          resolve();
        }
      }, true);
    });
  }
}
