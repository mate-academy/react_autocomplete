/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useEffect } from 'react';

const useClickOutside = (
  ref: React.MutableRefObject<HTMLElement | null>,
  handler: (arg0: any) => void,
) => {
  const clickListener = useCallback(
    (event: any) => {
      if (!ref?.current || ref?.current?.contains(event.target)) {
        return;
      }

      handler(event);
    },
    [ref, handler],
  );

  useEffect(() => {
    document.addEventListener('mousedown', clickListener, true);

    return () => {
      document.removeEventListener('mousedown', clickListener, true);
    };
  }, [clickListener]);
};

export { useClickOutside };
