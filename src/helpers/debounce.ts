export const debounce = (f:TimerHandler, delay: number) => {
  let timeoutID: number;

  return (...args:string[]) => {
    clearTimeout(timeoutID);
    // eslint-disable-next-line @typescript-eslint/no-implied-eval
    timeoutID = setTimeout(f, delay, ...args);
  };
};
