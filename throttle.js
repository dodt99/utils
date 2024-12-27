export const throttle = (func, timeout = 300) => {
  let isRunFunc = true;
  return (...args) => {
    if (isRunFunc) {
      isRunFunc = false;
      func.apply(this, args);
    }
    setTimeout(() => {
      isRunFunc = true;
    }, timeout);
  };
};