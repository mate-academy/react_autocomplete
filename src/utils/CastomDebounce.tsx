import { useCallback } from 'react';
import { debounce } from 'lodash';

export const castomDebounce = (
  fn: React.Dispatch<React.SetStateAction<string>>,
  delay: number,
) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useCallback(
    debounce(fn, delay),
    [delay],
  );
};
