export function debounce(callback: (...args: string[]) => void, delay: number) {
  let timerId: number | undefined = undefined;

  return (...args: string[]) => {
    window.clearTimeout(timerId);
    timerId = window.setTimeout(() => {
      callback(...args);
    }, delay);
  };
}
