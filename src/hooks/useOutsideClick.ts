import { useEffect } from 'react';

interface Props {
  ref: React.RefObject<HTMLElement>;
  callback: VoidFunction;
}

export const useOutsideClick = ({ ref, callback }: Props) => {
  const handler = (event: globalThis.MouseEvent) => {
    const { target } = event;

    if (ref.current && !ref.current.contains(target as Node)) {
      callback();
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handler);

    return () => {
      document.removeEventListener('mousedown', handler);
    };
  }, []);
};
