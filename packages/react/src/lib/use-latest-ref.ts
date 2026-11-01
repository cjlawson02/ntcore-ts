import { useRef, type RefObject } from 'react';

/**
 * Keeps a ref pointed at the latest value.
 * Updated during render so effects/callbacks never see a one-frame-stale value
 * and we avoid scheduling a per-hook effect on every commit.
 */
export function useLatestRef<T>(value: T): RefObject<T> {
  const ref = useRef(value);
  // oxlint-disable-next-line react/refs -- intentional latest-value mirror; not used for rendering
  ref.current = value;
  return ref;
}
