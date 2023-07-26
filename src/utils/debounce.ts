export function debounce(
  callback: React.Dispatch<React.SetStateAction<string>>,
  delay: number,
) {
  let timerId = 0;

  return (...args: string[]) => {
    window.clearTimeout(timerId);

    timerId = window.setTimeout(callback, delay, ...args);
  };
}
