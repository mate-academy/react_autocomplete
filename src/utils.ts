export const debounce = <T extends (...args: any[]) => void>(
  callback: T,
  delay = 300,
) => {
  let timerId = 0;

  return (...args: Parameters<T>) => {
    window.clearTimeout(timerId);

    timerId = window.setTimeout(() => {
      callback(...args);
    }, delay);
  };
};
