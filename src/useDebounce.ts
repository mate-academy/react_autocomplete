import debounce from 'lodash.debounce';
import {
  useEffect,
  useMemo,
  useRef,
  useCallback,
} from 'react';

export const useDebounce = <T extends (...args: any[]) => void>(
  callback: T,
  delay = 1000,
): T => {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const debouncedCallback = useMemo(() => {
    return debounce((...args: Parameters<T>) => {
      callbackRef.current?.(...args);
    }, delay);
  }, [delay]);

  useEffect(() => {
    return () => {
      debouncedCallback.cancel();
    };
  }, [debouncedCallback]);

  return useCallback(
    ((...args: Parameters<T>) => {
      debouncedCallback(...args);
    }) as T,
    [debouncedCallback],
  );
};
