import { describe, expect, it } from 'vitest';

import { collectSamples } from './sampler.js';
import type { NetworkTables } from '@ntcore-ts/client';

function mockNt(values: Record<string, { type: string; series: unknown[] }>): NetworkTables {
  return {
    getPrefixTopic: (prefix: string) => ({
      subscribe: (
        cb: (value: unknown, params: { name: string; type: string; id: number; properties: null }) => void
      ) => {
        for (const [name, info] of Object.entries(values)) {
          if (!name.startsWith(prefix) && prefix !== '/') continue;
          for (const v of info.series) {
            cb(v, { name, type: info.type, id: 1, properties: null });
          }
        }
        return 1;
      },
      unsubscribe: () => undefined,
    }),
  } as unknown as NetworkTables;
}

describe('collectSamples', () => {
  it('summarizes numeric series', async () => {
    const nt = mockNt({
      '/MyTable/Gyro': { type: 'double', series: [1, 2, 3, 4] },
    });
    const result = await collectSamples(nt, {
      prefixes: ['/MyTable/'],
      durationSeconds: 0.15,
      format: 'summary',
    });
    expect(result.topicCount).toBe(1);
    const summary = result.summaries?.[0];
    expect(summary?.topic).toBe('/MyTable/Gyro');
    expect(summary?.count).toBe(4);
    expect(summary?.min).toBe(1);
    expect(summary?.max).toBe(4);
    expect(summary?.mean).toBe(2.5);
    expect(summary?.last).toBe(4);
  });

  it('respects change_only', async () => {
    const nt = mockNt({
      '/MyTable/Gyro': { type: 'double', series: [1, 1, 1, 2] },
    });
    const result = await collectSamples(nt, {
      prefixes: ['/MyTable/'],
      durationSeconds: 0.15,
      changeOnly: true,
      format: 'summary',
    });
    expect(result.summaries?.[0]?.count).toBe(2);
  });
});
