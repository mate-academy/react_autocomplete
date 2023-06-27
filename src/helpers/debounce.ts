export const debounce = (callback: (state: string) => void, delay: number) => {
  let timeoutId: number;

  return (...args: string[]) => {
    clearTimeout(timeoutId);

    timeoutId = setTimeout(callback, delay, ...args);
  };
};
