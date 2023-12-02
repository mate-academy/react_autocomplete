// eslint-disable-next-line @typescript-eslint/ban-types
export const debounce = (callback: Function, delay: number) => {
  let timerId = 0;

  return (...args: unknown[]) => {
    window.clearTimeout(timerId);

    timerId = window.setTimeout(() => {
      callback(...args);
    }, delay);
  };
};
