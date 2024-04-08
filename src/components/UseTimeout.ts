import { useState } from 'react';

export function useTimeout(callback: () => void, delay: number) {
  const [id, setId] = useState(0);

  const stopTimeout = () => {
    window.clearTimeout(id);
  };

  const startTimeout = () => {
    stopTimeout();
    setId(window.setTimeout(callback, delay));
  };

  return [startTimeout, stopTimeout];
}
