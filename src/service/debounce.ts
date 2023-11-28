import React, { useRef } from 'react';

export const useDebounce = (
  func: React.Dispatch<React.SetStateAction<string>>,
  delay: number,
) => {
  const timerId = useRef(0);

  return (value: string) => {
    window.clearTimeout(timerId.current);
    timerId.current = window.setTimeout(() => {
      func(value);
    }, delay);
  };
};
