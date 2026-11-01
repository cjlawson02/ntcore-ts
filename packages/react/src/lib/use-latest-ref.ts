import { useRef, type RefObject } from 'react';

/**
 * Keeps a ref pointed at the latest value.
 * Updated during render so effect/subscribe callbacks never see a stale value and we
 * avoid scheduling a per-hook effect on every commit (important for many-hook dashboards).
 */
export function useLatestRef<T>(value: T): RefObject<T> {
  const ref = useRef(value);
  // Intentionally sync during render (React-supported "latest ref" pattern).
  // oxlint-disable-next-line react/refs -- latest-value ref must update before effects/subscribers run
  ref.current = value;
  return ref;
}
