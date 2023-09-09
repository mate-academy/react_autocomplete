export const debounce = (callback: (state: string) => void, delay: number) => {
  let timerId = 0;

  return (...args: string[]) => {
    window.clearTimeout(timerId);

    timerId = window.setTimeout(callback, delay, ...args);
  };
};
