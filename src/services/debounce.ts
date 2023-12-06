/* eslint-disable @typescript-eslint/ban-types */
export function debounce(callback: Function, daley: number) {
  let timerId = 0;

  return (...args: any) => {
    window.clearTimeout(timerId);

    timerId = window.setTimeout(() => {
      callback(...args);
    }, daley);
  };
}
