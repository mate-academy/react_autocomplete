export const debounce = (
  f: (args: string) => void,
  delay: number,
) => {
  let timerId: number;

  return (args: string) => {
    clearTimeout(timerId);
    timerId = window.setTimeout(f, delay, args);
  };
};
