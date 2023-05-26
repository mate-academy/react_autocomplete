/* eslint-disable @typescript-eslint/no-explicit-any */
export const debounce = (
  fn: (...args: any[]) => any,
  ms: number,
) => {
  let timerId: number;

  return (...args: any[]) => {
    clearTimeout(timerId);
    timerId = window.setTimeout(fn, ms, ...args);
  };
};
