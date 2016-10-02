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
