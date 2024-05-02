import { RefObject, useCallback, useEffect, useRef } from 'react';

type Input = () => void;
type Output = RefObject<HTMLDivElement>;

export const useClickOutside = (callback: Input): Output => {
  const ref = useRef<HTMLDivElement>(null);

  const clickOutsideHandler = useCallback(
    (event: Event) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    },
    [callback],
  );

  useEffect(() => {
    document.addEventListener('click', clickOutsideHandler, true);

    return () => {
      document.removeEventListener('click', clickOutsideHandler, true);
    };
  }, [ref, clickOutsideHandler]);

  return ref;
};
