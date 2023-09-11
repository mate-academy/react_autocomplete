export function queryDebounce(callBack: (a: string) => void, delay: number) {
  let timerId = 0;

  return (query: string) => {
    window.clearTimeout(timerId);

    timerId = window.setTimeout(() => {
      callBack(query);
    }, delay);
  };
}
