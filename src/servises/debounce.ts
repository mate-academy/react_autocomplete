export function debounce<T>(callback: (...args: T[]) => void, delay: number) {
  let timerId = 0;

  return (...args: T[]) => {
    window.clearTimeout(timerId);

    timerId = window.setTimeout(() => {
      callback(...args);
    }, delay);
  };
}
