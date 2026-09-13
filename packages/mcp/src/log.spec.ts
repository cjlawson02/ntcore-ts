import { afterEach, describe, expect, it, vi } from 'vitest';

import { logInfo, logWarn } from './log.js';

describe('log helpers', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('writes a single stderr line with JSON details', () => {
    const err = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    logInfo('Connecting by host', { host: 'localhost', port: 5810 });
    expect(err).toHaveBeenCalledTimes(1);
    expect(err.mock.calls[0]![0]).toBe('[ntcore-ts-mcp] Connecting by host {"host":"localhost","port":5810}');
  });

  it('omits details object when empty', () => {
    const err = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    logWarn('Write mode disabled');
    expect(err).toHaveBeenCalledWith('[ntcore-ts-mcp:warn] Write mode disabled');
  });
});
