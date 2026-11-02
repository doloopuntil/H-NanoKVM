import { useLayoutEffect, useRef } from 'react';

// Holds the value of the latest render for callbacks that must not change identity.
export function useLatest<T>(value: T) {
  const ref = useRef(value);

  useLayoutEffect(() => {
    ref.current = value;
  });

  return ref;
}
