export function debounce<T extends (...args: any[]) => void>(
  callback: T,
  delay: number,
) {
  let timerId = 0;

  return (...args: Parameters<T>) => {
    window.clearTimeout(timerId);

    timerId = window.setTimeout(() => {
      callback(...args);
    }, delay);
  };
}
// export function debounce(callback: Function, delay: number) {
//   let timerId = 0;

//   return (...args: any) => {
//     window.clearTimeout(timerId);

//     timerId = window.setTimeout(() => {
//       callback(...args);
//     }, delay);
//   };
// }
