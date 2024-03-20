export const debounce = <T extends (...args: any[]) => void>(
  callback: T,
  delay: number,
): T => {
  let timerId: number;

  return ((...args: Parameters<T>) => {
    clearTimeout(timerId);
    timerId = window.setTimeout(() => callback(...args), delay);
  }) as T;
};
