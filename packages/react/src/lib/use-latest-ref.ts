import { useEffect, useRef, type RefObject } from 'react';

/** Keeps a ref pointed at the latest value without writing to it during render. */
export function useLatestRef<T>(value: T): RefObject<T> {
  const ref = useRef(value);
  useEffect(() => {
    ref.current = value;
  });
  return ref;
}
