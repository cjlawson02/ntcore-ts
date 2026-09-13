import { describe, expect, it } from 'vitest';

import { matchGlob, toJsonSafe } from './response.js';

describe('matchGlob', () => {
  it('matches ** across segments', () => {
    expect(matchGlob('/MyTable/Gyro', '/MyTable/**')).toBe(true);
    expect(matchGlob('/SmartDashboard/foo/bar', '/SmartDashboard/**')).toBe(true);
    expect(matchGlob('/FMSInfo/Alliance', '/MyTable/**')).toBe(false);
  });

  it('matches single-segment *', () => {
    expect(matchGlob('/MyTable/Gyro', '/MyTable/*')).toBe(true);
    expect(matchGlob('/MyTable/a/b', '/MyTable/*')).toBe(false);
  });
});

describe('toJsonSafe', () => {
  it('previews Uint8Array', () => {
    const v = toJsonSafe(Uint8Array.from([1, 2, 255]));
    expect(v).toMatchObject({ __type: 'Uint8Array', length: 3 });
  });

  it('recurses objects', () => {
    expect(toJsonSafe({ a: 1, b: [true, null] })).toEqual({ a: 1, b: [true, null] });
  });
});
