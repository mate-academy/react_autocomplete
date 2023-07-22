type CallbackFunction = (...args: any) => void;

function debounce(callback: CallbackFunction, delay: number) {
  let timerId = 0;

  return (...args: any) => {
    window.clearTimeout(timerId);

    timerId = window.setTimeout(() => {
      callback(...args);
    }, delay);
  };
}

export { debounce };
