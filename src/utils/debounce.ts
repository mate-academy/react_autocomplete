// eslint-disable-next-line @typescript-eslint/ban-types
export function debounce(callback: Function, delay = 1000) {
  let timerId = 0;

  return (...args: any[]) => {
    window.clearTimeout(timerId);
    timerId = window.setTimeout(callback, delay, ...args);
  };
}
