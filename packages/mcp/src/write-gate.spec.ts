import { afterEach, describe, expect, it } from 'vitest';

import { WriteGate } from './write-gate.js';

describe('WriteGate', () => {
  const prevAllow = process.env.NT_ALLOW_WRITES;
  const prevList = process.env.NT_WRITE_ALLOWLIST;
  const prevLocal = process.env.NT_REQUIRE_LOCALHOST;

  afterEach(() => {
    if (prevAllow === undefined) delete process.env.NT_ALLOW_WRITES;
    else process.env.NT_ALLOW_WRITES = prevAllow;
    if (prevList === undefined) delete process.env.NT_WRITE_ALLOWLIST;
    else process.env.NT_WRITE_ALLOWLIST = prevList;
    if (prevLocal === undefined) delete process.env.NT_REQUIRE_LOCALHOST;
    else process.env.NT_REQUIRE_LOCALHOST = prevLocal;
  });

  it('defaults to writes disabled', () => {
    delete process.env.NT_ALLOW_WRITES;
    const gate = new WriteGate({ envAllowWrites: false });
    expect(gate.getStatus().enabled).toBe(false);
    expect(() => gate.assertCanWrite('/MyTable/Gyro', 'localhost')).toThrow(/disabled/i);
  });

  it('requires confirm to enable', () => {
    const gate = new WriteGate({ envAllowWrites: false });
    expect(() => gate.setWriteMode(true, false)).toThrow(/confirm/i);
    expect(gate.setWriteMode(true, true).enabled).toBe(true);
  });

  it('enforces allowlist', () => {
    const gate = new WriteGate({
      envAllowWrites: false,
      allowlist: ['/MyTable/**'],
    });
    gate.setWriteMode(true, true);
    expect(() => gate.assertCanWrite('/MyTable/Gyro', 'localhost')).not.toThrow();
    expect(() => gate.assertCanWrite('/FMSInfo/x', 'localhost')).toThrow(/allowlist/i);
  });

  it('enforces localhost when required', () => {
    const gate = new WriteGate({
      envAllowWrites: false,
      requireLocalhost: true,
      allowlist: ['/**'],
    });
    gate.setWriteMode(true, true);
    expect(() => gate.assertCanWrite('/MyTable/Gyro', 'localhost')).not.toThrow();
    expect(() => gate.assertCanWrite('/MyTable/Gyro', '10.97.3.2')).toThrow(/LOCALHOST/i);
  });
});
