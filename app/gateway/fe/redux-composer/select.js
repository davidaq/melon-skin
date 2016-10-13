function getMethods(obj) {
  if (!obj || typeof obj !== 'object') {
    return [];
  }
  const keys = {};
  const set = key => keys[key] = 1;
  Object.getOwnPropertyNames(obj).forEach(set);
  if (typeof ''.__proto__ === 'object') {
    Object.getOwnPropertyNames(obj.__proto__).forEach(set);
  } else if (typeof obj.constructor === 'function') {
    Object.getOwnPropertyNames(obj.constructor.prototype).forEach(set);
  }
  delete keys.constructor;
  delete keys.reduce;
  delete keys.actions;
  return Object.keys(keys).filter(key => typeof obj[key] === 'function');
}

export default function (inst, selector) {
  const actions = {};
  getMethods(inst).forEach(key => {
    const type = `#${key}`;
    actions[key] = (...args) => (dispatch, getState) => {
      const { composing } = getState();
      const path = selector(composing);
      console.log(path);
      return dispatch({
        type, path,
        data: inst[key](...args)
      });
    };
  });
  return actions;
}
