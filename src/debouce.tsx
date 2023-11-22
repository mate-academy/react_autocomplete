export function debounce(callback: (v: string) => void, delay: number) {
  let timerId = 0;

  return (arg: string) => {
    window.clearTimeout(timerId);

    timerId = window.setTimeout(() => {
      callback(arg);
    }, delay);
  };
}
