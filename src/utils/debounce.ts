// eslint-disable-next-line @typescript-eslint/ban-types
export function debounce(callback: Function, delay: number) {
  let timerId = 0;

  return (args: string) => {
    window.clearTimeout(timerId);

    timerId = window.setTimeout(() => {
      callback(args);
    }, delay);
  };
}
