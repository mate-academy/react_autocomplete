export const debounce = (callback: (state: string) => void, delay: number) => {
  let timeOutId: number;

  return (...args: string[]) => {
    clearTimeout(timeOutId);

    timeOutId = setTimeout(callback, delay, ...args);
  };
};
