// eslint-disable-next-line @typescript-eslint/ban-types
export const debounce = (callback: Function, delay: number) => {
  let timerId = 0;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (...args: any[]) => {
    window.clearTimeout(timerId);

    timerId = window.setTimeout(callback, delay, ...args);

    // timerId = window.setTimeout(() => {
    //   callback(...args);
    // }, delay);
  };
};
