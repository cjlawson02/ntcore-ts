import { describe, expect, it } from 'vitest';

import { decodeStructBytes } from './decode.js';

describe('decodeStructBytes', () => {
  it('decodes Pose2d built-in layout', async () => {
    // Pack via client to get a known buffer
    const { pack, getBuiltInDescriptor } = await import('@ntcore-ts/client');
    const desc = getBuiltInDescriptor('Pose2d');
    expect(desc).not.toBeNull();
    const bytes = pack({ translation: { x: 1.5, y: -2 }, rotation: { value: 0.25 } }, desc!);
    const decoded = decodeStructBytes('Pose2d', bytes);
    expect(decoded).toMatchObject({
      translation: { x: 1.5, y: -2 },
      rotation: { value: 0.25 },
    });
  });
});
