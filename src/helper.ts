let timerId: NodeJS.Timeout;

export const debounce = <T>(
  callback: (value: T) => void,
  delay: number,
) => {
  return (arg: T) => {
    clearTimeout(timerId);

    timerId = setTimeout(() => {
      callback(arg);
    }, delay);
  };
};
