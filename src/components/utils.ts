/* eslint-disable @typescript-eslint/no-explicit-any */
export const debounce = <T extends (...args: any[]) => void>(
  callback: T,
  delay: number,
) => {
  let timerId: ReturnType<typeof setTimeout> | null = null;
  let lastValue: any;

  return (...args: Parameters<T>) => {
    // Skip if the argument didn't change
    if (args[0] === lastValue) {
      return;
    }

    lastValue = args[0];

    if (timerId) {
      clearTimeout(timerId);
    }

    timerId = setTimeout(() => {
      callback(...args);
    }, delay);

    return timerId;
  };
};
