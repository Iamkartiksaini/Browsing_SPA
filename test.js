function rateLimiter(fn, limit) {
  let time = new Date().getTime();
  return function x() {
    let newtime = new Date().getTime();
    if (newtime > time + limit) {
      console.log("Limit exceed");
      return null;
    } else {
      return fn();
    }
  };
}

function xy() {
  console.log("function called");
}

const testFunc = rateLimiter(xy, 2000);

setTimeout(testFunc, 2200);
