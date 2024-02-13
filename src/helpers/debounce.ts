export function debounce(
  // eslint-disable-next-line @typescript-eslint/ban-types
  callback: Function,
  delay: number,
  // eslint-disable-next-line @typescript-eslint/ban-types
  afterCallback: Function,
) {
  let timerId = 0;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (...args: any) => {
    window.clearTimeout(timerId);

    timerId = window.setTimeout(() => {
      callback(args[0]);
      afterCallback(args[1]);
    }, delay);
  };
}
