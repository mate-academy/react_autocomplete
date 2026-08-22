export function debounce<T>(callback: (value: T) => void, delay: number) {
  let timerId: ReturnType<typeof setTimeout>;

  return (value: T) => {
    window.clearTimeout(timerId);
    timerId = setTimeout(() => callback(value), delay);
  };
}
