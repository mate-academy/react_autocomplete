// same to Misha's

// eslint-disable-next-line @typescript-eslint/ban-types
export function debounce(callback: Function, delay: number) {
  let timerId = 0;

  return (value: string | boolean) => {
    window.clearTimeout(timerId);

    timerId = window.setTimeout(() => {
      callback(value);
    }, delay);
  };
}
