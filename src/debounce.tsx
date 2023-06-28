export function debounce<T>(f: (...args: T[]) => void, delay: number) {
  let timerId: NodeJS.Timeout;

  return (...args: T[]) => {
    clearTimeout(timerId);
    timerId = setTimeout(f, delay, ...args);
  };
}
