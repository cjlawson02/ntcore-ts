import { logInfo, logWarn } from './log.js';
import { matchGlob } from './response.js';

const DEFAULT_ALLOWLIST = ['/SmartDashboard/**', '/Tuning/**', '/MyTable/**'];

export interface WriteGateStatus {
  enabled: boolean;
  source: 'env' | 'session' | 'off';
  allowlist: string[];
  requireLocalhost: boolean;
}

export class WriteGate {
  private sessionEnabled = false;
  private readonly allowlist: string[];
  private readonly requireLocalhost: boolean;
  private readonly envBootstrap: boolean;

  constructor(options?: { allowlist?: string[]; requireLocalhost?: boolean; envAllowWrites?: boolean }) {
    const fromEnv = process.env.NT_WRITE_ALLOWLIST?.split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    this.allowlist = options?.allowlist ?? (fromEnv?.length ? fromEnv : DEFAULT_ALLOWLIST);
    this.requireLocalhost =
      options?.requireLocalhost ??
      (process.env.NT_REQUIRE_LOCALHOST === '1' || process.env.NT_REQUIRE_LOCALHOST === 'true');
    this.envBootstrap =
      options?.envAllowWrites ?? (process.env.NT_ALLOW_WRITES === '1' || process.env.NT_ALLOW_WRITES === 'true');
    if (this.envBootstrap) {
      this.sessionEnabled = true;
      logInfo('Write gate enabled from NT_ALLOW_WRITES');
    }
  }

  getStatus(): WriteGateStatus {
    return {
      enabled: this.sessionEnabled,
      source: this.sessionEnabled ? (this.envBootstrap && !this.wasToggledOff ? 'env' : 'session') : 'off',
      allowlist: [...this.allowlist],
      requireLocalhost: this.requireLocalhost,
    };
  }

  private wasToggledOff = false;

  setWriteMode(enabled: boolean, confirm: boolean): WriteGateStatus {
    if (enabled && !confirm) {
      throw new Error('Enabling writes requires confirm: true. Writes can change robot behavior.');
    }
    this.sessionEnabled = enabled;
    if (!enabled) this.wasToggledOff = true;
    logInfo(`Write mode ${enabled ? 'ENABLED' : 'disabled'}`, { confirm });
    return this.getStatus();
  }

  assertCanWrite(topic: string, host: string | undefined): void {
    if (!this.sessionEnabled) {
      throw new Error(
        'Writes are disabled. Call nt_set_write_mode({ enabled: true, confirm: true }) or set NT_ALLOW_WRITES=1.'
      );
    }
    if (this.requireLocalhost) {
      const h = (host ?? '').toLowerCase();
      if (h !== 'localhost' && h !== '127.0.0.1' && h !== '::1') {
        throw new Error(`NT_REQUIRE_LOCALHOST is set; refusing write to non-local host "${host ?? '(unknown)'}".`);
      }
    }
    if (!this.allowlist.some((pattern) => matchGlob(topic, pattern))) {
      throw new Error(`Topic "${topic}" is not on the write allowlist (${this.allowlist.join(', ')}).`);
    }
  }

  auditWrite(topic: string, valueDigest: string): void {
    logWarn('WRITE', { topic, valueDigest });
  }
}
