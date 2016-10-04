export function sleep(millisec) {
  return new Promise(resolve => {
    setTimeout(resolve, millisec);
  });
}

export async function until(condFunc, limit = 60000, interval = 500) {
  const startTime = Date.now();
  while(!condFunc()) {
    await sleep(interval);
    if (Date.now() - startTime > limit) {
      return;
    }
  }
}

export function c2p(func) {
  return new Promise((resolve, reject) => {
    func((err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

export function catched(func) {
  return async function (...args) {
    try {
      return await func.call(this, ...args);
    } catch (e) {
      let msg;
      if (e && typeof e === 'object') {
        msg = e.stack || e.message || e;
      } else {
        msg = e;
      }
      console.error(msg);
    }
  }
}
